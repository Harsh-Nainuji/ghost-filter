'use client'

import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface ScoreOverviewProps {
  ghostRisk: number
  scamRisk: number
  jobQuality: number
}

export function ScoreOverview({ ghostRisk, scamRisk, jobQuality }: ScoreOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Ghost Risk Card */}
      <div className="interactive-card rounded-xl border border-border bg-card/90 p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <GhostRiskIcon score={ghostRisk} /> GHOST RISK
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 border border-border px-1.5 py-0.5 rounded">
            HEURISTIC
          </span>
        </div>

        <div className="my-4 flex items-baseline gap-2">
          <span className={`font-mono text-4xl font-light tracking-tight ${getScoreColor(ghostRisk, 'ghost')}`}>
            {ghostRisk}
          </span>
          <span className="font-mono text-xs text-muted-foreground/60">/ 100</span>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarBg(ghostRisk, 'ghost')}`}
              style={{ width: `${ghostRisk}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-tight pt-1">
            {ghostRisk <= 25 ? 'Low warning signals' : ghostRisk <= 55 ? 'Moderate ghost indicators' : 'High ghost role indicators'}
          </p>
        </div>
      </div>

      {/* Scam Risk Card */}
      <div className={`interactive-card rounded-xl border p-5 flex flex-col justify-between relative overflow-hidden group ${scamRisk > 25 ? 'border-red-500/40 bg-red-950/10' : 'border-border bg-card/90'}`}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <ShieldAlert size={12} className={scamRisk > 25 ? 'text-red-400 animate-pulse' : 'text-accent'} /> SCAM RISK
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 border border-border px-1.5 py-0.5 rounded">
            FRAUD SCAN
          </span>
        </div>

        <div className="my-4 flex items-baseline gap-2">
          <span className={`font-mono text-4xl font-light tracking-tight ${getScoreColor(scamRisk, 'scam')}`}>
            {scamRisk}
          </span>
          <span className="font-mono text-xs text-muted-foreground/60">/ 100</span>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarBg(scamRisk, 'scam')}`}
              style={{ width: `${scamRisk}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-tight pt-1">
            {scamRisk === 0 ? 'Zero fraud signals detected' : scamRisk <= 35 ? 'Minor financial caution' : 'High scam markers detected'}
          </p>
        </div>
      </div>

      {/* Job Quality Card */}
      <div className="interactive-card rounded-xl border border-border bg-card/90 p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
            <CheckCircle size={12} className="text-teal-400" /> JOB QUALITY
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 border border-border px-1.5 py-0.5 rounded">
            COMPLETENESS
          </span>
        </div>

        <div className="my-4 flex items-baseline gap-2">
          <span className={`font-mono text-4xl font-light tracking-tight ${getScoreColor(jobQuality, 'quality')}`}>
            {jobQuality}
          </span>
          <span className="font-mono text-xs text-muted-foreground/60">/ 100</span>
        </div>

        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getBarBg(jobQuality, 'quality')}`}
              style={{ width: `${jobQuality}%` }}
            />
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-tight pt-1">
            {jobQuality >= 75 ? 'Highly detailed posting' : jobQuality >= 45 ? 'Standard detail quality' : 'Vague or incomplete posting'}
          </p>
        </div>
      </div>
    </div>
  )
}

function GhostRiskIcon({ score }: { score: number }) {
  if (score > 60) return <AlertTriangle size={12} className="text-red-400" />
  if (score > 35) return <AlertTriangle size={12} className="text-amber-400" />
  return <Info size={12} className="text-teal-400" />
}

function getScoreColor(score: number, type: 'ghost' | 'scam' | 'quality') {
  if (type === 'quality') {
    return score >= 70 ? 'text-teal-400' : score >= 45 ? 'text-amber-400' : 'text-red-400'
  }
  return score > 55 ? 'text-red-400' : score > 30 ? 'text-amber-400' : 'text-teal-400'
}

function getBarBg(score: number, type: 'ghost' | 'scam' | 'quality') {
  if (type === 'quality') {
    return score >= 70 ? 'bg-teal-400' : score >= 45 ? 'bg-amber-400' : 'bg-red-400'
  }
  return score > 55 ? 'bg-red-400' : score > 30 ? 'bg-amber-400' : 'bg-teal-400'
}
