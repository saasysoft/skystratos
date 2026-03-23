'use client'

import { useState, useCallback, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'

interface TowerInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

export function TowerInput({ onSend, disabled }: TowerInputProps) {
  const [value, setValue] = useState('')
  const { t } = useTranslation()

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-hud-border/60">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('tower.placeholder')}
        disabled={disabled}
        className={cn(
          'flex-1 min-h-[48px] px-3 py-2',
          'bg-hud-surface border border-hud-border/60 rounded-sm',
          'font-sans text-[13px] text-hud-text-primary',
          'placeholder:text-hud-text-dim/60',
          'outline-none',
          'focus:border-hud-primary/40 focus:shadow-[0_0_8px_rgba(0,212,255,0.1)]',
          'transition-all duration-200',
          disabled && 'opacity-40 cursor-not-allowed',
        )}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className={cn(
          'flex-shrink-0 w-[48px] h-[48px]',
          'flex items-center justify-center',
          'bg-hud-surface border border-hud-border/60 rounded-sm',
          'text-hud-primary',
          'transition-all duration-200',
          'hover:border-hud-primary/50 hover:shadow-[0_0_10px_rgba(0,212,255,0.15)]',
          'active:translate-y-[1px]',
          (disabled || !value.trim()) &&
            'opacity-30 cursor-not-allowed pointer-events-none',
        )}
        aria-label="Send message"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
  )
}
