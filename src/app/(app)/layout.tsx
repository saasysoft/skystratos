'use client'

import { type ReactNode, useEffect } from 'react'
import { AuthProvider } from '@/lib/auth/pin-context'
import { I18nProvider } from '@/lib/i18n/context'
import { DashboardFilterProvider } from '@/lib/data/dashboard-filter-context'
import { HUDErrorBoundary } from '@/components/layout/ErrorBoundary'

export default function AppLayout({ children }: { children: ReactNode }) {
  // Lock body scroll for single-screen dashboard HUD
  useEffect(() => {
    document.body.classList.add('dashboard-lock')
    return () => document.body.classList.remove('dashboard-lock')
  }, [])

  return (
    <>
      <HUDErrorBoundary>
        <I18nProvider>
          <AuthProvider>
            <DashboardFilterProvider>
              {children}
            </DashboardFilterProvider>
          </AuthProvider>
        </I18nProvider>
      </HUDErrorBoundary>
    </>
  )
}
