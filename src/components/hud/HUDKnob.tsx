'use client'

import { useCallback, useId, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface HUDKnobProps {
  positions: string[]
  value: string
  onChange: (value: string) => void
  label: string
  size?: number
  className?: string
}

export function HUDKnob({
  positions,
  value,
  onChange,
  label,
  size = 120,
  className,
}: HUDKnobProps) {
  const id = useId()
  const cx = size / 2
  const cy = size / 2
  const knobRadius = size * 0.3
  const tickRadius = size * 0.42
  const labelRadius = size * 0.52
  const indicatorLength = knobRadius * 0.75
  const arcSpanDeg = 270

  const degToRad = (deg: number) => (deg * Math.PI) / 180

  const positionAngle = useCallback(
    (index: number) => {
      const count = positions.length
      if (count === 1) return 0
      // Distribute across 270 degrees: -135 (7 o'clock) to +135 (5 o'clock)
      return -135 + (index / (count - 1)) * arcSpanDeg
    },
    [positions.length],
  )

  const currentIndex = positions.indexOf(value)
  const currentAngle = currentIndex >= 0 ? positionAngle(currentIndex) : -135

  // Indicator line endpoint
  const indicatorX = cx + indicatorLength * Math.sin(degToRad(currentAngle))
  const indicatorY = cy - indicatorLength * Math.cos(degToRad(currentAngle))

  const handleClick = useCallback(
    (index: number) => {
      if (positions[index] !== value) {
        onChange(positions[index])
      }
    },
    [positions, value, onChange],
  )

  // Build invisible click sector path
  const buildSectorPath = useCallback(
    (index: number) => {
      const count = positions.length
      const sectorSpan = arcSpanDeg / count
      const startDeg = -135 + index * sectorSpan
      const endDeg = startDeg + sectorSpan
      const outerR = size * 0.48

      const startRad = degToRad(startDeg)
      const endRad = degToRad(endDeg)

      const x1 = cx + outerR * Math.sin(startRad)
      const y1 = cy - outerR * Math.cos(startRad)
      const x2 = cx + outerR * Math.sin(endRad)
      const y2 = cy - outerR * Math.cos(endRad)

      const largeArc = sectorSpan > 180 ? 1 : 0

      return `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} Z`
    },
    [positions.length, size, cx, cy],
  )

  // Memoize tick/label positions
  const positionData = useMemo(
    () =>
      positions.map((pos, i) => {
        const angle = positionAngle(i)
        const rad = degToRad(angle)
        return {
          pos,
          tickInnerX: cx + (tickRadius - 6) * Math.sin(rad),
          tickInnerY: cy - (tickRadius - 6) * Math.cos(rad),
          tickOuterX: cx + tickRadius * Math.sin(rad),
          tickOuterY: cy - tickRadius * Math.cos(rad),
          labelX: cx + labelRadius * Math.sin(rad),
          labelY: cy - labelRadius * Math.cos(rad),
        }
      }),
    [positions, positionAngle, cx, cy, tickRadius, labelRadius],
  )

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="cursor-pointer select-none"
      >
        <defs>
          <radialGradient id={`${id}-knob`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1A2A3A" />
            <stop offset="60%" stopColor="#0A1A2A" />
            <stop offset="100%" stopColor="#0C1218" />
          </radialGradient>

          <radialGradient id={`${id}-glow`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="rgba(0,136,255,0.12)" />
            <stop offset="50%" stopColor="rgba(0,136,255,0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id={`${id}-line-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={knobRadius + 8}
          fill="none"
          stroke="#1A2A3C"
          strokeWidth={1.5}
          opacity={0.6}
        />

        {/* Tick marks and position labels */}
        {positionData.map(({ pos, tickInnerX, tickInnerY, tickOuterX, tickOuterY, labelX, labelY }, i) => {
          const isActive = i === currentIndex
          return (
            <g key={pos}>
              <line
                x1={tickInnerX}
                y1={tickInnerY}
                x2={tickOuterX}
                y2={tickOuterY}
                stroke={isActive ? '#0088FF' : '#5A7A9B'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.6}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono"
                fontSize={Math.min(9, size * 0.075)}
                fill={isActive ? '#0088FF' : '#5A7A9B'}
                opacity={isActive ? 1 : 0.7}
              >
                {pos}
              </text>
            </g>
          )
        })}

        {/* Knob body */}
        <circle
          cx={cx}
          cy={cy}
          r={knobRadius}
          fill={`url(#${id}-knob)`}
          stroke="#1A2A3C"
          strokeWidth={1.5}
        />

        {/* Inner reflection */}
        <circle
          cx={cx}
          cy={cy}
          r={knobRadius - 2}
          fill={`url(#${id}-glow)`}
        />

        {/* Subtle edge highlight */}
        <circle
          cx={cx}
          cy={cy}
          r={knobRadius - 1}
          fill="none"
          stroke="rgba(0,136,255,0.08)"
          strokeWidth={0.5}
        />

        {/* Indicator line */}
        <line
          x1={cx}
          y1={cy}
          x2={indicatorX}
          y2={indicatorY}
          stroke="#0088FF"
          strokeWidth={2}
          strokeLinecap="round"
          filter={`url(#${id}-line-glow)`}
          style={{
            transition: 'x2 0.3s ease-out, y2 0.3s ease-out',
          }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="#0088FF" opacity={0.6} />

        {/* Invisible click sectors */}
        {positions.map((_, i) => (
          <path
            key={`sector-${i}`}
            d={buildSectorPath(i)}
            fill="transparent"
            className="cursor-pointer hover:fill-[rgba(0,136,255,0.04)]"
            onClick={() => handleClick(i)}
          />
        ))}
      </svg>

      {/* Current position value */}
      <span className="font-mono text-hud-sm text-hud-primary tracking-wider -mt-1">
        {value}
      </span>

      {/* Control label */}
      <span className="font-mono text-hud-xs text-hud-text-dim uppercase -mt-1">
        {label}
      </span>
    </div>
  )
}
