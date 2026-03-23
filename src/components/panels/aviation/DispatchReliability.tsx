'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDGauge } from '@/components/hud/HUDGauge'
import { HUDStatusBar } from '@/components/hud/HUDStatusBar'
import { getScheduledFlights, getAircraft } from '@/lib/data'
import type { Aircraft, ScheduledFlight } from '@/lib/data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AOG_STATUSES = new Set(['AOG', 'In Maintenance'])

// Simulated cause breakdown multipliers
const CAUSE_LABELS = ['Maintenance', 'Parts/Inventory', 'Weather', 'Crew', 'Other'] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTrendData(): { day: string; reliability: number }[] {
  // Seed-based pseudo-random for consistency
  const data: { day: string; reliability: number }[] = []
  const base = new Date('2026-02-21')

  for (let i = 0; i < 30; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    const dayStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`

    // Normal distribution around 98.5%, with a dip in the last 5 days
    let value: number
    if (i >= 25) {
      // Recent dip correlating with AOG events
      value = 97.0 + (Math.sin(i * 1.3) * 0.5)
    } else if (i >= 20) {
      // Slight decline leading up to AOG
      value = 98.0 + (Math.sin(i * 0.7) * 0.6)
    } else {
      // Normal operations
      value = 98.5 + (Math.sin(i * 0.9) * 0.7)
    }

    data.push({ day: dayStr, reliability: Math.round(value * 10) / 10 })
  }

  return data
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DispatchReliability() {
  const allFlights = getScheduledFlights()
  const allAircraft = getAircraft()

  const aircraftMap = useMemo(() => {
    const map = new Map<string, Aircraft>()
    allAircraft.forEach((ac) => map.set(ac.id, ac))
    return map
  }, [allAircraft])

  // Determine which aircraft are grounded
  const groundedIds = useMemo(() => {
    return new Set(
      allAircraft
        .filter((ac) => AOG_STATUSES.has(ac.status))
        .map((ac) => ac.id)
    )
  }, [allAircraft])

  // Compute dispatch reliability
  const { totalFlights, cancelledFlights, reliabilityPct, cancelledByAircraft } = useMemo(() => {
    const total = allFlights.length
    const cancelledMap = new Map<string, number>()
    let cancelled = 0

    for (const flt of allFlights) {
      if (groundedIds.has(flt.aircraftId)) {
        cancelled++
        cancelledMap.set(flt.aircraftId, (cancelledMap.get(flt.aircraftId) || 0) + 1)
      }
    }

    const pct = total > 0 ? ((total - cancelled) / total) * 100 : 100

    return {
      totalFlights: total,
      cancelledFlights: cancelled,
      reliabilityPct: Math.round(pct * 100) / 100,
      cancelledByAircraft: cancelledMap,
    }
  }, [allFlights, groundedIds])

  // Cause breakdown (derive from cancelled flights + mock minor causes)
  const causes = useMemo(() => {
    const maintenanceCancelled = cancelledFlights
    // Add minor simulated causes
    const weather = 2
    const crew = 1
    const parts = Math.ceil(cancelledFlights * 0.15)
    const other = 1

    const total = maintenanceCancelled + weather + crew + parts + other
    return [
      { label: 'Maintenance', count: maintenanceCancelled, pct: total > 0 ? (maintenanceCancelled / total) * 100 : 0 },
      { label: 'Parts/Inventory', count: parts, pct: total > 0 ? (parts / total) * 100 : 0 },
      { label: 'Weather', count: weather, pct: total > 0 ? (weather / total) * 100 : 0 },
      { label: 'Crew', count: crew, pct: total > 0 ? (crew / total) * 100 : 0 },
      { label: 'Other', count: other, pct: total > 0 ? (other / total) * 100 : 0 },
    ]
  }, [cancelledFlights])

  // By aircraft type breakdown
  const typeBreakdown = useMemo(() => {
    const typeMap = new Map<string, { flights: number; cancelled: number }>()

    for (const flt of allFlights) {
      const ac = aircraftMap.get(flt.aircraftId)
      const type = ac?.type || 'Unknown'
      const entry = typeMap.get(type) || { flights: 0, cancelled: 0 }
      entry.flights++
      if (groundedIds.has(flt.aircraftId)) entry.cancelled++
      typeMap.set(type, entry)
    }

    return Array.from(typeMap.entries())
      .map(([type, data]) => ({
        type,
        flights: data.flights,
        cancelled: data.cancelled,
        reliability: data.flights > 0
          ? Math.round(((data.flights - data.cancelled) / data.flights) * 10000) / 100
          : 100,
      }))
      .sort((a, b) => a.reliability - b.reliability)
  }, [allFlights, aircraftMap, groundedIds])

  const trendData = useMemo(() => generateTrendData(), [])

  // Gauge color thresholds (inverted: higher is better, but gauge expects higher = worse)
  // We use max=100, and thresholds are for the "remaining gap" from 100
  const gaugeValue = reliabilityPct

  return (
    <div className="space-y-4">
      {/* ── Top Row: Gauge + Trend ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gauge */}
        <HUDPanel label="Dispatch Reliability" glow>
          <div className="flex flex-col items-center py-4">
            <HUDGauge
              value={gaugeValue}
              max={100}
              label="Dispatch Rate"
              unit="%"
              thresholds={{ warning: 98.5, critical: 99.5 }}
              size={180}
            />
            <div className="mt-3 flex items-center gap-6 font-mono text-[11px]">
              <div className="text-center">
                <div className="text-hud-text-primary text-lg font-bold">{totalFlights}</div>
                <div className="text-hud-text-dim text-[10px] uppercase">Total Flights</div>
              </div>
              <div className="text-center">
                <div className="text-hud-critical text-lg font-bold">{cancelledFlights}</div>
                <div className="text-hud-text-dim text-[10px] uppercase">Cancelled</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  'text-lg font-bold',
                  reliabilityPct >= 99 ? 'text-hud-nominal' :
                  reliabilityPct >= 98 ? 'text-hud-warning' : 'text-hud-critical'
                )}>
                  {reliabilityPct.toFixed(2)}%
                </div>
                <div className="text-hud-text-dim text-[10px] uppercase">Target: 99.0%</div>
              </div>
            </div>
          </div>
        </HUDPanel>

        {/* Trend Chart */}
        <HUDPanel label="30-Day Trend">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2A3C" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#5A7A9B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1A2A3C' }}
                  interval={4}
                />
                <YAxis
                  domain={[96, 100]}
                  tick={{ fill: '#5A7A9B', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#1A2A3C' }}
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1A2A',
                    border: '1px solid #1A3A5C',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: '#C8E6FF',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Reliability']}
                />
                {/* Target line */}
                <Line
                  type="monotone"
                  dataKey={() => 99}
                  stroke="#FFB800"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
                <Line
                  type="monotone"
                  dataKey="reliability"
                  stroke="#00FF9F"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, fill: '#00FF9F' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </HUDPanel>
      </div>

      {/* ── Bottom Row: Causes + Type Breakdown ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cause Breakdown */}
        <HUDPanel label="Cancellation Causes">
          <div className="space-y-3">
            {causes.map((cause) => (
              <div key={cause.label} className="flex items-center gap-3">
                <HUDStatusBar
                  value={cause.pct}
                  label={`${cause.label} (${cause.count})`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </HUDPanel>

        {/* By Aircraft Type */}
        <HUDPanel label="Reliability by Type">
          <div className="overflow-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-hud-text-dim text-[10px] uppercase tracking-wider">
                  <th className="text-left px-2 py-2">Type</th>
                  <th className="text-right px-2 py-2">Flights</th>
                  <th className="text-right px-2 py-2">Cancelled</th>
                  <th className="text-right px-2 py-2">Reliability</th>
                </tr>
              </thead>
              <tbody>
                {typeBreakdown.map((row) => (
                  <tr
                    key={row.type}
                    className="border-t border-hud-border/20 hover:bg-hud-surface/30 transition-colors"
                  >
                    <td className="px-2 py-1.5 text-hud-text-primary font-bold">{row.type}</td>
                    <td className="px-2 py-1.5 text-right text-hud-text-dim">{row.flights}</td>
                    <td className="px-2 py-1.5 text-right">
                      <span className={row.cancelled > 0 ? 'text-hud-critical' : 'text-hud-text-dim'}>
                        {row.cancelled}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right">
                      <span
                        className={cn(
                          'font-bold',
                          row.reliability >= 99 ? 'text-hud-nominal' :
                          row.reliability >= 98 ? 'text-hud-warning' : 'text-hud-critical',
                        )}
                      >
                        {row.reliability.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </HUDPanel>
      </div>
    </div>
  )
}
