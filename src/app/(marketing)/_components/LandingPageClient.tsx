'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Lenis from 'lenis'
import { HeroSection } from './HeroSection'
import { PainPointsSection } from './PainPointsSection'
import { PlatformShowcase } from './PlatformShowcase'
import { TowerAISpotlight } from './TowerAISpotlight'
import { PricingSection } from './PricingSection'
import LandingNav from './LandingNav'
import LandingFooter from './LandingFooter'
import { SectionErrorBoundary } from './SectionErrorBoundary'
import { DemoRequestForm } from './DemoRequestForm'
import { NAV_SECTIONS, PAIN_POINTS, PLATFORM_FEATURES, PRICING_TIERS } from '@/lib/data/landing-data'

export default function LandingPageClient() {
  const lenisRef = useRef<Lenis | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined)

  // ── Lenis smooth scroll ──────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // ── Scroll helpers ───────────────────────────────────────────────────
  const scrollToDemo = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#demo-request', { offset: -80 })
    } else {
      const el = document.getElementById('demo-request')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleSelectTier = useCallback((tierId: string) => {
    setSelectedTier(tierId)
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#demo-request', { offset: -80 })
    } else {
      const el = document.getElementById('demo-request')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <LandingNav sections={NAV_SECTIONS} />

      <main>
        <SectionErrorBoundary sectionName="Hero" fallbackHeight="100vh">
          <HeroSection id="hero" onCtaClick={scrollToDemo} />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Pain Points" fallbackHeight="600px">
          <PainPointsSection id="challenges" cards={PAIN_POINTS} />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Platform Showcase" fallbackHeight="600px">
          <PlatformShowcase id="platform" features={PLATFORM_FEATURES} />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Tower AI" fallbackHeight="500px">
          <TowerAISpotlight id="tower" />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Pricing" fallbackHeight="600px">
          <PricingSection id="pricing" tiers={PRICING_TIERS} onSelectTier={handleSelectTier} />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Demo Request" fallbackHeight="600px">
          <DemoRequestForm preselectedTier={selectedTier} />
        </SectionErrorBoundary>
      </main>

      <LandingFooter />
    </>
  )
}
