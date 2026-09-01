import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { GhostEnvironment } from '@/components/ghost-environment'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = { 
  title: 'GhostFilter — Advanced Job Posting & Ghost Role Analysis Engine', 
  description: 'A transparent, privacy-first rules-based engine that scans job posting metadata to determine probability of ghost listings.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
}
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0a0c0c', userScalable: false }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0a0c0c] text-[#e5e5e5]">
      <body className={`${geist.variable} ${mono.variable} font-sans antialiased bg-[#0a0c0c] min-h-screen relative overflow-x-hidden`}>
        <GhostEnvironment />
        <div className="relative z-10">
          {children}
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
