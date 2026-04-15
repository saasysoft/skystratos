'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'

interface StatusBarProps {
  alertCount?: number
  alertSeverity?: 'nominal' | 'warning' | 'critical'
}

export default function StatusBar({ alertCount = 0, alertSeverity = 'nominal' }: StatusBarProps) {
  const [time, setTime] = useState<string>('')
  const { t, locale, setLocale } = useTranslation()
  const toggleLocale = () => setLocale(locale === 'en' ? 'zh-TW' : 'en')

  // Update clock every second -- only after mount to avoid hydration mismatch
  useEffect(() => {
    const formatTime = () => {
      const now = new Date()
      const date = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
      const clock = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      return `${date}  ${clock} UTC+8`
    }

    setTime(formatTime())
    const interval = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  const severityColor = {
    nominal: 'bg-hud-nominal',
    warning: 'bg-hud-warning animate-pulse-slow',
    critical: 'bg-hud-critical animate-pulse-fast',
  }[alertSeverity]

  return (
    <footer
      className="status-bar flex items-center justify-between h-[40px] px-4 bg-hud-surface/30 select-none"
      data-no-print
    >
      {/* Left -- system identifier */}
      <div className="font-mono text-hud-xs text-hud-text-dim tracking-widest whitespace-nowrap">
        {t('status.systemId')}
      </div>

      {/* Center -- clock */}
      <div className="font-mono text-hud-xs text-hud-text-secondary tracking-wider">
        {time}
      </div>

      {/* Right -- alerts + language */}
      <div className="flex items-center gap-4">
        {/* Alert badge */}
        <div className="flex items-center gap-2" data-tour="alerts-badge">
          <span className={cn('w-2 h-2 rounded-full', severityColor)} />
          <span className={cn(
            'font-mono text-hud-xs',
            alertCount > 0 ? 'text-hud-text-primary' : 'text-hud-text-dim'
          )}>
            {alertCount} {alertCount === 1 ? t('status.alert') : t('status.alerts')}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-hud-border" />

        {/* Language toggle */}
        <button
          onClick={toggleLocale}
          className={cn(
            'font-mono text-hud-xs tracking-wider px-2 py-1 rounded-sm transition-colors',
            'hover:bg-hud-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-primary/50'
          )}
          aria-label="Toggle language"
          data-tour="lang-toggle"
        >
          <span className={cn(locale === 'en' ? 'text-hud-primary' : 'text-hud-text-dim')}>EN</span>
          <span className="text-hud-text-dim mx-1">|</span>
          <span className={cn((locale as string) === 'zh-TW' ? 'text-hud-primary' : 'text-hud-text-dim')}>
            &#x4E2D;&#x6587;
          </span>
        </button>
      </div>
    </footer>
  )
}
