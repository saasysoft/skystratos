'use client'

import { cn } from '@/lib/utils'

interface HUDStatusBarProps {
  value: number
  label: string
  showValue?: boolean
  variant?: 'default' | 'gradient'
  className?: string
}

function getGradientColor(value: number): string {
  if (value >= 80) return '#FF3B3B'
  if (value >= 50) return '#FFB800'
  return '#00FF9F'
}

export function HUDStatusBar({
  value,
  label,
  showValue = true,
  variant = 'default',
  className,
}: HUDStatusBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  const fillColor =
    variant === 'gradient'
      ? getGradientColor(clampedValue)
      : '#0088FF'

  // For gradient variant, build a CSS gradient that shows the full spectrum
  const fillBackground =
    variant === 'gradient'
      ? `linear-gradient(to right, #00FF9F 0%, #00FF9F 48%, #FFB800 50%, #FFB800 78%, #FF3B3B 80%, #FF3B3B 100%)`
      : fillColor

  return (
    <div className={cn('w-full', className)}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-hud-xs text-hud-text-dim uppercase">
          {label}
        </span>
        {showValue && (
          <span
            className="font-mono text-hud-xs"
            style={{ color: variant === 'gradient' ? fillColor : '#0088FF' }}
          >
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>

      {/* Bar container */}
      <div className="relative h-2 w-full rounded-sm bg-hud-surface overflow-hidden">
        {/* Subtle border */}
        <div className="absolute inset-0 rounded-sm border border-hud-border/30" />

        {/* Fill */}
        <div
          className="h-full rounded-sm transition-[width] duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            background: variant === 'gradient' ? fillBackground : fillColor,
            boxShadow: `0 0 8px ${variant === 'gradient' ? fillColor : 'rgba(0,136,255,0.3)'}`,
          }}
        />
      </div>
    </div>
  )
}
