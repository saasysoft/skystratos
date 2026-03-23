'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

import type {
  AircraftType,
  AircraftStatus,
  MaintenanceStatus,
} from '@/lib/mock-data/types'

// ---------------------------------------------------------------------------
// Filter state shape
// ---------------------------------------------------------------------------

export interface DashboardFilterState {
  activeView: string
  aircraftType: AircraftType | null
  statusFilter: AircraftStatus[]
  maintenanceStatusFilter: MaintenanceStatus[]
  dateRange: string | null
  sortBy: string | null
  sortDirection: 'asc' | 'desc'
  highlightAnomalies: boolean
}

const DEFAULT_FILTER_STATE: DashboardFilterState = {
  activeView: 'fleet_map',
  aircraftType: null,
  statusFilter: [],
  maintenanceStatusFilter: [],
  dateRange: null,
  sortBy: null,
  sortDirection: 'asc',
  highlightAnomalies: false,
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DashboardFilterContextValue {
  filters: DashboardFilterState
  setDashboardFilter: (update: Partial<DashboardFilterState>) => void
  resetFilters: () => void
}

const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(
  null
)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function DashboardFilterProvider({
  children,
}: {
  children: ReactNode
}) {
  const [filters, setFilters] = useState<DashboardFilterState>(
    DEFAULT_FILTER_STATE
  )

  const setDashboardFilter = useCallback(
    (update: Partial<DashboardFilterState>) => {
      setFilters((prev) => ({ ...prev, ...update }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  return (
    <DashboardFilterContext.Provider
      value={{ filters, setDashboardFilter, resetFilters }}
    >
      {children}
    </DashboardFilterContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashboardFilters(): DashboardFilterContextValue {
  const ctx = useContext(DashboardFilterContext)
  if (!ctx) {
    throw new Error(
      'useDashboardFilters must be used within a DashboardFilterProvider'
    )
  }
  return ctx
}
