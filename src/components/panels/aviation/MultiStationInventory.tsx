'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDIndicator } from '@/components/hud/HUDIndicator'
import { getInventoryItems } from '@/lib/data'
import type { InventoryItem, InventoryLocation } from '@/lib/data'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATION_LOCATIONS: InventoryLocation[] = [
  'ORD MRO Hub',
  'LAX Parts Depot',
  'LHR Stores',
  'SIN MRO Center',
  'DFW Warehouse',
]

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StationStats {
  location: InventoryLocation
  items: InventoryItem[]
  totalItems: number
  totalValue: number
  outOfStock: number
  lowStock: number
  healthPct: number
  healthStatus: 'nominal' | 'warning' | 'critical'
}

interface TransferRecommendation {
  partDescription: string
  partNumber: string
  neededAt: string
  availableAt: string
  qtyAvailable: number
  leadTimeDays: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MultiStationInventory() {
  const allItems = getInventoryItems()

  // Compute per-station stats
  const stationStats = useMemo((): StationStats[] => {
    return STATION_LOCATIONS.map((location) => {
      const items = allItems.filter((i) => i.location === location)
      const totalItems = items.length
      const totalValue = items.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0)
      const outOfStock = items.filter((i) => i.status === 'Out of Stock').length
      const lowStock = items.filter((i) => i.status === 'Low Stock').length
      const inStock = items.filter((i) => i.status === 'In Stock').length
      const healthPct = totalItems > 0 ? Math.round((inStock / totalItems) * 100) : 100

      let healthStatus: 'nominal' | 'warning' | 'critical' = 'nominal'
      if (outOfStock > 0) healthStatus = 'critical'
      else if (lowStock > 0) healthStatus = 'warning'

      return { location, items, totalItems, totalValue, outOfStock, lowStock, healthPct, healthStatus }
    })
  }, [allItems])

  // Fleet summary
  const fleetSummary = useMemo(() => {
    const totalValue = stationStats.reduce((sum, s) => sum + s.totalValue, 0)
    const criticalStations = stationStats.filter((s) => s.healthStatus === 'critical').length
    const totalOOS = stationStats.reduce((sum, s) => sum + s.outOfStock, 0)
    return { totalValue, criticalStations, totalOOS }
  }, [stationStats])

  // Cross-station transfer recommendations
  const transfers = useMemo((): TransferRecommendation[] => {
    const recommendations: TransferRecommendation[] = []

    // Find all OOS items
    const oosItems = allItems.filter((i) => i.status === 'Out of Stock' && STATION_LOCATIONS.includes(i.location))

    for (const oosItem of oosItems) {
      // Find same part (by partNumber or alternatePN) at other stations
      const available = allItems.find(
        (i) =>
          i.location !== oosItem.location &&
          STATION_LOCATIONS.includes(i.location) &&
          i.currentStock > 0 &&
          (i.partNumber === oosItem.partNumber ||
            i.alternatePN.includes(oosItem.partNumber) ||
            oosItem.alternatePN.includes(i.partNumber))
      )

      if (available) {
        recommendations.push({
          partDescription: oosItem.description,
          partNumber: oosItem.partNumber,
          neededAt: oosItem.location,
          availableAt: available.location,
          qtyAvailable: available.currentStock,
          leadTimeDays: Math.ceil(available.leadTimeDays * 0.5), // Transfer is faster than new order
        })
      }
    }

    return recommendations
  }, [allItems])

