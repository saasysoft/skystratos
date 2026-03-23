'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BridgeShellProps {
  children: ReactNode
  towerPanel?: ReactNode
  towerOpen?: boolean
  nav?: ReactNode
  statusBar?: ReactNode
}

/** Decorative corner accent -- targeting reticle style */
function CornerAccent({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotation = {
    tl: 'rotate(0)',
    tr: 'rotate(90)',
    bl: 'rotate(-90)',
    br: 'rotate(180)',
  }[position]

  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0',
  }[position]

  return (
    <svg
      className={cn('absolute w-6 h-6 text-hud-primary/60 pointer-events-none z-50', positionClasses)}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: rotation }}
      aria-hidden="true"
    >
      <path
        d="M0 0 L10 0 M0 0 L0 10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0 0 L5 0 M0 0 L0 5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
        transform="translate(2,2)"
      />
    </svg>
  )
}

export default function BridgeShell({ children, towerPanel, towerOpen, nav, statusBar }: BridgeShellProps) {
  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-hud-bg border border-hud-border"
      data-no-print
    >
      {/* Corner accents */}
      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      {/* Main grid layout -- columns animate when Tower opens */}
      <div
        className="grid h-full w-full transition-[grid-template-columns] duration-300 ease-out"
        style={{
          gridTemplateRows: 'auto 1fr 40px',
          gridTemplateColumns: towerOpen ? '1fr 320px' : '1fr',
        }}
      >
        {/* Top nav -- spans full width */}
        <div
          className="border-b border-hud-border"
          style={{ gridRow: '1', gridColumn: '1 / -1' }}
        >
          {nav}
        </div>

        {/* Main content area */}
        <main
          className="overflow-auto transition-all duration-300"
          style={{ gridRow: '2', gridColumn: '1' }}
          data-tour="main-content"
        >
          {children}
        </main>

        {/* Tower sidebar -- slides in from right, content resizes */}
        {towerOpen && towerPanel && (
          <aside
            className="border-l border-hud-border overflow-hidden bg-hud-bg"
            style={{ gridRow: '2', gridColumn: '2' }}
          >
            {towerPanel}
          </aside>
        )}

        {/* Bottom status bar -- spans full width */}
        <div
          className="border-t border-hud-border"
          style={{ gridRow: '3', gridColumn: '1 / -1' }}
        >
          {statusBar}
        </div>
      </div>

      {/* Subtle edge glow lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hud-primary/20 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-hud-primary/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-hud-primary/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-hud-primary/20 to-transparent pointer-events-none" />
    </div>
  )
}
