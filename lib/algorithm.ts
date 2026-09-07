import type { GhostScoreResult, JobFormInput, RiskLevel, SignalResult } from '@/types'
import { evaluateJobPosting } from './engine'
import { incrementChecks } from './storage'

export { evaluateJobPosting }

export function calculateGhostScore(input: JobFormInput): GhostScoreResult {
  incrementChecks()
  const breakdown = evaluateJobPosting(input)

  const legacyRiskLevel: RiskLevel =
    breakdown.ghostRisk <= 25
      ? 'low'
      : breakdown.ghostRisk <= 50
      ? 'moderate'
      : breakdown.ghostRisk <= 75
      ? 'high'
      : 'very-high'

  const legacySignals: SignalResult[] = breakdown.allEvidence.map((ev) => ({
    name: ev.name,
    points: ev.state === 'negative' ? Math.abs(ev.scoreImpact || 10) : 0,
    maxPoints: 20,
    explanation: ev.detail,
    finding: ev.explanation,
    source: ev.citation?.source || 'GhostFilter Diagnostic Heuristics',
    searchQuery: ev.citation?.searchQuery || 'ghost job indicators',
    flagged: ev.state === 'negative',
  }))

  return {
    totalScore: breakdown.ghostRisk,
    riskLevel: legacyRiskLevel,
    signals: legacySignals,
  }
}

export const analyzeText = calculateGhostScore
