import { NextRequest, NextResponse } from 'next/server'
import { leadSubmissionSchema } from '@/lib/schemas/lead'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LeadSubmissionResponse {
  success: boolean
  leadId?: string
  errors?: Record<string, string[]>
  message?: string
}

// ---------------------------------------------------------------------------
// In-memory rate limiter: IP -> { count, resetAt }
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip characters that have special meaning in Slack mrkdwn */
function sanitizeForSlack(value: string): string {
  return value.replace(/[@<>`]/g, '')
}

/** Sanitize all string fields in an object for Slack */
function sanitizeRecord(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitizeForSlack(value) : value
  }
  return result
}

function getAllowedOrigins(): string[] {
  const origins: string[] = ['http://localhost:3000', 'http://localhost:3001']
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    origins.push(siteUrl.replace(/\/$/, ''))
  }
  return origins
}

// ---------------------------------------------------------------------------
// POST /api/leads
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // CSRF: Check Origin header
  const origin = request.headers.get('origin')
  const allowedOrigins = getAllowedOrigins()

  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { success: false, message: 'Forbidden' } satisfies LeadSubmissionResponse,
      { status: 403 },
    )
  }

  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Too many submissions. Please try again later.',
      } satisfies LeadSubmissionResponse,
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' } satisfies LeadSubmissionResponse,
      { status: 400 },
    )
  }

  // Honeypot: if the hidden "website" field has a value, silently reject
  if (
    body &&
    typeof body === 'object' &&
    'website' in body &&
    (body as Record<string, unknown>).website
  ) {
    return NextResponse.json(
      { success: true, leadId: 'lead_noop' } satisfies LeadSubmissionResponse,
      { status: 201 },
    )
  }

  // Validate with Zod
  const parsed = leadSubmissionSchema.safeParse(body)

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.')
      if (!fieldErrors[path]) fieldErrors[path] = []
      fieldErrors[path].push(issue.message)
    }
    return NextResponse.json(
      { success: false, errors: fieldErrors } satisfies LeadSubmissionResponse,
      { status: 400 },
    )
  }

  const lead = parsed.data
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  // ---------------------------------------------------------------------------
  // Slack webhook notification
  // ---------------------------------------------------------------------------
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (webhookUrl) {
    if (!webhookUrl.startsWith('https://hooks.slack.com/services/')) {
      console.error(
        '[Leads API] Invalid SLACK_WEBHOOK_URL — must start with https://hooks.slack.com/services/',
      )
    } else {
      try {
        const safe = sanitizeRecord(lead as unknown as Record<string, unknown>)

        const utmParts = [
          safe.utmSource && `Source: ${safe.utmSource}`,
          safe.utmMedium && `Medium: ${safe.utmMedium}`,
          safe.utmCampaign && `Campaign: ${safe.utmCampaign}`,
          safe.utmTerm && `Term: ${safe.utmTerm}`,
          safe.utmContent && `Content: ${safe.utmContent}`,
        ].filter(Boolean)

        const blocks = [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'New SkyStratos Demo Request',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Name:*\n${safe.fullName}` },
              { type: 'mrkdwn', text: `*Email:*\n${safe.email}` },
              { type: 'mrkdwn', text: `*Company:*\n${safe.company}` },
              { type: 'mrkdwn', text: `*Title:*\n${safe.jobTitle}` },
              { type: 'mrkdwn', text: `*Fleet Size:*\n${safe.fleetSize}` },
              { type: 'mrkdwn', text: `*Tier:*\n${safe.selectedTier || 'N/A'}` },
            ],
          },
          ...(safe.message
            ? [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Message:*\n${safe.message}`,
                  },
                },
              ]
            : []),
          ...(utmParts.length > 0
            ? [
                {
                  type: 'context',
                  elements: [
                    {
                      type: 'mrkdwn',
                      text: `UTM: ${utmParts.join(' | ')}`,
                    },
                  ],
                },
              ]
            : []),
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Lead ID: ${leadId}`,
              },
            ],
          },
        ]

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blocks }),
        })
      } catch (err) {
        console.error('[Leads API] Slack webhook failed:', err)
      }
    }
  }

  return NextResponse.json(
    { success: true, leadId } satisfies LeadSubmissionResponse,
    { status: 201 },
  )
}
