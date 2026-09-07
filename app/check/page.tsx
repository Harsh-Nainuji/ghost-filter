'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Check, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Shell } from '@/components/site-shell'
import { ScoreOverview } from '@/components/score-overview'
import { EvidenceReport } from '@/components/evidence-report'
import { InteractiveTutorial } from '@/components/interactive-tutorial'
import { evaluateJobPosting } from '@/lib/engine'
import { saveJob } from '@/lib/storage'
import type { ScoreBreakdown, JobFormInput, StoredJob } from '@/types'

const initialForm: JobFormInput = {
  jobUrl: '',
  jobTitle: '',
  companyName: '',
  platform: 'linkedin',
  postingAge: 'unknown',
  salaryMentioned: 'unknown',
  applicationMethod: [],
  reposted: 'not-sure',
  companySize: 'unknown',
  description: '',
  contactInfo: '',
}

export default function CheckPage() {
  const [form, setForm] = useState<JobFormInput>(initialForm)
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null)
  const [saved, setSaved] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStep, setScanStep] = useState('PARSING TEXT & METADATA...')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const update = (key: keyof JobFormInput, value: any) => setForm((current) => ({ ...current, [key]: value }))

  const runAnalysis = () => {
    // Requires either description or job title or URL
    if (!form.description.trim() && !form.jobTitle.trim() && !form.jobUrl?.trim()) return

    setIsAnalyzing(true)
    setBreakdown(null)
    setSaved(false)
    setScanProgress(20)
    setScanStep('PARSING JOB DESCRIPTION & STRUCTURE...')

    setTimeout(() => {
      setScanProgress(60)
      setScanStep('EVALUATING GHOST, SCAM & QUALITY SIGNALS...')
    }, 450)

    setTimeout(() => {
      setScanProgress(90)
      setScanStep('GENERATING PLAIN-ENGLISH VERDICT...')
    }, 900)

    setTimeout(() => {
      setScanProgress(100)
      const res = evaluateJobPosting(form)
      setBreakdown(res)
      setIsAnalyzing(false)
    }, 1200)
  }

  const handleSave = () => {
    if (!breakdown) return
    const job: StoredJob = {
      id: crypto.randomUUID(),
      jobTitle: form.jobTitle.trim() || 'Analyzed Job Requisition',
      companyName: form.companyName.trim() || 'Unspecified Company',
      platform: form.platform,
      ghostRisk: breakdown.ghostRisk,
      scamRisk: breakdown.scamRisk,
      jobQuality: breakdown.jobQuality,
      verdict: breakdown.verdict,
      evidence: breakdown.allEvidence,
      status: 'saved',
      checkedAt: new Date().toISOString(),
      formInput: form,
      url: form.jobUrl,
    }
    saveJob(job)
    setSaved(true)
  }

  const isFormValid = form.description.trim().length > 10 || form.jobTitle.trim().length > 2 || (form.jobUrl && form.jobUrl.trim().length > 5)

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <InteractiveTutorial 
          isOpen={showTutorial} 
          onClose={() => setShowTutorial(false)} 
          onLoadSample={(sampleText) => update('description', sampleText)}
        />

        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft size={12} /> BACK TO DASHBOARD
          </Link>

          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase border border-border bg-card/60 px-3 py-1.5 rounded text-accent hover:border-accent/40 transition-colors"
          >
            <Sparkles size={12} />
            <span>GUIDED TOUR</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="mb-10 border-b border-border pb-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
            <ShieldCheck size={14} /> GHOSTFILTER ENGINE V2.0
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Job Posting Risk & Quality Scan
          </h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
            Paste the job posting description or URL below. The V2 engine independently calculates Ghost Risk, Scam Risk, and Job Quality with zero penalty for missing parameters.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Form Input Section */}
          <section className="interactive-card rounded-xl border border-border bg-card p-5 sm:p-7 shadow-sm space-y-6">
            {/* Primary Input 1: Job Description */}
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Paste Job Description <span className="text-accent">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Paste full job description text here. Our text analyzer extracts duties, qualifications, salary ranges, and scam patterns automatically..."
                className="field min-h-44 resize-y text-xs leading-relaxed"
              />
            </div>

            {/* Primary Input 2: Job Listing URL */}
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Job Posting URL (Optional)
              </label>
              <input
                value={form.jobUrl || ''}
                onChange={(e) => update('jobUrl', e.target.value)}
                placeholder="https://linkedin.com/jobs/view/..."
                className="field text-xs"
              />
            </div>

            {/* Quick Context Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Job Title
                </label>
                <input
                  value={form.jobTitle}
                  onChange={(e) => update('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="field text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Company Name
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="field text-xs"
                />
              </div>
            </div>

            {/* Toggle Advanced Supporting Metadata */}
            <div className="border-t border-border/60 pt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
              >
                <SlidersHorizontal size={12} />
                <span>{showAdvanced ? 'HIDE SUPPORTING METADATA' : 'ADD SUPPORTING METADATA (OPTIONAL)'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 pt-2 animate-fade-in-scale">
                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                      Posting Platform
                    </label>
                    <select value={form.platform} onChange={(e) => update('platform', e.target.value)} className="field text-xs">
                      <option value="linkedin">LinkedIn</option>
                      <option value="indeed">Indeed</option>
                      <option value="naukri">Naukri</option>
                      <option value="company-website">Company Website</option>
                      <option value="other">Other Platform</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                      Days Active / Posting Age
                    </label>
                    <select value={form.postingAge} onChange={(e) => update('postingAge', e.target.value)} className="field text-xs">
                      <option value="unknown">Unknown / Not Sure (0 penalty)</option>
                      <option value="today">Posted Today</option>
                      <option value="this-week">Posted This Week</option>
                      <option value="two-to-four-weeks">2 to 4 Weeks Ago</option>
                      <option value="one-to-two-months">1 to 2 Months Ago</option>
                      <option value="over-two-months">Over 2 Months Ago</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                      Is Salary Disclosed?
                    </label>
                    <select value={form.salaryMentioned} onChange={(e) => update('salaryMentioned', e.target.value)} className="field text-xs">
                      <option value="unknown">Unspecified (0 penalty)</option>
                      <option value="yes">Yes - Salary Mentioned</option>
                      <option value="no">No - Salary Omitted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                      Is This Reposted?
                    </label>
                    <select value={form.reposted} onChange={(e) => update('reposted', e.target.value)} className="field text-xs">
                      <option value="not-sure">Unsure / Unverified (0 penalty)</option>
                      <option value="no">No - Original Post</option>
                      <option value="yes">Yes - Reposted Listing</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={runAnalysis}
              disabled={!isFormValid || isAnalyzing}
              className="btn-hover-lift w-full min-h-[48px] rounded-lg bg-accent px-4 py-3.5 font-mono text-xs font-bold tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              {isAnalyzing ? 'RUNNING DIAGNOSTIC SCAN...' : 'LAUNCH GHOST & SCAM CHECK'}
            </button>
          </section>

          {/* Results Output Section */}
          {isAnalyzing ? (
            <section className="interactive-card rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-center items-center min-h-[480px]">
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-accent animate-pulse">
                  ⚡
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2 text-center">{scanStep}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-accent transition-all ease-out duration-300 rounded-full" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest mt-4">V2 DIAGNOSTIC PIPELINE</p>
              </div>
            </section>
          ) : breakdown ? (
            <section className="animate-fade-in-scale space-y-6">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  SCAN COMPLETE // 3 SCORES COMPUTED
                </span>

                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-1.5 font-mono text-[10px] tracking-widest transition-colors min-h-[36px] px-3 rounded border ${
                    saved ? 'text-teal-400 border-teal-500/40 bg-teal-400/10' : 'text-accent border-accent/40 hover:bg-accent/10'
                  }`}
                >
                  {saved ? <Check size={13} /> : <Save size={13} />}
                  {saved ? 'SAVED TO HISTORY' : 'SAVE TO HISTORY'}
                </button>
              </div>

              {/* 3 Independent Scores Overview */}
              <ScoreOverview 
                ghostRisk={breakdown.ghostRisk} 
                scamRisk={breakdown.scamRisk} 
                jobQuality={breakdown.jobQuality} 
              />

              {/* Evidence & Verdict Report */}
              <EvidenceReport breakdown={breakdown} />
            </section>
          ) : (
            <section className="flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border font-mono text-lg text-muted-foreground bg-muted/30">
                ?
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">SYSTEM READY</p>
              <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Paste the job description or listing details on the left and run the scan to evaluate Ghost Risk, Scam Risk, and Job Quality.
              </p>
            </section>
          )}
        </div>
      </main>
    </Shell>
  )
}
