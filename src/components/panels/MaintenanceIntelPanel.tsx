'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDIndicator } from '@/components/hud/HUDIndicator'
import { HUDStatusBar } from '@/components/hud/HUDStatusBar'
import { getMaintenanceRecords, getAircraft } from '@/lib/data'
import type {
  MaintenanceRecord,
  MaintenanceCategory,
} from '@/lib/mock-data/types'
import { useTranslation } from '@/lib/i18n/use-translation'
import { td } from '@/lib/i18n/data-i18n'

// ─── Color palette ───────────────────────────────────────────────────
const CATEGORY_COLORS: Record<MaintenanceCategory, string> = {
  Engines: '#FF3B3B',
  Airframe: '#0088FF',
  Avionics: '#FFB800',
  'Landing Gear': '#00FF9F',
  APU: '#A78BFA',
  Hydraulics: '#5A7A9B',
  Pressurization: '#2DD4BF',
  'Flight Controls': '#FF8C00',
  Electrical: '#00FF41',
  Interiors: '#7BA8D9',
}

const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#0088FF',
  'In Progress': '#00FF9F',
  Overdue: '#FF3B3B',
  Emergency: '#FF8C00',
}

// ─── Helpers ─────────────────────────────────────────────────────────
const PINNED_NOW = new Date('2026-03-23')

