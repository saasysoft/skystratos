'use client'

import { cn } from '@/lib/utils'

interface HUDButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const variantStyles = {
  primary: {
    bg: 'bg-gradient-to-b from-[#0A2A3A] to-[#0C1218]',
    border: 'border-hud-primary/30',
    hoverBorder: 'hover:border-hud-primary/70',
    hoverShadow: 'hover:shadow-[0_0_12px_rgba(0,136,255,0.25)]',
    text: 'text-hud-primary',
    activeShadow: 'active:shadow-[0_0_4px_rgba(0,136,255,0.15)]',
  },
  secondary: {
    bg: 'bg-gradient-to-b from-[#0A1A2A] to-[#0C1218]',
    border: 'border-hud-border/50',
    hoverBorder: 'hover:border-hud-text-dim/70',
    hoverShadow: 'hover:shadow-[0_0_12px_rgba(90,122,155,0.2)]',
    text: 'text-hud-text-secondary',
    activeShadow: 'active:shadow-[0_0_4px_rgba(90,122,155,0.1)]',
  },
  danger: {
    bg: 'bg-gradient-to-b from-[#2A0A0A] to-[#1A0808]',
    border: 'border-hud-critical/30',
    hoverBorder: 'hover:border-hud-critical/70',
    hoverShadow: 'hover:shadow-[0_0_12px_rgba(255,59,59,0.25)]',
    text: 'text-hud-critical',
    activeShadow: 'active:shadow-[0_0_4px_rgba(255,59,59,0.15)]',
  },
} as const

const sizeStyles = {
  sm: 'min-h-[32px] px-3 py-1.5 text-[11px]',
  md: 'min-h-[40px] px-4 py-2 text-[12px]',
  lg: 'min-h-[48px] px-6 py-3 text-[13px]',
} as const

export function HUDButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
}: HUDButtonProps) {
  const v = variantStyles[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base
        'relative inline-flex items-center justify-center',
        'font-mono uppercase tracking-wider',
        'border rounded-sm',
        'select-none cursor-pointer',
        'transition-all duration-200 ease-out',

        // Raised look: shadow for depth
        'shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]',

        // Size
        sizeStyles[size],

        // Variant colors
        v.bg,
        v.border,
        v.text,

        // Hover effects
        !disabled && v.hoverBorder,
        !disabled && v.hoverShadow,

        // Active/pressed: reduce shadow, slight press-in
        !disabled && 'active:translate-y-[1px]',
        !disabled && v.activeShadow,

        // Disabled
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',

        className,
      )}
    >
      {children}
    </button>
  )
}
