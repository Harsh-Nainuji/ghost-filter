'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, Play, ArrowRight, CheckCircle2, AlertTriangle, Eye, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

interface InteractiveTutorialProps {
  isOpen: boolean
  onClose: () => void
  onLoadSample?: (sampleText: string) => void
}

export function InteractiveTutorial({ isOpen, onClose, onLoadSample }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight' && currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
      if (e.key === 'ArrowLeft' && currentStep > 0) setCurrentStep((s) => s - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep])

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ghostfilter_tutorial_seen', 'true')
    }
    onClose()
  }, [onClose])

  if (!isOpen) return null

  const steps = [
    {
      step: 1,
      badge: 'WELCOME TO GHOSTFILTER V2',
      title: 'Transparent Hiring Risk Scanner',
      description: 'GhostFilter evaluates job postings to calculate 3 independent scores: Ghost Risk, Scam Risk, and Job Quality. All evaluation runs 100% locally in your browser.',
      targetHighlight: 'Welcome Section',
      interactiveAction: null,
      visual: (
        <div className="grid gap-3 sm:grid-cols-3 font-mono text-[10px]">
          <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-950/20 text-amber-400 flex flex-col items-center text-center">
            <Eye size={16} className="mb-1" />
            <span className="font-bold">GHOST RISK</span>
            <span className="text-[9px] text-muted-foreground mt-1">Unapproved Headcount & Aging Posts</span>
          </div>
          <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/20 text-red-400 flex flex-col items-center text-center">
            <ShieldAlert size={16} className="mb-1" />
            <span className="font-bold">SCAM RISK</span>
            <span className="text-[9px] text-muted-foreground mt-1">Fees, Fake Checks & Telegram Traps</span>
          </div>
          <div className="p-3 rounded-lg border border-teal-500/40 bg-teal-950/20 text-teal-400 flex flex-col items-center text-center">
            <CheckCircle2 size={16} className="mb-1" />
            <span className="font-bold">JOB QUALITY</span>
            <span className="text-[9px] text-muted-foreground mt-1">Posting Completeness & Duties</span>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      badge: 'INTERACTIVE DEMO INPUT',
      title: 'Try Loading a Sample Job Description',
      description: 'You can paste full job text or job URLs. Click the demo button below to auto-fill a realistic job listing and see the diagnostic parser in action!',
      targetHighlight: 'Job Description Field',
      interactiveAction: onLoadSample ? (
        <button
          onClick={() => {
            onLoadSample(
              `Senior React Engineer at TechCorp\nResponsibilities:\n- Build high performance web applications in React and TypeScript.\n- Optimize bundle sizes and maintain component library.\nRequirements:\n- 4+ years frontend development experience.\nSalary: $140,000 - $170,000 / year.\nApply directly on company website.`
            )
            setCurrentStep(2)
          }}
          className="btn-hover-lift w-full py-2.5 rounded border border-accent bg-accent/15 font-mono text-xs font-bold text-accent flex items-center justify-center gap-2 hover:bg-accent/25 transition-all"
        >
          <Play size={13} /> LOAD REALISTIC DEMO JOB TEXT
        </button>
      ) : null,
      visual: (
        <div className="p-3.5 rounded-lg border border-border bg-card/90 space-y-2 font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between text-[10px] text-accent">
            <span>INPUT: JOB DESCRIPTION TEXT</span>
            <span>AUTO-PARSING ACTIVE</span>
          </div>
          <p className="line-clamp-2 text-foreground/80">
            "Senior React Engineer... Responsibilities: Build web applications... Salary: $140,000 - $170,000..."
          </p>
        </div>
      ),
    },
    {
      step: 3,
      badge: 'SCORE #1: GHOST RISK',
      title: 'Ghost Risk (0 to 100)',
      description: 'Measures reposting loops, stale posting age (>60 days), and talent-pool phrases. High score means elevated warning signs—NOT definitive proof that a company is fake.',
      targetHighlight: 'Ghost Risk Gauge',
      interactiveAction: null,
      visual: (
        <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-950/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-amber-400">
            <span>GHOST RISK INDEX</span>
            <span className="font-bold text-lg">65 / 100</span>
          </div>
          <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 w-[65%]" />
          </div>
          <p className="text-[11px] text-muted-foreground">Flagged: Posted 65 days ago + marked as reposted listing.</p>
        </div>
      ),
    },
    {
      step: 4,
      badge: 'SCORE #2: SCAM RISK',
      title: 'Scam Risk (0 to 100)',
      description: 'Completely independent score detecting payment demands (application fees, equipment purchase deposits), fake check money transfers, and Telegram/WhatsApp-only channels.',
      targetHighlight: 'Scam Risk Gauge',
      interactiveAction: null,
      visual: (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-950/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-red-400">
            <span>SCAM RISK INDEX</span>
            <span className="font-bold text-lg">75 / 100</span>
          </div>
          <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 w-[75%]" />
          </div>
          <p className="text-[11px] text-muted-foreground">Flagged: Upfront equipment fee demand + Telegram recruiter contact.</p>
        </div>
      ),
    },
    {
      step: 5,
      badge: 'SCORE #3: JOB QUALITY',
      title: 'Job Quality (0 to 100)',
      description: 'Measures posting completeness (role duties, explicit skills, salary transparency). A poorly written job is NOT automatically a fake job.',
      targetHighlight: 'Job Quality Gauge',
      interactiveAction: null,
      visual: (
        <div className="p-4 rounded-lg border border-teal-500/30 bg-teal-950/15 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-teal-400">
            <span>JOB QUALITY INDEX</span>
            <span className="font-bold text-lg">85 / 100</span>
          </div>
          <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 w-[85%]" />
          </div>
          <p className="text-[11px] text-muted-foreground">Clear responsibilities, explicit prerequisites, salary range stated.</p>
        </div>
      ),
    },
    {
      step: 6,
      badge: '3-STATE EVIDENCE SYSTEM',
      title: 'Read Warning Signs & Positive Evidence',
      description: 'Review Strongest Warning Signs, Positive Evidence, and Unverified Signals. Unprovided parameters carry ZERO score penalty and are marked under "Unable to Verify".',
      targetHighlight: 'Evidence Report Section',
      interactiveAction: null,
      visual: (
        <div className="space-y-2 font-mono text-[10px]">
          <div className="p-2.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-between">
            <span>⚠️ REPOSTED LISTING (+30 RISK)</span>
            <span>WARNING</span>
          </div>
          <div className="p-2.5 rounded bg-teal-400/10 border border-teal-400/20 text-teal-400 flex items-center justify-between">
            <span>✓ OFFICIAL ATS APPLICATION ROUTE</span>
            <span>POSITIVE</span>
          </div>
          <div className="p-2.5 rounded bg-muted/40 border border-border text-muted-foreground flex items-center justify-between">
            <span>? SALARY UNKNOWN (ZERO PENALTY)</span>
            <span>UNVERIFIED</span>
          </div>
        </div>
      ),
    },
    {
      step: 7,
      badge: 'APPLICATION OUTCOME TRACKER',
      title: 'Track Your Applications Locally',
      description: 'Save jobs to your local application dataset and update outcome statuses (Applied, Interviewing, Rejected, Offer, Suspected Scam) over time with personal recruiter notes.',
      targetHighlight: 'Outcome History',
      interactiveAction: (
        <Link
          href="/check"
          onClick={handleClose}
          className="btn-hover-lift w-full py-2.5 rounded bg-accent font-mono text-xs font-bold text-accent-foreground flex items-center justify-center gap-2"
        >
          START SCANNING NOW <ArrowRight size={14} />
        </Link>
      ),
      visual: (
        <div className="p-4 rounded-lg border border-border bg-card/90 text-center space-y-2">
          <ShieldCheck className="mx-auto text-accent" size={24} />
          <p className="font-mono text-xs text-foreground">11 Outcome Statuses & Personal Notes</p>
          <p className="text-xs text-muted-foreground">Stored 100% locally in your browser LocalStorage.</p>
        </div>
      ),
    },
  ]

  const active = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fade-in-scale">
      {/* High-Tech Interactive Tour Card */}
      <div className="relative w-full max-w-xl rounded-2xl border border-accent/40 bg-card p-6 sm:p-8 shadow-2xl space-y-5 overflow-hidden">
        {/* Glowing Spotlight Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-teal-400 to-amber-400" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-accent font-semibold flex items-center gap-1.5">
              <Sparkles size={12} /> {active.badge} // STEP {active.step} OF {steps.length}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {active.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {active.description}
          </p>
        </div>

        {/* Visual Feature Display */}
        <div className="py-1">
          {active.visual}
        </div>

        {/* Interactive Action Button (e.g. Try Demo Input) */}
        {active.interactiveAction && (
          <div className="pt-1">
            {active.interactiveAction}
          </div>
        )}

        {/* Footer Navigation & Progress Line */}
        <div className="flex items-center justify-between pt-4 border-t border-border/80">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={14} /> PREV
          </button>

          {/* Step Dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-accent' : 'w-2 bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              className="btn-hover-lift flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wider text-accent-foreground"
            >
              NEXT <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="btn-hover-lift flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wider text-accent-foreground"
            >
              COMPLETE TOUR <ShieldCheck size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
