'use client'

import { useState } from 'react'
import type { StoredJob, JobStatus } from '@/types'
import { formatDate } from '@/types'
import { updateJobStatus, updateJobNotes, deleteJob } from '@/lib/storage'
import { Trash2, FileText, ExternalLink, Edit3, X, Check } from 'lucide-react'

export function JobHistoryTable({ jobs, onChange }: { jobs: StoredJob[]; onChange: () => void }) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')

  const statuses: { value: JobStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'recruiter-contacted', label: 'Recruiter Contacted' },
    { value: 'interview', label: 'Interview' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'no-response', label: 'No Response' },
    { value: 'position-closed', label: 'Position Closed' },
    { value: 'job-disappeared', label: 'Job Disappeared' },
    { value: 'suspected-scam', label: 'Suspected Scam' },
    { value: 'hired', label: 'Successfully Hired' },
    { value: 'other', label: 'Other' },
  ]

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

  const openNotes = (job: StoredJob) => {
    setEditingNotesId(job.id)
    setNotesText(job.notes || '')
  }

  const saveNotes = () => {
    if (editingNotesId) {
      updateJobNotes(editingNotesId, notesText)
      setEditingNotesId(null)
      onChange()
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile Stacked Timeline View */}
      <div className="md:hidden space-y-3">
        {jobs.map((job) => {
          const ghostRisk = job.ghostRisk ?? job.totalScore ?? 0
          const scamRisk = job.scamRisk ?? 0
          const jobQuality = job.jobQuality ?? 50

          return (
            <div key={job.id} className="interactive-card rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-foreground">{job.jobTitle}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-border/60 bg-background text-muted-foreground">
                    {formatDate(job.checkedAt)}
                  </span>
                </div>
              </div>

              {/* Score Badges */}
              <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                <span className={`px-2 py-0.5 rounded border ${ghostRisk > 50 ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-teal-400/30 text-teal-400 bg-teal-400/10'}`}>
                  GHOST: {ghostRisk}
                </span>
                <span className={`px-2 py-0.5 rounded border ${scamRisk > 25 ? 'border-red-400/30 text-red-400 bg-red-400/10' : 'border-border text-muted-foreground bg-muted/20'}`}>
                  SCAM: {scamRisk}
                </span>
                <span className="px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted/20">
                  QUALITY: {jobQuality}
                </span>
              </div>

              {/* Status Select & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <select 
                  value={job.status} 
                  onChange={(e) => handleStatus(job.id, e.target.value as JobStatus)}
                  className="bg-background border border-border text-[10px] font-mono tracking-wider uppercase p-1.5 rounded outline-none focus:border-accent min-h-[36px]"
                >
                  {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openNotes(job)}
                    className="text-muted-foreground hover:text-accent p-1.5 transition-colors"
                    title="Edit Notes"
                  >
                    <FileText size={14} />
                  </button>

                  <button 
                    onClick={() => handleDelete(job.id)} 
                    className="text-muted-foreground hover:text-red-400 p-1.5 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Dataset Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Job & Company</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Ghost Risk</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Scam Risk</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Quality</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Outcome Status</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal">Date Scanned</th>
              <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {jobs.map((job) => {
              const ghostRisk = job.ghostRisk ?? job.totalScore ?? 0
              const scamRisk = job.scamRisk ?? 0
              const jobQuality = job.jobQuality ?? 50

              return (
                <tr key={job.id} className="hover:bg-muted/15 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{job.jobTitle}</div>
                    <div className="text-xs text-muted-foreground">{job.companyName}</div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded border ${ghostRisk > 50 ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-teal-400/30 text-teal-400 bg-teal-400/10'}`}>
                      {ghostRisk} / 100
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded border ${scamRisk > 25 ? 'border-red-400/30 text-red-400 bg-red-400/10' : 'border-border text-muted-foreground bg-muted/20'}`}>
                      {scamRisk} / 100
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded border border-border text-muted-foreground bg-muted/20">
                      {jobQuality} / 100
                    </span>
                  </td>

                  <td className="p-4">
                    <select 
                      value={job.status} 
                      onChange={(e) => handleStatus(job.id, e.target.value as JobStatus)}
                      className="bg-background border border-border text-[10px] font-mono tracking-wider uppercase p-1.5 rounded outline-none focus:border-accent"
                    >
                      {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>

                  <td className="p-4 text-muted-foreground font-mono text-[10px] tracking-widest">
                    {formatDate(job.checkedAt)}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openNotes(job)}
                        className="text-muted-foreground hover:text-accent p-1 transition-colors"
                        title="Notes"
                      >
                        <FileText size={14} />
                      </button>

                      <button 
                        onClick={() => handleDelete(job.id)} 
                        className="text-muted-foreground hover:text-red-400 p-1 transition-colors" 
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Notes Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in-scale">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-semibold flex items-center gap-1.5">
                <Edit3 size={14} /> APPLICATION NOTES
              </h3>
              <button onClick={() => setEditingNotesId(null)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add recruiter contact names, interview dates, or notes about this application..."
              className="field min-h-28 text-xs leading-relaxed"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingNotesId(null)}
                className="px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                CANCEL
              </button>
              <button
                onClick={saveNotes}
                className="btn-hover-lift px-4 py-1.5 rounded bg-accent font-mono text-xs font-bold text-accent-foreground flex items-center gap-1"
              >
                <Check size={12} /> SAVE NOTES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
