'use client'

import { cn } from '@/lib/utils'

interface HUDIndicatorProps {
  status: 'nominal' | 'warning' | 'critical' | 'offline'
  label: string
  value?: string
  size?: 'sm' | 'md'
  className?: string
}

const statusConfig = {
  nominal: {
    color: 'bg-hud-nominal',
    shadow: 'shadow-[0_0_6px_rgba(0,255,159,0.6)]',
    animation: '',
  },
  warning: {
    color: 'bg-hud-warning',
    shadow: 'shadow-[0_0_6px_rgba(255,184,0,0.6)]',
    animation: 'animate-pulse-slow',
  },
  critical: {
    color: 'bg-hud-critical',
    shadow: 'shadow-[0_0_6px_rgba(255,59,59,0.6)]',
    animation: 'animate-pulse-fast',
  },
  offline: {
    color: 'bg-hud-text-dim/40',
    shadow: '',
    animation: '',
  },
} as const

export function HUDIndicator({
  status,
  label,
  value,
  size = 'md',
  className,
}: HUDIndicatorProps) {
  const config = statusConfig[status]
  const dotSize = size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Status dot */}
      <span
        className={cn(
          'rounded-full flex-shrink-0',
          dotSize,
          config.color,
          config.shadow,
          config.animation,
        )}
      />

      {/* Label */}
      <span className="font-mono text-hud-xs text-hud-text-dim uppercase">
        {label}
      </span>

      {/* Optional value */}
      {value && (
        <span className="font-mono text-hud-xs text-hud-text-primary">
          {value}
        </span>
      )}
    </div>
  )
}
