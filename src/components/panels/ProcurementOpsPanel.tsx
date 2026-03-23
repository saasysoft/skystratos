'use client'

import { useMemo } from 'react'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDGauge } from '@/components/hud/HUDGauge'
import { HUDIndicator } from '@/components/hud/HUDIndicator'
import { useTranslation } from '@/lib/i18n/use-translation'
import { getProcurementRecords, getInventoryItems } from '@/lib/data'
import type { ProcurementRecord, InventoryItem } from '@/lib/mock-data/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount.toLocaleString()}`
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ---------------------------------------------------------------------------
// Computed data
// ---------------------------------------------------------------------------

interface PipelineStage {
  key: ProcurementRecord['status']
  label: string
  count: number
  isEmergencyStage?: boolean
}

interface EmergencyOrderRow {
  id: string
  item: string
  tailNumber: string
  totalCost: number
  expectedDelivery: string
  premiumPct: number
}

interface LowStockCard {
  id: string
  description: string
  currentStock: number
  minimumStock: number
  status: InventoryItem['status']
}

function useComputedData() {
  return useMemo(() => {
    const allRecords = getProcurementRecords()
    const allInventory = getInventoryItems()

    // --- AOG emergency rate ---
    const emergencyOrders = allRecords.filter((r) => r.isEmergency)
    const emergencyRate =
      allRecords.length > 0
        ? (emergencyOrders.length / allRecords.length) * 100
        : 0

    // --- AOG cost premium ---
    // Compare emergency items to planned items in the same category
    const plannedByCategory: Record<string, number[]> = {}
    const emergencyByCategory: Record<string, number[]> = {}

    for (const r of allRecords) {
      const bucket = r.isEmergency ? emergencyByCategory : plannedByCategory
      if (!bucket[r.category]) bucket[r.category] = []
      bucket[r.category].push(r.unitPrice)
    }

    let totalPremium = 0
    let premiumCount = 0
    for (const cat of Object.keys(emergencyByCategory)) {
      const plannedPrices = plannedByCategory[cat]
      if (!plannedPrices || plannedPrices.length === 0) continue
      const avgPlanned =
        plannedPrices.reduce((a, b) => a + b, 0) / plannedPrices.length
      for (const ep of emergencyByCategory[cat]) {
        if (avgPlanned > 0) {
          totalPremium += ((ep - avgPlanned) / avgPlanned) * 100
          premiumCount++
        }
      }
    }
    const avgPremium = premiumCount > 0 ? Math.round(totalPremium / premiumCount) : 45

    // --- Active orders ---
    const activeStatuses = new Set<string>([
      'Ordered',
      'Shipped',
      'Pending Approval',
      'Emergency Order',
    ])
    const activeOrders = allRecords.filter((r) =>
      activeStatuses.has(r.status),
    )

    // --- Pipeline stages ---
    const statusCounts: Record<string, number> = {}
    const emergencyStatusCounts: Record<string, number> = {}

    for (const r of allRecords) {
      if (r.isEmergency) {
        emergencyStatusCounts[r.status] =
          (emergencyStatusCounts[r.status] || 0) + 1
      } else {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1
      }
    }

    const pipelineStages: PipelineStage[] = [
      {
        key: 'Pending Approval',
        label: 'procurement.pending',
        count: statusCounts['Pending Approval'] || 0,
      },
      { key: 'Ordered', label: 'procurement.ordered', count: statusCounts['Ordered'] || 0 },
      { key: 'Shipped', label: 'procurement.shipped', count: statusCounts['Shipped'] || 0 },
      {
        key: 'Delivered',
        label: 'procurement.delivered',
        count: statusCounts['Delivered'] || 0,
      },
    ]

    const emergencyPipelineStages: PipelineStage[] = [
      {
        key: 'Emergency Order',
        label: 'maintenance.emergency',
        count: emergencyStatusCounts['Emergency Order'] || 0,
        isEmergencyStage: true,
      },
      {
        key: 'Ordered',
        label: 'procurement.ordered',
        count: emergencyStatusCounts['Ordered'] || 0,
        isEmergencyStage: true,
      },
      {
        key: 'Shipped',
        label: 'procurement.shipped',
        count: emergencyStatusCounts['Shipped'] || 0,
        isEmergencyStage: true,
      },
      {
        key: 'Delivered',
        label: 'procurement.delivered',
        count: emergencyStatusCounts['Delivered'] || 0,
        isEmergencyStage: true,
      },
    ]

    // --- Emergency order list (sorted by cost desc) ---
    const emergencyOrderRows: EmergencyOrderRow[] = emergencyOrders
      .map((r) => {
        const catPlanned = plannedByCategory[r.category]
        const avgPlanned =
          catPlanned && catPlanned.length > 0
            ? catPlanned.reduce((a, b) => a + b, 0) / catPlanned.length
            : 0
        const premium =
          avgPlanned > 0
            ? Math.round(((r.unitPrice - avgPlanned) / avgPlanned) * 100)
            : 0

        return {
          id: r.id,
          item: r.item.split(' — ')[0], // Trim long description after dash
          tailNumber: r.tailNumber,
          totalCost: r.totalCost,
          expectedDelivery: r.expectedDelivery,
          premiumPct: premium,
        }
      })
      .sort((a, b) => b.totalCost - a.totalCost)

    // --- Emergency spend total ---
    const emergencySpendTotal = emergencyOrders.reduce(
      (sum, r) => sum + r.totalCost,
      0,
    )

    // --- Low stock alerts ---
    const lowStockItems: LowStockCard[] = allInventory
      .filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock')
      .sort((a, b) => {
        // Out of Stock first, then Low Stock
        if (a.status === 'Out of Stock' && b.status !== 'Out of Stock') return -1
        if (a.status !== 'Out of Stock' && b.status === 'Out of Stock') return 1
        return a.currentStock / a.minimumStock - b.currentStock / b.minimumStock
      })

    return {
      emergencyRate,
      avgPremium,
      activeOrders,
      pipelineStages,
      emergencyPipelineStages,
      emergencyOrderRows,
      emergencySpendTotal,
      lowStockItems,
    }
  }, [])
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PipelineFlow({
  stages,
  isEmergency = false,
}: {
  stages: PipelineStage[]
  isEmergency?: boolean
}) {
  const { t } = useTranslation()
  const borderColor = isEmergency
    ? 'border-hud-critical/40'
    : 'border-hud-border'
  const glowClass = isEmergency
    ? 'shadow-[0_0_12px_rgba(255,59,59,0.15)]'
    : ''
  const textColor = isEmergency ? 'text-hud-critical' : 'text-hud-primary'
  const countColor = isEmergency ? 'text-hud-critical' : 'text-hud-text-primary'
  const lineColor = isEmergency ? 'bg-hud-critical/30' : 'bg-hud-border'
  const arrowColor = isEmergency
    ? 'border-l-hud-critical/30'
    : 'border-l-hud-border'

  return (
    <div className="flex items-center gap-0 w-full">
      {stages.map((stage, idx) => {
        const hasItems = stage.count > 0
        return (
          <div key={stage.key + (isEmergency ? '-em' : '')} className="flex items-center flex-1 min-w-0">
            {/* Stage box */}
            <div
              className={[
                'relative flex flex-col items-center justify-center',
                'border rounded px-2 py-2.5 w-full min-h-[60px]',
                'bg-hud-surface/60 backdrop-blur-sm',
                borderColor,
                hasItems ? glowClass : '',
                hasItems ? 'border-opacity-100' : 'border-opacity-40',
                'transition-all duration-300',
              ].join(' ')}
            >
              <span
                className={[
                  'font-mono text-[10px] uppercase tracking-widest',
                  hasItems ? textColor : 'text-hud-text-dim',
                ].join(' ')}
              >
                {t(stage.label)}
              </span>
              <span
                className={[
                  'font-mono text-lg leading-none mt-1',
                  hasItems ? countColor : 'text-hud-text-dim/50',
                ].join(' ')}
              >
                {stage.count}
              </span>
              {isEmergency && idx === 0 && stage.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-hud-critical text-hud-bg text-[9px] font-mono px-1.5 py-0.5 rounded-sm leading-none">
                  {t('status.alert')}
                </span>
              )}
            </div>

            {/* Connector arrow between stages */}
            {idx < stages.length - 1 && (
              <div className="flex items-center flex-shrink-0 mx-0.5">
                <div className={`h-px w-3 ${lineColor}`} />
                <div
                  className={`w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] ${arrowColor}`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EmergencyOrdersList({
  orders,
}: {
  orders: EmergencyOrderRow[]
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1 overflow-y-auto max-h-[240px] pr-1 custom-scrollbar">
      {orders.length === 0 && (
        <p className="font-mono text-hud-xs text-hud-text-dim text-center py-4">
          {t('procurement.noEmergencyOrders')}
        </p>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center gap-3 px-3 py-2 rounded bg-hud-warning/[0.06] border border-hud-warning/20 hover:bg-hud-warning/[0.1] transition-colors"
        >
          {/* Item + tail number */}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-hud-xs text-hud-text-primary truncate">
              {order.item}
            </p>
            <p className="font-mono text-[10px] text-hud-text-dim mt-0.5">
              {order.tailNumber}
            </p>
          </div>

          {/* Cost */}
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-hud-xs text-hud-warning">
              {formatUSD(order.totalCost)}
            </p>
            <p className="font-mono text-[10px] text-hud-critical mt-0.5">
              +{order.premiumPct > 0 ? order.premiumPct : '~'}% {t('procurement.premium')}
            </p>
          </div>

          {/* Delivery */}
          <div className="text-right flex-shrink-0 w-14">
            <p className="font-mono text-[10px] text-hud-text-dim">ETA</p>
            <p className="font-mono text-hud-xs text-hud-text-secondary">
              {daysUntil(order.expectedDelivery)}d
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function LowStockAlerts({ items }: { items: LowStockCard[] }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[240px] pr-1 custom-scrollbar">
      {items.map((item) => {
        const isOutOfStock = item.status === 'Out of Stock'
        return (
          <div
            key={item.id}
            className={[
              'px-3 py-2 rounded border',
              'bg-hud-surface/60',
              isOutOfStock
                ? 'border-hud-critical/40 shadow-[0_0_8px_rgba(255,59,59,0.1)]'
                : 'border-hud-warning/25',
              'transition-all duration-200',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-hud-xs text-hud-text-primary truncate">
                  {item.description.split(' — ')[0]}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <HUDIndicator
                    status={isOutOfStock ? 'critical' : 'warning'}
                    label=""
                    size="sm"
                  />
                  <span className="font-mono text-[10px] text-hud-text-dim">
                    {item.currentStock} / {item.minimumStock} min
                  </span>
                </div>
              </div>
              <span
                className={[
                  'font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm leading-none flex-shrink-0 mt-0.5',
                  isOutOfStock
                    ? 'bg-hud-critical/20 text-hud-critical'
                    : 'bg-hud-warning/15 text-hud-warning',
                ].join(' ')}
              >
                {item.status}
              </span>
            </div>
          </div>
        )
      })}

      {/* Insight callout */}
      <div className="mt-2 px-3 py-2 rounded border border-hud-border/40 bg-hud-surface/40">
        <div className="flex items-start gap-2">
          <span className="text-hud-warning text-sm leading-none mt-px flex-shrink-0">
            &#9888;
          </span>
          <p className="font-mono text-[10px] text-hud-text-dim leading-relaxed">
            {t('procurement.lowStockInsight')}
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Panel
// ---------------------------------------------------------------------------

export function ProcurementOpsPanel() {
  const { t } = useTranslation()
  const {
    emergencyRate,
    avgPremium,
    activeOrders,
    pipelineStages,
    emergencyPipelineStages,
    emergencyOrderRows,
    emergencySpendTotal,
    lowStockItems,
  } = useComputedData()

  return (
    <div className="flex flex-col gap-4">
      {/* ================================================================= */}
      {/* TOP ROW -- Key Metrics                                            */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AOG Procurement Rate */}
        <HUDPanel variant="alert" label={t('procurement.emergencyRateLabel')} active>
          <div className="flex justify-center">
            <HUDGauge
              value={Math.round(emergencyRate * 10) / 10}
              max={30}
              label={t('procurement.emergencyRate')}
              unit="%"
              thresholds={{ warning: 10, critical: 15 }}
              size={130}
            />
          </div>
        </HUDPanel>

        {/* AOG Cost Premium */}
        <HUDPanel variant="alert" label={t('procurement.costPremiumLabel')} active>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="font-mono text-metric-lg text-hud-critical leading-none">
              +{avgPremium}%
            </span>
            <span className="font-mono text-hud-xs text-hud-text-dim uppercase mt-2">
              {t('procurement.avgEmergencyPremium')}
            </span>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-hud-xs text-hud-text-dim">
                {t('procurement.totalEmergencySpend')}
              </span>
              <span className="font-mono text-hud-sm text-hud-warning">
                {formatUSD(emergencySpendTotal)}
              </span>
            </div>
          </div>
        </HUDPanel>

        {/* Active Orders */}
        <HUDPanel variant="primary" label={t('procurement.activeOrders')}>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="font-mono text-metric-lg text-hud-primary leading-none">
              {activeOrders.length}
            </span>
            <span className="font-mono text-hud-xs text-hud-text-dim uppercase mt-2">
              {t('procurement.ordersInPipeline')}
            </span>
            <div className="mt-3 flex flex-col gap-1">
              <HUDIndicator
                status={
                  activeOrders.filter((o) => o.isEmergency).length > 0
                    ? 'critical'
                    : 'nominal'
                }
                label={t('procurement.emergencyLabel')}
                value={String(activeOrders.filter((o) => o.isEmergency).length)}
                size="sm"
              />
              <HUDIndicator
                status="nominal"
                label={t('procurement.plannedLabel')}
                value={String(
                  activeOrders.filter((o) => !o.isEmergency).length,
                )}
                size="sm"
              />
            </div>
          </div>
        </HUDPanel>
      </div>

      {/* ================================================================= */}
      {/* MIDDLE -- Order Pipeline Visualization                            */}
      {/* ================================================================= */}
      <HUDPanel variant="secondary" label={t('procurement.pipeline')} scanlines>
        <div className="flex flex-col gap-4">
          {/* Planned orders row */}
          <div>
            <p className="font-mono text-[10px] text-hud-text-dim uppercase tracking-widest mb-2">
              {t('procurement.plannedOrders')}
            </p>
            <PipelineFlow stages={pipelineStages} />
          </div>

          {/* Separator -- AOG emergency channel */}
          <div className="relative flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-hud-border/30" />
            <span className="font-mono text-[9px] text-hud-warning uppercase tracking-widest px-2">
              {t('procurement.emergencyChannel')}
            </span>
            <div className="flex-1 h-px bg-hud-border/30" />
          </div>

          {/* Emergency orders row */}
          <div>
            <p className="font-mono text-[10px] text-hud-critical uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-hud-critical animate-pulse-fast" />
              {t('procurement.emergencyBypass')}
            </p>
            <PipelineFlow stages={emergencyPipelineStages} isEmergency />
          </div>
        </div>
      </HUDPanel>

      {/* ================================================================= */}
      {/* BOTTOM -- AOG Emergency Orders + Low Stock Alerts                 */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bottom left -- AOG Emergency Orders */}
        <HUDPanel variant="alert" label={t('procurement.emergencyOrders')}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-hud-text-dim uppercase tracking-widest">
              {t('procurement.sortedByCost')}
            </span>
            <span className="font-mono text-[10px] text-hud-warning">
              {emergencyOrderRows.length} {t('procurement.orders')}
            </span>
          </div>
          <EmergencyOrdersList orders={emergencyOrderRows} />
        </HUDPanel>

        {/* Bottom right -- Low Stock Alerts */}
        <HUDPanel variant="alert" label={t('procurement.lowStock')}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-hud-text-dim uppercase tracking-widest">
              {t('procurement.inventoryGaps')}
            </span>
            <span className="font-mono text-[10px] text-hud-critical">
              {lowStockItems.filter((i) => i.status === 'Out of Stock').length} {t('procurement.critical')}
            </span>
          </div>
          <LowStockAlerts items={lowStockItems} />
        </HUDPanel>
      </div>
    </div>
  )
}
