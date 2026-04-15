import { type ReactNode } from 'react'
import { LANDING_METADATA } from '@/lib/config/landing-seo'
import { I18nProvider } from '@/lib/i18n/context'

export const metadata = LANDING_METADATA

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>
}
