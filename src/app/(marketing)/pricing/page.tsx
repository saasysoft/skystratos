import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICING_TIERS } from '@/lib/data/landing-data'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'SkyStratos fleet intelligence platform pricing. Custom-tailored deployments for airlines of every size.',
}

/* ── Feature comparison matrix ─────────────────────────────────────── */

type ComparisonRow = {
  feature: string
  ops: boolean
  intel: boolean
  command: boolean
}

const COMPARISON: ComparisonRow[] = [
  { feature: 'Fleet Map', ops: true, intel: true, command: true },
  { feature: 'MEL Tracking', ops: false, intel: true, command: true },
  { feature: 'Basic Alerts', ops: true, intel: true, command: true },
  { feature: 'Maintenance Intelligence', ops: false, intel: true, command: true },
  { feature: 'AD Compliance', ops: false, intel: true, command: true },
  { feature: 'Cost Analytics', ops: false, intel: true, command: true },
  { feature: 'Tower AI', ops: false, intel: true, command: true },
  { feature: 'Multi-Station Inventory', ops: false, intel: true, command: true },
  { feature: 'Custom Integrations', ops: false, intel: false, command: true },
  { feature: 'API Access', ops: false, intel: false, command: true },
  { feature: 'Dedicated Support', ops: false, intel: false, command: true },
  { feature: 'SLA Guarantee', ops: false, intel: false, command: true },
]

/* ── FAQ ───────────────────────────────────────────────────────────── */

const FAQ = [
  {
    q: 'How does pricing work?',
    a: 'Each airline has unique systems, fleet sizes, and operational needs. We scope and price each deployment individually after understanding your requirements.',
  },
  {
    q: 'What integrations are supported?',
    a: 'SkyStratos connects to common MRO systems, inventory platforms, ADS-B feeds, and airline operations databases. Custom integrations are included in INTEL and COMMAND tiers.',
  },
  {
    q: 'How long does deployment take?',
    a: 'Typical deployments take 4-8 weeks depending on the number of integrations and customizations required.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer a live demo with simulated fleet data so you can experience the full platform before committing. Request demo access to get started.',
  },
]

/* ── Helpers ───────────────────────────────────────────────────────── */

function Check() {
  return (
    <svg className="w-5 h-5 text-hud-nominal mx-auto" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function Cross() {
  return <span className="block text-center text-hud-text-dim">&mdash;</span>
}

/* ── Page ──────────────────────────────────────────────────────────── */

// TODO: Wave 5 — add LandingNav import

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-hud-bg text-hud-text-primary">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-hud-sm text-hud-text-secondary hover:text-hud-primary transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-mono text-3xl md:text-4xl tracking-wide text-hud-text-primary mb-4">
          Built for Your Fleet, Priced for Your Scale
        </h1>
        <p className="font-sans text-lg text-hud-text-secondary leading-relaxed">
          Every deployment is custom-tailored to your airline&apos;s systems, workflows, and fleet
          size.
        </p>
      </header>

      {/* Tier Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-lg border p-6 flex flex-col ${
                tier.highlighted
                  ? 'border-hud-border-glow shadow-hud-glow bg-hud-surface'
                  : 'border-hud-border bg-hud-surface'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hud-primary text-hud-bg font-mono text-hud-xs uppercase px-3 py-1 rounded-full tracking-widest">
                  Recommended
                </span>
              )}

              <h2 className="font-mono text-2xl tracking-widest text-hud-primary mb-1">
                {tier.name}
              </h2>
              <p className="font-sans text-sm text-hud-text-secondary mb-6">{tier.tagline}</p>

              <p className="font-mono text-xl text-hud-text-primary mb-6">Contact Sales</p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm font-sans">
                    {f.included ? (
                      <span className="text-hud-nominal mt-0.5 shrink-0">&#10003;</span>
                    ) : (
                      <span className="text-hud-text-dim mt-0.5 shrink-0">&#10005;</span>
                    )}
                    <span className={f.included ? 'text-hud-text-primary' : 'text-hud-text-dim'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/#demo-request"
                className={`block text-center font-mono text-sm tracking-wider py-3 rounded border transition-colors ${
                  tier.highlighted
                    ? 'bg-hud-primary text-hud-bg border-hud-primary hover:bg-hud-primary/90'
                    : 'border-hud-border text-hud-primary hover:border-hud-primary hover:bg-hud-primary/10'
                }`}
              >
                {tier.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="font-mono text-2xl tracking-wide text-hud-text-primary text-center mb-8">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-hud-border">
                <th className="text-left font-mono text-hud-sm text-hud-text-secondary py-3 pr-4">
                  Feature
                </th>
                <th className="font-mono text-hud-sm text-hud-primary py-3 px-4 text-center">
                  OPS
                </th>
                <th className="font-mono text-hud-sm text-hud-primary py-3 px-4 text-center">
                  INTEL
                </th>
                <th className="font-mono text-hud-sm text-hud-primary py-3 px-4 text-center">
                  COMMAND
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="border-b border-hud-border/50">
                  <td className="font-sans text-sm text-hud-text-primary py-3 pr-4">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4">{row.ops ? <Check /> : <Cross />}</td>
                  <td className="py-3 px-4">{row.intel ? <Check /> : <Cross />}</td>
                  <td className="py-3 px-4">{row.command ? <Check /> : <Cross />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="font-mono text-2xl tracking-wide text-hud-text-primary text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="border border-hud-border rounded-lg p-6 bg-hud-surface">
              <h3 className="font-mono text-hud-base text-hud-primary mb-2">{item.q}</h3>
              <p className="font-sans text-sm text-hud-text-secondary leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="border border-hud-border rounded-lg p-10 bg-hud-surface">
          <h2 className="font-mono text-2xl tracking-wide text-hud-text-primary mb-3">
            Ready to See SkyStratos in Action?
          </h2>
          <p className="font-sans text-hud-text-secondary mb-6">
            Let&apos;s scope the right deployment for your airline.
          </p>
          <Link
            href="/#demo-request"
            className="inline-block font-mono text-sm tracking-wider bg-hud-primary text-hud-bg px-8 py-3 rounded border border-hud-primary hover:bg-hud-primary/90 transition-colors"
          >
            Schedule Meeting
          </Link>
        </div>
      </section>
    </div>
  )
}
