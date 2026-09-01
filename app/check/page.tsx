'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Check } from 'lucide-react'
import Link from 'next/link'
import { Shell } from '@/components/site-shell'
import { ScoreMeter } from '@/components/score-meter'
import { SignalRow } from '@/components/signal-row'
import { calculateGhostScore } from '@/lib/algorithm'
import { saveJob } from '@/lib/storage'
import type { GhostScoreResult, JobFormInput, StoredJob } from '@/types'

const initial: JobFormInput = { jobTitle: '', companyName: '', platform: 'linkedin', postingAge: 'unknown', salaryMentioned: 'no', applicationMethod: [], reposted: 'not-sure', companySize: 'unknown', description: '' }
const labels = { platform: 'Platform', postingAge: 'Days Since Posted', applicationMethod: 'Application Method', companySize: 'Company Size' }
const options = { platform: [['linkedin','LinkedIn'],['indeed','Indeed'],['naukri','Naukri'],['company-website','Company website'],['other','Other']], postingAge: [['today','Today'],['this-week','This week'],['two-to-four-weeks','2 to 4 weeks'],['one-to-two-months','1 to 2 months'],['over-two-months','Over 2 months'],['unknown','Unknown']], applicationMethod: [['external-ats','External ATS'],['company-website','Company website'],['easy-apply','Easy Apply'],['email-only','Email only'],['no-clear-method','No clear method']], companySize: [['1-10','1-10 employees'],['11-50','11-50 employees'],['51-200','51-200 employees'],['201-1000','201-1000 employees'],['1000+','1000+ employees'],['unknown','Unknown']] }

