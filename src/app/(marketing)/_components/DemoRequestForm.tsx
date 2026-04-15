'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/use-translation'
import { getLandingStrings } from '@/lib/i18n/landing-i18n'
import { HUDButton } from '@/components/hud/HUDButton'

const CAL_LINK = 'robot-friends/30min'

interface ScheduleMeetingSectionProps {
  preselectedTier?: string
}

export function DemoRequestForm({ preselectedTier: _preselectedTier }: ScheduleMeetingSectionProps) {
  const { locale } = useTranslation()
  const s = getLandingStrings(locale)

  // Load Cal.com embed script once
  useEffect(() => {
    if (document.getElementById('cal-embed-script')) return

    const script = document.createElement('script')
    script.id = 'cal-embed-script'
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.onload = () => {
      const Cal = (window as unknown as Record<string, unknown>).Cal as ((...args: unknown[]) => void) | undefined
      if (Cal) {
        Cal('init', { origin: 'https://cal.com' })
        Cal('ui', {
          theme: 'dark',
          hideEventTypeDetails: false,
          layout: 'month_view',
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  const openCalPopup = () => {
    const Cal = (window as unknown as Record<string, unknown>).Cal as ((...args: unknown[]) => void) | undefined
    if (Cal) {
      Cal('openModal', {
        calLink: CAL_LINK,
        config: { theme: 'dark', layout: 'month_view' },
      })
    } else {
      // Fallback: open in new tab
      window.open(`https://cal.com/${CAL_LINK}`, '_blank')
    }
  }

  return (
    <section id="demo-request" className="py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-hud-bg border border-hud-border/40 rounded-sm p-12 text-center">
          {/* Heading */}
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-hud-text-primary tracking-wider">
            {s.schedule.headline}
          </h2>

          <p className="mt-4 font-sans text-lg text-hud-text-secondary max-w-xl mx-auto">
            {s.schedule.subhead}
          </p>

          {/* Badge */}
          <div className="mt-6 mb-8">
            <span className="inline-block font-mono text-hud-xs uppercase tracking-widest text-hud-nominal bg-hud-nominal/10 border border-hud-nominal/30 rounded-sm px-3 py-1">
              {s.schedule.badge}
            </span>
          </div>

          {/* CTA Button */}
          <HUDButton
            onClick={openCalPopup}
            variant="primary"
            size="lg"
          >
            {s.schedule.cta}
          </HUDButton>
        </div>
      </div>
    </section>
  )
}
