import type { SignalResult } from '@/types'
import { ChevronDown, CircleAlert, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { signalCitations } from '@/lib/signals'

const signalMap: Record<string, keyof typeof signalCitations> = {
  'Posting Age': 'postingAge',
  'Salary Mentioned': 'salaryMentioned',
  'Application Method': 'applicationMethod',
  'Description Length': 'descriptionLength',
  'Platform': 'platform',
  'Reposted': 'reposted',
  'Vague Language': 'vagueLanguage',
  'Company Size vs Role Fit': 'companySize'
}

export function SignalRow({ signal, delay = 0 }: { signal: SignalResult, delay?: number }) {
  const [open, setOpen] = useState(false)
  const citationData = signalCitations[signalMap[signal.name]]

  return (
    <div 
      className="animate-fade-in-up-stagger border-b border-border last:border-0" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-muted/30 px-2 rounded-md" aria-expanded={open}>
        <span className={signal.flagged ? 'text-amber-400' : 'text-teal-500'}>
          {signal.flagged ? <CircleAlert size={14} /> : <CircleCheck size={14} />}
        </span>
        <span className="flex-1 text-sm">{signal.name}</span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">{signal.points}/{signal.maxPoints} PT</span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="animate-slide-up pb-4 pl-7 text-sm leading-6 text-muted-foreground">
          <p>{signal.explanation}</p>
          {signal.flagged && (
            <div className="mt-3 space-y-1 border-t border-white/5 pt-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {signal.finding}
              </p>
              <p className="text-xs text-muted-foreground/60">
                — {signal.source}
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(signal.searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors mt-1"
              >
                Read current research →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

