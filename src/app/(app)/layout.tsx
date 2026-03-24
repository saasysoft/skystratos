'use client'

import { type ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth/pin-context'
import { I18nProvider } from '@/lib/i18n/context'
import { DashboardFilterProvider } from '@/lib/data/dashboard-filter-context'
import { HUDErrorBoundary } from '@/components/layout/ErrorBoundary'

export default function AppLayout({ children }: { children: ReactNode }) {
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
