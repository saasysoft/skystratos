'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { HUDButton } from '@/components/hud/HUDButton'
import type { NavSection } from '@/lib/types/landing'
import { NAV_SECTIONS } from '@/lib/data/landing-data'
import { cn } from '@/lib/utils'

interface LandingNavProps {
  sections?: NavSection[]
  activeSectionId?: string | null
}

export default function LandingNav({
  sections = NAV_SECTIONS,
  activeSectionId: externalActiveId,
}: LandingNavProps) {
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const activeId = externalActiveId ?? internalActiveId

  // ── Scroll state ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── IntersectionObserver for active section ───────────────────────
  useEffect(() => {
    if (externalActiveId !== undefined && externalActiveId !== null) return

    const ids = sections.map((s) => s.id)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInternalActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [sections, externalActiveId])

  // ── Helpers ───────────────────────────────────────────────────────
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  const scrollToDemo = useCallback(() => {
    const el = document.getElementById('demo-request')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  // Filter out 'hero' and 'demo' from visible nav links — hero is the logo click,
  // demo is the CTA button
  const navLinks = sections.filter((s) => s.id !== 'hero' && s.id !== 'demo')

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-hud-bg/80 backdrop-blur-md border-b border-hud-border'
            : 'bg-hud-bg/40 backdrop-blur-sm border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Logo ─────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="font-mono text-lg tracking-[0.3em] uppercase text-hud-primary select-none"
          >
            SKYSTRATOS
          </button>

          {/* ── Desktop links ────────────────────────────────────── */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'relative font-mono text-hud-xs uppercase tracking-widest transition-colors pb-1',
                  activeId === section.id
                    ? 'text-hud-primary'
                    : 'text-hud-text-dim hover:text-hud-primary',
                )}
              >
                {section.label}
                {activeId === section.id && (
                  <span className="absolute bottom-0 left-0 h-px w-full bg-hud-primary" />
                )}
              </button>
            ))}

            <Link
              href="/sign-in"
              className="font-mono text-hud-xs uppercase tracking-widest text-hud-text-dim hover:text-hud-primary transition-colors"
            >
              Sign In
            </Link>

            <HUDButton onClick={scrollToDemo} variant="primary" size="sm">
              REQUEST DEMO
            </HUDButton>
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-px w-6 bg-hud-text-secondary" />
            <span className="block h-px w-6 bg-hud-text-secondary" />
            <span className="block h-px w-6 bg-hud-text-secondary" />
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-hud-bg/95 backdrop-blur-lg md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 font-mono text-2xl text-hud-text-secondary hover:text-hud-primary transition-colors"
            aria-label="Close menu"
          >
            &#x2715;
          </button>

          <div className="flex flex-col items-center gap-8">
            {navLinks.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'font-mono text-lg uppercase tracking-widest transition-colors',
                  activeId === section.id
                    ? 'text-hud-primary'
                    : 'text-hud-text-dim hover:text-hud-primary',
                )}
              >
                {section.label}
              </button>
            ))}

            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="font-mono text-lg uppercase tracking-widest text-hud-text-dim hover:text-hud-primary transition-colors"
            >
              Sign In
            </Link>

            <HUDButton onClick={scrollToDemo} variant="primary" size="md">
              REQUEST DEMO
            </HUDButton>
          </div>
        </div>
      )}
    </>
  )
}
