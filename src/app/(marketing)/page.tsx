import { JSON_LD_SOFTWARE } from '@/lib/config/landing-seo'
import LandingPageClient from './_components/LandingPageClient'

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SOFTWARE) }}
      />
      <LandingPageClient />
    </>
  )
}
