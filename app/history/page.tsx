'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Clock, Download, Trash2, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Shell } from '@/components/site-shell'
import { JobHistoryTable } from '@/components/job-history-table'
import { EmptyState } from '@/components/empty-state'
import { StatCard } from '@/components/stat-card'
import { getJobs, exportJobsAsJson, clearAllJobs } from '@/lib/storage'
import type { StoredJob, JobStatus } from '@/types'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<StoredJob[]>([])
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')

  const load = () => {
    setJobs(getJobs())
  }

  useEffect(() => {
    load()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = 
      j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ? true : j.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const avgGhost = jobs.length > 0 ? Math.round(jobs.reduce((a, b) => a + (b.ghostRisk ?? b.totalScore ?? 0), 0) / jobs.length) : 0
  const avgScam = jobs.length > 0 ? Math.round(jobs.reduce((a, b) => a + (b.scamRisk ?? 0), 0) / jobs.length) : 0
  const avgQuality = jobs.length > 0 ? Math.round(jobs.reduce((a, b) => a + (b.jobQuality ?? 50), 0) / jobs.length) : 0

  const handleExport = () => {
    const json = exportJobsAsJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ghostfilter_history_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all saved job records? This action cannot be undone.')) {
      clearAllJobs()
      load()
    }
  }

  const filterTabs: { id: JobStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'saved', label: 'SAVED' },
    { id: 'applied', label: 'APPLIED' },
    { id: 'interview', label: 'INTERVIEW' },
    { id: 'hired', label: 'HIRED' },
    { id: 'rejected', label: 'REJECTED' },
    { id: 'suspected-scam', label: 'SUSPECTED SCAM' },
  ]

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link 
          href="/" 
          className="mb-8 flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft size={12} /> BACK TO DASHBOARD
        </Link>

        {/* Page Header */}
        <div className="mb-10 border-b border-border pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Personal Hiring Dataset</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight">Application Outcome History</h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-xl">
              Track analyzed job requisitions, monitor Ghost & Scam risks over time, and update your application statuses locally.
            </p>
          </div>

          {jobs.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded border border-border bg-card hover:border-accent text-foreground transition-colors"
              >
                <Download size={13} className="text-accent" /> EXPORT JSON
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 font-mono text-xs px-3 py-2 rounded border border-red-500/30 bg-red-950/10 hover:border-red-500/60 text-red-400 transition-colors"
              >
                <Trash2 size={13} /> CLEAR ALL
              </button>
            </div>
          )}
        </div>

        {jobs.length === 0 ? (
          <EmptyState 
            icon={<Clock size={20} />}
            title="NO ANALYSIS RECORDS FOUND"
            description="Run a job verification scan to begin building your personal application history dataset."
            action={
              <Link href="/check" className="btn-hover-lift inline-block rounded-md bg-accent px-6 py-3 font-mono text-xs font-bold tracking-[0.15em] text-accent-foreground hover:bg-accent/90 transition-colors">
                RUN FIRST ANALYSIS
              </Link>
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Overview Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
              <StatCard title="Total Tracked" value={jobs.length} subtitle="Saved Requisitions" />
              <StatCard title="Avg Ghost Risk" value={`${avgGhost} / 100`} subtitle="Warning Indicator Avg" />
              <StatCard title="Avg Scam Risk" value={`${avgScam} / 100`} subtitle="Fraud Marker Avg" />
              <StatCard title="Avg Job Quality" value={`${avgQuality} / 100`} subtitle="Completeness Score" />
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search title or company..."
                    className="field pl-9 text-xs min-h-[38px]"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <Filter size={12} className="text-muted-foreground mr-1 hidden sm:block" />
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`font-mono text-[10px] tracking-wider px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                        statusFilter === tab.id
                          ? 'bg-accent/15 text-accent border border-accent/40 font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-lg bg-card/20">
                  <p className="font-mono text-xs text-muted-foreground">NO RECORDS MATCHING THIS SEARCH OR FILTER</p>
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