export default function CheckPage() {
  const [form, setForm] = useState(initial)
  const [result, setResult] = useState<GhostScoreResult | null>(null)
  const [saved, setSaved] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStep, setScanStep] = useState('INITIALIZING SCAN...')

  const update = (key: keyof JobFormInput, value: any) => setForm((current) => ({ ...current, [key]: value }))
  
  const run = () => { 
    if (!form.jobTitle.trim() || !form.companyName.trim()) return
    setIsAnalyzing(true)
    setResult(null)
    setSaved(false)
    setScanProgress(15)
    setScanStep('INITIALIZING SCAN...')

    setTimeout(() => {
      setScanProgress(55)
      setScanStep('EVALUATING HEURISTIC SIGNALS...')
    }, 500)

    setTimeout(() => {
      setScanProgress(90)
      setScanStep('COMPUTING RISK INDEX...')
    }, 1100)

    setTimeout(() => {
      setScanProgress(100)
      const res = calculateGhostScore(form)
      setResult(res)
      setIsAnalyzing(false)
    }, 1500)
  }
  
  const save = () => { 
    if (!result) return
    const job: StoredJob = {
      id: crypto.randomUUID(),
      jobTitle: form.jobTitle,
      companyName: form.companyName,
      platform: form.platform,
      totalScore: result.totalScore,
      riskLevel: result.riskLevel,
      signals: result.signals,
      status: 'not-applied',
      checkedAt: new Date().toISOString(),
      formInput: form
    }
    saveJob(job)
    setSaved(true)
  }

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft size={12} /> BACK TO DASHBOARD
        </Link>
        <div className="mb-10 border-b border-border pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Analysis Engine v1.1</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">Job Verification Scan</h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">Provide the available metadata for the job posting below. The engine will evaluate the data against known ghost job heuristics to estimate legitimacy.</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <section className="interactive-card rounded-lg border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Job Title" required>
                <input value={form.jobTitle} onChange={(e) => update('jobTitle', e.target.value)} className="field" placeholder="e.g. Software Engineer" />
              </Field>
              <Field label="Company Name" required>
                <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="field" placeholder="e.g. Acme Corp" />
              </Field>
              <Field label={labels.platform}>
                <select value={form.platform} onChange={(e) => update('platform', e.target.value)} className="field">
                  {options.platform.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label={labels.postingAge}>
                <select value={form.postingAge} onChange={(e) => update('postingAge', e.target.value)} className="field">
                  {options.postingAge.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label={labels.companySize}>
                <select value={form.companySize} onChange={(e) => update('companySize', e.target.value)} className="field">
                  {options.companySize.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <ToggleMulti label={labels.applicationMethod} values={options.applicationMethod} selected={form.applicationMethod} onChange={(v) => update('applicationMethod', v)} />
              <Toggle label="Is salary mentioned?" value={form.salaryMentioned} values={['yes','no']} onChange={(v) => update('salaryMentioned', v)} />
              <Toggle label="Is this reposted?" value={form.reposted} values={['no','not-sure','yes']} onChange={(v) => update('reposted', v)} />
            </div>
            
            <div className="mt-6">
              <Field label="Job Description (optional but recommended)">
                <textarea 
                  value={form.description} 
                  onChange={(e) => update('description', e.target.value)} 
                  placeholder="Paste the full job description. We scan it for vague language and word count automatically." 
                  className="field min-h-36 resize-y leading-relaxed" 
                />
              </Field>
            </div>
            
            <button 
              onClick={run} 
              disabled={!form.jobTitle.trim() || !form.companyName.trim() || isAnalyzing}
              className="btn-hover-lift mt-8 w-full min-h-[48px] rounded-[6px] bg-accent px-4 py-3.5 font-mono text-xs font-bold tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'SCAN IN PROGRESS...' : 'RUN GHOST CHECK'}
            </button>
          </section>

          {isAnalyzing ? (
            <section className="interactive-card rounded-lg border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-center items-center min-h-[480px]">
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-accent animate-pulse-subtle">
                  ⚡
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">{scanStep}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-accent transition-all ease-out duration-300 rounded-full" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 tracking-widest mt-4">DIAGNOSTIC SCAN ACTIVE</p>
              </div>
            </section>
          ) : result ? (
            <section className="animate-fade-in-scale interactive-card rounded-lg border border-border bg-card p-5 sm:p-8 shadow-sm flex flex-col h-full">
              <div className="flex items-start justify-between border-b border-border pb-6 mb-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SYSTEM DIAGNOSTIC</p>
                  <p className="mt-1.5 text-lg sm:text-xl font-semibold">
                    {result.riskLevel === 'low' ? 'Low Risk Detected' : result.riskLevel === 'moderate' ? 'Moderate Risk Detected' : result.riskLevel === 'high' ? 'High Risk Detected' : 'Critical Risk Detected'}
                  </p>
                </div>
                <button 
                  onClick={save} 
                  disabled={saved}
                  className={`flex items-center gap-1.5 font-mono text-[10px] tracking-widest transition-colors min-h-[36px] px-2.5 rounded border border-border/40 ${saved ? 'text-teal-400 border-teal-500/30' : 'text-accent hover:border-accent/40'}`}
                >
                  {saved ? <Check size={13} /> : <Save size={13} />} 
                  {saved ? 'SAVED' : 'SAVE'}
                </button>
              </div>
              
              <div className="mb-8 flex justify-center">
                <ScoreMeter score={result.totalScore} signalsCount={result.signals.length} />
              </div>
              
              <div className="grid gap-0 flex-1 content-start border-t border-border pt-2">
                {result.signals.map((signal, idx) => (
                  <SignalRow key={signal.name} signal={signal} delay={idx * 60} />
                ))}
              </div>

              {showDisclaimer && (
                <div className="mt-6 bg-muted/40 border border-border/80 rounded-md p-4 flex gap-3 relative animate-fade-in-scale" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                  <button onClick={() => setShowDisclaimer(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-sm">&times;</button>
                  <p className="text-xs leading-relaxed text-muted-foreground/80 pr-4">
                    <strong>Disclaimer:</strong> This ghost score is a statistical heuristic. It estimates probability based on industry patterns and does not guarantee job post status.
                  </p>
                </div>
              )}
            </section>
          ) : (
            <section className="flex min-h-[480px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center bg-card/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border font-mono text-lg text-muted-foreground bg-muted/30">?</div>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">SYSTEM READY</p>
              <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-muted-foreground">Fill out the parameters and launch the scan to generate a diagnostic risk assessment.</p>
            </section>
          )}
        </div>
      </main>
    </Shell>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { 
  return (
    <label className="block text-sm">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}{required ? ' *' : ''}</span>
      <span className="mt-2 block">{children}</span>
    </label> 
  ) 
}

function Toggle({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) { 
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      <div className="mt-2 flex gap-2">
        {values.map((item) => (
          <button 
            type="button" 
            key={item} 
            onClick={() => onChange(item)} 
            className={`flex-1 rounded-[6px] border px-2 py-2 font-mono text-xs capitalize transition-colors ${value === item ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:bg-muted/30'}`}
          >
            {item.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  )
}

function ToggleMulti({ label, values, selected, onChange }: { label: string; values: string[][]; selected: string[]; onChange: (values: string[]) => void }) { 
  return (
    <div className="col-span-full">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map(([val, itemLabel]) => {
          const isSelected = selected.includes(val);
          return (
            <button 
              type="button" 
              key={val} 
              onClick={() => onChange(isSelected ? selected.filter(v => v !== val) : [...selected, val])} 
              className={`rounded-[6px] border px-3 py-2 font-mono text-xs transition-colors ${isSelected ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:bg-muted/30'}`}
            >
              {itemLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
