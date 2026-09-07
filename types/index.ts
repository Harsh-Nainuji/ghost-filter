export type Platform = 'linkedin' | 'indeed' | 'naukri' | 'company-website' | 'other'
export type PostingAge = 'today' | 'this-week' | 'two-to-four-weeks' | 'one-to-two-months' | 'over-two-months' | 'unknown'
export type SalaryMentioned = 'yes' | 'no' | 'unknown'
export type ApplicationMethod = 'external-ats' | 'company-website' | 'easy-apply' | 'email-only' | 'no-clear-method'
export type Reposted = 'no' | 'not-sure' | 'yes'
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | 'unknown'

export type JobFormInput = {
  jobUrl?: string
  jobTitle: string
  companyName: string
  platform: Platform
  postingAge: PostingAge
  salaryMentioned: SalaryMentioned
  applicationMethod: ApplicationMethod[]
  reposted: Reposted
  companySize: CompanySize
  description: string
  contactInfo?: string
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high'
export type EvidenceState = 'positive' | 'negative' | 'unknown'
export type EvidenceCategory = 'ghost' | 'scam' | 'quality'

export type SignalCitation = { 
  finding: string 
  source: string 
  searchQuery: string 
}

export type SignalResult = {
  name: string
  points: number
  maxPoints: number
  explanation: string
  finding: string
  source: string
  searchQuery: string
  flagged: boolean
}

export type GhostScoreResult = {
  totalScore: number
  riskLevel: RiskLevel
  signals: SignalResult[]
}

export type EvidenceItem = {
  id: string
  name: string
  category: EvidenceCategory
  state: EvidenceState
  title: string
  detail: string
  explanation: string
  scoreImpact: number
  citation?: SignalCitation
}

export type ScoreBreakdown = {
  ghostRisk: number
  scamRisk: number
  jobQuality: number
  verdict: string
  summary: string
  strongestWarnings: EvidenceItem[]
  positiveEvidence: EvidenceItem[]
  unverifiedSignals: EvidenceItem[]
  allEvidence: EvidenceItem[]
}

export type JobStatus = 
  | 'saved' 
  | 'applied' 
  | 'recruiter-contacted' 
  | 'interview' 
  | 'rejected' 
  | 'no-response' 
  | 'position-closed' 
  | 'job-disappeared' 
  | 'suspected-scam' 
  | 'hired' 
  | 'other'

export type StoredJob = {
  id: string
  jobTitle: string
  companyName: string
  platform: string
  ghostRisk: number
  scamRisk: number
  jobQuality: number
  totalScore?: number // Legacy compatibility fallback
  riskLevel?: RiskLevel // Legacy compatibility fallback
  verdict: string
  evidence: EvidenceItem[]
  signals?: SignalResult[] // Legacy compatibility fallback
  status: JobStatus
  checkedAt: string
  formInput: JobFormInput
  notes?: string
  url?: string
}

export const scoreLabel = (ghostRisk: number) => 
  ghostRisk <= 25 ? 'Low Warning Signs' : ghostRisk <= 50 ? 'Proceed With Caution' : ghostRisk <= 75 ? 'Higher Risk Detected' : 'Elevated Ghost Indicators'

export const getScoreColor = (score: number = 0, category: EvidenceCategory = 'ghost') => {
  if (category === 'quality') {
    return score >= 75 ? 'text-teal-400' : score >= 45 ? 'text-amber-400' : 'text-red-400'
  }
  return score > 65 ? 'text-red-400' : score > 35 ? 'text-amber-400' : 'text-teal-400'
}

export const getScoreBg = (score: number = 0, category: EvidenceCategory = 'ghost') => {
  if (category === 'quality') {
    return score >= 75 ? 'bg-teal-400/10' : score >= 45 ? 'bg-amber-400/10' : 'bg-red-400/10'
  }
  return score > 65 ? 'bg-red-400/10' : score > 35 ? 'bg-amber-400/10' : 'bg-teal-400/10'
}

export const getScoreLabel = (score: number = 0) => score <= 25 ? 'Low' : score <= 50 ? 'Moderate' : score <= 75 ? 'High' : 'Very high'

export const formatDate = (date: string) => 
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))

export const formatTime = (date: string) => 
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(date))
