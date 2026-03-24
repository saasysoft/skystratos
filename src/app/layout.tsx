import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkyStratos Fleet Intelligence',
  description: 'Real-time airline fleet operations dashboard with AI-powered fleet intelligence, ADS-B tracking, and operational analytics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${shareTechMono.variable}`}>
      <body className="font-sans bg-hud-bg text-hud-text-primary antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
