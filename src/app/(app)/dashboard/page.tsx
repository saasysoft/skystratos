'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useAuth } from '@/lib/auth/pin-context'
import { BootSequence } from '@/components/auth/BootSequence'
import BridgeShell from '@/components/layout/BridgeShell'
import NavConsole, { type TabId } from '@/components/layout/NavConsole'
import StatusBar from '@/components/layout/StatusBar'
import FleetOverviewPanel from '@/components/panels/FleetOverviewPanel'
import { TowerSidebar } from '@/components/tower/TowerSidebar'
import { GuidedTour } from '@/components/auth/GuidedTour'
import { alerts } from '@/lib/mock-data'

/* Lazy-load non-default panels -- only fleet tab is in the initial bundle */
const MaintenanceIntelPanel = dynamic(
  () => import('@/components/panels/MaintenanceIntelPanel').then((m) => ({ default: m.MaintenanceIntelPanel })),
)
const ProcurementOpsPanel = dynamic(
  () => import('@/components/panels/ProcurementOpsPanel').then((m) => ({ default: m.ProcurementOpsPanel })),
)
const CostAnalysisPanel = dynamic(
  () => import('@/components/panels/CostAnalysisPanel').then((m) => ({ default: m.CostAnalysisPanel })),
)
const MELTracker = dynamic(
  () => import('@/components/panels/aviation/MELTracker'),
)
const ADComplianceBoard = dynamic(
  () => import('@/components/panels/aviation/ADComplianceBoard'),
)
const DispatchReliability = dynamic(
  () => import('@/components/panels/aviation/DispatchReliability'),
)
const AOGTimeline = dynamic(
  () => import('@/components/panels/aviation/AOGTimeline'),
)
const MultiStationInventory = dynamic(
  () => import('@/components/panels/aviation/MultiStationInventory'),
)

type AppState = 'boot' | 'dashboard'

const BOOT_SHOWN_KEY = 'skystratos-boot-shown'

const PANEL_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
}

function getAlertSeverity(
  alertList: typeof alerts,
): 'nominal' | 'warning' | 'critical' {
  const hasCritical = alertList.some(
    (a) => a.severity === 'critical' && !a.acknowledged,
  )
  if (hasCritical) return 'critical'

  const hasHigh = alertList.some(
    (a) => (a.severity === 'high' || a.severity === 'medium') && !a.acknowledged,
  )
  if (hasHigh) return 'warning'

  return 'nominal'
}

function hasCookie(name: string): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some((c) => c.trim().startsWith(name + '='))
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const [appState, setAppState] = useState<AppState>(() => {
    // If boot was already shown this session, skip straight to dashboard
    if (typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem(BOOT_SHOWN_KEY) === 'true') {
          return 'dashboard'
        }
      } catch {
        // sessionStorage unavailable
      }
    }
    return 'boot'
  })
  const [activeTab, setActiveTab] = useState<TabId>('fleet')
  const [towerOpen, setTowerOpen] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Client-side mount check
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to sign-in if not authenticated and no session cookie
  useEffect(() => {
    if (mounted && !isAuthenticated && !hasCookie('skystratos-session')) {
      window.location.href = '/sign-in'
    }
  }, [mounted, isAuthenticated])

  // Glass mode toggle: Ctrl+Shift+G
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault()
        const root = document.documentElement
        const current = root.getAttribute('data-glass')
        root.setAttribute('data-glass', current === 'full' ? '' : 'full')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleBootComplete = useCallback(() => {
    setAppState('dashboard')
    // Mark boot as shown for this session
    try {
      sessionStorage.setItem(BOOT_SHOWN_KEY, 'true')
    } catch {
      // sessionStorage unavailable
    }
    // Show guided tour for first-time users
    try {
      if (localStorage.getItem('skystratos-tour-completed') !== 'true') {
        setTimeout(() => setShowTour(true), 400)
      }
    } catch {
      // localStorage unavailable -- skip tour
    }
  }, [])

  const alertCount = useMemo(
    () => alerts.filter((a) => !a.acknowledged).length,
    [],
  )
  const alertSeverity = useMemo(() => getAlertSeverity(alerts), [])

  const activePanel = useMemo(() => {
    switch (activeTab) {
      case 'fleet':
        return <FleetOverviewPanel key="fleet" />
      case 'maintenance':
        return <MaintenanceIntelPanel key="maintenance" />
      case 'procurement':
        return <ProcurementOpsPanel key="procurement" />
      case 'cost':
        return <CostAnalysisPanel key="cost" />
      case 'mel':
        return <MELTracker key="mel" />
      case 'compliance':
        return <ADComplianceBoard key="compliance" />
      case 'dispatch':
        return <DispatchReliability key="dispatch" />
      case 'aog':
        return <AOGTimeline key="aog" />
      case 'inventory-map':
        return <MultiStationInventory key="inventory-map" />
      default:
        return <FleetOverviewPanel key="fleet" />
    }
  }, [activeTab])

  // --- Boot Sequence ---
  if (appState === 'boot') {
    return <BootSequence onComplete={handleBootComplete} />
  }

  // --- Dashboard ---
  return (
    <>
      {showTour && <GuidedTour onComplete={() => setShowTour(false)} />}
      <BridgeShell
        nav={
          <NavConsole
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTowerToggle={() => setTowerOpen((prev) => !prev)}
            towerOpen={towerOpen}
          />
        }
        towerPanel={<TowerSidebar />}
        towerOpen={towerOpen}
        statusBar={<StatusBar alertCount={alertCount} alertSeverity={alertSeverity} />}
      >
        <LazyMotion features={domAnimation} strict>
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={PANEL_FADE.initial}
              animate={PANEL_FADE.animate}
              exit={PANEL_FADE.exit}
              transition={PANEL_FADE.transition}
              className="h-full w-full overflow-auto p-4"
            >
              {activePanel}
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </BridgeShell>
    </>
  )
}
