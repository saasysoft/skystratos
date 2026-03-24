import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skystratos.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/sign-in', '/api/'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