  return (
    <div className="space-y-4">
      {/* ── Fleet Summary ─────────────────────────────────────────── */}
      <HUDPanel label="Fleet Inventory Summary">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-hud-text-primary">
              {formatCurrency(fleetSummary.totalValue)}
            </div>
            <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mt-1">
              Total Fleet Value
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-mono text-2xl font-bold',
              fleetSummary.criticalStations > 0 ? 'text-hud-critical' : 'text-hud-nominal'
            )}>
              {fleetSummary.criticalStations}
            </div>
            <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mt-1">
              Stations with Gaps
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-mono text-2xl font-bold',
              fleetSummary.totalOOS > 0 ? 'text-hud-critical' : 'text-hud-nominal'
            )}>
              {fleetSummary.totalOOS}
            </div>
            <div className="font-mono text-[10px] text-hud-text-dim uppercase tracking-wider mt-1">
              Total Out of Stock
            </div>
          </div>
        </div>
      </HUDPanel>

      {/* ── Station Cards Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {stationStats.map((station) => (
          <HUDPanel
            key={station.location}
            variant={station.healthStatus === 'critical' ? 'alert' : station.healthStatus === 'warning' ? 'secondary' : 'primary'}
            label={station.location}
          >
            <div className="space-y-3">
              {/* Health indicator */}
              <div className="flex items-center justify-between">
                <HUDIndicator
                  status={station.healthStatus}
                  label="Health"
                  value={`${station.healthPct}%`}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-mono text-lg font-bold text-hud-text-primary">
                    {station.totalItems}
                  </div>
                  <div className="font-mono text-[9px] text-hud-text-dim uppercase">Items</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-hud-text-primary">
                    {formatCurrency(station.totalValue)}
                  </div>
                  <div className="font-mono text-[9px] text-hud-text-dim uppercase">Value</div>
                </div>
              </div>

              {/* Stock issues */}
              <div className="flex items-center gap-3 font-mono text-[11px]">
                {station.outOfStock > 0 && (
                  <span className="text-hud-critical font-bold">
                    {station.outOfStock} OOS
                  </span>
                )}
                {station.lowStock > 0 && (
                  <span className="text-hud-warning font-bold">
                    {station.lowStock} Low
                  </span>
                )}
                {station.outOfStock === 0 && station.lowStock === 0 && (
                  <span className="text-hud-nominal text-[10px]">All stocked</span>
                )}
              </div>

              {/* Simple health bar */}
              <div className="relative h-1.5 w-full rounded-sm bg-hud-surface overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-sm transition-all',
                    station.healthStatus === 'critical' ? 'bg-hud-critical' :
                    station.healthStatus === 'warning' ? 'bg-hud-warning' : 'bg-hud-nominal',
                  )}
                  style={{ width: `${station.healthPct}%` }}
                />
              </div>
            </div>
          </HUDPanel>
        ))}
      </div>

      {/* ── Cross-Station Transfer Recommendations ────────────────── */}
      <HUDPanel label="Nearest Available — Transfer Recommendations">
        {transfers.length > 0 ? (
          <div className="overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-hud-border scrollbar-track-transparent">
            <table className="w-full font-mono text-[11px]">
              <thead className="sticky top-0 bg-hud-bg/95 z-10">
                <tr className="text-hud-text-dim text-[10px] uppercase tracking-wider">
                  <th className="text-left px-2 py-2">Part Description</th>
                  <th className="text-left px-2 py-2 w-[110px]">Needed At</th>
                  <th className="text-left px-2 py-2 w-[110px]">Available At</th>
                  <th className="text-right px-2 py-2 w-[50px]">Qty</th>
                  <th className="text-right px-2 py-2 w-[80px]">Lead Time</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr
                    key={i}
                    className="border-t border-hud-border/20 hover:bg-hud-surface/30 transition-colors"
                  >
                    <td className="px-2 py-1.5 text-hud-text-primary truncate max-w-[220px]" title={t.partDescription}>
                      {t.partDescription.length > 45
                        ? t.partDescription.slice(0, 42) + '...'
                        : t.partDescription}
                    </td>
                    <td className="px-2 py-1.5 text-hud-critical font-bold">{t.neededAt}</td>
                    <td className="px-2 py-1.5 text-hud-nominal">{t.availableAt}</td>
                    <td className="px-2 py-1.5 text-right text-hud-text-primary">{t.qtyAvailable}</td>
                    <td className="px-2 py-1.5 text-right text-hud-text-dim">{t.leadTimeDays}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6">
            <div className="font-mono text-[11px] text-hud-text-dim">
              No cross-station transfers available for current out-of-stock items.
            </div>
          </div>
        )}
      </HUDPanel>
    </div>
  )
}
