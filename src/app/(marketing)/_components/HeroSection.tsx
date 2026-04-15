'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion'
import type { HeroSectionProps } from '@/lib/types/landing'
import { HUDButton } from '@/components/hud/HUDButton'
import { HUDGauge } from '@/components/hud/HUDGauge'
import { HUDIndicator } from '@/components/hud/HUDIndicator'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { getLandingStrings } from '@/lib/i18n/landing-i18n'

// ── Cost label data ────────────────────────────────────────────────
const COST_LABELS = [
  { component: 'ENGINE OVERHAUL', cost: '$3.2M', x: '12%', y: '18%' },
  { component: 'LANDING GEAR', cost: '$850K', x: '72%', y: '22%' },
  { component: 'AVIONICS UPGRADE', cost: '$1.4M', x: '8%', y: '62%' },
  { component: 'APU REPLACEMENT', cost: '$620K', x: '76%', y: '58%' },
  { component: 'HYDRAULIC SYSTEM', cost: '$340K', x: '42%', y: '78%' },
] as const

// ── Desktop scroll-stop animation ──────────────────────────────────
interface AnimationStrings {
  fleetHealth: string; costSavings: string; predictiveEngine: string;
  online: string; costAnomalies: string; detected3: string;
  dataPipeline: string; streaming: string; mroEvents: string;
  costReduction: string; fleetUptime: string; tagline: string;
  scanActive: string; scanMobile: string;
}

function ScrollStopAnimation({ t }: { t: AnimationStrings }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1: assembled aircraft opacity (visible 0–0.35, fade out 0.3–0.5)
  const assembledOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 1, 0])
  // Phase 2: exploded view (fade in 0.25–0.45)
  const explodedOpacity = useTransform(scrollYProgress, [0.25, 0.45, 0.7, 0.85], [0, 1, 1, 0.3])
  // Phase 3: dashboard (fade in 0.65–0.85)
  const dashboardOpacity = useTransform(scrollYProgress, [0.65, 0.85], [0, 1])

  // Cost labels stagger based on scroll progress
  const labelBaseProgress = 0.35

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      {/* Sticky viewport pinned within scroll container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9]">

          {/* Phase 1: Assembled aircraft placeholder */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: assembledOpacity, willChange: 'transform, opacity' }}
            data-video-src="/assets/aircraft-assembled.mp4"
          >
            <div className="relative w-full h-full">
              <img
                src="/assets/aircraft-assembled.png"
                alt="Commercial aircraft technical scan — fleet asset overview"
                className="w-full h-full object-contain"
                loading="eager"
              />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-hud-xs text-hud-text-dim uppercase tracking-widest">
                {t.scanActive}
              </span>
            </div>
          </motion.div>

          {/* Phase 2: Exploded view with cost labels */}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: explodedOpacity, willChange: 'transform, opacity' }}
            data-video-src="/assets/aircraft-exploded.mp4"
          >
            <div className="relative w-full h-full">
              <img
                src="/assets/aircraft-exploded.png"
                alt="Aircraft components deconstructed — maintenance cost breakdown view"
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
              />

              {/* Cost labels */}
              {COST_LABELS.map((label, i) => {
                const enterAt = labelBaseProgress + i * 0.06
                return (
                  <CostLabel
                    key={label.component}
                    component={label.component}
                    cost={label.cost}
                    x={label.x}
                    y={label.y}
                    scrollProgress={scrollYProgress}
                    enterAt={enterAt}
                  />
                )
              })}
            </div>
          </motion.div>

          {/* Phase 3: Dashboard reveal */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: dashboardOpacity, willChange: 'transform, opacity' }}
          >
            <div className="w-full max-w-3xl mx-auto px-4">
              <div className="bg-hud-bg border border-hud-border/40 rounded-sm p-6 space-y-6">
                {/* HUD instruments row */}
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <HUDGauge
                    value={87}
                    max={100}
                    label={t.fleetHealth}
                    unit="%"
                    thresholds={{ warning: 70, critical: 50 }}
                    size={120}
                  />
                  <div className="space-y-3">
                    <HUDIndicator status="nominal" label={t.predictiveEngine} value={t.online} />
                    <HUDIndicator status="warning" label={t.costAnomalies} value={t.detected3} />
                    <HUDIndicator status="nominal" label={t.dataPipeline} value={t.streaming} />
                  </div>
                  <HUDGauge
                    value={6.4}
                    max={10}
                    label={t.costSavings}
                    unit="M/yr"
                    thresholds={{ warning: 3, critical: 1 }}
                    size={120}
                  />
                </div>

                {/* Data readouts */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: t.mroEvents, value: '2,847' },
                    { label: t.costReduction, value: '23.4%' },
                    { label: t.fleetUptime, value: '99.2%' },
                  ].map((readout) => (
                    <div
                      key={readout.label}
                      className="text-center border border-hud-border/20 rounded-sm py-3 px-2 bg-hud-surface/50"
                    >
                      <div className="font-mono text-metric-lg text-hud-primary">
                        {readout.value}
                      </div>
                      <div className="font-mono text-hud-xs text-hud-text-dim uppercase mt-1">
                        {readout.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tagline */}
                <p className="font-mono text-hud-primary text-2xl text-center tracking-wider">
                  {t.tagline}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── Cost label sub-component ───────────────────────────────────────
interface CostLabelProps {
  component: string
  cost: string
  x: string
  y: string
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress']
  enterAt: number
}

function CostLabel({ component, cost, x, y, scrollProgress, enterAt }: CostLabelProps) {
  const opacity = useTransform(
    scrollProgress,
    [enterAt, enterAt + 0.06, 0.75, 0.85],
    [0, 1, 1, 0]
  )
  const translateY = useTransform(
    scrollProgress,
    [enterAt, enterAt + 0.06],
    [12, 0]
  )

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        opacity,
        y: translateY,
        willChange: 'transform, opacity',
      }}
    >
      {/* Connecting dot */}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-hud-secondary/80 shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
      <div className="ml-3 border border-hud-border/40 bg-hud-bg/90 backdrop-blur-sm rounded-sm px-3 py-1.5 whitespace-nowrap">
        <span className="font-mono text-hud-xs md:text-hud-sm text-hud-text-dim block">
          {component}
        </span>
        <span className="font-mono text-hud-xs md:text-hud-sm text-hud-secondary font-bold">
          {cost}
        </span>
      </div>
    </motion.div>
  )
}

