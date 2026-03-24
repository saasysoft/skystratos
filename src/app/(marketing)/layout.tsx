import { type ReactNode } from 'react'
import { LANDING_METADATA } from '@/lib/config/landing-seo'

export const metadata = LANDING_METADATA

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
