'use client'

import { cn } from '@/lib/utils'

const variantStyles = {
  primary: {
    border: 'border-hud-primary/30',
    glow: 'shadow-[0_0_20px_rgba(0,136,255,0.15),0_0_40px_rgba(0,136,255,0.08)]',
    activeBorder: 'border-hud-primary/60',
    activeShadow: 'shadow-[0_0_30px_rgba(0,136,255,0.25),0_0_60px_rgba(0,136,255,0.12)]',
    label: 'text-hud-text-dim',
  },
  secondary: {
    border: 'border-hud-secondary/30',
    glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15),0_0_40px_rgba(255,184,0,0.08)]',
    activeBorder: 'border-hud-secondary/60',
    activeShadow: 'shadow-[0_0_30px_rgba(255,184,0,0.25),0_0_60px_rgba(255,184,0,0.12)]',
    label: 'text-hud-text-dim',
  },
  alert: {
    border: 'border-hud-warning/30',
    glow: 'shadow-[0_0_20px_rgba(255,184,0,0.15),0_0_40px_rgba(255,184,0,0.08)]',
    activeBorder: 'border-hud-warning/60',
    activeShadow: 'shadow-[0_0_30px_rgba(255,184,0,0.25),0_0_60px_rgba(255,184,0,0.12)]',
    label: 'text-hud-warning',
  },
  nominal: {
    border: 'border-hud-nominal/30',
    glow: 'shadow-[0_0_20px_rgba(0,255,159,0.15),0_0_40px_rgba(0,255,159,0.08)]',
    activeBorder: 'border-hud-nominal/60',
    activeShadow: 'shadow-[0_0_30px_rgba(0,255,159,0.25),0_0_60px_rgba(0,255,159,0.12)]',
    label: 'text-hud-text-dim',
  },
} as const

type HUDPanelVariant = keyof typeof variantStyles

interface HUDPanelProps {
  variant?: HUDPanelVariant
  glow?: boolean
  scanlines?: boolean
  label?: string
  active?: boolean
  className?: string
  children: React.ReactNode
}

export function HUDPanel({
  variant = 'primary',
  glow = false,
  scanlines = false,
  label,
  active = false,
  className,
  children,
}: HUDPanelProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'hud-panel hud-clip relative',
        scanlines && 'hud-scanlines',
        active ? styles.activeBorder : styles.border,
        active && styles.activeShadow,
        glow && 'animate-glow-pulse',
        className,
      )}
      data-active={active || undefined}
    >
      {label && (
        <div
          className={cn(
            'absolute top-0 left-3 -translate-y-px z-10',
            'font-mono text-[11px] uppercase tracking-widest',
            'px-2 py-0.5',
            'bg-hud-bg/80',
            styles.label,
          )}
        >
          {label}
        </div>
      )}

      <div className="relative z-0 p-4">
        {children}
      </div>
    </div>
  )
}
