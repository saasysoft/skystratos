'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HUDButton } from '@/components/hud/HUDButton'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GuidedTourProps {
  onComplete: () => void
}

interface TourStep {
  /** data-tour attribute value to highlight, or null for no highlight */
  target: string | null
  title: string
  description: string
}

// ---------------------------------------------------------------------------
// Tour Steps
// ---------------------------------------------------------------------------

const TOUR_STEPS: TourStep[] = [
  {
    target: 'main-content',
    title: 'FLEET OVERVIEW',
    description:
      'Track every aircraft in your fleet in real-time. See positions, status, and cost metrics at a glance.',
  },
  {
    target: 'vessel-knob',
    title: 'AIRCRAFT TYPE FILTER',
    description:
      'Focus on specific aircraft types. Rotate the knob to filter the fleet.',
  },
  {
    target: 'helmsman-btn',
    title: 'TOWER AI',
    description:
      'Your operations copilot. Ask anything about the fleet \u2014 maintenance status, cost analysis, AOG impact. Tower has full visibility.',
  },
]

const STORAGE_KEY = 'skystratos-tour-completed'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the bounding rect of a data-tour element, or null if not found */
function getTargetRect(target: string): DOMRect | null {
  const el = document.querySelector(`[data-tour="${target}"]`)
  return el ? el.getBoundingClientRect() : null
}

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center'

/** Decide where to place the tooltip relative to the highlighted element */
function computeTooltipPosition(rect: DOMRect | null, isMobile: boolean): TooltipPosition {
  if (!rect) return 'center'
  if (isMobile) return 'center'

  const viewH = window.innerHeight
  const viewW = window.innerWidth
  const centerY = rect.top + rect.height / 2
  const centerX = rect.left + rect.width / 2

  if (centerY < viewH * 0.33) return 'bottom'
  if (centerY > viewH * 0.67) return 'top'
  if (centerX < viewW * 0.33) return 'right'
  if (centerX > viewW * 0.67) return 'left'

  return 'bottom'
}

