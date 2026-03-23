'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { getAircraft, getAlerts, getScheduledFlights, getMaintenanceRecords } from '@/lib/data'
import type { Aircraft, Alert } from '@/lib/data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NOW = new Date('2026-03-23T12:00:00Z')
const MS_PER_HOUR = 1000 * 60 * 60

// Inline mock AOG history (recent resolved events)
const AOG_HISTORY = [
  { date: '2026-03-15', tail: 'N38M02', duration: '6h 20m', cause: 'Landing gear proximity sensor failure', totalCost: 145000 },
  { date: '2026-03-11', tail: 'N77701', duration: '18h 45m', cause: 'Engine #1 oil leak - accessory gearbox seal', totalCost: 520000 },
  { date: '2026-03-06', tail: 'N73807', duration: '4h 10m', cause: 'APU starter motor seized', totalCost: 85000 },
  { date: '2026-02-28', tail: 'N321A2', duration: '12h 30m', cause: 'Hydraulic system A pump failure', totalCost: 320000 },
  { date: '2026-02-22', tail: 'N320A4', duration: '8h 15m', cause: 'FMC software fault - reloading required', totalCost: 195000 },
  { date: '2026-02-18', tail: 'N73803', duration: '22h 00m', cause: 'Engine bleed air 5th stage check valve crack', totalCost: 680000 },
  { date: '2026-02-10', tail: 'N35001', duration: '3h 45m', cause: 'Weather radar antenna drive failure', totalCost: 62000 },
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hoursSince(dateStr: string): number {
  return (NOW.getTime() - new Date(dateStr).getTime()) / MS_PER_HOUR
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.floor((hours % 1) * 60)
  return `${h}h ${m}m`
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AOGTimeline() {
  const allAircraft = getAircraft()
  const allAlerts = getAlerts()
  const allFlights = getScheduledFlights()
  const allMaintenance = getMaintenanceRecords()

  // Get currently AOG aircraft
  const aogAircraft = useMemo(() => {
    return allAircraft.filter((ac) => ac.status === 'AOG')
  }, [allAircraft])

  // Map alerts by aircraft for root cause lookup
  const alertsByAircraft = useMemo(() => {
    const map = new Map<string, Alert>()
    allAlerts
      .filter((a) => a.severity === 'critical' && a.type === 'maintenance')
      .forEach((a) => {
        if (a.aircraftId) map.set(a.aircraftId, a)
      })
    return map
  }, [allAlerts])

  // Revenue impact per AOG aircraft
  const aogDetails = useMemo(() => {
    return aogAircraft.map((ac) => {
      const alert = alertsByAircraft.get(ac.id)
      const flights = allFlights.filter((f) => f.aircraftId === ac.id)
      const totalRevenue = flights.reduce((sum, f) => sum + f.estimatedRevenue, 0)
      const totalPax = flights.reduce((sum, f) => sum + f.passengerCount, 0)

      // Find maintenance record for ETA
      const activeMaintenanceRecords = allMaintenance.filter(
        (m) => m.aircraftId === ac.id && (m.status === 'In Progress' || m.status === 'Scheduled')
      )

      // AOG start time from alert creation
      const aogStartTime = alert?.createdAt || '2026-03-22T08:00:00Z'
      const durationHours = hoursSince(aogStartTime)

      // Extract root cause from alert description
      const rootCause = alert?.title.replace(/^AOG:\s*\S+\s*—\s*/, '') || 'Under investigation'

      return {
        aircraft: ac,
        alert,
        flights,
        flightCount: flights.length,
        totalRevenue,
        totalPax,
        durationHours,
        rootCause,
        location: ac.currentAirport || 'Unknown',
        maintenanceRecords: activeMaintenanceRecords,
      }
    })
  }, [aogAircraft, alertsByAircraft, allFlights, allMaintenance])

  // Total history cost
  const totalHistoryCost = AOG_HISTORY.reduce((sum, e) => sum + e.totalCost, 0)

  return (
    <div className="space-y-4">
      {/* ── Current AOG Events ────────────────────────────────────── */}
      {aogDetails.length > 0 ? (
        aogDetails.map((aog) => (
          <HUDPanel key={aog.aircraft.id} variant="alert" glow label="ACTIVE AOG">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-hud-critical animate-pulse">
                      {aog.aircraft.tailNumber}
                    </span>
                    <span className="font-mono text-sm text-hud-text-dim">
                      {aog.aircraft.type}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-hud-text-dim mt-1">
                    Location: <span className="text-hud-text-primary">{aog.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-hud-text-dim uppercase">Duration</div>
                  <div className="font-mono text-lg font-bold text-hud-critical">
                    {formatDuration(aog.durationHours)}
                  </div>
                </div>
              </div>

              {/* Root cause */}
              <div className="bg-hud-surface/50 rounded-sm px-3 py-2 border-l-2 border-hud-critical">
                <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mb-1">
                  Root Cause
                </div>
                <div className="font-mono text-[12px] text-hud-text-primary">
                  {aog.rootCause}
                </div>
              </div>

              {/* Revenue impact row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-hud-surface/30 rounded-sm px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-hud-warning">{aog.flightCount}</div>
                  <div className="font-mono text-[10px] text-hud-text-dim uppercase">Flights Affected</div>
                </div>
                <div className="bg-hud-surface/30 rounded-sm px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-hud-warning">~{aog.totalPax.toLocaleString()}</div>
                  <div className="font-mono text-[10px] text-hud-text-dim uppercase">Passengers</div>
                </div>
                <div className="bg-hud-surface/30 rounded-sm px-3 py-2 text-center">
                  <div className="font-mono text-lg font-bold text-hud-critical">
                    {formatCurrency(aog.totalRevenue)}
                  </div>
                  <div className="font-mono text-[10px] text-hud-text-dim uppercase">Revenue at Risk</div>
                </div>
              </div>

              {/* Maintenance ETA */}
              {aog.maintenanceRecords.length > 0 && (
                <div className="font-mono text-[11px] text-hud-text-dim">
                  <span className="uppercase tracking-wider text-[10px]">Recovery ETA: </span>
                  {aog.maintenanceRecords.map((m) => (
                    <span key={m.id} className="text-[#0088FF]">
                      {m.scheduledDate} ({m.description.slice(0, 40)})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </HUDPanel>
        ))
      ) : (
        <HUDPanel variant="nominal" label="AOG STATUS">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="font-mono text-hud-nominal text-lg font-bold">ALL CLEAR</div>
              <div className="font-mono text-[11px] text-hud-text-dim mt-1">
                No aircraft currently grounded
              </div>
            </div>
          </div>
        </HUDPanel>
      )}

      {/* ── AOG History ───────────────────────────────────────────── */}
      <HUDPanel label="AOG History — Last 30 Days">
        <div className="overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent">
          <table className="w-full font-mono text-[11px]">
            <thead className="sticky top-0 bg-hud-bg/95 z-10">
              <tr className="text-hud-text-dim text-[10px] uppercase tracking-wider">
                <th className="text-left px-2 py-2 w-[80px]">Date</th>
                <th className="text-left px-2 py-2 w-[70px]">Tail #</th>
                <th className="text-right px-2 py-2 w-[70px]">Duration</th>
                <th className="text-left px-2 py-2">Cause</th>
                <th className="text-right px-2 py-2 w-[90px]">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {AOG_HISTORY.map((event, i) => (
                <tr
                  key={i}
                  className="border-t border-hud-border/20 hover:bg-hud-surface/30 transition-colors"
                >
                  <td className="px-2 py-1.5 text-hud-text-dim">{event.date}</td>
                  <td className="px-2 py-1.5 text-hud-text-primary font-bold">{event.tail}</td>
                  <td className="px-2 py-1.5 text-right text-hud-warning">{event.duration}</td>
                  <td className="px-2 py-1.5 text-hud-text-dim truncate max-w-[220px]" title={event.cause}>
                    {event.cause}
                  </td>
                  <td className="px-2 py-1.5 text-right text-hud-critical">
                    {formatCurrency(event.totalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-hud-border/40">
                <td colSpan={4} className="px-2 py-2 text-right text-hud-text-dim text-[10px] uppercase tracking-wider font-bold">
                  30-Day AOG Total
                </td>
                <td className="px-2 py-2 text-right text-hud-critical font-bold text-sm">
                  {formatCurrency(totalHistoryCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </HUDPanel>
    </div>
  )
}
