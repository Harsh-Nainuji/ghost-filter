export interface TutorialStep {
  id: string
  targetSelector: string
  title: string
  description: string
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right'
  route?: string
  badgeText?: string
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    targetSelector: '[data-tutorial="welcome"]',
    title: 'Transparent Hiring Risk Scanner',
    description: 'GhostFilter evaluates job postings to calculate 3 independent scores: Ghost Risk, Scam Risk, and Job Quality. All analysis runs 100% locally in your browser.',
    preferredPosition: 'bottom',
    route: '/check',
    badgeText: 'STEP 1 OF 8 // WELCOME',
  },
  {
    id: 'job-url',
    targetSelector: '[data-tutorial="job-url"]',
    title: 'Job Posting URL (Optional)',
    description: 'Paste the direct job URL (LinkedIn, Indeed, Company Site) to extract metadata like hosting domain and platform origin.',
    preferredPosition: 'bottom',
    route: '/check',
    badgeText: 'STEP 2 OF 8 // URL INPUT',
  },
  {
    id: 'job-description',
    targetSelector: '[data-tutorial="job-description"]',
    title: 'Job Description Text',
    description: 'Paste the full job requisition text here. GhostFilter parses duties, qualifications, salary disclosures, and scam indicators.',
    preferredPosition: 'bottom',
    route: '/check',
    badgeText: 'STEP 3 OF 8 // DESCRIPTION',
  },
  {
    id: 'analyze',
    targetSelector: '[data-tutorial="analyze"]',
    title: 'Launch Diagnostic Scan',
    description: 'Click to evaluate the job text against our 3-State heuristic engine. Every score impact is explicitly cited with zero penalty for missing parameters.',
    preferredPosition: 'top',
    route: '/check',
    badgeText: 'STEP 4 OF 8 // DIAGNOSTIC SCAN',
  },
  {
    id: 'risk-score',
    targetSelector: '[data-tutorial="risk-score"]',
    title: '3 Independent Risk Scores',
    description: 'Ghost Risk measures reposting loops & aging posts (>60 days). Scam Risk flags payment traps & Telegram contacts. Job Quality measures role completeness.',
    preferredPosition: 'top',
    route: '/check',
    badgeText: 'STEP 5 OF 8 // RISK SCORES',
  },
  {
    id: 'evidence',
    targetSelector: '[data-tutorial="evidence"]',
    title: '3-State Evidence Breakdown',
    description: 'Review cited Strongest Warning Signs, Positive Evidence, and Unverified Signals. Unprovided fields carry zero artificial score penalty.',
    preferredPosition: 'top',
    route: '/check',
    badgeText: 'STEP 6 OF 8 // EVIDENCE REPORT',
  },
  {
    id: 'history',
    targetSelector: '[data-tutorial="history"]',
    title: 'Save & Track Requisitions',
    description: 'Save evaluated jobs to your local hiring dataset to build a personal history of verified listings.',
    preferredPosition: 'bottom',
    route: '/check',
    badgeText: 'STEP 7 OF 8 // SAVE & HISTORY',
  },
  {
    id: 'outcome',
    targetSelector: '[data-tutorial="outcome"]',
    title: 'Application Outcome Tracking',
    description: 'Track 11 application statuses (Applied, Interviewing, Rejected, Offer, Suspected Scam) and store private notes stored 100% locally in your browser.',
    preferredPosition: 'bottom',
    route: '/history',
    badgeText: 'STEP 8 OF 8 // OUTCOME TRACKER',
  },
]
