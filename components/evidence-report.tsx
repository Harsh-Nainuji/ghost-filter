'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, HelpCircle, ExternalLink, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
import type { ScoreBreakdown, EvidenceItem } from '@/types'

interface EvidenceReportProps {
  breakdown: ScoreBreakdown
}

export function EvidenceReport({ breakdown }: EvidenceReportProps) {
  const [activeTab, setActiveTab] = useState<'warnings' | 'positive' | 'unverified'>('warnings')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Plain English Verdict Box */}
      <div className="interactive-card rounded-xl border border-accent/30 bg-card p-6 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
          <ShieldCheck size={14} /> DIAGNOSTIC VERDICT
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {breakdown.verdict}
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {breakdown.summary}
        </p>
      </div>

      {/* Evidence Category Tabs */}
      <div className="border-b border-border flex gap-4 font-mono text-xs overflow-x-auto pb-0">
        <button
          onClick={() => setActiveTab('warnings')}
          className={`pb-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'warnings'
              ? 'border-red-400 text-red-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertCircle size={14} /> WARNING SIGNS ({breakdown.strongestWarnings.length})
        </button>

        <button
          onClick={() => setActiveTab('positive')}
          className={`pb-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'positive'
              ? 'border-teal-400 text-teal-400 font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckCircle2 size={14} /> POSITIVE EVIDENCE ({breakdown.positiveEvidence.length})
        </button>

        <button
          onClick={() => setActiveTab('unverified')}
          className={`pb-3 px-1 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'unverified'
              ? 'border-muted-foreground text-foreground font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <HelpCircle size={14} /> UNVERIFIED / UNKNOWN ({breakdown.unverifiedSignals.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {activeTab === 'warnings' && (
          breakdown.strongestWarnings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
              <CheckCircle2 className="mx-auto text-teal-400 mb-2" size={24} />
              <p className="font-mono text-xs text-foreground">NO STRONG WARNING SIGNS DETECTED</p>
              <p className="mt-1 text-xs text-muted-foreground">The job posting does not present significant ghost or scam indicators.</p>
            </div>
          ) : (
            breakdown.strongestWarnings.map((item) => (
              <EvidenceCard 
                key={item.id} 
                item={item} 
                isExpanded={expandedId === item.id} 
                onToggle={() => toggleExpand(item.id)} 
              />
            ))
          )
        )}

        {activeTab === 'positive' && (
          breakdown.positiveEvidence.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
              <p className="font-mono text-xs text-muted-foreground">NO SPECIFIC POSITIVE EVIDENCE RECORDED</p>
            </div>
          ) : (
            breakdown.positiveEvidence.map((item) => (
              <EvidenceCard 
                key={item.id} 
                item={item} 
                isExpanded={expandedId === item.id} 
                onToggle={() => toggleExpand(item.id)} 
              />
            ))
          )
        )}

        {activeTab === 'unverified' && (
          breakdown.unverifiedSignals.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
              <p className="font-mono text-xs text-muted-foreground">ALL PARAMETERS WERE SUCCESSFULLY VERIFIED</p>
            </div>
          ) : (
            breakdown.unverifiedSignals.map((item) => (
              <EvidenceCard 
                key={item.id} 
                item={item} 
                isExpanded={expandedId === item.id} 
                onToggle={() => toggleExpand(item.id)} 
              />
            ))
          )
        )}
      </div>
    </div>
  )
}

function EvidenceCard({ item, isExpanded, onToggle }: { item: EvidenceItem; isExpanded: boolean; onToggle: () => void }) {
  const isNegative = item.state === 'negative'
  const isPositive = item.state === 'positive'

  const borderClass = isNegative 
    ? 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10' 
    : isPositive 
    ? 'border-teal-500/30 hover:border-teal-500/60 bg-teal-950/10' 
    : 'border-border hover:border-border/80 bg-card/50'

  const badgeClass = isNegative 
    ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' 
    : isPositive 
    ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' 
    : 'text-muted-foreground bg-muted/40 border-border'

  return (
    <div className={`rounded-lg border p-4 sm:p-5 transition-all ${borderClass}`}>
      <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={onToggle}>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>
              {item.category.toUpperCase()} :: {item.state.toUpperCase()}
            </span>
            {isNegative && item.scoreImpact !== 0 && (
              <span className="font-mono text-[9px] text-red-400 font-semibold">
                +{item.scoreImpact} RISK
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground pt-1">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {item.detail}
          </p>
        </div>

        <button className="text-muted-foreground hover:text-foreground pt-1">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Details & Research Citation */}
      {isExpanded && (
        <div className="mt-4 border-t border-border/60 pt-3 space-y-3 animate-fade-in-scale">
          <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
            <p className="font-mono text-[10px] uppercase text-accent tracking-widest">WHY THIS MATTERS:</p>
            <p>{item.explanation}</p>
          </div>

          {item.citation && (
            <div className="rounded bg-muted/30 border border-border/40 p-3 space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-foreground">SOURCE: {item.citation.source}</span>
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(item.citation.searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  VERIFY RESEARCH <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-muted-foreground/80 leading-normal">{item.citation.finding}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