/** Get CSS positioning for the tooltip card */
function getTooltipStyle(
  rect: DOMRect | null,
  position: TooltipPosition,
): React.CSSProperties {
  if (!rect || position === 'center') {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  const gap = 16
  const maxW = 380

  switch (position) {
    case 'bottom':
      return {
        position: 'fixed',
        top: rect.bottom + gap,
        left: Math.max(16, Math.min(rect.left + rect.width / 2 - maxW / 2, window.innerWidth - maxW - 16)),
        maxWidth: maxW,
      }
    case 'top':
      return {
        position: 'fixed',
        bottom: window.innerHeight - rect.top + gap,
        left: Math.max(16, Math.min(rect.left + rect.width / 2 - maxW / 2, window.innerWidth - maxW - 16)),
        maxWidth: maxW,
      }
    case 'left':
      return {
        position: 'fixed',
        top: Math.max(16, rect.top + rect.height / 2 - 80),
        right: window.innerWidth - rect.left + gap,
        maxWidth: maxW,
      }
    case 'right':
      return {
        position: 'fixed',
        top: Math.max(16, rect.top + rect.height / 2 - 80),
        left: rect.right + gap,
        maxWidth: maxW,
      }
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [step, setStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(true)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const current = TOUR_STEPS[step]
  const isLast = step === TOUR_STEPS.length - 1

  // Measure target element and track resize
  useEffect(() => {
    const measure = () => {
      setIsMobile(window.innerWidth < 768)
      if (current.target) {
        setTargetRect(getTargetRect(current.target))
      } else {
        setTargetRect(null)
      }
    }

    measure()

    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)

    const timer = setTimeout(measure, 300)

    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      clearTimeout(timer)
    }
  }, [current.target])

  const finish = useCallback(() => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // localStorage may be unavailable
      }
    }
    onComplete()
  }, [dontShowAgain, onComplete])

  const handleNext = useCallback(() => {
    if (isLast) {
      finish()
    } else {
      setStep((s) => s + 1)
    }
  }, [isLast, finish])

  const handleSkip = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // noop
    }
    onComplete()
  }, [onComplete])

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip()
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft' && step > 0) setStep((s) => s - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSkip, handleNext, step])

  const tooltipPos = computeTooltipPosition(targetRect, isMobile)
  const tooltipStyle = getTooltipStyle(targetRect, tooltipPos)

  const slideOffset = {
    top: { y: 12 },
    bottom: { y: -12 },
    left: { x: 12 },
    right: { x: -12 },
    center: { y: 20 },
  }[tooltipPos]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: 'auto', fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* Dark overlay with spotlight cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 4}
                y={targetRect.top - 4}
                width={targetRect.width + 8}
                height={targetRect.height + 8}
                rx={4}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.65)"
          mask="url(#tour-spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow on targeted element */}
      {targetRect && (
        <div
          className="absolute pointer-events-none rounded-sm"
          style={{
            left: targetRect.left - 4,
            top: targetRect.top - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            border: '1px solid rgba(0, 136, 255, 0.5)',
            boxShadow:
              '0 0 20px rgba(0, 136, 255, 0.2), inset 0 0 20px rgba(0, 136, 255, 0.05)',
          }}
        />
      )}

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, ...slideOffset }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={tooltipStyle}
          className="z-[101] pointer-events-auto"
        >
          <div
            className="relative border p-5 font-sans"
            style={{
              borderColor: '#1A2A3A',
              backgroundColor: 'rgba(6, 14, 20, 0.95)',
              boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,136,255,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: '1px solid rgba(0,136,255,0.6)', borderLeft: '1px solid rgba(0,136,255,0.6)' }} />
            <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: '1px solid rgba(0,136,255,0.6)', borderRight: '1px solid rgba(0,136,255,0.6)' }} />
            <div className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: '1px solid rgba(0,136,255,0.6)', borderLeft: '1px solid rgba(0,136,255,0.6)' }} />
            <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: '1px solid rgba(0,136,255,0.6)', borderRight: '1px solid rgba(0,136,255,0.6)' }} />

            {/* Step counter */}
            <div className="text-[11px] tracking-widest mb-2"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: '#4A6A7F' }}
            >
              {step + 1}/{TOUR_STEPS.length}
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Share Tech Mono', monospace", color: '#0088FF' }}
            >
              {current.title}
            </h3>

            {/* Description */}
            <p className="text-[15px] leading-relaxed mb-5"
              style={{ color: '#C8D8E8' }}
            >
              {current.description}
            </p>

            {/* Don't show again checkbox -- only on last step */}
            {isLast && (
              <label className="flex items-center gap-2 mb-4 cursor-pointer select-none group">
                <div
                  className="w-4 h-4 rounded-sm flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: dontShowAgain ? 'rgba(0,136,255,0.2)' : 'transparent',
                    border: dontShowAgain ? '1px solid rgba(0,136,255,0.6)' : '1px solid #1A2A3A',
                  }}
                  onClick={() => setDontShowAgain(!dontShowAgain)}
                >
                  {dontShowAgain && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3" style={{ color: '#0088FF' }}>
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[11px] uppercase tracking-wider"
                  style={{ fontFamily: "'Share Tech Mono', monospace", color: '#4A6A7F' }}
                >
                  Don&apos;t show again
                </span>
              </label>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              {!isLast ? (
                <button
                  onClick={handleSkip}
                  className="text-[11px] uppercase tracking-wider transition-colors px-1 py-1"
                  style={{ fontFamily: "'Share Tech Mono', monospace", color: '#4A6A7F' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#7EB8DA' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#4A6A7F' }}
                >
                  SKIP TOUR
                </button>
              ) : (
                <div />
              )}

              <HUDButton
                onClick={handleNext}
                variant="primary"
                size="sm"
              >
                {isLast ? 'BEGIN' : 'NEXT \u2192'}
              </HUDButton>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
