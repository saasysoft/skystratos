import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skystratos.com';

export const LANDING_METADATA: Metadata = {
  title: {
    template: '%s | SkyStratos',
    default: 'SkyStratos — Airline Fleet Operations Intelligence',
  },
  description:
    'Real-time fleet visibility, AI-powered maintenance intelligence, and cost analytics for airline operations teams. From AOG response to AD compliance — one platform.',
  keywords: [
    'airline fleet management',
    'fleet operations intelligence',
    'aircraft maintenance tracking',
    'AOG management',
    'dispatch reliability',
    'airline operations software',
    'fleet visibility',
    'aviation analytics',
    'AD compliance tracking',
    'MEL tracking',
    'MRO analytics',
    'SkyStratos',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'SkyStratos',
    title: 'SkyStratos — Airline Fleet Operations Intelligence',
    description:
      'Real-time fleet visibility, AI-powered maintenance intelligence, and cost analytics for airline operations teams.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SkyStratos — Airline Fleet Operations Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkyStratos — Airline Fleet Operations Intelligence',
    description:
      'Real-time fleet visibility, AI-powered maintenance intelligence, and cost analytics for airline operations teams.',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const JSON_LD_SOFTWARE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SkyStratos',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Airline fleet operations intelligence platform providing real-time fleet visibility, AI-powered maintenance intelligence, and cost analytics.',
  url: siteUrl,
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    availability: 'https://schema.org/OnlineOnly',
    offerCount: 3,
  },
  featureList: [
    'Real-time fleet map & radar',
    'AI-powered maintenance intelligence',
    'Cost & operations analytics',
    'Tower AI Co-Pilot',
    'AD compliance tracking',
    'MEL management',
    'Multi-station inventory',
    'Dispatch reliability metrics',
  ],
};
