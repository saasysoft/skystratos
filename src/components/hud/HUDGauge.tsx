'use client'

import { useId, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HUDGaugeProps {
  value: number
  max: number
  label: string
  unit: string
  thresholds?: { warning: number; critical: number }
  size?: number
  className?: string
}

const COLORS = {
  nominal: '#00FF9F',
  warning: '#FFB800',
  critical: '#FF3B3B',
} as const

export function HUDGauge({
  value,
  max,
  label,
  unit,
  thresholds,
  size = 140,
  className,
}: HUDGaugeProps) {
  const id = useId()
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const strokeWidth = size * 0.06
  const needleLength = radius - 4
  const tickLength = 6
  const tickCount = 12

  // Arc: 270 degrees, open at the bottom
  // Start angle: 135 deg (bottom-left), end angle: 405 deg (bottom-right)
  const startAngleDeg = 135
  const sweepDeg = 270

  const degToRad = (deg: number) => (deg * Math.PI) / 180

  const clampedValue = Math.min(Math.max(value, 0), max)
  const fraction = max > 0 ? clampedValue / max : 0

  // Determine color based on thresholds
  const valueColor = useMemo(() => {
    if (!thresholds) return COLORS.nominal
    if (clampedValue >= thresholds.critical) return COLORS.critical
    if (clampedValue >= thresholds.warning) return COLORS.warning
    return COLORS.nominal
  }, [clampedValue, thresholds])

  // SVG arc path helper (clockwise)
  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const s = degToRad(startDeg)
    const e = degToRad(endDeg)
    const x1 = cx + r * Math.cos(s)
    const y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e)
    const y2 = cy + r * Math.sin(e)
    const span = endDeg - startDeg
    const largeArc = span > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const bgArcD = arcPath(startAngleDeg, startAngleDeg + sweepDeg, radius)
  const valueAngle = startAngleDeg + fraction * sweepDeg
  const valueArcD = fraction > 0.001
    ? arcPath(startAngleDeg, valueAngle, radius)
    : ''

  // Needle endpoint
  const needleAngleRad = degToRad(valueAngle)
  const needleX = cx + needleLength * Math.cos(needleAngleRad)
  const needleY = cy + needleLength * Math.sin(needleAngleRad)

  // Tick marks
  const ticks = useMemo(() => {
    const result = []
    for (let i = 0; i <= tickCount; i++) {
      const angle = startAngleDeg + (i / tickCount) * sweepDeg
      const rad = degToRad(angle)
      const isMajor = i % 3 === 0
      const innerR = radius - strokeWidth / 2 - (isMajor ? tickLength : tickLength * 0.6)
      const outerR = radius - strokeWidth / 2
      result.push({
        x1: cx + innerR * Math.cos(rad),
        y1: cy + innerR * Math.sin(rad),
        x2: cx + outerR * Math.cos(rad),
        y2: cy + outerR * Math.sin(rad),
        isMajor,
      })
    }
    return result
  }, [size])

  // Arc circumference for stroke-dasharray animation
  const arcLength = (sweepDeg / 360) * 2 * Math.PI * radius
  const valueDash = fraction * arcLength

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="select-none"
      >
        <defs>
          <filter id={`${id}-needle-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={bgArcD}
          fill="none"
          stroke="#1A2A3C"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        {valueArcD && (
          <path
            d={valueArcD}
            fill="none"
            stroke={valueColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.9}
            style={{
              transition: 'stroke 0.4s ease, d 0.5s ease-out',
            }}
          />
        )}

        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#5A7A9B"
            strokeWidth={tick.isMajor ? 1.5 : 0.8}
            opacity={tick.isMajor ? 0.8 : 0.4}
          />
        ))}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={valueColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          filter={`url(#${id}-needle-glow)`}
          style={{
            transition: 'x2 0.5s ease-out, y2 0.5s ease-out, stroke 0.4s ease',
          }}
        />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={3.5} fill="#0A1A2A" stroke={valueColor} strokeWidth={1} opacity={0.8} />

        {/* Center value text */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono"
          fontSize={size * 0.19}
          fill={valueColor}
          style={{ transition: 'fill 0.4s ease' }}
        >
          {Math.round(clampedValue)}
        </text>

        {/* Unit text below value */}
        <text
          x={cx}
          y={cy + size * 0.14}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono"
          fontSize={10}
          fill="#5A7A9B"
        >
          {unit}
        </text>
      </svg>

      {/* Label below gauge */}
      <span className="font-mono text-hud-xs text-hud-text-dim uppercase -mt-1">
        {label}
      </span>
    </div>
  )
}
