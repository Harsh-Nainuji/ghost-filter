'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { Shell } from '@/components/site-shell'
import { JobHistoryTable } from '@/components/job-history-table'
import { ScoreChart } from '@/components/score-chart'
import { EmptyState } from '@/components/empty-state'
import { StatCard } from '@/components/stat-card'
import { getJobs } from '@/lib/storage'
import type { StoredJob } from '@/types'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<StoredJob[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<'all' | 'low' | 'moderate' | 'high' | 'very-high'>('all')

  const load = () => {
    setJobs(getJobs())
  }

  useEffect(() => {
    load()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredJobs = jobs.filter(j => filter === 'all' ? true : j.riskLevel === filter)

  const avgScore = jobs.length > 0 ? Math.round(jobs.reduce((a, b) => a + b.totalScore, 0) / jobs.length) : 0
  const highRisk = jobs.filter(j => j.totalScore > 50).length

  const filterTabs = [
    { id: 'all', label: 'ALL' },
    { id: 'low', label: 'LOW RISK' },
    { id: 'moderate', label: 'MODERATE' },
    { id: 'high', label: 'HIGH RISK' },
    { id: 'very-high', label: 'CRITICAL' },
  ] as const

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft size={12} /> BACK TO DASHBOARD
        </Link>
        <div className="mb-10 border-b border-border pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Analysis Record</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">Your History</h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">Keep track of the jobs you have analyzed and manage your application status.</p>
        </div>

        {jobs.length === 0 ? (
          <EmptyState 
            icon={<Clock size={20} />}
            title="NO ANALYSIS RECORDS"
            description="Run an analysis to begin building your GhostFilter history dataset."
            action={
              <Link href="/check" className="btn-hover-lift inline-block rounded-[6px] bg-accent px-5 py-2.5 font-mono text-xs font-bold tracking-[0.15em] text-accent-foreground hover:bg-accent/90 transition-colors">
                RUN ANALYSIS
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard title="Total Saved" value={jobs.length} />
              <StatCard title="Avg Risk Score" value={avgScore} subtitle="Out of 100" />
              <StatCard title="High Risk Roles" value={highRisk} subtitle="Score > 50" />
            </div>
            
            <ScoreChart jobs={jobs} />
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Historical Dataset</h2>
                
                {/* Compact Risk Filter Bar */}
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 max-w-full">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`font-mono text-[10px] tracking-widest px-2.5 py-1 rounded transition-colors whitespace-nowrap ${filter === tab.id ? 'bg-accent/10 text-accent border border-accent/40 font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
                  <p className="font-mono text-xs text-muted-foreground">NO RECORDS MATCHING THIS FILTER</p>
                </div>
              ) : (
                <JobHistoryTable jobs={filteredJobs} onChange={load} />
              )}
            </div>
          </div>
        )}
      </main>
    </Shell>
  )
}
