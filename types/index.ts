export type Platform = 'linkedin' | 'indeed' | 'naukri' | 'company-website' | 'other'
export type PostingAge = 'today' | 'this-week' | 'two-to-four-weeks' | 'one-to-two-months' | 'over-two-months' | 'unknown'
export type SalaryMentioned = 'yes' | 'no'
export type ApplicationMethod = 'external-ats' | 'company-website' | 'easy-apply' | 'email-only' | 'no-clear-method'
export type Reposted = 'no' | 'not-sure' | 'yes'
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | 'unknown'

export type JobFormInput = {
  jobTitle: string
  companyName: string
  platform: Platform
  postingAge: PostingAge
  salaryMentioned: SalaryMentioned
  applicationMethod: ApplicationMethod[]
  reposted: Reposted
  companySize: CompanySize
  description: string
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high'
export type SignalCitation = { finding: string; source: string; searchQuery: string }
export type SignalResult = { name: string; points: number; maxPoints: number; explanation: string; finding: string; source: string; searchQuery: string; flagged: boolean }
export type GhostScoreResult = { totalScore: number; riskLevel: RiskLevel; signals: SignalResult[] }

export type JobStatus = 'not-applied' | 'applied' | 'interviewing' | 'rejected' | 'offer'

export type StoredJob = {
  id: string
  jobTitle: string
  companyName: string
  platform: string
  totalScore: number
  riskLevel: RiskLevel
  signals: SignalResult[]
  status: JobStatus
  checkedAt: string
  formInput: JobFormInput
}

export const scoreLabel = (score: number) => score <= 25 ? 'Looks Legitimate' : score <= 50 ? 'Proceed Carefully' : score <= 75 ? 'High Ghost Risk' : 'Very Likely a Ghost'
export const scoreTone = (score: number) => score > 75 ? 'high' : score > 50 ? 'medium' : 'low'
export const signalTone = (flagged: boolean) => flagged ? 'text-amber-400 bg-amber-400/10' : 'text-teal-400 bg-teal-400/10'
export const getSignalColor = (score: number) => score > 0 ? '#f59e0b' : '#14b8a6'
export const getScoreColor = (score: number) => score > 75 ? 'text-red-400' : score > 50 ? 'text-amber-400' : 'text-teal-400'
export const getScoreBg = (score: number) => score > 75 ? 'bg-red-400/10' : score > 50 ? 'bg-amber-400/10' : 'bg-teal-400/10'
export const getScoreLabel = (score: number) => score <= 25 ? 'Low' : score <= 50 ? 'Moderate' : score <= 75 ? 'High' : 'Very high'
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
export const formatTime = (date: string) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(date))
