'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { FLEET_SIZE_OPTIONS, leadSubmissionSchema } from '@/lib/schemas/lead'
import type { FleetSizeRange } from '@/lib/types/landing'

// ── Types ──────────────────────────────────────────────────────────────

interface DemoFormData {
  fullName: string
  email: string
  company: string
  jobTitle: string
  fleetSize: string
  message: string
  website: string // honeypot
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface DemoRequestFormProps {
  preselectedTier?: string
}

const SESSION_STORAGE_KEY = 'skystratos_demo_form'

const INITIAL_FORM: DemoFormData = {
  fullName: '',
  email: '',
  company: '',
  jobTitle: '',
  fleetSize: '',
  message: '',
  website: '',
}

// ── Component ──────────────────────────────────────────────────────────

export function DemoRequestForm({ preselectedTier }: DemoRequestFormProps) {
  const [form, setForm] = useState<DemoFormData>(INITIAL_FORM)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  // Restore form data from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoFormData>
        setForm((prev) => ({ ...prev, ...parsed, website: '' }))
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  // Persist form data to sessionStorage on change
  useEffect(() => {
    try {
      const { website: _hp, ...toSave } = form
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(toSave))
    } catch {
      // Ignore quota errors
    }
  }, [form])

  const updateField = useCallback(
    (field: keyof DemoFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        // Clear field-level error on edit
        setFieldErrors((prev) => {
          if (!prev[field]) return prev
          const next = { ...prev }
          delete next[field]
          return next
        })
      },
    [],
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    setFieldErrors({})

    // Read UTM params
    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source') || undefined
    const utmMedium = params.get('utm_medium') || undefined
    const utmCampaign = params.get('utm_campaign') || undefined
    const utmTerm = params.get('utm_term') || undefined
    const utmContent = params.get('utm_content') || undefined

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim(),
      fleetSize: form.fleetSize as FleetSizeRange,
      message: form.message.trim() || undefined,
      selectedTier: preselectedTier || undefined,
      website: form.website, // honeypot
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
    }

    // Client-side validation
    const validation = leadSubmissionSchema.safeParse(payload)
    if (!validation.success) {
      const errors: Record<string, string[]> = {}
      for (const issue of validation.error.issues) {
        const path = issue.path.join('.')
        if (!errors[path]) errors[path] = []
        errors[path].push(issue.message)
      }
      setFieldErrors(errors)
      setStatus('error')
      setErrorMessage('Please fix the errors below.')
      return
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setFieldErrors(data.errors)
        }
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  // ── Success state ────────────────────────────────────────────────────

  if (status === 'success') {
    return (
      <section id="demo-request" className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-hud-bg border border-hud-border/40 rounded-sm p-12">
            {/* Green checkmark */}
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full border-2 border-hud-nominal flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-hud-nominal"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
            </div>
            <h2 className="font-mono text-2xl md:text-3xl text-hud-primary tracking-wider mb-4">
              TRANSMISSION RECEIVED
            </h2>
            <p className="font-sans text-hud-text-secondary leading-relaxed">
              Our team will contact you within 24 hours to set up your demo environment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Form state ───────────────────────────────────────────────────────

  const inputBase =
    'w-full bg-hud-bg border border-hud-border/40 rounded-sm px-4 py-3 font-mono text-sm text-hud-text-primary placeholder:text-hud-text-dim/50 focus:outline-none focus:border-hud-primary/70 focus:shadow-[0_0_8px_rgba(0,136,255,0.15)] transition-all duration-200'

  const renderFieldError = (field: string) => {
    const errors = fieldErrors[field]
    if (!errors?.length) return null
    return (
      <p className="mt-1 font-mono text-xs text-hud-critical">
        {errors[0]}
      </p>
    )
  }

  return (
    <section id="demo-request" className="py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-hud-text-primary tracking-wider">
            Schedule a Meeting
          </h2>
          <p className="mt-4 font-sans text-lg text-hud-text-secondary max-w-xl mx-auto">
            Book time with our team to see SkyStratos in action and discuss your fleet operations.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-hud-bg border border-hud-border/40 rounded-sm p-8 space-y-6"
        >
          {/* Global error */}
          {status === 'error' && errorMessage && (
            <div className="border border-hud-critical/30 bg-hud-critical/5 rounded-sm px-4 py-3">
              <p className="font-mono text-sm text-hud-critical">{errorMessage}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Full Name <span className="text-hud-critical">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={updateField('fullName')}
              placeholder="Jane Mitchell"
              className={inputBase}
            />
            {renderFieldError('fullName')}
          </div>

          {/* Work Email */}
          <div>
            <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Work Email <span className="text-hud-critical">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={updateField('email')}
              placeholder="jane@airline.com"
              className={inputBase}
            />
            {renderFieldError('email')}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Company <span className="text-hud-critical">*</span>
            </label>
            <input
              id="company"
              type="text"
              required
              value={form.company}
              onChange={updateField('company')}
              placeholder="Pacific Airways"
              className={inputBase}
            />
            {renderFieldError('company')}
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Job Title <span className="text-hud-critical">*</span>
            </label>
            <input
              id="jobTitle"
              type="text"
              required
              value={form.jobTitle}
              onChange={updateField('jobTitle')}
              placeholder="VP of Maintenance"
              className={inputBase}
            />
            {renderFieldError('jobTitle')}
          </div>

          {/* Fleet Size */}
          <div>
            <label htmlFor="fleetSize" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Fleet Size <span className="text-hud-critical">*</span>
            </label>
            <select
              id="fleetSize"
              required
              value={form.fleetSize}
              onChange={updateField('fleetSize')}
              className={`${inputBase} appearance-none cursor-pointer`}
            >
              <option value="" disabled>
                Select fleet size range
              </option>
              {FLEET_SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {renderFieldError('fleetSize')}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-2">
              Message <span className="text-hud-text-dim/50">(optional)</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={updateField('message')}
              placeholder="Tell us about your fleet operations challenges..."
              className={`${inputBase} resize-y`}
            />
            {renderFieldError('message')}
          </div>

          {/* Honeypot */}
          <input
            name="website"
            type="text"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={updateField('website')}
            aria-hidden="true"
          />

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full relative inline-flex items-center justify-center font-mono uppercase tracking-wider border rounded-sm select-none cursor-pointer transition-all duration-200 ease-out shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] min-h-[48px] px-6 py-3 text-[13px] bg-gradient-to-b from-[#0A2A3A] to-[#0C1218] border-hud-primary/30 text-hud-primary hover:border-hud-primary/70 hover:shadow-[0_0_12px_rgba(0,136,255,0.25)] active:translate-y-[1px] active:shadow-[0_0_4px_rgba(0,136,255,0.15)] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {status === 'submitting' ? 'TRANSMITTING...' : 'SCHEDULE MEETING'}
            </button>
          </div>

          {/* Retry hint on error */}
          {status === 'error' && (
            <p className="text-center font-mono text-xs text-hud-text-dim">
              Fix the errors above and try again.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
