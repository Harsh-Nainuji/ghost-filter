import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { GhostEnvironment } from '@/components/ghost-environment'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = { title: 'GhostFilter — See what text is really doing', description: 'A transparent text analyzer for hidden persuasion signals.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#0f0f0f', userScalable: false }

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
