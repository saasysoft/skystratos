'use client'

import Link from 'next/link'
import type { LandingFooterProps } from '@/lib/types/landing'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { getLandingStrings } from '@/lib/i18n/landing-i18n'

export default function LandingFooter({ className }: LandingFooterProps) {
  const year = new Date().getFullYear()
  const { locale } = useTranslation()
  const s = getLandingStrings(locale)

  const footerColumns = [
    {
      heading: s.footer.product,
      links: [
        { label: s.footer.fleetIntelligence, href: '#platform' },
        { label: s.footer.maintenanceAI, href: '#platform' },
        { label: s.footer.costAnalytics, href: '#platform' },
        { label: s.footer.towerCoPilot, href: '#platform' },
      ],
    },
    {
      heading: s.footer.company,
      links: [
        { label: s.footer.about, href: '#hero' },
        { label: s.footer.pricing, href: '#pricing' },
        { label: s.footer.contact, href: '#demo-request' },
      ],
    },
    {
      heading: s.footer.legal,
      links: [
        { label: s.footer.terms, href: '/terms' },
        { label: s.footer.privacy, href: '/privacy' },
      ],
    },
  ]

  return (
    <footer
      className={cn(
        'bg-hud-surface border-t border-hud-border',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ── Columns ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-hud-text-dim mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-hud-sm text-hud-text-secondary hover:text-hud-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div className="mt-12 border-t border-hud-border pt-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Left: CTA */}
            <p className="font-mono text-hud-sm text-hud-text-dim text-center md:text-left">
              {s.footer.cta}{' '}
              <Link
                href="#demo-request"
                className="text-hud-primary hover:underline"
              >
                {s.footer.ctaLink}
              </Link>
            </p>

            {/* Right: wordmark + tagline */}
            <div className="flex flex-col items-center md:items-end gap-1">
              <span className="font-mono text-sm tracking-[0.3em] uppercase text-hud-text-secondary">
                SKYSTRATOS
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-hud-text-dim">
                {s.footer.tagline}
              </span>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-hud-text-dim">
            &copy; {year} {s.footer.tagline === 'Fleet Intelligence Platform'
              ? 'SkyStratos. All rights reserved.'
              : 'SkyStratos\u3002\u7248\u6b0a\u6240\u6709\u3002'}
          </p>
        </div>
      </div>
    </footer>
  )
}
