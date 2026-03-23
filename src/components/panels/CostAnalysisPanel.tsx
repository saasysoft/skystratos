'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { HUDPanel } from '@/components/hud/HUDPanel'
import { HUDGauge } from '@/components/hud/HUDGauge'
import { HUDButton } from '@/components/hud/HUDButton'
import { getCostData } from '@/lib/data'
import { useTranslation } from '@/lib/i18n/use-translation'

/* ============================================
   HUD Color Tokens (SkyStratos aviation palette)
   ============================================ */
const HUD = {
  primary: '#0088FF',
  secondary: '#FFB800',
  nominal: '#00FF9F',
  warning: '#FF8C00',
  critical: '#FF3B3B',
  muted: '#2A3A5A',
  surface: '#0C1218',
  border: '#1A2A3C',
  textDim: '#5A7A9B',
  textPrimary: '#E0EEFF',
  grid: 'rgba(0,136,255,0.08)',
} as const

/* ============================================
   Custom Tooltip — dollar values in $X.XXM
   ============================================ */
function HUDTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="font-mono text-[11px] px-3 py-2 border"
      style={{
        background: HUD.surface,
        borderColor: HUD.primary,
        color: HUD.textPrimary,
      }}
    >
      <p className="mb-1 text-hud-text-dim">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: ${(entry.value / 1_000_000).toFixed(2)}M
        </p>
      ))}
    </div>
  )
}

/* ============================================
   Custom Tooltip — AOG values in $XK
   ============================================ */
function HUDTooltipAOG({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="font-mono text-[11px] px-3 py-2 border"
      style={{
        background: HUD.surface,
        borderColor: HUD.warning,
        color: HUD.textPrimary,
      }}
    >
      <p className="mb-1 text-hud-text-dim">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: ${(entry.value / 1_000).toFixed(0)}K
        </p>
      ))}
    </div>
  )
}

