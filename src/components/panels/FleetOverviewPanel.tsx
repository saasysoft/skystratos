'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDIndicator } from '@/components/hud/HUDIndicator'
import { HUDKnob } from '@/components/hud/HUDKnob'
import RadarDisplay from '@/components/hud/RadarDisplay'
import { getAircraft } from '@/lib/data'
import { useTranslation } from '@/lib/i18n/use-translation'
import type { Aircraft, AircraftStatus } from '@/lib/mock-data/types'

const FleetMapGL = dynamic(() => import('@/components/panels/fleet/FleetMapGL'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#020B12] font-mono text-[11px] text-[#4A7A9B] uppercase tracking-widest">
      Initializing ADS-B Display...
    </div>
  ),
})

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<AircraftStatus, string> = {
  'In Flight': '#00FF9F',
  'On Ground': '#0088FF',
  'In Maintenance': '#FF8C00',
  'AOG': '#FF3B3B',
}

const STATUS_TEXT_CLASSES: Record<AircraftStatus, string> = {
  'In Flight': 'text-[#00FF9F]',
  'On Ground': 'text-[#0088FF]',
  'In Maintenance': 'text-hud-warning',
  'AOG': 'text-hud-critical',
}

const KNOB_POSITIONS = ['ALL', 'B737', 'A320', 'B787', 'B777', 'A350', 'E175'] as const

