import Link from 'next/link'
import type { LandingFooterProps } from '@/lib/types/landing'
import { cn } from '@/lib/utils'

const footerColumns = [
  {
    heading: 'PRODUCT',
    links: [
      { label: 'Fleet Intelligence', href: '#platform' },
      { label: 'Maintenance AI', href: '#platform' },
      { label: 'Cost Analytics', href: '#platform' },
      { label: 'Tower AI Co-Pilot', href: '#platform' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'About', href: '#hero' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#demo-request' },
    ],
  },
  {
    heading: 'LEGAL',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
] as const

export default function LandingFooter({ className }: LandingFooterProps) {
  const year = new Date().getFullYear()

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
              Ready to see what&apos;s grounding your fleet?{' '}
              <Link
                href="#demo-request"
                className="text-hud-primary hover:underline"
              >
                Request Demo
              </Link>
            </p>

            {/* Right: wordmark + tagline */}
            <div className="flex flex-col items-center md:items-end gap-1">
              <span className="font-mono text-sm tracking-[0.3em] uppercase text-hud-text-secondary">
                SKYSTRATOS
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-hud-text-dim">
                Authorized Personnel Only
              </span>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-hud-text-dim">
            &copy; {year} SkyStratos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
