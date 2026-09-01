import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export function SiteHeader() { 
  return (
    <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <Link href="/" className="flex items-center gap-3 font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-foreground transition-colors hover:text-accent group">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 transition-transform group-hover:scale-110">
            <Image src="/hero.png" alt="GhostFilter Logo" fill className="object-contain drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
          </div>
          <span className="tracking-[0.18em]">GHOSTFILTER</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-[11px] tracking-[0.15em] text-muted-foreground">
          <Link href="/check" className="px-2 py-1.5 transition-colors hover:text-accent font-medium">CHECK JOB</Link>
          <Link href="/history" className="px-2 py-1.5 transition-colors hover:text-accent font-medium">HISTORY</Link>
          <Link href="/privacy" className="px-2 py-1.5 transition-colors hover:text-accent font-medium hidden sm:block">PRIVACY</Link>
        </nav>
      </div>
    </header>
  ) 
}

export function SiteFooter() { 
  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70">
          GHOSTFILTER // HEURISTIC DIAGNOSTIC v1.1
        </span>
        <div className="flex gap-6 font-mono text-[10px] tracking-wider">
          <Link href="/privacy" className="hover:text-accent transition-colors">PRIVACY POLICY</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition-colors">
            OPEN SOURCE <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </footer>
  ) 
}

export function Shell({ children }: { children: React.ReactNode }) { 
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  ) 
}