type SortKey = 'tailNumber' | 'type' | 'status' | 'cpfh' | 'route'
type SortDir = 'asc' | 'desc'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FleetOverviewPanel() {
  const { t } = useTranslation()
  const allAircraft = getAircraft()
  const [aircraftType, setAircraftType] = useState<string>('ALL')
  const [sortKey, setSortKey] = useState<SortKey>('tailNumber')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  // -- Filter aircraft by type --
  const filteredAircraft = useMemo(() => {
    if (aircraftType === 'ALL') return allAircraft
    return allAircraft.filter(
      (a) => a.type.toUpperCase().startsWith(aircraftType),
    )
  }, [allAircraft, aircraftType])

  // -- Status counts --
  const counts = useMemo(() => {
    const c = { total: filteredAircraft.length, inFlight: 0, onGround: 0, maintenance: 0, aog: 0 }
    for (const a of filteredAircraft) {
      if (a.status === 'In Flight') c.inFlight++
      else if (a.status === 'On Ground') c.onGround++
      else if (a.status === 'In Maintenance') c.maintenance++
      else if (a.status === 'AOG') c.aog++
    }
    return c
  }, [filteredAircraft])

  // -- Sorted aircraft for table --
  const sortedAircraft = useMemo(() => {
    const arr = [...filteredAircraft]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'tailNumber':
          cmp = a.tailNumber.localeCompare(b.tailNumber)
          break
        case 'type':
          cmp = a.type.localeCompare(b.type)
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
        case 'cpfh':
          cmp = a.costPerFlightHour - b.costPerFlightHour
          break
        case 'route':
          cmp = (a.currentRoute ?? '').localeCompare(b.currentRoute ?? '')
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [filteredAircraft, sortKey, sortDir])

  // -- Radar aircraft (transform for RadarDisplay) --
  const radarAircraft = useMemo(
    () =>
      filteredAircraft.map((a) => ({
        id: a.id,
        name: a.tailNumber,
        lat: a.currentPosition.lat,
        lng: a.currentPosition.lng,
        status: a.status,
      })),
    [filteredAircraft],
  )

  // -- Sort handler --
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    },
    [sortKey],
  )

  const SortArrow = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null
    return (
      <span className="ml-1 text-hud-primary">
        {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
      </span>
    )
  }

  // -- Status label helper --
  const statusLabel = (status: AircraftStatus): string => {
    switch (status) {
      case 'In Flight': return t('status.inFlight')
      case 'On Ground': return t('status.onGround')
      case 'In Maintenance': return t('status.maintenance')
      case 'AOG': return t('status.aog')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* -- FLEET SUMMARY STRIP -- */}
      <HUDPanel variant="primary" label={t('nav.fleet')}>
        <div className="flex flex-wrap items-center gap-6 shrink-0">
          <HUDIndicator
            status="nominal"
            label={t('fleet.totalAircraft')}
            value={String(counts.total)}
          />
          <HUDIndicator
            status="nominal"
            label={t('fleet.inFlight')}
            value={String(counts.inFlight)}
          />
          <HUDIndicator
            status="nominal"
            label={t('fleet.onGround')}
            value={String(counts.onGround)}
          />
          <HUDIndicator
            status="warning"
            label={t('fleet.inMaintenance')}
            value={String(counts.maintenance)}
          />
          <HUDIndicator
            status={counts.aog > 0 ? 'critical' : 'offline'}
            label={t('fleet.aog')}
            value={String(counts.aog)}
          />
        </div>
      </HUDPanel>

      {/* -- MAP + RADAR ROW -- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Left: Fleet map */}
        <HUDPanel variant="secondary" className="relative min-w-0" label={t('fleet.fleetMap')}>
          <div className="relative w-full min-h-[300px] aspect-[16/9]">
            <FleetMapGL aircraft={filteredAircraft} className="absolute inset-0" />

            {/* Map legend -- overlays bottom-left of map */}
            <div className="absolute bottom-1 left-1 z-10 flex gap-3 bg-hud-bg/80 px-2 py-1 rounded-sm pointer-events-none">
              {(Object.entries(STATUS_COLORS) as [AircraftStatus, string][]).map(
                ([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[13px] text-hud-text-dim uppercase tracking-wider">
                      {statusLabel(status)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </HUDPanel>

        {/* Right: Radar + Knob + Cost Summary */}
        <div className="flex flex-col gap-4">
          <HUDPanel variant="primary" label={t('fleet.radar')}>
            <div className="flex items-center justify-center">
              <RadarDisplay
                aircraft={radarAircraft}
                centerLat={41.97}
                centerLng={-87.91}
                range={500}
                size={250}
              />
            </div>
          </HUDPanel>

          <div data-tour="aircraft-knob">
            <HUDPanel variant="secondary" label={t('fleet.aircraftType')}>
              <div className="flex items-center justify-center py-1">
                <HUDKnob
                  positions={[...KNOB_POSITIONS]}
                  value={aircraftType}
                  onChange={setAircraftType}
                  label={t('fleet.aircraftType')}
                  size={140}
                />
              </div>
            </HUDPanel>
          </div>

          {/* -- FLEET COST SUMMARY -- */}
          <HUDPanel variant="secondary" label={t('fleet.costSummary')}>
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* Total Daily Fleet Cost */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-hud-text-dim">
                  {t('fleet.totalDailyCost')}
                </span>
                <span className="block text-lg text-hud-primary font-bold leading-tight">
                  {(() => {
                    const total = filteredAircraft.reduce((sum, a) => sum + a.dailyCost, 0)
                    return `$${(total / 1_000_000).toFixed(1)}M/day`
                  })()}
                </span>
              </div>

              {/* Avg Cost Per Aircraft */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-hud-text-dim">
                  {t('fleet.avgCostPerAircraft')}
                </span>
                <span className="block text-lg text-hud-text-primary font-bold leading-tight">
                  {(() => {
                    const total = filteredAircraft.reduce((sum, a) => sum + a.costPerFlightHour, 0)
                    const avg = filteredAircraft.length > 0 ? total / filteredAircraft.length : 0
                    return `$${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  })()}
                </span>
              </div>

              {/* Highest Cost Aircraft */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-hud-text-dim">
                  {t('fleet.highestCost')}
                </span>
                {(() => {
                  const top = filteredAircraft.reduce<Aircraft | null>(
                    (max, a) => (!max || a.dailyCost > max.dailyCost ? a : max),
                    null,
                  )
                  if (!top) return <span className="block text-sm text-hud-text-dim">{'\u2014'}</span>
                  const isWarning = top.dailyCost > 40_000
                  return (
                    <span
                      className={cn(
                        'block text-sm font-bold leading-tight',
                        isWarning ? 'text-hud-warning' : 'text-hud-text-primary',
                      )}
                    >
                      {top.tailNumber}
                      <span className="block text-[11px] font-normal">
                        ${top.dailyCost.toLocaleString()}/day
                      </span>
                    </span>
                  )
                })()}
              </div>

              {/* AOG Burn Rate */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-hud-text-dim">
                  {t('fleet.aogBurn')}
                  <span className="ml-1.5 text-[9px] text-hud-critical font-bold tracking-widest">
                    {t('fleet.waste')}
                  </span>
                </span>
                <span className="block text-lg text-hud-critical font-bold leading-tight">
                  {(() => {
                    const aogCost = filteredAircraft
                      .filter((a) => a.status === 'AOG')
                      .reduce((sum, a) => sum + a.dailyCost, 0)
                    return aogCost > 0 ? `$${aogCost.toLocaleString()}/day` : '$0'
                  })()}
                </span>
              </div>
            </div>
          </HUDPanel>
        </div>
      </div>

      {/* -- AIRCRAFT REGISTRY TABLE -- */}
      <HUDPanel variant="primary" label={t('fleet.aircraftRegistry')} className="shrink-0">
        <div className="overflow-auto max-h-[240px] scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent">
          <table className="w-full border-collapse font-mono text-hud-xs">
            <thead>
              <tr className="text-hud-text-dim uppercase sticky top-0 bg-hud-bg/95 z-10">
                <th
                  className="text-left px-2 py-1.5 cursor-pointer hover:text-hud-primary transition-colors select-none"
                  onClick={() => handleSort('tailNumber')}
                >
                  {t('fleet.tailNumber')}
                  <SortArrow col="tailNumber" />
                </th>
                <th
                  className="text-left px-2 py-1.5 cursor-pointer hover:text-hud-primary transition-colors select-none"
                  onClick={() => handleSort('type')}
                >
                  {t('fleet.type')}
                  <SortArrow col="type" />
                </th>
                <th
                  className="text-left px-2 py-1.5 cursor-pointer hover:text-hud-primary transition-colors select-none"
                  onClick={() => handleSort('status')}
                >
                  {t('fleet.status')}
                  <SortArrow col="status" />
                </th>
                <th className="text-left px-2 py-1.5">
                  {t('fleet.position')}
                </th>
                <th
                  className="text-right px-2 py-1.5 cursor-pointer hover:text-hud-primary transition-colors select-none"
                  onClick={() => handleSort('cpfh')}
                >
                  {t('fleet.cpfh')}
                  <SortArrow col="cpfh" />
                </th>
                <th
                  className="text-left px-2 py-1.5 cursor-pointer hover:text-hud-primary transition-colors select-none"
                  onClick={() => handleSort('route')}
                >
                  {t('fleet.route')}
                  <SortArrow col="route" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAircraft.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-hud-border/40 bg-hud-surface/40 hover:bg-hud-surface/80 transition-colors"
                >
                  <td className="px-2 py-1.5 text-hud-text-primary whitespace-nowrap">
                    {a.tailNumber}
                  </td>
                  <td className="px-2 py-1.5 text-hud-text-secondary whitespace-nowrap">
                    {a.type}
                  </td>
                  <td
                    className={cn(
                      'px-2 py-1.5 whitespace-nowrap',
                      STATUS_TEXT_CLASSES[a.status],
                    )}
                  >
                    {statusLabel(a.status)}
                  </td>
                  <td className="px-2 py-1.5 text-hud-text-dim whitespace-nowrap">
                    {a.currentAirport
                      ? a.currentAirport
                      : `${a.currentPosition.lat.toFixed(1)}\u00B0, ${a.currentPosition.lng.toFixed(1)}\u00B0`}
                  </td>
                  <td className="px-2 py-1.5 text-right text-hud-text-primary whitespace-nowrap">
                    ${a.costPerFlightHour.toLocaleString()}
                  </td>
                  <td className="px-2 py-1.5 text-hud-text-secondary whitespace-nowrap">
                    {a.currentRoute ?? '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HUDPanel>
    </div>
  )
}
