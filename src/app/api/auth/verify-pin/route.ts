import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// In-memory rate limiter: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { pin } = body as { pin?: string }

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'PIN is required' },
        { status: 400 }
      )
    }

    const correctPin = process.env.DEMO_PIN
    if (!correctPin) {
      console.error('[Auth] DEMO_PIN environment variable is not set')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (pin !== correctPin) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString('hex')

    const response = NextResponse.json({ success: true })

    // Set httpOnly signed cookie
    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('skystratos-session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400, // 24 hours
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
