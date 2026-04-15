'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { getMELItems, getAircraft } from '@/lib/data'
import type { MELItem } from '@/lib/data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NOW = new Date('2026-03-23T12:00:00Z')
const MS_PER_HOUR = 1000 * 60 * 60
const APPROACHING_HOURS = 24

const CATEGORY_STYLES: Record<MELItem['category'], { bg: string; text: string }> = {
  A: { bg: 'bg-hud-critical/20', text: 'text-hud-critical' },
  B: { bg: 'bg-hud-warning/20', text: 'text-hud-warning' },
  C: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  D: { bg: 'bg-hud-text-dim/20', text: 'text-hud-text-dim' },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hoursUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate + 'T23:59:59Z')
  return (expiry.getTime() - NOW.getTime()) / MS_PER_HOUR
}

function formatCountdown(hours: number): { days: number; hrs: number; status: 'expired' | 'approaching' | 'active' } {
  if (hours <= 0) return { days: 0, hrs: 0, status: 'expired' }

  const days = Math.floor(hours / 24)
  const hrs = Math.floor(hours % 24)

  if (hours <= APPROACHING_HOURS) {
    return { days, hrs, status: 'approaching' }
  }

  return {
    days,
    hrs,
    status: days <= 1 ? 'approaching' : 'active',
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MELTracker() {
  const { t } = useTranslation()
  const allMEL = getMELItems({ status: 'active' })
  const allAircraft = getAircraft()

  function countdownLabel(cd: ReturnType<typeof formatCountdown>): string {
    if (cd.status === 'expired') return t('mel.expired')
    if (cd.days === 0) return `${cd.hrs}${t('mel.hRemaining')}`
    return `${cd.days}d ${cd.hrs}${t('mel.hRemaining')}`
  }

  const aircraftMap = useMemo(() => {
    const map = new Map<string, { tailNumber: string; type: string }>()
    allAircraft.forEach((ac) => map.set(ac.id, { tailNumber: ac.tailNumber, type: ac.type }))
    return map
  }, [allAircraft])

  // Group by aircraft and enrich with countdown
  const grouped = useMemo(() => {
    const groups = new Map<string, { tailNumber: string; items: (MELItem & { countdown: ReturnType<typeof formatCountdown>; hoursLeft: number })[] }>()

    for (const mel of allMEL) {
      const hrs = hoursUntilExpiry(mel.expiryDate)
      const countdown = formatCountdown(hrs)

      if (!groups.has(mel.aircraftId)) {
        groups.set(mel.aircraftId, {
          tailNumber: mel.tailNumber,
          items: [],
        })
      }
      groups.get(mel.aircraftId)!.items.push({ ...mel, countdown, hoursLeft: hrs })
    }

    // Sort items within each group by expiry (soonest first)
    Array.from(groups.values()).forEach((group) => {
      group.items.sort((a: typeof group.items[number], b: typeof group.items[number]) => a.hoursLeft - b.hoursLeft)
    })

    return groups
  }, [allMEL])

  // Summary stats
  const stats = useMemo(() => {
    let total = 0
    let catA = 0
    let approaching = 0
    let aircraftWith3Plus = 0

    for (const [, group] of Array.from(grouped)) {
      total += group.items.length
      if (group.items.length >= 3) aircraftWith3Plus++

      for (const item of group.items) {
        if (item.category === 'A') catA++
        if (item.countdown.status === 'approaching' || item.countdown.status === 'expired') approaching++
      }
    }

    return { total, catA, approaching, aircraftWith3Plus }
  }, [grouped])

  return (
    <div className="space-y-4">
      {/* ── Summary Strip ─────────────────────────────────────────── */}
      <HUDPanel label={t('mel.title')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCell label={t('mel.activeMELs')} value={stats.total} />
          <SummaryCell label={t('mel.categoryA')} value={stats.catA} color="text-hud-critical" />
          <SummaryCell
            label={t('mel.approachingLimit')}
            value={stats.approaching}
            color={stats.approaching > 0 ? 'text-hud-warning' : 'text-hud-text-primary'}
          />
          <SummaryCell
            label={t('mel.acWith3Plus')}
            value={stats.aircraftWith3Plus}
            color={stats.aircraftWith3Plus > 0 ? 'text-hud-warning' : 'text-hud-text-primary'}
          />
        </div>
      </HUDPanel>

      {/* ── Main Table ────────────────────────────────────────────── */}
      <HUDPanel label={t('mel.activeItems')}>
        <div className="overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent">
          {Array.from(grouped.entries()).map(([aircraftId, group]) => {
            const ac = aircraftMap.get(aircraftId)
            const hasWarning = group.items.length >= 3

            return (
              <div key={aircraftId} className="mb-4 last:mb-0">
                {/* Aircraft group header */}
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-1.5 mb-1 rounded-sm',
                    'font-mono text-[12px] uppercase tracking-wider',
                    hasWarning
                      ? 'bg-hud-warning/10 text-hud-warning border-l-2 border-hud-warning'
                      : 'bg-hud-surface/50 text-hud-text-dim border-l-2 border-hud-border',
                  )}
                >
                  <span className="font-bold">{group.tailNumber}</span>
                  {ac && <span className="text-[10px] opacity-70">{ac.type}</span>}
                  <span className="ml-auto text-[10px]">
                    {group.items.length} {t('mel.itemsLabel')}
                  </span>
                  {hasWarning && (
                    <span className="text-[10px] text-hud-warning animate-pulse">3+ {t('mel.melsLabel')}</span>
                  )}
                </div>

                {/* Items table */}
                <table className="w-full font-mono text-[11px]">
                  <thead>
                    <tr className="text-hud-text-dim text-[10px] uppercase tracking-wider">
                      <th className="text-left px-2 py-1 w-[72px]">{t('mel.ata')}</th>
                      <th className="text-left px-2 py-1">{t('mel.description')}</th>
                      <th className="text-center px-2 py-1 w-[44px]">{t('mel.cat')}</th>
                      <th className="text-left px-2 py-1 w-[80px]">{t('mel.deferred')}</th>
                      <th className="text-left px-2 py-1 w-[80px]">{t('mel.expiry')}</th>
                      <th className="text-right px-2 py-1 w-[120px]">{t('mel.countdown')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item) => {
                      const catStyle = CATEGORY_STYLES[item.category]
                      return (
                        <tr
                          key={item.id}
                          className="border-t border-hud-border/20 hover:bg-hud-surface/30 transition-colors"
                        >
                          <td className="px-2 py-1.5 text-hud-text-primary">
                            ATA {item.ataChapter}
                          </td>
                          <td className="px-2 py-1.5 text-hud-text-dim truncate max-w-[200px]" title={item.description}>
                            {item.description.length > 60
                              ? item.description.slice(0, 57) + '...'
                              : item.description}
                          </td>
                          <td className="px-2 py-1.5 text-center">
                            <span
                              className={cn(
                                'inline-block px-1.5 py-0.5 rounded text-[10px] font-bold',
                                catStyle.bg,
                                catStyle.text,
                              )}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-hud-text-dim">
                            {item.deferredDate.slice(5)}
                          </td>
                          <td className="px-2 py-1.5 text-hud-text-dim">
                            {item.expiryDate.slice(5)}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            <span
                              className={cn(
                                'font-bold',
                                item.countdown.status === 'expired' && 'text-hud-critical animate-pulse',
                                item.countdown.status === 'approaching' && 'text-hud-warning animate-pulse',
                                item.countdown.status === 'active' && 'text-hud-text-dim',
                              )}
                            >
                              {countdownLabel(item.countdown)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </HUDPanel>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCell({
  label,
  value,
  color = 'text-hud-text-primary',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="text-center">
      <div className={cn('font-mono text-2xl font-bold', color)}>{value}</div>
      <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  )
}