function daysOverdue(scheduledDate: string): number {
  const scheduled = new Date(scheduledDate)
  return Math.max(0, Math.floor((PINNED_NOW.getTime() - scheduled.getTime()) / 86_400_000))
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// A320neo aircraft IDs — lookup once
function getA320neoIds(): Set<string> {
  return new Set(getAircraft({ type: 'A320neo' }).map((a) => a.id))
}

// ─── Sub-components ──────────────────────────────────────────────────

/** Overdue alert card */
function OverdueCard({ record }: { record: MaintenanceRecord }) {
  const { t, locale } = useTranslation()
  const days = daysOverdue(record.scheduledDate)
  const isCritical = record.priority === 'Critical'

  return (
    <HUDPanel variant="alert" glow active className="min-w-[280px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`font-mono text-hud-sm font-bold ${isCritical ? 'text-hud-critical' : 'text-hud-warning'}`}>
            {record.tailNumber}
          </p>
          <p className="font-mono text-hud-xs text-hud-text-secondary mt-1 line-clamp-2">
            {td(record.description, locale)}
          </p>
          <p className="font-mono text-hud-xs text-hud-text-dim mt-1">
            Due {formatDate(record.scheduledDate)} &mdash;{' '}
            <span className="text-hud-critical font-bold">{days}{t('maintenance.daysOverdue')}</span>
          </p>
        </div>
        <span
          className={`flex-shrink-0 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
            isCritical
              ? 'bg-hud-critical/20 text-hud-critical animate-pulse-fast'
              : 'bg-hud-warning/20 text-hud-warning animate-pulse-slow'
          }`}
        >
          {td(record.priority, locale)}
        </span>
      </div>
      <HUDIndicator
        status={isCritical ? 'critical' : 'warning'}
        label={td(record.category, locale)}
        value={`${t('maintenance.estDowntime')} ${record.downtimeHours}${t('maintenance.downtimeHours')}`}
        className="mt-2"
      />
    </HUDPanel>
  )
}

/** Maintenance Timeline — next 90 days grouped by aircraft */
function MaintenanceTimeline({
  records,
}: {
  records: MaintenanceRecord[]
}) {
  const { t, locale } = useTranslation()
  const now = PINNED_NOW
  const endDate = new Date('2026-06-21') // 90 days out
  const totalDays = 90

  // Filter to relevant records (overdue, in progress, or upcoming within 90 days)
  const relevant = useMemo(() => {
    return records.filter((r) => {
      if (r.status === 'Completed') return false
      const sd = new Date(r.scheduledDate)
      // Overdue or In Progress are always shown
      if (r.status === 'Overdue' || r.status === 'In Progress') return true
      // Scheduled within 90 days
      return sd >= now && sd <= endDate
    })
  }, [records])

  // Group by aircraft tail number
  const grouped = useMemo(() => {
    const map = new Map<string, MaintenanceRecord[]>()
    for (const r of relevant) {
      const key = r.tailNumber
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
    // Sort aircraft: those with overdue first
    return Array.from(map.entries()).sort(([, a], [, b]) => {
      const aHasOverdue = a.some((r) => r.status === 'Overdue')
      const bHasOverdue = b.some((r) => r.status === 'Overdue')
      if (aHasOverdue && !bHasOverdue) return -1
      if (!aHasOverdue && bHasOverdue) return 1
      return 0
    })
  }, [relevant])

  function barPosition(record: MaintenanceRecord) {
    const sd = new Date(record.scheduledDate)
    const startOffset = Math.max(
      0,
      (sd.getTime() - now.getTime()) / 86_400_000,
    )
    // For overdue items, start at 0 (left edge)
    const leftPct =
      record.status === 'Overdue' ? 0 : (startOffset / totalDays) * 100
    // Convert downtime hours to days for bar width
    const downtimeDays = record.downtimeHours / 24
    const widthPct = Math.max(2, (downtimeDays / totalDays) * 100)

    let color = STATUS_COLORS[record.status] || STATUS_COLORS.Scheduled
    // Emergency trigger overrides color
    if (record.trigger === 'condition' && record.status === 'Overdue') color = STATUS_COLORS.Emergency

    const isPulsing = record.status === 'Overdue'

    return { leftPct, widthPct, color, isPulsing }
  }

  return (
    <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
      {/* Timeline header */}
      <div className="flex items-center pl-[140px] mb-2">
        <div className="flex-1 flex justify-between font-mono text-[10px] text-hud-text-dim">
          <span>{t('maintenance.now')}</span>
          <span>+30d</span>
          <span>+60d</span>
          <span>+90d</span>
        </div>
      </div>

      {grouped.map(([tailNumber, recs]) => (
        <div key={tailNumber} className="flex items-center mb-2 min-h-[28px]">
          {/* Aircraft label */}
          <div className="w-[140px] flex-shrink-0 pr-3 text-right">
            <span className="font-mono text-[10px] text-hud-text-secondary truncate block">
              {tailNumber}
            </span>
          </div>

          {/* Timeline track */}
          <div className="flex-1 relative h-5 bg-hud-surface rounded-sm border border-hud-border/20">
            {/* 30-day gridlines */}
            <div className="absolute left-[33.3%] top-0 bottom-0 w-px bg-hud-border/15" />
            <div className="absolute left-[66.6%] top-0 bottom-0 w-px bg-hud-border/15" />

            {recs.map((r) => {
              const { leftPct, widthPct, color, isPulsing } = barPosition(r)
              return (
                <div
                  key={r.id}
                  className={`absolute top-0.5 h-4 rounded-sm ${isPulsing ? 'animate-pulse-fast' : ''}`}
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.min(widthPct, 100 - leftPct)}%`,
                    backgroundColor: color,
                    opacity: 0.85,
                    boxShadow: `0 0 6px ${color}40`,
                  }}
                  title={`${td(r.description, locale)}\n${td(r.status, locale)} — ${r.downtimeHours}h downtime`}
                />
              )
            })}
          </div>
        </div>
      ))}

      {grouped.length === 0 && (
        <p className="font-mono text-hud-xs text-hud-text-dim text-center py-4">
          {t('maintenance.noUpcoming')}
        </p>
      )}
    </div>
  )
}

/** Custom Recharts tooltip */
function CategoryTooltip({ active, payload }: any) {
  const { locale } = useTranslation()
  if (!active || !payload?.length) return null
  const { name, value, fill } = payload[0].payload
  return (
    <div className="bg-hud-bg/95 border border-hud-border/50 rounded px-3 py-2 shadow-hud">
      <p className="font-mono text-hud-xs text-hud-text-primary flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: fill }} />
        {td(name, locale)}
      </p>
      <p className="font-mono text-hud-xs text-hud-text-dim mt-0.5">
        {value} record{value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// ─── Main Panel ──────────────────────────────────────────────────────

export function MaintenanceIntelPanel() {
  const { t, locale } = useTranslation()
  const allRecords = useMemo(() => getMaintenanceRecords(), [])
  const allAircraft = useMemo(() => getAircraft(), [])
  const a320neoIds = useMemo(() => getA320neoIds(), [])

  // ── Derived data ────────────────────────────────────────────────
  const overdueRecords = useMemo(
    () =>
      allRecords
        .filter((r) => r.status === 'Overdue')
        .sort((a, b) => {
          const prio = { Critical: 0, High: 1, Medium: 2, Low: 3 }
          return (prio[a.priority] ?? 3) - (prio[b.priority] ?? 3)
        }),
    [allRecords],
  )

  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const counts = new Map<MaintenanceCategory, number>()
    for (const r of allRecords) {
      counts.set(r.category, (counts.get(r.category) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([name, value]) => ({
        name,
        value,
        fill: CATEGORY_COLORS[name] || '#5A7A9B',
      }))
      .sort((a, b) => b.value - a.value) // Engines first (largest)
  }, [allRecords])

  // Emergency ratio (condition-triggered / total)
  const emergencyRatio = useMemo(() => {
    const emergency = allRecords.filter((r) => r.trigger === 'condition').length
    return allRecords.length > 0
      ? Math.round((emergency / allRecords.length) * 100)
      : 0
  }, [allRecords])

  // A320neo engine pattern stats
  const a320neoEngineStats = useMemo(() => {
    const engineRecords = allRecords.filter(
      (r) =>
        r.category === 'Engines' &&
        (r.trigger === 'condition' || r.status === 'Overdue') &&
        a320neoIds.has(r.aircraftId),
    )
    const totalDowntime = engineRecords.reduce((sum, r) => sum + r.downtimeHours, 0)
    const totalCost = engineRecords.reduce(
      (sum, r) => sum + (r.actualCost ?? r.costEstimate),
      0,
    )
    const affectedAircraft = new Set(engineRecords.map((r) => r.aircraftId)).size
    return {
      count: engineRecords.length,
      totalDowntime,
      totalCost,
      affectedAircraft,
    }
  }, [allRecords, a320neoIds])

  return (
    <div className="flex flex-col gap-5 p-1">
      {/* ── TOP ROW: Overdue Alerts ─────────────────────────────── */}
      <section className="shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-hud-critical animate-pulse-fast" />
          <h2 className="font-mono text-hud-sm text-hud-critical uppercase tracking-widest">
            {t('maintenance.overdueAlerts')}
          </h2>
          <span className="font-mono text-hud-xs text-hud-text-dim ml-auto">
            {overdueRecords.length} {t('maintenance.items')} {t('maintenance.requireAttention')}
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {overdueRecords.map((r) => (
            <OverdueCard key={r.id} record={r} />
          ))}
        </div>
      </section>

      {/* ── MIDDLE: Timeline + Category Breakdown ───────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Timeline (3/5 width) */}
        <HUDPanel
          variant="primary"
          label={t('maintenance.timeline')}
          className="lg:col-span-3"
        >
          <div className="mt-2">
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              {Object.entries(STATUS_COLORS).map(([label, color]) => {
                const statusLabelMap: Record<string, string> = {
                  Scheduled: t('maintenance.scheduled'),
                  'In Progress': t('maintenance.inProgress'),
                  Overdue: t('maintenance.overdue'),
                  Emergency: t('maintenance.emergency'),
                }
                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-2 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[13px] text-hud-text-dim uppercase">
                      {statusLabelMap[label] ?? label}
                    </span>
                  </div>
                )
              })}
            </div>

            <MaintenanceTimeline records={allRecords} />
          </div>
        </HUDPanel>

        {/* Right: Category Breakdown (2/5 width) */}
        <HUDPanel
          variant="secondary"
          label={t('maintenance.categoryBreakdown')}
          className="lg:col-span-2"
        >
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.fill}
                      opacity={entry.name === 'Engines' ? 1 : 0.7}
                      strokeWidth={entry.name === 'Engines' ? 2 : 0}
                      stroke={entry.name === 'Engines' ? '#FF3B3B' : 'none'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span
                    className={`font-mono text-[13px] ${
                      entry.name === 'Engines'
                        ? 'text-hud-critical font-bold'
                        : 'text-hud-text-dim'
                    }`}
                  >
                    {td(entry.name, locale)} ({entry.value})
                  </span>
                </div>
              ))}
            </div>

            {/* Emergency vs Scheduled ratio */}
            <div className="mt-4 pt-3 border-t border-hud-border/20">
              <HUDStatusBar
                value={emergencyRatio}
                label={t('maintenance.emergencyTotalRatio')}
                showValue
                variant="gradient"
              />
            </div>
          </div>
        </HUDPanel>
      </section>

      {/* ── BOTTOM: A320neo Engine Pattern Alert ────────────────── */}
      <section>
        <HUDPanel variant="alert" glow active scanlines>
          <div className="flex items-start gap-4">
            {/* Pulsing warning icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="relative">
                <span className="block h-4 w-4 rounded-full bg-hud-critical animate-pulse-fast" />
                <span className="absolute inset-0 rounded-full bg-hud-critical/30 animate-ping" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-mono text-hud-sm text-hud-critical uppercase tracking-widest font-bold">
                {t('maintenance.patternDetected')}
              </p>
              <p className="font-mono text-hud-base text-hud-text-primary mt-1">
                {t('maintenance.patternTitle')}
              </p>
              <p className="font-mono text-hud-xs text-hud-text-secondary mt-2 leading-relaxed">
                {a320neoEngineStats.count} {t('maintenance.patternDesc')} {a320neoEngineStats.affectedAircraft} {t('maintenance.patternDesc2')}
              </p>

              {/* Impact metrics */}
              <div className="flex flex-wrap gap-6 mt-3 pt-3 border-t border-hud-warning/20">
                <div>
                  <span className="font-mono text-[10px] text-hud-text-dim uppercase block">
                    {t('maintenance.totalDowntime')}
                  </span>
                  <span className="font-mono text-metric-lg text-hud-critical">
                    {a320neoEngineStats.totalDowntime}
                  </span>
                  <span className="font-mono text-hud-xs text-hud-text-dim ml-1">{t('common.hours')}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-hud-text-dim uppercase block">
                    {t('maintenance.costImpact')}
                  </span>
                  <span className="font-mono text-metric-lg text-hud-warning">
                    {formatCurrency(a320neoEngineStats.totalCost)}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-hud-text-dim uppercase block">
                    {t('maintenance.vesselsAffected')}
                  </span>
                  <span className="font-mono text-metric-lg text-hud-primary">
                    {a320neoEngineStats.affectedAircraft}
                  </span>
                  <span className="font-mono text-hud-xs text-hud-text-dim ml-1">
                    {t('common.of')} {allAircraft.filter((a) => a.type === 'A320neo').length} A320neo
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-hud-text-dim uppercase block">
                    {t('maintenance.incidents')}
                  </span>
                  <span className="font-mono text-metric-lg text-hud-text-primary">
                    {a320neoEngineStats.count}
                  </span>
                </div>
              </div>

              <p className="font-mono text-hud-xs text-hud-warning/80 mt-3 italic">
                {t('maintenance.askTower')}
              </p>
            </div>
          </div>
        </HUDPanel>
      </section>
    </div>
  )
}
