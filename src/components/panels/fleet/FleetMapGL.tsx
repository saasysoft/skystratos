'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import Map, { Marker, Source, Layer, Popup, type MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n/use-translation'
import type { Aircraft, AircraftStatus } from '@/lib/mock-data/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const INITIAL_VIEW = {
  longitude: -40,
  latitude: 30,
  zoom: 2,
}

const STATUS_COLORS: Record<AircraftStatus, string> = {
  'In Flight': '#00FF9F',
  'On Ground': '#0088FF',
  'In Maintenance': '#FF8C00',
  'AOG': '#FF3B3B',
}

const STATUS_GLOW: Record<AircraftStatus, string> = {
  'In Flight': '0 0 6px #00FF9F, 0 0 12px rgba(0,255,159,0.4)',
  'On Ground': '0 0 4px rgba(0,136,255,0.5)',
  'In Maintenance': '0 0 6px #FF8C00, 0 0 12px rgba(255,140,0,0.4)',
  'AOG': '0 0 6px #FF3B3B, 0 0 12px rgba(255,59,59,0.4)',
}

const WIDEBODY_TYPES = ['B787-9', 'B777-300ER', 'A350-900']

// ---------------------------------------------------------------------------
// Hub Airports
// ---------------------------------------------------------------------------

interface HubAirport {
  code: string
  name: string
  lat: number
  lng: number
}

const HUB_AIRPORTS: HubAirport[] = [
  { code: 'ORD', name: "O'Hare", lat: 41.97, lng: -87.91 },
  { code: 'LAX', name: 'Los Angeles', lat: 33.94, lng: -118.41 },
  { code: 'DFW', name: 'Dallas/Fort Worth', lat: 32.90, lng: -97.04 },
  { code: 'LHR', name: 'Heathrow', lat: 51.47, lng: -0.46 },
  { code: 'SIN', name: 'Singapore', lat: 1.36, lng: 103.99 },
]

// Lookup table for route line generation
const AIRPORT_COORDS: Record<string, [number, number]> = {
  ORD: [-87.91, 41.97],
  LAX: [-118.41, 33.94],
  DFW: [-97.04, 32.90],
  LHR: [-0.46, 51.47],
  SIN: [103.99, 1.36],
  JFK: [-73.78, 40.64],
  MIA: [-80.29, 25.79],
  SFO: [-122.38, 37.62],
  DEN: [-104.67, 39.86],
  ATL: [-84.43, 33.64],
  SEA: [-122.31, 47.45],
  MSP: [-93.22, 44.88],
  NRT: [140.39, 35.77],
  HND: [139.78, 35.55],
  CDG: [2.55, 49.01],
  AMS: [4.76, 52.31],
  FRA: [8.57, 50.03],
  BOS: [-71.01, 42.36],
  IAH: [-95.34, 29.98],
  PHX: [-112.01, 33.44],
}

// ---------------------------------------------------------------------------
// Route arc generation
// ---------------------------------------------------------------------------

function generateArc(
  originLng: number,
  originLat: number,
  destLng: number,
  destLat: number,
  numPoints: number = 20
): [number, number][] {
  const points: [number, number][] = []
  // Distance between points determines arc height
  const dLng = destLng - originLng
  const dLat = destLat - originLat
  const dist = Math.sqrt(dLng * dLng + dLat * dLat)
  // Arc height proportional to distance — subtle curve
  const arcHeight = dist * 0.15

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const lng = originLng + t * dLng
    const lat = originLat + t * dLat + Math.sin(t * Math.PI) * arcHeight
    points.push([lng, lat])
  }
  return points
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface FleetMapGLProps {
  aircraft: Aircraft[]
  className?: string
}

