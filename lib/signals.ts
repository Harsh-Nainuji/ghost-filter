import type { SignalCitation } from "@/types"

export const signalCitations: Record<string, SignalCitation> = {
  postingAge: {
    finding: "Most legitimate urgent roles are filled within 30 days of posting. Jobs live beyond 60 days are either ghost posts or chronically unfilled for undisclosed reasons.",
    source: "Clarify Capital Hiring Report",
    searchQuery: "ghost job postings how long active before hiring research",
  },
  salaryMentioned: {
    finding: "Job posts with a salary range get 30% more applicants on average. Companies with approved headcount almost always list compensation. No salary usually means no approved budget.",
    source: "LinkedIn Talent Trends Report",
    searchQuery: "job postings without salary ghost jobs no budget approval",
  },
  applicationMethod: {
    finding: "43% of hiring managers admit keeping job posts active with no intent to hire. Easy Apply is used heavily to collect resumes passively with zero commitment to fill the role.",
    source: "Clarify Capital Hiring Report",
    searchQuery: "Easy Apply passive pipeline ghost jobs hiring managers not hiring",
  },
  descriptionLength: {
    finding: "Short and vague job descriptions strongly correlate with roles that have no defined scope, no approved headcount, and no real hiring timeline.",
    source: "Harvard Business Review",
    searchQuery: "vague short job descriptions ghost jobs no headcount approval",
  },
  platform: {
    finding: "Active job openings are almost always listed on the company careers page in addition to job boards. A listing only on aggregators with no careers page equivalent is very hard to verify.",
    source: "Resume Genius Job Market Analysis",
    searchQuery: "ghost jobs only on job boards not company careers page",
  },
  reposted: {
    finding: "Reposting the same listing repeatedly is the single strongest ghost job signal. LinkedIn now internally flags reposted jobs. A role that keeps reappearing without being filled indicates no genuine intent to hire.",
    source: "LinkedIn Internal Hiring Data",
    searchQuery: "reposted job listings ghost job signal LinkedIn",
  },
  vagueLanguage: {
    finding: "Buzzword-heavy descriptions like rockstar, self-starter, and wear many hats consistently indicate roles with no defined responsibilities, no team structure, and no approved scope.",
    source: "Harvard Business Review",
    searchQuery: "buzzword job descriptions ghost jobs undefined roles no scope",
  },
  companySize: {
    finding: "When company size is unknown it is impossible to confirm whether headcount or budget for the role exists. Legitimate companies with active hiring have a verifiable public presence and LinkedIn headcount.",
    source: "Resume Genius Ghost Job Analysis",
    searchQuery: "unknown company size ghost job verification LinkedIn headcount",
  },
}

export const vagueLanguage = [
  'rockstar',
  'ninja',
  'self-starter',
  'wear many hats',
  'fast-paced',
  'hit the ground running',
  'superhero',
  'work hard play hard',
  'family',
]