/* ============================================
   Month label formatter
   ============================================ */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`
}

/* ============================================
   CostAnalysisPanel
   ============================================ */
export function CostAnalysisPanel() {
  const { t } = useTranslation()

  const costData = useMemo(() => getCostData(), [])

  // ---- Computed metrics ----
  const totalFleetCostYTD = useMemo(
    () => costData.reduce((sum, m) => sum + m.totalFleetCost, 0),
    [costData]
  )

  const latestMonth = costData[costData.length - 1]

  const aogRate = useMemo(() => {
    const totalProcurement = costData.reduce((s, m) => s + m.procurementCost, 0)
    const totalAOG = costData.reduce((s, m) => s + m.aogProcurementCost, 0)
    return totalProcurement > 0 ? (totalAOG / totalProcurement) * 100 : 0
  }, [costData])

  // ---- Chart data ----
  const trendData = useMemo(
    () =>
      costData.map((m) => ({
        month: monthLabel(m.month),
        actual: m.totalFleetCost,
        budget: m.budgetedCost,
      })),
    [costData]
  )

  const breakdownData = useMemo(
    () =>
      costData.map((m) => ({
        month: monthLabel(m.month),
        Fuel: m.fuelCost,
        Maintenance: m.scheduledMaintenanceCost + m.unscheduledMaintenanceCost,
        Crew: m.crewCost,
        'Airport Fees': m.airportFees,
        Insurance: m.insuranceCost,
        Procurement: m.procurementCost,
      })),
    [costData]
  )

  const aogTrendData = useMemo(
    () =>
      costData.map((m) => ({
        month: monthLabel(m.month),
        aog: m.aogProcurementCost,
      })),
    [costData]
  )

  // Healthy threshold: average of first 3 months (baseline)
  const aogHealthyThreshold = useMemo(() => {
    const baseline = costData.slice(0, 3)
    return baseline.reduce((s, m) => s + m.aogProcurementCost, 0) / baseline.length
  }, [costData])

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ---- SECTION 1: Header + Print Button ---- */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-hud-sm uppercase tracking-widest text-hud-text-dim">
          {t('cost.panelTitle')}
        </h2>
        <div data-no-print>
          <HUDButton
            onClick={() => window.print()}
            variant="secondary"
            size="sm"
          >
            {t('cost.printReport')}
          </HUDButton>
        </div>
      </div>

      {/* ============================================
         SECTION 2: TOP ROW — 3 Gauges
         ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Fleet Cost YTD */}
        <HUDPanel variant="primary" label={t('cost.fleetCostYTD')}>
          <div className="flex flex-col items-center py-2">
            <HUDGauge
              value={Math.round(totalFleetCostYTD / 1_000_000)}
              max={550}
              label={t('cost.totalFleetCostLabel')}
              unit="$M"
              size={160}
            />
            <p className="font-mono text-hud-xs text-hud-text-dim mt-2">
              {t('cost.monthTotal')}: ${(totalFleetCostYTD / 1_000_000).toFixed(1)}M
            </p>
          </div>
        </HUDPanel>

        {/* Budget Variance */}
        <HUDPanel
          variant={latestMonth.variance > 0 ? 'alert' : 'nominal'}
          label={t('cost.budgetVariance')}
        >
          <div className="flex flex-col items-center py-2">
            <HUDGauge
              value={Math.abs(Math.round(latestMonth.variance / 1_000_000))}
              max={15}
              label={t('cost.currentMonthVariance')}
              unit="$M"
              thresholds={{ warning: 3, critical: 7 }}
              size={160}
            />
            <p
              className={`font-mono text-hud-xs mt-2 ${
                latestMonth.variance > 0 ? 'text-hud-critical' : 'text-hud-nominal'
              }`}
            >
              {latestMonth.variance > 0 ? t('cost.overBudget') : t('cost.underBudget')}: $
              {(Math.abs(latestMonth.variance) / 1_000_000).toFixed(1)}M
            </p>
          </div>
        </HUDPanel>

        {/* AOG Procurement Rate */}
        <HUDPanel
          variant={aogRate >= 15 ? 'alert' : 'primary'}
          glow={aogRate >= 15}
          label={t('cost.aogProcurement')}
        >
          <div className="flex flex-col items-center py-2">
            <HUDGauge
              value={parseFloat(aogRate.toFixed(1))}
              max={25}
              label={t('cost.aogRateLabel')}
              unit="%"
              thresholds={{ warning: 10, critical: 15 }}
              size={160}
            />
            <p
              className={`font-mono text-hud-xs mt-2 uppercase tracking-wider ${
                aogRate >= 15
                  ? 'text-hud-critical animate-pulse-fast'
                  : aogRate >= 10
                    ? 'text-hud-warning'
                    : 'text-hud-nominal'
              }`}
            >
              {aogRate >= 15 ? `\u26A0 ${t('status.critical')}` : aogRate >= 10 ? t('status.warning') : t('status.nominal')}
            </p>
          </div>
        </HUDPanel>
      </div>

      {/* ============================================
         SECTION 3: MIDDLE ROW — 2 Charts
         ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Cost Trend */}
        <HUDPanel variant="primary" label={t('cost.monthlyTrend')} scanlines>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="costAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={HUD.primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={HUD.primary} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={HUD.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                  axisLine={{ stroke: HUD.border }}
                  tickLine={{ stroke: HUD.border }}
                />
                <YAxis
                  tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                  axisLine={{ stroke: HUD.border }}
                  tickLine={{ stroke: HUD.border }}
                  tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip content={<HUDTooltip />} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name={t('cost.actualCost')}
                  stroke={HUD.primary}
                  strokeWidth={2}
                  fill="url(#costAreaGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  name={t('cost.budget')}
                  stroke={HUD.muted}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </HUDPanel>

        {/* Cost Breakdown by Category */}
        <HUDPanel variant="primary" label={t('cost.costBreakdown')} scanlines>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={HUD.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                  axisLine={{ stroke: HUD.border }}
                  tickLine={{ stroke: HUD.border }}
                />
                <YAxis
                  tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                  axisLine={{ stroke: HUD.border }}
                  tickLine={{ stroke: HUD.border }}
                  tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip content={<HUDTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 13,
                    color: HUD.textDim,
                  }}
                />
                <Bar dataKey="Fuel" name={t('cost.fuel')} stackId="costs" fill={HUD.primary} />
                <Bar dataKey="Maintenance" name={t('cost.maintenance')} stackId="costs" fill={HUD.secondary} />
                <Bar dataKey="Crew" name={t('cost.crew')} stackId="costs" fill={HUD.nominal} />
                <Bar dataKey="Airport Fees" name={t('cost.airportFees')} stackId="costs" fill={HUD.warning} />
                <Bar dataKey="Insurance" name={t('cost.insurance')} stackId="costs" fill={HUD.muted} />
                <Bar dataKey="Procurement" name={t('cost.procurement')} stackId="costs" fill={HUD.critical} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </HUDPanel>
      </div>

      {/* ============================================
         SECTION 4: BOTTOM — AOG Procurement Trend
         ============================================ */}
      <HUDPanel variant="alert" glow label={t('cost.aogTrendTitle')} scanlines>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-hud-sm uppercase tracking-wider text-hud-warning">
            {t('cost.aogTrendRising')}{' '}
            <span className="text-hud-critical animate-blink font-bold">{t('cost.rising')}</span>
          </p>
          <span className="font-mono text-hud-xs text-hud-text-dim">
            {t('cost.healthyThreshold')}: ${(aogHealthyThreshold / 1_000).toFixed(0)}K{t('common.perMonth')}
          </span>
        </div>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={aogTrendData}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="aogAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={HUD.warning} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={HUD.warning} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={HUD.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                axisLine={{ stroke: HUD.border }}
                tickLine={{ stroke: HUD.border }}
              />
              <YAxis
                tick={{ fill: HUD.textDim, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }}
                axisLine={{ stroke: HUD.border }}
                tickLine={{ stroke: HUD.border }}
                tickFormatter={(v: number) => `$${(v / 1_000).toFixed(0)}K`}
              />
              <Tooltip content={<HUDTooltipAOG />} />
              <ReferenceLine
                y={aogHealthyThreshold}
                stroke={HUD.nominal}
                strokeDasharray="8 4"
                strokeWidth={1.5}
                label={{
                  value: t('cost.healthyThreshold').toUpperCase(),
                  position: 'insideTopRight',
                  fill: HUD.nominal,
                  fontSize: 10,
                  fontFamily: 'Share Tech Mono, monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="aog"
                name={t('cost.aogProcurementLabel')}
                stroke={HUD.warning}
                strokeWidth={2.5}
                fill="url(#aogAreaGrad)"
                dot={{ fill: HUD.warning, r: 3, strokeWidth: 0 }}
                activeDot={{ fill: HUD.critical, r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </HUDPanel>
    </div>
  )
}
