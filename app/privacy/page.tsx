import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, Server, Cpu, Database, EyeOff, FileText, CheckCircle2 } from 'lucide-react'
import { Shell } from '@/components/site-shell'

export default function PrivacyPage() {
  const privacyPillars = [
    {
      icon: <Lock className="text-accent" size={20} />,
      title: '01. Client-Side Execution Boundary',
      description: 'GhostFilter operates exclusively inside your browser DOM. When you input job listing metadata, description text, or posting details, no network requests are dispatched to external AI APIs or third-party servers. All heuristic evaluation happens locally in client memory.'
    },
    {
      icon: <Server className="text-accent" size={20} />,
      title: '02. Zero Server Ingestion & Telemetry',
      description: 'We do not collect, store, transmit, or monetize your job searches. There are no backend database servers listening for your inputs, no candidate profile tracking, and zero data logging.'
    },
    {
      icon: <Database className="text-accent" size={20} />,
      title: '03. LocalStorage Data Persistence',
      description: 'Your analysis history is stored strictly in your browser’s local storage (HTML5 LocalStorage API). You retain complete ownership and control over this data. You can clear your historical dataset at any time with a single click in your history panel.'
    },
    {
      icon: <EyeOff className="text-accent" size={20} />,
      title: '04. No User Tracking or Third-Party Cookies',
      description: 'GhostFilter does not use cross-site tracking cookies, advertising pixels, or invasive session recording tools. The system is designed for security professionals and job seekers who demand absolute data privacy.'
    }
  ]

  const technicalGuarantees = [
    'Zero transmission of job posting content or URLs across the wire.',
    'No account registration, email collection, or identity verification required.',
    '100% deterministic rules-based evaluation running locally via pure TypeScript.',
    'Full transparency: source code and algorithmic weights are completely inspectable.',
    'Immediate data wipe functionality via browser storage controls.',
  ]

  return (
    <Shell>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link 
          href="/" 
          className="mb-10 flex w-fit items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </Link>

        {/* Page Header */}
        <div className="mb-12 border-b border-border pb-8">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-accent mb-3">
            <ShieldCheck size={14} /> PRIVACY ARCHITECTURE & DATA GOVERNANCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Your data never leaves your device.
          </h1>
          <p className="mt-4 text-xs sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            GhostFilter was engineered from the ground up with a strict security boundary: your inputs, analyzed jobs, and history remain exclusively local.
          </p>
        </div>

        {/* Privacy Pillars Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-16">
          {privacyPillars.map((pillar) => (
            <div 
              key={pillar.title} 
              className="interactive-card rounded-lg border border-border bg-card/70 p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded border border-border bg-muted/40">
                  {pillar.icon}
                </div>
                <h2 className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase text-foreground mb-2.5">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specification Section */}
        <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8 mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Cpu size={16} className="text-accent" />
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-foreground">
              Technical Verification & Security Commitments
            </h2>
          </div>

          <ul className="space-y-3.5">
            {technicalGuarantees.map((guarantee, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{guarantee}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Disclaimer & Educational Scope */}
        <div className="border-t border-border/80 pt-8 space-y-4 text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent/80">
            <FileText size={12} /> SCOPE & INTENDED USE
          </div>
          <p>
            GhostFilter is a diagnostic heuristic scanner designed to help job applicants analyze public job posting metadata for common red flags (such as stale posting dates, vague descriptions, and missing compensation ranges). 
          </p>
          <p>
            Scoring outputs represent probabilistic estimations based on empirical hiring research and do not constitute legal advice, employment verification, or definitive declarations of employer intent.
          </p>
        </div>
      </main>
    </Shell>
  )
}
