'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { getMaintenanceRecords, getAircraft } from '@/lib/data'
import type { MaintenanceRecord, MaintenanceStatus } from '@/lib/data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<MaintenanceStatus, { bg: string; text: string; pulse?: boolean }> = {
  Completed: { bg: 'bg-hud-nominal/20', text: 'text-hud-nominal' },
  'In Progress': { bg: 'bg-[#0088FF]/20', text: 'text-[#0088FF]' },
  Scheduled: { bg: 'bg-hud-text-dim/20', text: 'text-hud-text-dim' },
  Overdue: { bg: 'bg-hud-critical/20', text: 'text-hud-critical', pulse: true },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ADComplianceBoard() {
  const { t } = useTranslation()
  const allRecords = getMaintenanceRecords()
  const allAircraft = getAircraft()

  const aircraftMap = useMemo(() => {
    const map = new Map<string, string>()
    allAircraft.forEach((ac) => map.set(ac.id, ac.tailNumber))
    return map
  }, [allAircraft])

  // Filter to only AD/SB records
  const adsbRecords = useMemo(() => {
    return allRecords
      .filter((r) => r.adReference !== null || r.sbReference !== null)
      .map((r) => ({
        ...r,
        reference: r.adReference || r.sbReference || '',
        referenceType: r.adReference ? 'AD' as const : 'SB' as const,
        tailNumber: aircraftMap.get(r.aircraftId) || r.tailNumber,
      }))
  }, [allRecords, aircraftMap])

  // Sort: overdue first, then by scheduled date ascending
  const sorted = useMemo(() => {
    return [...adsbRecords].sort((a, b) => {
      if (a.status === 'Overdue' && b.status !== 'Overdue') return -1
      if (a.status !== 'Overdue' && b.status === 'Overdue') return 1
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    })
  }, [adsbRecords])

  // Summary stats
  const stats = useMemo(() => {
    const total = sorted.length
    const completed = sorted.filter((r) => r.status === 'Completed').length
    const inProgress = sorted.filter((r) => r.status === 'In Progress').length
    const overdue = sorted.filter((r) => r.status === 'Overdue').length
    const compliedPct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, inProgress, overdue, compliedPct }
  }, [sorted])

  if (sorted.length === 0) {
    return (
      <HUDPanel label={t('adCompliance.title')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="font-mono text-hud-text-dim text-sm uppercase tracking-wider mb-2">
              {t('adCompliance.noRecords')}
            </div>
            <div className="font-mono text-[11px] text-hud-text-dim/60">
              {t('adCompliance.noRecordsDetail')}
            </div>
          </div>
        </div>
      </HUDPanel>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Summary Strip ─────────────────────────────────────────── */}
      <HUDPanel label={t('adCompliance.summary')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCell label={t('adCompliance.totalADsSBs')} value={String(stats.total)} />
          <SummaryCell label={t('adCompliance.complied')} value={`${stats.compliedPct}%`} color="text-hud-nominal" />
          <SummaryCell label={t('adCompliance.inProgress')} value={String(stats.inProgress)} color="text-[#0088FF]" />
          <SummaryCell
            label={t('adCompliance.overdue')}
            value={String(stats.overdue)}
            color={stats.overdue > 0 ? 'text-hud-critical' : 'text-hud-text-primary'}
            pulse={stats.overdue > 0}
          />
        </div>
      </HUDPanel>

      {/* ── Compliance Table ──────────────────────────────────────── */}
      <HUDPanel label={t('adCompliance.tracker')}>
        <div className="overflow-auto max-h-[400px] scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent">
          <table className="w-full font-mono text-[11px]">
            <thead className="sticky top-0 bg-hud-bg/95 z-10">
              <tr className="text-hud-text-dim text-[10px] uppercase tracking-wider">
                <th className="text-left px-2 py-2 w-[50px]">{t('adCompliance.type')}</th>
                <th className="text-left px-2 py-2 w-[160px]">{t('adCompliance.reference')}</th>
                <th className="text-left px-2 py-2">{t('adCompliance.description')}</th>
                <th className="text-left px-2 py-2 w-[80px]">{t('adCompliance.aircraft')}</th>
                <th className="text-center px-2 py-2 w-[100px]">{t('adCompliance.status')}</th>
                <th className="text-left px-2 py-2 w-[90px]">{t('adCompliance.dueDate')}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((record) => {
                const statusStyle = STATUS_STYLES[record.status]
                return (
                  <tr
                    key={record.id}
                    className="border-t border-hud-border/20 hover:bg-hud-surface/30 transition-colors"
                  >
                    <td className="px-2 py-1.5">
                      <span
                        className={cn(
                          'inline-block px-1.5 py-0.5 rounded text-[10px] font-bold',
                          record.referenceType === 'AD'
                            ? 'bg-hud-critical/15 text-hud-critical'
                            : 'bg-[#0088FF]/15 text-[#0088FF]',
                        )}
                      >
                        {record.referenceType}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-hud-text-primary font-bold">
                      {record.reference}
                    </td>
                    <td className="px-2 py-1.5 text-hud-text-dim truncate max-w-[250px]" title={record.description}>
                      {record.description.length > 50
                        ? record.description.slice(0, 47) + '...'
                        : record.description}
                    </td>
                    <td className="px-2 py-1.5 text-hud-text-primary">
                      {record.tailNumber}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 rounded text-[10px] font-bold',
                          statusStyle.bg,
                          statusStyle.text,
                          statusStyle.pulse && 'animate-pulse',
                        )}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-hud-text-dim">
                      {record.scheduledDate}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
  pulse = false,
}: {
  label: string
  value: string
  color?: string
  pulse?: boolean
}) {
  return (
    <div className="text-center">
      <div className={cn('font-mono text-2xl font-bold', color, pulse && 'animate-pulse')}>
        {value}
      </div>
      <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  )
}
