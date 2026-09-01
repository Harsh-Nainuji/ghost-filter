'use client'

import Link from 'next/link'
import { ArrowRight, Search, ShieldCheck, Clock, Lock } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { useEffect, useState } from 'react'
import { InteractiveHero } from '@/components/interactive-hero'

export default function Page() {
  const [totalChecks, setTotalChecks] = useState(0)

  useEffect(() => {
    const checks = localStorage.getItem('ghostfilter_total_checks')
    if (checks) {
      setTotalChecks(parseInt(checks, 10))
    }
  }, [])

  return (
    <Shell>
      <main className="relative overflow-hidden">
        {/* Atmospheric Subtle Background Blur Accent */}
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-accent/5 blur-[120px] rounded-full z-0" />

        {/* Hero Section */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div 
                className="animate-fade-in-up-stagger mb-6 flex items-center gap-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent" 
                style={{ animationDelay: '0ms' }}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-accent/10 border border-accent/20">
                  <ShieldCheck size={10} />
                </span> 
                ANALYSIS ENGINE V1.1
              </div>
              <h1 
                className="animate-fade-in-up-stagger text-balance text-3xl font-semibold tracking-tight sm:text-5xl leading-tight"
                style={{ animationDelay: '80ms' }}
              >
                Determine if a job posting is <span className="text-accent font-normal">real or fake.</span>
              </h1>
              <p 
                className="animate-fade-in-up-stagger mt-5 max-w-xl text-pretty text-xs sm:text-base leading-relaxed text-muted-foreground"
                style={{ animationDelay: '160ms' }}
              >
                Many companies maintain active job listings with no approved headcount. Our rules-based engine scans the metadata of any job posting to calculate the probability of it being a ghost job.
              </p>
              <div 
                className="animate-fade-in-up-stagger mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
                style={{ animationDelay: '240ms' }}
              >
                <Link 
                  href="/check" 
                  className="btn-hover-lift flex h-12 items-center gap-3 rounded-[6px] bg-accent px-7 font-mono text-xs font-bold tracking-[0.15em] text-accent-foreground transition-all hover:bg-accent/90"
                >
                  INITIALIZE CHECK <ArrowRight size={14} />
                </Link>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
                  <Lock size={12} className="text-accent/70" /> 
                  <span>100% Client-Side Privacy</span>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-up-stagger" style={{ animationDelay: '320ms' }}>
              <InteractiveHero totalChecks={totalChecks} />
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-border/80 bg-muted/10 animate-fade-in-up-stagger" style={{ animationDelay: '400ms' }}>
          <div className="mx-auto grid max-w-6xl divide-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-start">
              <p className="font-mono text-2xl sm:text-3xl font-light text-foreground">08</p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Risk Signals</p>
            </div>
            <div className="px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-start">
              <p className="font-mono text-2xl sm:text-3xl font-light text-foreground">{totalChecks > 0 ? totalChecks.toLocaleString() : '1,200+'}</p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Total Analyses</p>
            </div>
            <div className="px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-start">
              <p className="font-mono text-2xl sm:text-3xl font-light text-foreground">100%</p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Local Execution</p>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="animate-fade-in-up-stagger mb-12 sm:mb-16 max-w-2xl" style={{ animationDelay: '480ms' }}>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent mb-3">Architecture</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Analytical pipeline</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">The GhostFilter scoring algorithm uses statistically verified hiring behaviors to identify systemic red flags in job postings.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-lg" style={{ animationDelay: '560ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <Search className="text-accent" size={15} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">01. Data Ingestion</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">Provide structured metadata such as posting age, platform, and application method. The engine requires basic boolean flags to start.</p>
            </div>
            
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-lg" style={{ animationDelay: '640ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <Clock className="text-accent" size={15} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">02. Heuristic Scan</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">The system cross-references the input data against known patterns of passive candidate pipelining and unapproved headcount.</p>
            </div>
            
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-lg" style={{ animationDelay: '720ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <ShieldCheck className="text-accent" size={15} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">03. Risk Output</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">A weighted Ghost Score (0-100) is generated alongside a granular breakdown of flagged signals and their associated research.</p>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  )
}
