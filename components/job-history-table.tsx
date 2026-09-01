'use client'
import type { StoredJob, JobStatus } from '@/types'
import { getScoreColor, getScoreLabel, formatDate } from '@/types'
import { updateJobStatus, deleteJob } from '@/lib/storage'
import { Trash2 } from 'lucide-react'

export function JobHistoryTable({ jobs, onChange }: { jobs: StoredJob[], onChange: () => void }) {
  const statuses: JobStatus[] = ['not-applied', 'applied', 'interviewing', 'rejected', 'offer']
  
  const handleStatus = (id: string, status: JobStatus) => {
    updateJobStatus(id, status)
    onChange()
  }
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job record?')) {
      deleteJob(id)
      onChange()
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile Stacked Timeline View */}
      <div className="md:hidden space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="interactive-card rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-sm leading-tight text-foreground">{job.jobTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded border border-border/60 ${getScoreColor(job.totalScore)} bg-background`}>
                  {job.totalScore} · {getScoreLabel(job.totalScore)}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/60 tracking-widest mt-1">
                  {formatDate(job.checkedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70">STATUS:</span>
                <select 
                  value={job.status} 
                  onChange={(e) => handleStatus(job.id, e.target.value as JobStatus)}
                  className="bg-background border border-border text-[10px] font-mono tracking-widest uppercase p-1.5 rounded outline-none focus:border-accent min-h-[36px]"
                >
                  {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                </select>
              </div>

              <button 
                onClick={() => handleDelete(job.id)} 
                className="text-muted-foreground hover:text-red-400 p-1.5 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Delete entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Dataset Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Job Title</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Company</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Ghost Risk</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Date Scanned</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Application Status</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/15 transition-colors">
                <td className="p-4 font-medium">{job.jobTitle}</td>
                <td className="p-4 text-muted-foreground">{job.companyName}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 text-[10px] font-mono tracking-widest uppercase rounded ${getScoreColor(job.totalScore)} bg-background border border-border/60`}>
                    {job.totalScore} - {getScoreLabel(job.totalScore)}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-mono text-[10px] tracking-widest">{formatDate(job.checkedAt)}</td>
                <td className="p-4">
                  <select 
                    value={job.status} 
                    onChange={(e) => handleStatus(job.id, e.target.value as JobStatus)}
                    className="bg-background border border-border text-[10px] font-mono tracking-widest uppercase p-1.5 rounded outline-none focus:border-accent"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(job.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1" title="Delete record">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
