import type { StoredJob, JobStatus } from '@/types'

const KEY = 'ghostfilter_jobs'
const COUNT = 'ghostfilter_total_checks'

export function getJobs(): StoredJob[] { 
  if (typeof window === 'undefined') return [] 
  try { 
    const raw = window.localStorage.getItem(KEY) 
    if (!raw) return []
    const parsed: StoredJob[] = JSON.parse(raw)
    
    // Legacy migration compatibility layer
    return parsed.map((job) => ({
      ...job,
      ghostRisk: job.ghostRisk ?? job.totalScore ?? 0,
      scamRisk: job.scamRisk ?? 0,
      jobQuality: job.jobQuality ?? 50,
      verdict: job.verdict || 'Legacy Analysis Record',
      evidence: job.evidence || [],
      status: job.status || 'saved',
    }))
  } catch { 
    return [] 
  } 
}

export function saveJob(job: StoredJob) { 
  if (typeof window === 'undefined') return 
  const next = [job, ...getJobs().filter((item) => item.id !== job.id)] 
  window.localStorage.setItem(KEY, JSON.stringify(next)) 
}

export function deleteJob(id: string) { 
  if (typeof window === 'undefined') return 
  window.localStorage.setItem(KEY, JSON.stringify(getJobs().filter((item) => item.id !== id))) 
}

export function updateJobStatus(id: string, status: JobStatus) { 
  if (typeof window === 'undefined') return 
  window.localStorage.setItem(KEY, JSON.stringify(getJobs().map((item) => item.id === id ? { ...item, status } : item))) 
}

export function updateJobNotes(id: string, notes: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(getJobs().map((item) => item.id === id ? { ...item, notes } : item)))
}

export function incrementChecks() { 
  if (typeof window !== 'undefined') {
    const current = Number(window.localStorage.getItem(COUNT) || 0)
    window.localStorage.setItem(COUNT, String(current + 1))
  }
}

export function getCheckCount() { 
  if (typeof window === 'undefined') return 0 
  return Number(window.localStorage.getItem(COUNT) || 0) 
}

export function exportJobsAsJson(): string {
  const jobs = getJobs()
  return JSON.stringify(jobs, null, 2)
}

export function clearAllJobs() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
}
