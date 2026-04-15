'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/i18n/use-translation'
import { getLandingStrings } from '@/lib/i18n/landing-i18n'

const CAL_URL = 'https://cal.com/robot-friends/30min'

interface ScheduleMeetingSectionProps {
  preselectedTier?: string
}

export function DemoRequestForm({ preselectedTier: _preselectedTier }: ScheduleMeetingSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loaded, setLoaded] = useState(false)
  const { locale } = useTranslation()
  const s = getLandingStrings(locale)

  // Fade in iframe once loaded to avoid white flash
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const onLoad = () => setLoaded(true)
    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [])

  return (
    <section id="demo-request" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-hud-text-primary tracking-wider">
            {s.schedule.headline}
          </h2>
          <p className="mt-4 font-sans text-lg text-hud-text-secondary max-w-xl mx-auto">
            {s.schedule.subhead}
          </p>
        </div>

        {/* Cal.com embed */}
        <div className="bg-hud-bg border border-hud-border/40 rounded-sm overflow-hidden">
          <div className="relative w-full" style={{ minHeight: 600 }}>
            {/* Loading skeleton */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-2 border-hud-primary/30 border-t-hud-primary rounded-full animate-spin" />
                  <span className="font-mono text-hud-xs text-hud-text-dim uppercase tracking-widest">
                    {s.schedule.loading}
                  </span>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={`${CAL_URL}?embed=true&theme=dark&layout=month_view`}
              title="Schedule a meeting with Robot Friends"
              className={`w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ height: 600 }}
              loading="lazy"
              allow="payment"
            />
          </div>

          {/* Fallback link */}
          <div className="border-t border-hud-border/20 px-6 py-4 text-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-hud-xs text-hud-text-dim hover:text-hud-primary transition-colors uppercase tracking-widest"
            >
              {s.schedule.fallback} &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
