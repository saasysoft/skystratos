'use client'

import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'

export type TabId =
  | 'fleet'
  | 'maintenance'
  | 'procurement'
  | 'cost'
  | 'mel'
  | 'compliance'
  | 'dispatch'
  | 'aog'
  | 'inventory-map'

interface NavConsoleProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  onTowerToggle?: () => void
  towerOpen?: boolean
}

const primaryTabs: { id: TabId; labelKey: string; icon: JSX.Element }[] = [
  {
    id: 'fleet',
    labelKey: 'nav.fleet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M3 17l3-3h12l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 14V8l6-4 6 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4v10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'maintenance',
    labelKey: 'nav.maintenance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.2a2 2 0 01-2.83 0l-.1-.1a2 2 0 010-2.83l6.73-6.73A6 6 0 0114.7 6.3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'procurement',
    labelKey: 'nav.procurement',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'cost',
    labelKey: 'nav.cost',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const secondaryTabs: { id: TabId; labelKey: string }[] = [
  { id: 'mel', labelKey: 'navSub.mel' },
  { id: 'compliance', labelKey: 'navSub.adCompliance' },
  { id: 'dispatch', labelKey: 'navSub.dispatch' },
  { id: 'aog', labelKey: 'navSub.aog' },
  { id: 'inventory-map', labelKey: 'navSub.inventory' },
]

export default function NavConsole({ activeTab, onTabChange, onTowerToggle, towerOpen }: NavConsoleProps) {
  const { t } = useTranslation()

  const isPrimaryActive = primaryTabs.some((tab) => tab.id === activeTab)
  const isSecondaryActive = secondaryTabs.some((tab) => tab.id === activeTab)

  return (
    <div className="flex flex-col bg-hud-surface/50 select-none" data-no-print data-tour="nav-tabs">
      {/* Primary row */}
      <nav
        className="flex items-stretch h-[42px]"
        role="tablist"
        aria-label="Bridge navigation"
      >
        {/* SKYSTRATOS wordmark */}
        <div className="flex items-center px-5 border-r border-hud-border shrink-0">
          <span className="font-mono text-hud-sm text-hud-primary tracking-[0.3em] font-normal">
            SKYSTRATOS
          </span>
        </div>

        {/* Primary Tabs */}
        {primaryTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2.5 px-5 transition-colors duration-200',
                'font-mono text-hud-xs uppercase tracking-widest whitespace-nowrap',
                'hover:bg-hud-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-primary/50',
                isActive
                  ? 'text-hud-primary bg-hud-primary/[0.08]'
                  : 'text-hud-text-dim hover:text-hud-text-secondary'
              )}
            >
              <span className={cn(isActive ? 'text-hud-primary' : 'text-hud-text-dim')}>
                {tab.icon}
              </span>
              <span>{t(tab.labelKey)}</span>

              {/* Active indicator -- bottom glow bar */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-hud-primary rounded-full"
                  style={{
                    boxShadow: '0 0 8px rgba(0, 136, 255, 0.6), 0 0 20px rgba(0, 136, 255, 0.3)',
                  }}
                />
              )}
            </button>
          )
        })}

        {/* Right spacer */}
        <div className="flex-1" />

        {/* Tower AI button -- far right */}
        {onTowerToggle && (
          <button
            onClick={onTowerToggle}
            className={cn(
              'flex items-center gap-2.5 px-5 transition-colors duration-200 border-l border-hud-border shrink-0',
              'font-mono text-hud-xs uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis',
              'hover:bg-hud-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-primary/50',
              towerOpen
                ? 'text-hud-primary bg-hud-primary/[0.08]'
                : 'text-hud-text-dim hover:text-hud-text-secondary'
            )}
            aria-label="Toggle Tower AI"
            data-tour="tower-btn"
          >
            {/* Tower/ATC icon */}
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.64 5.64l4.24 4.24M14.12 14.12l4.24 4.24M5.64 18.36l4.24-4.24M14.12 9.88l4.24-4.24" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            </svg>
            <span>{t('navSub.towerAI')}</span>
            {/* Online indicator dot */}
            <span className="w-2 h-2 rounded-full bg-hud-nominal animate-pulse-slow" />
          </button>
        )}
      </nav>

      {/* Secondary row -- aviation specialty tabs */}
      <div
        className="flex items-center h-[28px] border-t border-hud-border/50 px-5 gap-1"
        role="tablist"
        aria-label="Aviation modules"
      >
        <span className="font-mono text-[9px] text-hud-text-dim tracking-widest uppercase mr-2 shrink-0 opacity-60">
          {t('navSub.aviation')}
        </span>
        <div className="w-px h-3 bg-hud-border/50 mr-1" />
        {secondaryTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative px-3 py-1 rounded-sm transition-colors duration-150',
                'font-mono text-[10px] uppercase tracking-wider whitespace-nowrap',
                'hover:bg-hud-primary/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-primary/50',
                isActive
                  ? 'text-hud-primary bg-hud-primary/[0.08]'
                  : 'text-hud-text-dim hover:text-hud-text-secondary'
              )}
            >
              {t(tab.labelKey)}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1 right-1 h-[1px] bg-hud-primary rounded-full"
                  style={{
                    boxShadow: '0 0 6px rgba(0, 136, 255, 0.5)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
