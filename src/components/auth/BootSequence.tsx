'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'

interface BootSequenceProps {
  onComplete: () => void
}

interface SystemLine {
  label: string
  detail: string
}

const SYSTEM_LINES: SystemLine[] = [
  { label: 'ADS-B Feed: Simulation Mode', detail: '30 aircraft tracked' },
  { label: 'MRO Database Synced', detail: 'Last sync: 4 min ago' },
  { label: 'Parts Inventory Loaded', detail: '5 stations online' },
  { label: 'Procurement Pipeline Active', detail: '23 open orders' },
  { label: 'Tower AI Online', detail: 'Claude Sonnet ready' },
  { label: 'Regulatory DB Current', detail: 'FAA ADs through 2026-03-23' },
]

export function BootSequence({ onComplete }: BootSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const separatorRef = useRef<HTMLDivElement>(null)
  const initRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<(HTMLDivElement | null)[]>([])
  const finalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const stableComplete = useCallback(onComplete, [onComplete])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const container = containerRef.current
    const title = titleRef.current
    const separator = separatorRef.current
    const init = initRef.current
    const finalLine = finalRef.current
    if (!container || !title || !separator || !init || !finalLine) return

    // Set initial states
    gsap.set(title, { opacity: 0, filter: 'brightness(1)' })
    gsap.set(separator, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(init, { opacity: 0 })
    linesRef.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, x: -10 })
    })
    gsap.set(finalLine, { opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the whole boot screen then call onComplete
        gsap.to(container, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: stableComplete,
        })
      },
    })

    // Title appears with glow
    tl.to(title, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0)
    tl.to(title, {
      filter: 'brightness(1.8)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    }, 0)

    // Separator draws across
    tl.to(separator, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 0.3)

    // "INITIALIZING SYSTEMS..." fades in
    tl.to(init, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, 0.5)

    // Each system line staggers in
    linesRef.current.forEach((el, i) => {
      if (!el) return
      const checkmark = el.querySelector('.boot-check')
      const detailEl = el.querySelector('.boot-detail')

      tl.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.8 + i * 0.3)

      // Checkmark appears green slightly after
      if (checkmark) {
        gsap.set(checkmark, { opacity: 0, color: '#00FF9F' })
        tl.to(checkmark, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out',
        }, 0.85 + i * 0.3)
      }

      // Detail text appears slightly after the line
      if (detailEl) {
        gsap.set(detailEl, { opacity: 0 })
        tl.to(detailEl, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out',
        }, 0.95 + i * 0.3)
      }
    })

    // Final "ALL SYSTEMS NOMINAL" line pulses green then settles
    const finalStart = 0.8 + SYSTEM_LINES.length * 0.3 + 0.2
    tl.to(finalLine, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }, finalStart)
    tl.to(finalLine, {
      filter: 'brightness(1.6)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    }, finalStart)

    return () => {
      tl.kill()
    }
  }, [mounted, stableComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      style={{
        backgroundColor: '#0A0E14',
        fontFamily: "'Share Tech Mono', monospace",
      }}
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-start max-w-[600px] w-full px-8">
        {/* Title */}
        <div
          ref={titleRef}
          className="text-lg tracking-wider mb-2"
          style={{ color: '#0088FF', opacity: 0 }}
        >
          [SKYSTRATOS FLEET INTELLIGENCE v2.1.0]
        </div>

        {/* Separator line */}
        <div
          ref={separatorRef}
          className="w-full h-px mb-4"
          style={{
            backgroundColor: '#0088FF',
            opacity: 0.6,
            transform: 'scaleX(0)',
          }}
        />

        {/* Initializing text */}
        <div
          ref={initRef}
          className="text-sm tracking-wider mb-4"
          style={{ color: '#0088FF', opacity: 0 }}
        >
          INITIALIZING SYSTEMS...
        </div>

        {/* System lines */}
        <div className="space-y-2 mb-6 pl-2">
          {SYSTEM_LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => { linesRef.current[i] = el }}
              className="flex items-center gap-2 text-sm"
              style={{ opacity: 0 }}
            >
              <span className="boot-check" style={{ color: '#00FF9F', opacity: 0 }}>
                &#10003;
              </span>
              <span style={{ color: '#C8D8E8' }}>
                {line.label}
              </span>
              <span
                className="boot-detail ml-2"
                style={{ color: '#4A6A7F', opacity: 0 }}
              >
                [{line.detail}]
              </span>
            </div>
          ))}
        </div>

        {/* Final line */}
        <div
          ref={finalRef}
          className="text-sm tracking-wider font-bold"
          style={{ color: '#00FF9F', opacity: 0 }}
        >
          ALL SYSTEMS NOMINAL — DASHBOARD READY
        </div>
      </div>
    </div>
  )
}
