'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface RadarAircraft {
  id: string
  name: string
  lat: number
  lng: number
  status: string
}

interface RadarDisplayProps {
  aircraft?: RadarAircraft[]
  centerLat?: number
  centerLng?: number
  range?: number
  size?: number
  className?: string
}

/** Status color map — radar blip colors */
const STATUS_COLORS: Record<string, string> = {
  'In Flight': '#00FF9F',
  'On Ground': '#0088FF',
  'In Maintenance': '#FF8C00',
  'AOG': '#FF3B3B',
}

/** Radar accent green */
const RADAR_GREEN = '#00FF9F'
/** Ring / crosshair color */
const RING_COLOR = 'rgba(0, 255, 159, 0.1)'
/** Sweep rotation period in ms */
const SWEEP_PERIOD = 3000
/** Trail arc in radians (~60 degrees) */
const TRAIL_ARC = Math.PI / 3
/** Target ~30fps via frame-skip */
const FRAME_INTERVAL = 1000 / 30

/** Range ring labels in nautical miles */
const RANGE_RING_LABELS = ['200nm', '400nm']

export default function RadarDisplay({
  aircraft = [],
  centerLat = 41.97,
  centerLng = -87.91,
  range = 500,
  size = 250,
  className,
}: RadarDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastFrameRef = useRef<number>(0)
  const reducedMotionRef = useRef(false)
  /** Track which blips were recently "swept" for glow effect */
  const sweptRef = useRef<Map<string, number>>(new Map())
  const canvasSizeRef = useRef(size)

  /** Convert aircraft lat/lng to canvas x/y relative to center */
  const aircraftToCanvas = useCallback(
    (ac: RadarAircraft, canvasSize: number) => {
      // Approximate: 1 degree lat ~ 60nm, 1 degree lng ~ 60nm * cos(lat)
      const nmPerDegLat = 60
      const nmPerDegLng = 60 * Math.cos((centerLat * Math.PI) / 180)
      const radius = canvasSize / 2

      const dxNm = (ac.lng - centerLng) * nmPerDegLng
      const dyNm = (centerLat - ac.lat) * nmPerDegLat // inverted Y

      // Normalize to range
      const dx = dxNm / range
      const dy = dyNm / range

      const px = radius + dx * radius * 0.85
      const py = radius + dy * radius * 0.85
      return { x: px, y: py }
    },
    [centerLat, centerLng, range],
  )

  /** Angle of a point relative to center (0 = right, clockwise) */
  const pointAngle = useCallback((x: number, y: number, cx: number, cy: number) => {
    return Math.atan2(y - cy, x - cx)
  }, [])

  /** Main render function */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, canvasSize: number, timestamp: number) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvasSize * dpr
      const center = w / 2
      const radius = center - 2 * dpr

      ctx.clearRect(0, 0, w, w)

      // -- Transparent background (renders inside HUDPanel) --
      // No fill — let parent bg show through

      // -- Clip to circle --
      ctx.save()
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.clip()

      // -- Subtle circular background --
      ctx.fillStyle = 'rgba(2, 11, 18, 0.6)'
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.fill()

      // -- Concentric range rings (3 rings) --
      ctx.strokeStyle = RING_COLOR
      ctx.lineWidth = 1 * dpr
      for (let i = 1; i <= 3; i++) {
        const r = (radius * i) / 3
        ctx.beginPath()
        ctx.arc(center, center, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // -- Range ring labels --
      ctx.font = `${8 * dpr}px monospace`
      ctx.fillStyle = 'rgba(0, 255, 159, 0.3)'
      ctx.textAlign = 'left'
      for (let i = 0; i < RANGE_RING_LABELS.length; i++) {
        const r = (radius * (i + 1)) / 3
        ctx.fillText(RANGE_RING_LABELS[i], center + 4 * dpr, center - r + 10 * dpr)
      }

      // -- Crosshair lines --
      ctx.strokeStyle = RING_COLOR
      ctx.lineWidth = 0.5 * dpr
      ctx.beginPath()
      ctx.moveTo(center - radius, center)
      ctx.lineTo(center + radius, center)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(center, center - radius)
      ctx.lineTo(center, center + radius)
      ctx.stroke()

      // -- Sweep angle --
      const isStatic = reducedMotionRef.current
      const sweepAngle = isStatic
        ? 0
        : ((timestamp % SWEEP_PERIOD) / SWEEP_PERIOD) * Math.PI * 2 - Math.PI / 2

      if (!isStatic) {
        // -- Sweep trail (gradient arc) --
        const trailStart = sweepAngle - TRAIL_ARC
        const gradient = ctx.createConicGradient(trailStart, center, center)
        const trailFraction = TRAIL_ARC / (Math.PI * 2)
        gradient.addColorStop(0, 'rgba(0, 255, 159, 0)')
        gradient.addColorStop(trailFraction * 0.5, 'rgba(0, 255, 159, 0.04)')
        gradient.addColorStop(trailFraction, 'rgba(0, 255, 159, 0.14)')
        gradient.addColorStop(Math.min(trailFraction + 0.001, 1), 'rgba(0, 255, 159, 0)')
        gradient.addColorStop(1, 'rgba(0, 255, 159, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.arc(center, center, radius, trailStart, sweepAngle)
        ctx.closePath()
        ctx.fill()

        // -- Sweep beam line --
        const beamEndX = center + Math.cos(sweepAngle) * radius
        const beamEndY = center + Math.sin(sweepAngle) * radius
        ctx.strokeStyle = 'rgba(0, 255, 159, 0.5)'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.lineTo(beamEndX, beamEndY)
        ctx.stroke()

        // Secondary thinner beam
        const beam2Angle = sweepAngle - 0.02
        const beam2EndX = center + Math.cos(beam2Angle) * radius
        const beam2EndY = center + Math.sin(beam2Angle) * radius
        ctx.strokeStyle = 'rgba(0, 255, 159, 0.2)'
        ctx.lineWidth = 1 * dpr
        ctx.beginPath()
        ctx.moveTo(center, center)
        ctx.lineTo(beam2EndX, beam2EndY)
        ctx.stroke()
      }

      // -- Aircraft blips --
      const now = timestamp
      for (const ac of aircraft) {
        const pos = aircraftToCanvas(ac, canvasSize)
        const px = pos.x * dpr
        const py = pos.y * dpr

        // Check if within radar circle
        const distFromCenter = Math.sqrt((px - center) ** 2 + (py - center) ** 2)
        if (distFromCenter > radius) continue

        // Check if sweep just passed this blip
        if (!isStatic) {
          const blipAngle = pointAngle(px, py, center, center)
          let angleDiff = sweepAngle - blipAngle
          while (angleDiff < 0) angleDiff += Math.PI * 2
          while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2
          if (angleDiff < 0.09) {
            sweptRef.current.set(ac.id, now)
          }
        }

        const lastSwept = sweptRef.current.get(ac.id) || 0
        const timeSinceSwept = now - lastSwept
        const glowIntensity = isStatic ? 0.5 : Math.max(0, 1 - timeSinceSwept / 800)
        const baseColor = STATUS_COLORS[ac.status] || RADAR_GREEN

        // Outer glow when recently swept
        if (glowIntensity > 0.05) {
          const glowRadius = (3 + glowIntensity * 6) * dpr
          const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius)
          glow.addColorStop(0, baseColor + alphaHex(glowIntensity * 0.6))
          glow.addColorStop(1, baseColor + '00')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(px, py, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Blip dot
        const blipRadius = 2.5 * dpr
        const blipAlpha = 0.5 + glowIntensity * 0.5
        ctx.fillStyle = baseColor + alphaHex(blipAlpha)
        ctx.beginPath()
        ctx.arc(px, py, blipRadius, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.fillStyle = baseColor + alphaHex(0.8 + glowIntensity * 0.2)
        ctx.beginPath()
        ctx.arc(px, py, 1 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      // -- Center point (small cross) --
      const crossSize = 4 * dpr
      ctx.strokeStyle = RADAR_GREEN + '99'
      ctx.lineWidth = 1.5 * dpr
      ctx.beginPath()
      ctx.moveTo(center - crossSize, center)
      ctx.lineTo(center + crossSize, center)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(center, center - crossSize)
      ctx.lineTo(center, center + crossSize)
      ctx.stroke()
      // Tiny center dot
      ctx.fillStyle = RADAR_GREEN + 'CC'
      ctx.beginPath()
      ctx.arc(center, center, 1.5 * dpr, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // -- Outer circle border --
      ctx.strokeStyle = 'rgba(0, 255, 159, 0.15)'
      ctx.lineWidth = 1.5 * dpr
      ctx.beginPath()
      ctx.arc(center, center, radius, 0, Math.PI * 2)
      ctx.stroke()
    },
    [aircraft, aircraftToCanvas, pointAngle],
  )

  useEffect(() => {
    // Detect reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mq.addEventListener('change', handler)

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /** Size the canvas to the container or the size prop */
    const resize = () => {
      const rect = container.getBoundingClientRect()
      const s = Math.min(rect.width, rect.height) || size
      canvasSizeRef.current = s
      const dpr = window.devicePixelRatio || 1
      canvas.width = s * dpr
      canvas.height = s * dpr
      canvas.style.width = `${s}px`
      canvas.style.height = `${s}px`
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    /** Animation loop with frame-skip for ~30fps */
    const loop = (timestamp: number) => {
      const elapsed = timestamp - lastFrameRef.current
      if (elapsed >= FRAME_INTERVAL) {
        lastFrameRef.current = timestamp - (elapsed % FRAME_INTERVAL)
        draw(ctx, canvasSizeRef.current, timestamp)
      }
      if (reducedMotionRef.current) {
        draw(ctx, canvasSizeRef.current, 0)
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      mq.removeEventListener('change', handler)
    }
  }, [draw, size])

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        className="radar-glow"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0, 255, 159, 0.25))' }}
        aria-label="Radar display showing aircraft positions"
        role="img"
      />
    </div>
  )
}

/** Convert a 0-1 alpha float to a 2-digit hex string */
function alphaHex(alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha))
  const byte = Math.round(clamped * 255)
  return byte.toString(16).padStart(2, '0')
}