// ── Mobile cost card strip ─────────────────────────────────────────
function MobileCostStrip() {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 -mx-4 px-4">
      <div className="flex gap-3 w-max">
        {COST_LABELS.map((label) => (
          <HUDPanel key={label.component} variant="secondary" className="min-w-[160px]">
            <div className="text-center">
              <div className="font-mono text-hud-xs text-hud-text-dim uppercase">
                {label.component}
              </div>
              <div className="font-mono text-hud-sm text-hud-secondary font-bold mt-1">
                {label.cost}
              </div>
            </div>
          </HUDPanel>
        ))}
      </div>
    </div>
  )
}

// ── Mobile static hero ─────────────────────────────────────────────
function MobileStaticHero() {
  return (
    <div className="md:hidden space-y-6 px-4">
      {/* Static aircraft image */}
      <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-hud-border/20">
        <img
          src="/assets/aircraft-assembled.png"
          alt="Commercial aircraft technical scan"
          className="w-full h-full object-contain"
          loading="eager"
        />
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-hud-xs text-hud-text-dim uppercase tracking-widest">
          {/* Mobile static — will be translated via parent */}
        </span>
      </div>

      {/* Horizontal scrollable cost cards */}
      <MobileCostStrip />
    </div>
  )
}

// ── Main HeroSection component ─────────────────────────────────────
export function HeroSection({ id, className, onCtaClick }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const { locale } = useTranslation()
  const s = getLandingStrings(locale)
  const a = s.heroAnimation

  return (
    <section
      id={id}
      className={cn('bg-hud-bg text-hud-text-primary', className)}
      aria-label="SkyStratos hero — fleet intelligence platform overview"
    >
      {/* Above the fold — always visible */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-mono text-4xl md:text-6xl text-hud-primary tracking-wider max-w-4xl">
          {s.hero.headline}
        </h1>

        <p className="font-mono text-hud-text-secondary text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
          {s.hero.subhead}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <HUDButton
            onClick={onCtaClick}
            variant="primary"
            size="lg"
          >
            {s.hero.cta}
          </HUDButton>

          <a
            href="/dashboard"
            className="font-mono text-hud-text-dim hover:text-hud-primary transition-colors duration-200 text-sm tracking-wider uppercase"
            aria-label={s.hero.demoAria}
          >
            {s.hero.demo}
          </a>
        </div>

        {/* Scroll hint — desktop only */}
        <div className="hidden md:flex flex-col items-center mt-16 animate-pulse-slow">
          <span className="font-mono text-hud-xs text-hud-text-dim uppercase mb-2">
            {s.hero.scrollHint}
          </span>
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            className="text-hud-text-dim"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="18" height="22" rx="9" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2" fill="currentColor" className="animate-bounce" />
          </svg>
        </div>
      </div>

      {/* Below the fold — scroll-stop animation zone */}
      {prefersReducedMotion ? (
        /* Reduced motion: static layout with all phases visible */
        <div className="px-4 pb-20">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Static cost breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COST_LABELS.map((label) => (
                <HUDPanel key={label.component} variant="secondary">
                  <div className="text-center">
                    <div className="font-mono text-hud-xs text-hud-text-dim uppercase">
                      {label.component}
                    </div>
                    <div className="font-mono text-hud-sm text-hud-secondary font-bold mt-1">
                      {label.cost}
                    </div>
                  </div>
                </HUDPanel>
              ))}
            </div>

            {/* Static dashboard preview */}
            <div className="bg-hud-bg border border-hud-border/40 rounded-sm p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <HUDGauge
                  value={87}
                  max={100}
                  label={a.fleetHealth}
                  unit="%"
                  thresholds={{ warning: 70, critical: 50 }}
                  size={100}
                />
                <div className="space-y-2">
                  <HUDIndicator status="nominal" label={a.predictiveEngine} value={a.online} />
                  <HUDIndicator status="warning" label={a.costAnomalies} value={a.detected3} />
                </div>
              </div>
              <p className="font-mono text-hud-primary text-xl text-center tracking-wider">
                {a.tagline}
              </p>
            </div>

            {/* CTA */}
            <div className="flex justify-center">
              <HUDButton onClick={onCtaClick} variant="primary" size="lg">
                {s.hero.cta}
              </HUDButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop: scroll-driven animation */}
          <div className="hidden md:block">
            <ScrollStopAnimation t={a} />
            {/* Bottom CTA after scroll animation */}
            <div className="flex justify-center py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="animate-glow-pulse"
              >
                <HUDButton
                  onClick={onCtaClick}
                  variant="primary"
                  size="lg"
                >
                  {s.hero.cta}
                </HUDButton>
              </motion.div>
            </div>
          </div>

          {/* Mobile: static hero with scrollable cost strip */}
          <MobileStaticHero />

          {/* Mobile bottom CTA */}
          <div className="md:hidden flex justify-center py-12">
            <HUDButton
              onClick={onCtaClick}
              variant="primary"
              size="lg"
            >
              {s.hero.cta}
            </HUDButton>
          </div>
        </>
      )}
    </section>
  )
}
