'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles, ShieldCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface TutorialStep {
  step: number
  title: string
  subtitle: string
  content: string
  visual: React.ReactNode
}

export function InteractiveTutorial({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
      if (e.key === 'ArrowLeft' && currentStep > 0) setCurrentStep((s) => s - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep, onClose])

  if (!isOpen) return null

  const steps: TutorialStep[] = [
    {
      step: 1,
      title: 'What is GhostFilter?',
      subtitle: 'Transparent Hiring Risk Scanner',
      content: 'GhostFilter is a rules-based diagnostic tool that scans job postings to evaluate ghost role indicators, scam risks, and posting quality without sending your data to external servers.',
      visual: (
        <div className="p-6 rounded-lg border border-accent/30 bg-card/90 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-mono">
            <ShieldCheck size={24} />
          </div>
          <p className="font-mono text-xs text-accent uppercase tracking-widest">100% Client-Side Evaluation</p>
          <p className="text-xs text-muted-foreground">Your inputs stay private in your browser DOM.</p>
        </div>
      ),
    },
    {
      step: 2,
      title: 'Add the Job Posting',
      subtitle: 'URL or Full Description Text',
      content: 'Simply paste the job listing URL or full description text. You can also provide optional supporting details such as posting age, platform, and salary.',
      visual: (
        <div className="p-5 rounded-lg border border-border bg-card/90 space-y-2 font-mono text-xs">
          <div className="p-2.5 rounded bg-muted/40 border border-border text-muted-foreground">
            https://linkedin.com/jobs/view/123456789...
          </div>
          <div className="p-3 rounded bg-muted/40 border border-border text-muted-foreground/80 text-[11px] h-20 overflow-hidden">
            Paste full job description text here... We automatically scan for responsibilities, requirements, compensation, and contact channels.
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: 'Ghost Risk Score (0 - 100)',
      subtitle: 'Unapproved Headcount & Evergreen Detector',
      content: 'Evaluates reposting patterns, stale posting age (>60 days), and talent pool phrasing. It measures warning signs—NOT definitive proof that a job is fake.',
      visual: (
        <div className="p-5 rounded-lg border border-amber-500/30 bg-amber-950/10 text-center space-y-2">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">GHOST RISK SCORE</p>
          <p className="font-mono text-4xl text-amber-400 font-semibold">68 <span className="text-xs text-muted-foreground">/ 100</span></p>
          <p className="text-xs text-muted-foreground">High warning signs from repeated reposting and stale active age.</p>
        </div>
      ),
    },
    {
      step: 4,
      title: 'Scam Risk Score (0 - 100)',
      subtitle: 'Fraud & Financial Protection',
      content: 'Independent score detecting payment demands (application fees, equipment deposits), fake check schemes, Telegram/WhatsApp-only recruitment, and identity theft risks.',
      visual: (
        <div className="p-5 rounded-lg border border-red-500/30 bg-red-950/10 text-center space-y-2">
          <div className="flex justify-center"><AlertTriangle className="text-red-400" size={20} /></div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">SCAM RISK SCORE</p>
          <p className="font-mono text-4xl text-red-400 font-semibold">75 <span className="text-xs text-muted-foreground">/ 100</span></p>
          <p className="text-xs text-muted-foreground">Flagged: Upfront equipment fee demand + Telegram contact.</p>
        </div>
      ),
    },
    {
      step: 5,
      title: 'Job Quality Score (0 - 100)',
      subtitle: 'Posting Completeness & Detail',
      content: 'Measures how complete the post is (title clarity, duties, skills, salary transparency). A poorly written job is NOT automatically a fake job.',
      visual: (
        <div className="p-5 rounded-lg border border-teal-500/30 bg-teal-950/10 text-center space-y-2">
          <div className="flex justify-center"><CheckCircle className="text-teal-400" size={20} /></div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">JOB QUALITY SCORE</p>
          <p className="font-mono text-4xl text-teal-400 font-semibold">82 <span className="text-xs text-muted-foreground">/ 100</span></p>
          <p className="text-xs text-muted-foreground">Clear duties, explicit prerequisites, disclosed compensation.</p>
        </div>
      ),
    },
    {
      step: 6,
      title: 'Read the Evidence & Verdict',
      subtitle: 'Transparent Evidence Classification',
      content: 'Review Warning Signs, Positive Evidence, and Unverified Information. Missing information carries ZERO score penalty and is marked as "Unable to Verify".',
      visual: (
        <div className="p-4 rounded-lg border border-border bg-card/90 space-y-2 text-xs">
          <div className="p-2 rounded bg-amber-400/10 text-amber-400 font-mono text-[10px]">
            ⚠️ REPOSTED LISTING (+30 RISK)
          </div>
          <div className="p-2 rounded bg-teal-400/10 text-teal-400 font-mono text-[10px]">
            ✓ OFFICIAL ATS APPLICATION ROUTE
          </div>
          <div className="p-2 rounded bg-muted/40 text-muted-foreground font-mono text-[10px]">
            ? SALARY UNKNOWN (ZERO PENALTY)
          </div>
        </div>
      ),
    },
    {
      step: 7,
      title: 'Track Application Outcomes',
      subtitle: 'Personal Application History',
      content: 'Save jobs to your local history dataset and track statuses (Applied, Interviewing, Rejected, Offer, Suspected Scam) over time.',
      visual: (
        <div className="p-5 rounded-lg border border-border bg-card/90 space-y-2 text-center">
          <Clock className="mx-auto text-accent" size={20} />
          <p className="font-mono text-xs text-foreground">11 Outcome Statuses</p>
          <p className="text-xs text-muted-foreground">Track interviews, recruiter responses, and application history locally.</p>
        </div>
      ),
    },
  ]

  const active = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in-scale">
      <div className="relative w-full max-w-xl rounded-2xl border border-accent/30 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header & Controls */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              PRODUCT WALKTHROUGH // STEP {active.step} OF {steps.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close tutorial"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {active.title}
            </h2>
            <p className="font-mono text-xs text-accent mt-0.5">{active.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {active.content}
          </p>

          <div className="py-2">
            {active.visual}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={14} /> BACK
          </button>

          {/* Progress Indicator Dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-accent' : 'w-2 bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Go to step ${idx + 1}`}
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
              onClick={onClose}
              className="btn-hover-lift flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-bold tracking-wider text-accent-foreground"
            >
              START USING GHOSTFILTER <ShieldCheck size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
