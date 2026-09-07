'use client'

import Link from 'next/link'
import { ArrowRight, Search, ShieldCheck, Lock, Sparkles, AlertTriangle, CheckCircle2, Eye, ShieldAlert } from 'lucide-react'
import { Shell } from '@/components/site-shell'
import { useEffect, useState } from 'react'
import { InteractiveHero } from '@/components/interactive-hero'
import { InteractiveTutorial } from '@/components/interactive-tutorial'

export default function Page() {
  const [totalChecks, setTotalChecks] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    const checks = localStorage.getItem('ghostfilter_total_checks')
    if (checks) {
      setTotalChecks(parseInt(checks, 10))
    }
  }, [])

  return (
    <Shell>
      <main className="relative overflow-hidden">
        {/* Interactive Onboarding Tutorial Modal */}
        <InteractiveTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

        {/* Atmospheric Background Accent */}
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
                ANALYSIS ENGINE V2.0 // 3 INDEPENDENT SCORES
              </div>
              
              <h1 
                className="animate-fade-in-up-stagger text-balance text-3xl font-semibold tracking-tight sm:text-5xl leading-tight"
                style={{ animationDelay: '80ms' }}
              >
                Analyze job postings for <span className="text-accent font-normal">ghost roles, scam risks & posting quality.</span>
              </h1>

              <p 
                className="animate-fade-in-up-stagger mt-5 max-w-xl text-pretty text-xs sm:text-base leading-relaxed text-muted-foreground"
                style={{ animationDelay: '160ms' }}
              >
                GhostFilter is a transparent hiring-risk diagnostic tool. It evaluates job metadata and description text to generate 3 independent scores with zero artificial penalties for unverified information.
              </p>

              <div 
                className="animate-fade-in-up-stagger mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
                style={{ animationDelay: '240ms' }}
              >
                <Link 
                  href="/check" 
                  className="btn-hover-lift flex h-12 items-center gap-3 rounded-lg bg-accent px-7 font-mono text-xs font-bold tracking-[0.15em] text-accent-foreground transition-all hover:bg-accent/90"
                >
                  INITIALIZE CHECK <ArrowRight size={14} />
                </Link>

                <button
                  onClick={() => setShowTutorial(true)}
                  className="flex h-12 items-center gap-2 rounded-lg border border-border bg-card/60 px-5 font-mono text-xs font-medium tracking-wider text-foreground hover:border-accent/40 transition-colors"
                >
                  <Sparkles size={14} className="text-accent" />
                  <span>PRODUCT TUTORIAL</span>
                </button>
              </div>

              <div 
                className="animate-fade-in-up-stagger mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80"
                style={{ animationDelay: '300ms' }}
              >
                <Lock size={12} className="text-accent/70" /> 
                <span>100% Client-Side Evaluation • No Backend Data Collection</span>
              </div>
            </div>
            
            <div className="animate-fade-in-up-stagger" style={{ animationDelay: '320ms' }}>
              <InteractiveHero totalChecks={totalChecks} />
            </div>
          </div>
        </section>

        {/* 3 Independent Scores Strip */}
        <section className="border-y border-border/80 bg-muted/10 animate-fade-in-up-stagger" style={{ animationDelay: '400ms' }}>
          <div className="mx-auto grid max-w-6xl divide-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 sm:px-8 py-8 flex flex-col items-start space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                <Eye size={14} /> GHOST RISK
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Detects reposting loops, aging postings (&gt;60 days), and talent-pool phrases indicating unapproved headcount.
              </p>
            </div>

            <div className="px-6 sm:px-8 py-8 flex flex-col items-start space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red-400 font-semibold">
                <ShieldAlert size={14} /> SCAM RISK
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Identifies financial demands, equipment deposit schemes, Telegram/WhatsApp recruitment, and fake check traps.
              </p>
            </div>

            <div className="px-6 sm:px-8 py-8 flex flex-col items-start space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-teal-400 font-semibold">
                <CheckCircle2 size={14} /> JOB QUALITY
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Evaluates role completeness, concrete duties, salary transparency, and realistic qualifications.
              </p>
            </div>
          </div>
        </section>

        {/* Analytical Pipeline Architecture */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="animate-fade-in-up-stagger mb-12 sm:mb-16 max-w-2xl" style={{ animationDelay: '480ms' }}>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent mb-3">V2 Architecture</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Transparent diagnostic pipeline</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              GhostFilter avoids black-box AI scores. Every score impact is explicitly cited, inspectable, and categorized under a strict 3-state evidence system.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-xl" style={{ animationDelay: '560ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <Search className="text-accent" size={16} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">01. Text & Metadata Ingestion</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">
                Paste job description text or URL. The V2 parser extracts responsibilities, prerequisites, salary strings, and contact channels.
              </p>
            </div>
            
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-lg" style={{ animationDelay: '640ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <ShieldCheck className="text-accent" size={16} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">02. 3-State Heuristic Evaluation</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">
                Evidence is classified as Positive, Negative, or Unknown. Unknown signals carry zero artificial penalty.
              </p>
            </div>
            
            <div className="animate-fade-in-up-stagger interactive-card flex flex-col border border-border bg-card p-6 sm:p-8 rounded-lg" style={{ animationDelay: '720ms' }}>
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/30">
                <AlertTriangle className="text-accent" size={16} />
              </div>
              <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase mb-2.5 text-foreground">03. Evidence & Outcome Tracking</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground flex-1">
                Receive a plain-English verdict, review research citations, and track application outcomes locally over time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Shell>
  )
}
