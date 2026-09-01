import type { GhostScoreResult, JobFormInput, RiskLevel, SignalResult } from '@/types'
import { vagueLanguage, signalCitations } from './signals'
import { incrementChecks } from './storage'

const riskLevel = (score: number): RiskLevel => score <= 25 ? 'low' : score <= 50 ? 'moderate' : score <= 75 ? 'high' : 'very-high'
const words = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0

export function calculateGhostScore(input: JobFormInput): GhostScoreResult {
  // Increment checks whenever a calculation is performed
  incrementChecks()

  const count = words(input.description)
  const vagueMatches = vagueLanguage.filter((term) => input.description.toLowerCase().includes(term))
  const results: SignalResult[] = [
    { name: 'Posting Age', points: ({ today: 0, 'this-week': 0, 'two-to-four-weeks': 5, 'one-to-two-months': 10, 'over-two-months': 15, unknown: 8 } as const)[input.postingAge], maxPoints: 15, explanation: `Posted ${input.postingAge.replaceAll('-', ' ')}.`, finding: signalCitations.postingAge.finding, source: signalCitations.postingAge.source, searchQuery: signalCitations.postingAge.searchQuery, flagged: input.postingAge !== 'today' && input.postingAge !== 'this-week' },
    { name: 'Salary Mentioned', points: input.salaryMentioned === 'no' ? 15 : 0, maxPoints: 15, explanation: input.salaryMentioned === 'yes' ? 'The listing mentions salary.' : 'No salary information was provided.', finding: signalCitations.salaryMentioned.finding, source: signalCitations.salaryMentioned.source, searchQuery: signalCitations.salaryMentioned.searchQuery, flagged: input.salaryMentioned === 'no' },
    { name: 'Application Method', points: input.applicationMethod.length > 0 ? Math.max(...input.applicationMethod.map(m => ({ 'external-ats': 0, 'company-website': 2, 'easy-apply': 8, 'email-only': 12, 'no-clear-method': 15 } as const)[m])) : 15, maxPoints: 15, explanation: `Application method(s): ${input.applicationMethod.length ? input.applicationMethod.map(m => m.replaceAll('-', ' ')).join(', ') : 'None selected'}.`, finding: signalCitations.applicationMethod.finding, source: signalCitations.applicationMethod.source, searchQuery: signalCitations.applicationMethod.searchQuery, flagged: !input.applicationMethod.includes('external-ats') || input.applicationMethod.length > 1 },
    { name: 'Description Length', points: count >= 400 ? 0 : count >= 200 ? 5 : 10, maxPoints: 10, explanation: `${count} words detected in the description.`, finding: signalCitations.descriptionLength.finding, source: signalCitations.descriptionLength.source, searchQuery: signalCitations.descriptionLength.searchQuery, flagged: count < 400 },
    { name: 'Platform', points: ({ 'company-website': 0, linkedin: 2, indeed: 5, naukri: 6, other: 8 } as const)[input.platform], maxPoints: 10, explanation: `Listed on ${input.platform.replaceAll('-', ' ')}.`, finding: signalCitations.platform.finding, source: signalCitations.platform.source, searchQuery: signalCitations.platform.searchQuery, flagged: input.platform !== 'company-website' },
    { name: 'Reposted', points: ({ no: 0, 'not-sure': 5, yes: 15 } as const)[input.reposted], maxPoints: 15, explanation: input.reposted === 'yes' ? 'You marked this listing as reposted.' : input.reposted === 'not-sure' ? 'Repost status is uncertain.' : 'No repost detected.', finding: signalCitations.reposted.finding, source: signalCitations.reposted.source, searchQuery: signalCitations.reposted.searchQuery, flagged: input.reposted !== 'no' },
    { name: 'Vague Language', points: vagueMatches.length === 0 ? 0 : vagueMatches.length <= 2 ? 4 : vagueMatches.length <= 4 ? 7 : 10, maxPoints: 10, explanation: vagueMatches.length ? `${vagueMatches.length} vague phrase${vagueMatches.length === 1 ? '' : 's'} found: ${vagueMatches.slice(0, 3).join(', ')}.` : 'No phrases from the vague language list found.', finding: signalCitations.vagueLanguage.finding, source: signalCitations.vagueLanguage.source, searchQuery: signalCitations.vagueLanguage.searchQuery, flagged: vagueMatches.length > 0 },
    { name: 'Company Size vs Role Fit', points: input.companySize === 'unknown' ? 5 : 0, maxPoints: 10, explanation: input.companySize === 'unknown' ? 'Company size is unknown.' : `Company size entered as ${input.companySize}.`, finding: signalCitations.companySize.finding, source: signalCitations.companySize.source, searchQuery: signalCitations.companySize.searchQuery, flagged: input.companySize === 'unknown' },
  ]
  const totalScore = results.reduce((sum, signal) => sum + signal.points, 0)
  return { totalScore, riskLevel: riskLevel(totalScore), signals: results }
}

export const analyzeText = calculateGhostScore
