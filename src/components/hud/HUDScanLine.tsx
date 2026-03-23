'use client'

import { cn } from '@/lib/utils'

interface HUDScanLineProps {
  className?: string
}

export function HUDScanLine({ className }: HUDScanLineProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none z-10',
        className,
      )}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        )`,
      }}
      aria-hidden="true"
    />
  )
}
