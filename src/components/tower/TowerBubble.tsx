'use client'

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TowerSidebar } from './TowerSidebar'

export type TowerBubbleState = 'hidden' | 'bubble' | 'chat' | 'expanded'

export interface TowerBubbleHandle {
  open: () => void
  close: () => void
  toggle: () => void
  setState: (state: TowerBubbleState) => void
}

/** Control tower radar icon */
function TowerIcon({ size = 28 }: { size?: number }) {
  const r = size / 2
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="text-hud-primary"
    >
      {/* Radar dish base */}
      <rect
        x={r - 3}
        y={r + 2}
        width={6}
        height={r - 4}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Tower cab */}
      <rect
        x={r - 5}
        y={r - 4}
        width={10}
        height={7}
        rx={1}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Antenna */}
      <line
        x1={r}
        y1={r - 4}
        x2={r}
        y2={2}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Radar sweep arcs */}
      <path
        d={`M ${r - 6} ${r - 8} Q ${r} ${r - 14} ${r + 6} ${r - 8}`}
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M ${r - 4} ${r - 6} Q ${r} ${r - 10} ${r + 4} ${r - 6}`}
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      {/* Ground line */}
      <line
        x1={r - 7}
        y1={size - 2}
        x2={r + 7}
        y2={size - 2}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export const TowerBubble = forwardRef<TowerBubbleHandle>(
  function TowerBubble(_props, ref) {
    const [state, setState] = useState<TowerBubbleState>('hidden')
    const [showTooltip, setShowTooltip] = useState(false)

    const open = useCallback(() => setState('chat'), [])
    const close = useCallback(() => setState('hidden'), [])
    const toggle = useCallback(
      () => setState((prev) => (prev === 'hidden' ? 'chat' : 'hidden')),
      [],
    )

    useImperativeHandle(
      ref,
      () => ({ open, close, toggle, setState }),
      [open, close, toggle],
    )

    // Keyboard: T toggles bubble/chat, Escape closes
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
        const isEditable =
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          (e.target as HTMLElement)?.isContentEditable

        if (e.key === 'Escape') {
          e.preventDefault()
          setState('hidden')
          return
        }

        if ((e.key === 't' || e.key === 'T') && !isEditable) {
          e.preventDefault()
          setState((prev) => (prev === 'hidden' ? 'chat' : 'hidden'))
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }, [])

    // Click outside to close chat panel
    useEffect(() => {
      if (state !== 'chat') return
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (
          target.closest('[data-tower-chat]') ||
          target.closest('[data-tower-bubble]')
        ) {
          return
        }
        setState('bubble')
      }
      const timer = setTimeout(() => {
        window.addEventListener('mousedown', handler)
      }, 100)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('mousedown', handler)
      }
    }, [state])

    return (
      <LazyMotion features={domAnimation} strict>
        {/* ===== FLOATING BUBBLE ===== */}
        <AnimatePresence>
          {state === 'bubble' && (
            <m.div
              key="tower-bubble-wrapper"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50"
              style={{ left: 24, bottom: 80 }}
              data-tower-bubble
            >
              <button
                type="button"
                onClick={() =>
                  setState((prev) => (prev === 'bubble' ? 'chat' : 'bubble'))
                }
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Open Tower AI"
                className={cn(
                  'relative w-14 h-14 rounded-full flex items-center justify-center',
                  'bg-hud-surface border border-hud-border',
                  'shadow-[0_0_16px_rgba(0,212,255,0.15)]',
                  'hover:scale-110 hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]',
                  'transition-all duration-200 cursor-pointer',
                  state === 'bubble' && 'animate-glow-pulse',
                )}
              >
                <TowerIcon size={28} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-hud-nominal border-2 border-hud-surface" />
              </button>

              <AnimatePresence>
                {showTooltip && state === 'bubble' && (
                  <m.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className={cn(
                      'absolute left-1/2 -translate-x-1/2 bottom-full mb-2',
                      'px-2.5 py-1 rounded-sm',
                      'bg-hud-bg border border-hud-border',
                      'font-mono text-[10px] uppercase tracking-widest text-hud-primary',
                      'whitespace-nowrap pointer-events-none select-none',
                    )}
                  >
                    TOWER AI
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          )}
        </AnimatePresence>

        {/* ===== CHAT PANEL ===== */}
        <AnimatePresence>
          {state === 'chat' && (
            <m.div
              key="tower-chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              data-tower-chat
              className={cn(
                'fixed z-50 flex flex-col',
                'hud-panel hud-clip',
                'shadow-[0_0_30px_rgba(0,212,255,0.12)]',
              )}
              style={{
                left: 24,
                bottom: 148,
                width: 360,
                height: 480,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-hud-border/60 shrink-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-hud-primary select-none">
                  TOWER
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-hud-nominal" />

                <div className="ml-auto flex items-center gap-1">
                  {/* Expand button */}
                  <button
                    type="button"
                    onClick={() => setState('expanded')}
                    aria-label="Expand Tower panel"
                    className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-sm',
                      'text-hud-text-secondary hover:text-hud-primary hover:bg-hud-surface/50',
                      'transition-colors font-mono text-xs',
                    )}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close Tower"
                    className={cn(
                      'w-7 h-7 flex items-center justify-center rounded-sm',
                      'text-hud-text-secondary hover:text-hud-primary hover:bg-hud-surface/50',
                      'transition-colors font-mono text-xs',
                    )}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M1 1L13 13M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat content */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <TowerSidebar />
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* ===== EXPANDED PANEL ===== */}
        <AnimatePresence>
          {state === 'expanded' && (
            <>
              {/* Backdrop */}
              <m.div
                key="tower-expanded-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/30"
                style={{ top: 56, bottom: 40 }}
                onClick={() => setState('chat')}
                aria-hidden="true"
              />

              {/* Panel */}
              <m.div
                key="tower-expanded-panel"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                data-tower-chat
                className={cn(
                  'fixed right-0 z-50 flex flex-col',
                  'bg-hud-bg border-l border-hud-border',
                  'shadow-[inset_1px_0_12px_rgba(0,212,255,0.08)]',
                )}
                style={{
                  top: 56,
                  bottom: 40,
                  width: 320,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-hud-border/60 shrink-0">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-hud-primary select-none">
                    TOWER
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-hud-nominal" />

                  <div className="ml-auto flex items-center gap-1">
                    {/* Collapse button */}
                    <button
                      type="button"
                      onClick={() => setState('chat')}
                      aria-label="Collapse Tower panel"
                      className={cn(
                        'w-7 h-7 flex items-center justify-center rounded-sm',
                        'text-hud-text-secondary hover:text-hud-primary hover:bg-hud-surface/50',
                        'transition-colors font-mono text-xs',
                      )}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M5 1L1 1L1 5M13 5L13 1L9 1M9 13L13 13L13 9M1 9L1 13L5 13"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </button>

                    {/* Close button */}
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close Tower"
                      className={cn(
                        'w-7 h-7 flex items-center justify-center rounded-sm',
                        'text-hud-text-secondary hover:text-hud-primary hover:bg-hud-surface/50',
                        'transition-colors font-mono text-xs',
                      )}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M1 1L13 13M13 1L1 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Chat content */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <TowerSidebar />
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </LazyMotion>
    )
  },
)