export default function FleetMapGL({ aircraft, className }: FleetMapGLProps) {
  const { t } = useTranslation()
  const mapRef = useRef<MapRef>(null)
  const [hoveredAircraft, setHoveredAircraft] = useState<Aircraft | null>(null)
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null)
  const [showAircraftLabels, setShowAircraftLabels] = useState(false)
  const [showHubs, setShowHubs] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [zoom, setZoom] = useState(INITIAL_VIEW.zoom)

  const handleZoom = useCallback((e: { viewState: { zoom: number } }) => {
    setZoom(e.viewState.zoom)
  }, [])

  const handleZoomIn = useCallback(() => {
    mapRef.current?.getMap().zoomIn({ duration: 300 })
  }, [])

  const handleZoomOut = useCallback(() => {
    mapRef.current?.getMap().zoomOut({ duration: 300 })
  }, [])

  const showHubLabels = zoom >= 3

  // Build GeoJSON for route lines — only In Flight aircraft with origin + destination
  const routeGeoJSON = useMemo<GeoJSON.FeatureCollection>(() => {
    const features: GeoJSON.Feature[] = []
    for (const ac of aircraft) {
      if (ac.status !== 'In Flight') continue
      const origin = ac.currentPosition.origin
      const dest = ac.currentPosition.destination
      if (!origin || !dest) continue
      const originCoords = AIRPORT_COORDS[origin]
      const destCoords = AIRPORT_COORDS[dest]
      if (!originCoords || !destCoords) continue

      try {
        const arc = generateArc(originCoords[0], originCoords[1], destCoords[0], destCoords[1])
        features.push({
          type: 'Feature',
          properties: { tailNumber: ac.tailNumber, route: `${origin} - ${dest}` },
          geometry: {
            type: 'LineString',
            coordinates: arc,
          },
        })
      } catch {
        // Skip malformed routes
      }
    }
    return { type: 'FeatureCollection', features }
  }, [aircraft])

  return (
    <div className={cn('relative w-full h-full min-h-[300px]', className)}>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        minZoom={1.5}
        maxZoom={10}
        onZoom={handleZoom}
        attributionControl={false}
        mapLib={maplibregl}
      >
        {/* Route Lines */}
        {showRoutes && (
          <Source id="route-lines" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-lines-layer"
              type="line"
              paint={{
                'line-color': 'rgba(0, 136, 255, 0.3)',
                'line-width': 1.5,
              }}
            />
          </Source>
        )}

        {/* Hub Airport Markers */}
        {showHubs &&
          HUB_AIRPORTS.map((hub) => (
            <AirportMarker key={hub.code} hub={hub} showLabel={showHubLabels} />
          ))}

        {/* Aircraft Markers */}
        {aircraft.map((ac) => (
          <AircraftMarker
            key={ac.id}
            aircraft={ac}
            showLabel={showAircraftLabels}
            isHovered={hoveredAircraft?.id === ac.id}
            onHover={setHoveredAircraft}
            onClick={setSelectedAircraft}
          />
        ))}

        {/* Aircraft Hover Tooltip */}
        {hoveredAircraft && !selectedAircraft && (
          <Popup
            longitude={hoveredAircraft.currentPosition.lng}
            latitude={hoveredAircraft.currentPosition.lat}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={14}
            className="fleet-map-tooltip"
          >
            <div className="bg-[#061520]/95 border border-[#0A3A5C] px-2.5 py-1.5 font-mono shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-[11px] text-[#E0F4FF] font-bold tracking-wide">
                {hoveredAircraft.tailNumber}
              </div>
              <div className="text-[10px] text-[#7DBDD9]">
                {hoveredAircraft.type} &middot; {hoveredAircraft.currentRoute ?? t('fleet.noRoute')}
              </div>
              <div
                className="text-[10px] font-bold"
                style={{ color: STATUS_COLORS[hoveredAircraft.status] }}
              >
                {hoveredAircraft.status}
                {hoveredAircraft.currentAirport ? ` \u2014 ${hoveredAircraft.currentAirport}` : ''}
              </div>
              <div className="text-[10px] text-[#00D4FF]">
                ${hoveredAircraft.costPerFlightHour.toLocaleString()}/FH
              </div>
            </div>
          </Popup>
        )}

        {/* Aircraft Detail Popup */}
        {selectedAircraft && (
          <Popup
            longitude={selectedAircraft.currentPosition.lng}
            latitude={selectedAircraft.currentPosition.lat}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={18}
            className="fleet-map-detail"
          >
            <AircraftDetailCard
              aircraft={selectedAircraft}
              onClose={() => setSelectedAircraft(null)}
            />
          </Popup>
        )}
      </Map>

      {/* HUD Controls Overlay - Top Right */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <div className="bg-[#061520]/90 border border-[#0A3A5C] p-2.5 font-mono shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="text-[9px] uppercase tracking-[0.2em] text-[#4A7A9B] mb-2 border-b border-[#0A3A5C] pb-1">
            {t('fleet.mapControls')}
          </div>

          <ToggleSwitch
            label={t('fleet.aircraftLabels')}
            checked={showAircraftLabels}
            onChange={setShowAircraftLabels}
          />
          <ToggleSwitch
            label={t('fleet.hubAirports')}
            checked={showHubs}
            onChange={setShowHubs}
          />
          <ToggleSwitch
            label={t('fleet.routeLines')}
            checked={showRoutes}
            onChange={setShowRoutes}
          />

          {/* Zoom Buttons */}
          <div className="flex gap-1 mt-2 pt-2 border-t border-[#0A3A5C]">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center font-mono text-lg text-[#00D4FF] border border-[#0A3A5C] bg-[#020B12]/80 hover:bg-[#0A3A5C]/50 hover:border-[#00D4FF]/50 transition-all active:scale-95"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center font-mono text-lg text-[#00D4FF] border border-[#0A3A5C] bg-[#020B12]/80 hover:bg-[#0A3A5C]/50 hover:border-[#00D4FF]/50 transition-all active:scale-95"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#061520]/90 border border-[#0A3A5C] p-2 font-mono shadow-[0_0_20px_rgba(0,0,0,0.6)]">
        <div className="text-[9px] uppercase tracking-[0.2em] text-[#4A7A9B] mb-1.5">
          {t('fleet.fleetStatus')}
        </div>
        {(Object.entries(STATUS_COLORS) as [AircraftStatus, string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 py-0.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
            />
            <span className="text-[9px] text-[#7DBDD9]">{status}</span>
          </div>
        ))}
      </div>

      {/* Inline styles for MapLibre popup overrides */}
      <style jsx global>{`
        .fleet-map-tooltip .maplibregl-popup-content,
        .fleet-map-detail .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .fleet-map-tooltip .maplibregl-popup-tip,
        .fleet-map-detail .maplibregl-popup-tip {
          border-top-color: #0A3A5C !important;
        }
        .maplibregl-ctrl-attrib {
          display: none !important;
        }
        @keyframes aircraft-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.8); opacity: 0.3; }
        }
        .aircraft-pulse {
          animation: aircraft-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AircraftMarker({
  aircraft,
  showLabel,
  isHovered,
  onHover,
  onClick,
}: {
  aircraft: Aircraft
  showLabel: boolean
  isHovered: boolean
  onHover: (a: Aircraft | null) => void
  onClick: (a: Aircraft) => void
}) {
  const color = STATUS_COLORS[aircraft.status]
  const glow = STATUS_GLOW[aircraft.status]
  const isAOG = aircraft.status === 'AOG'
  const isWidebody = WIDEBODY_TYPES.includes(aircraft.type)
  const markerSize = isWidebody ? 10 : 8

  return (
    <Marker
      longitude={aircraft.currentPosition.lng}
      latitude={aircraft.currentPosition.lat}
      anchor="center"
    >
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => onHover(aircraft)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation()
          onClick(aircraft)
        }}
      >
        {/* Pulse ring for AOG */}
        {isAOG && (
          <div
            className="aircraft-pulse absolute inset-0 rounded-full"
            style={{
              width: markerSize + 4,
              height: markerSize + 4,
              marginLeft: -(markerSize + 4) / 2,
              marginTop: -(markerSize + 4) / 2,
              left: '50%',
              top: '50%',
              border: `1px solid ${color}`,
              opacity: 0.5,
            }}
          />
        )}
        {/* Core dot */}
        <div
          style={{
            width: markerSize,
            height: markerSize,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            backgroundColor: isHovered ? color : 'rgba(2, 11, 18, 0.8)',
            boxShadow: glow,
            transition: 'all 0.15s ease',
            transform: isHovered ? 'scale(1.4)' : 'scale(1)',
          }}
        />
        {/* Label */}
        {showLabel && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-wide pointer-events-none"
            style={{ color: '#7DBDD9' }}
          >
            {aircraft.tailNumber}
          </div>
        )}
      </div>
    </Marker>
  )
}

function AirportMarker({
  hub,
  showLabel,
}: {
  hub: HubAirport
  showLabel: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Marker longitude={hub.lng} latitude={hub.lat} anchor="center">
      <div
        className="relative cursor-default"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Diamond shape */}
        <div
          style={{
            width: 6,
            height: 6,
            backgroundColor: hovered ? '#7DBDD9' : '#4A7A9B',
            opacity: hovered ? 1.0 : 0.7,
            transform: 'rotate(45deg)',
            transition: 'all 0.15s',
          }}
        />
        {(showLabel || hovered) && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-wide pointer-events-none"
            style={{ color: '#4A7A9B' }}
          >
            {hub.code}
          </div>
        )}
      </div>
    </Marker>
  )
}

function AircraftDetailCard({
  aircraft,
  onClose,
}: {
  aircraft: Aircraft
  onClose: () => void
}) {
  const { t } = useTranslation()
  const color = STATUS_COLORS[aircraft.status]

  return (
    <div className="bg-[#061520]/95 border border-[#0A3A5C] font-mono shadow-[0_0_30px_rgba(0,0,0,0.8)] min-w-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#0A3A5C] bg-[#020B12]/60">
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#4A7A9B]">
          {t('fleet.aircraftDetail')}
        </span>
        <button
          onClick={onClose}
          className="text-[#4A7A9B] hover:text-[#FF3B3B] text-xs transition-colors leading-none"
        >
          X
        </button>
      </div>

      {/* Body */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="text-[13px] text-[#E0F4FF] font-bold tracking-wide">
          {aircraft.tailNumber}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <DetailRow label={t('fleet.type')} value={aircraft.type} />
          <DetailRow
            label={t('fleet.status')}
            value={aircraft.status}
            valueColor={color}
          />
          <DetailRow
            label={t('fleet.route')}
            value={aircraft.currentRoute ?? '\u2014'}
          />
          <DetailRow
            label={t('fleet.airport')}
            value={aircraft.currentAirport ?? '\u2014'}
          />
          <DetailRow
            label={t('fleet.cpfh')}
            value={`$${aircraft.costPerFlightHour.toLocaleString()}`}
            valueColor="#00D4FF"
          />
          <DetailRow
            label={t('fleet.altitude')}
            value={aircraft.currentPosition.altitude > 0
              ? `FL${Math.round(aircraft.currentPosition.altitude / 100)}`
              : 'GND'}
          />
          <DetailRow
            label={t('fleet.groundSpeed')}
            value={`${aircraft.currentPosition.groundSpeed} kts`}
          />
          <DetailRow
            label={t('fleet.heading')}
            value={`${aircraft.currentPosition.heading}\u00B0`}
          />
          <DetailRow
            label={t('fleet.flightHours')}
            value={aircraft.totalFlightHours.toLocaleString()}
          />
          <DetailRow
            label={t('fleet.cycles')}
            value={aircraft.totalCycles.toLocaleString()}
          />
          <DetailRow
            label={t('fleet.mel')}
            value={String(aircraft.activeMELCount)}
            valueColor={aircraft.activeMELCount > 0 ? '#FF8C00' : undefined}
          />
          <DetailRow
            label={t('fleet.nextCheck')}
            value={aircraft.nextScheduledCheck}
          />
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div>
      <span className="text-[#4A7A9B] uppercase tracking-wider">{label}</span>
      <span className="ml-1.5" style={{ color: valueColor ?? '#E0F4FF' }}>
        {value}
      </span>
    </div>
  )
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-2 py-0.5 cursor-pointer group">
      <span className="text-[10px] text-[#7DBDD9] uppercase tracking-wide group-hover:text-[#E0F4FF] transition-colors">
        {label}
      </span>
      <div
        className="relative w-7 h-3.5 rounded-full transition-all"
        style={{
          backgroundColor: checked ? 'rgba(0, 212, 255, 0.3)' : 'rgba(10, 58, 92, 0.6)',
          border: `1px solid ${checked ? '#00D4FF' : '#0A3A5C'}`,
        }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-0.5 w-2 h-2 rounded-full transition-all"
          style={{
            left: checked ? 14 : 2,
            backgroundColor: checked ? '#00D4FF' : '#4A7A9B',
            boxShadow: checked ? '0 0 4px #00D4FF' : 'none',
          }}
        />
      </div>
    </label>
  )
}
