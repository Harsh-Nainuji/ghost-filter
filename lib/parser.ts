/**
 * GhostFilter V2 — Job Description Text Parser
 *
 * Extracts structural signals from raw job posting text.
 * All analysis is purely local and deterministic — no external APIs.
 *
 * Key rules:
 * - Missing information produces Unknown state, never a penalty.
 * - Vague language strength is evaluated proportionally to useful content.
 * - Title quality is evaluated on meaningful content, not character count.
 */

export interface TitleQuality {
  /** 0-10 score for the job title */
  score: number
  isSpammy: boolean
  hasMultipleRoles: boolean
  hasSuspiciousCaps: boolean
  hasPromotionalWording: boolean
  detail: string
}

export interface ParsedJobDescription {
  hasText: boolean
  wordCount: number

  // Structural content
  hasResponsibilities: boolean
  responsibilityCount: number
  hasRequirements: boolean
  requirementCount: number
  hasEmploymentType: boolean
  hasApplicationInstructions: boolean

  // Compensation & logistics
  hasSalary: boolean
  extractedSalaryText?: string
  hasLocation: boolean
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'unspecified'

  // Contact analysis
  contactChannels: {
    hasTelegram: boolean
    hasWhatsApp: boolean
    hasPersonalEmail: boolean
    hasCorporateEmail: boolean
    hasAtsUrl: boolean
    detectedEmails: string[]
  }

  // Scam signals
  scamSignals: {
    hasPaymentRequest: boolean
    hasTrainingFee: boolean
    hasEquipmentPurchase: boolean
    hasMoneyTransferOrCheck: boolean
    hasCryptoPayment: boolean
    hasSensitiveDataUpfront: boolean
    hasUnrealisticIncomeClaim: boolean
    scamKeywordMatches: string[]
  }

  // Ghost signals
  ghostSignals: {
    hasEvergreenLanguage: boolean
    hasTalentPoolLanguage: boolean
    hasNoDefinedScope: boolean
    evergreenMatches: string[]
  }

  // Quality / vagueness signals
  qualitySignals: {
    isOverlyVague: boolean
    vagueCount: number
    vaguePhraseMatches: string[]
    /**
     * Vague strength: 0 = no impact, 1 = minor, 2 = moderate, 3 = strong.
     * Calculated relative to how much real content exists.
     */
    vagueStrength: 0 | 1 | 2 | 3
    hasClearHiringContext: boolean
    /** Rough measure of description coherence (0-10) */
    coherenceScore: number
  }

  titleQuality: TitleQuality
}

// ---------------------------------------------------------------------------
// Phrase lists
// ---------------------------------------------------------------------------

const EVERGREEN_PHRASES = [
  'continuously hiring',
  'always looking for talent',
  'always accepting applications',
  'evergreen opening',
  'talent pool',
  'resume database',
  'future opportunities',
  'pipeline requisition',
  'general interest',
  'always open',
  'rolling hiring',
  'general application',
  'future openings',
  'build our talent pipeline',
  'no specific opening',
]

const VAGUE_PHRASES = [
  'rockstar',
  'ninja',
  'self-starter',
  'wear many hats',
  'fast-paced environment',
  'fast-paced',
  'hit the ground running',
  'superhero',
  'work hard play hard',
  'like a family',
  'do whatever it takes',
  'go-getter',
  'results-driven',
  'synergy',
  'thought leader',
  'competitive salary',
  'passionate about',
  'dynamic environment',
  'team player',
]

const SCAM_PAYMENT_PHRASES = [
  'application fee',
  'training fee',
  'equipment fee',
  'background check fee',
  'refundable deposit',
  'purchase equipment',
  'wire transfer',
  'cashier check',
  'cashier\'s check',
  'crypto payment',
  'usdt',
  'bitcoin',
  'buy software',
  'send money back',
  'task earning',
  'daily payout guaranteed',
  'pay for training',
  'course fee',
  'registration fee',
]

const SENSITIVE_PII_PHRASES = [
  'bank account number',
  'social security number',
  'ssn required',
  'passport copy',
  'credit card details',
  'direct deposit authorization',
  'send your id',
  'upload your passport',
  'national id number',
]

const PROMOTIONAL_TITLE_WORDS = [
  'urgent',
  'immediate',
  'asap',
  'hiring now',
  'multiple openings',
  'various roles',
  'earn',
  'make money',
  'work from home job',
  'online job',
  'part time job',
  'freelance work',
  '!',
  '!!!',
]

// ---------------------------------------------------------------------------
// Title quality evaluator
// ---------------------------------------------------------------------------

export function evaluateTitleQuality(title: string): TitleQuality {
  const trimmed = title.trim()

  if (!trimmed) {
    return {
      score: 0,
      isSpammy: false,
      hasMultipleRoles: false,
      hasSuspiciousCaps: false,
      hasPromotionalWording: false,
      detail: 'No title provided.',
    }
  }

  const lower = trimmed.toLowerCase()
  let score = 10
  const issues: string[] = []

  // Promotional / spammy wording
  const hasPromotionalWording = PROMOTIONAL_TITLE_WORDS.some((w) => lower.includes(w))
  if (hasPromotionalWording) {
    score -= 4
    issues.push('contains promotional wording')
  }

  // Multiple roles crammed into one title
  const hasMultipleRoles =
    (trimmed.match(/\//g) || []).length >= 2 ||
    /\band\b.*(engineer|developer|manager|designer|analyst)/i.test(trimmed)
  if (hasMultipleRoles) {
    score -= 2
    issues.push('appears to list multiple unrelated roles')
  }

  // Suspicious ALL-CAPS (more than 2 consecutive uppercase words)
  const hasSuspiciousCaps = /\b[A-Z]{4,}\b/.test(trimmed) && trimmed !== trimmed.toUpperCase()
  if (hasSuspiciousCaps) {
    score -= 2
    issues.push('unusual capitalization')
  }

  // Excessive punctuation or symbols
  const excessivePunctuation = (trimmed.match(/[!?*#@]{2,}/g) || []).length > 0
  if (excessivePunctuation) {
    score -= 3
    issues.push('excessive punctuation')
  }

  // Very short (1-2 characters after trim) but not empty
  if (trimmed.length < 4) {
    score -= 5
    issues.push('extremely short or nonsensical title')
  }

  // Generic one-word titles like "Developer" or "Manager" — small penalty only
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length
  if (wordCount === 1 && trimmed.length > 3) {
    score -= 2
    issues.push('overly generic single-word title')
  }

  const isSpammy = hasPromotionalWording || excessivePunctuation || hasSuspiciousCaps

  score = Math.max(0, Math.min(10, score))

  const detail =
    issues.length > 0
      ? `Title issues: ${issues.join('; ')}.`
      : 'Title appears to be a recognizable professional role.'

  return {
    score,
    isSpammy,
    hasMultipleRoles,
    hasSuspiciousCaps,
    hasPromotionalWording,
    detail,
  }
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseJobDescription(text: string): ParsedJobDescription {
  const trimmed = text.trim()

  const emptyResult: ParsedJobDescription = {
    hasText: false,
    wordCount: 0,
    hasResponsibilities: false,
    responsibilityCount: 0,
    hasRequirements: false,
    requirementCount: 0,
    hasEmploymentType: false,
    hasApplicationInstructions: false,
    hasSalary: false,
    hasLocation: false,
    workArrangement: 'unspecified',
    contactChannels: {
      hasTelegram: false,
      hasWhatsApp: false,
      hasPersonalEmail: false,
      hasCorporateEmail: false,
      hasAtsUrl: false,
      detectedEmails: [],
    },
    scamSignals: {
      hasPaymentRequest: false,
      hasTrainingFee: false,
      hasEquipmentPurchase: false,
      hasMoneyTransferOrCheck: false,
      hasCryptoPayment: false,
      hasSensitiveDataUpfront: false,
      hasUnrealisticIncomeClaim: false,
      scamKeywordMatches: [],
    },
    ghostSignals: {
      hasEvergreenLanguage: false,
      hasTalentPoolLanguage: false,
      hasNoDefinedScope: true,
      evergreenMatches: [],
    },
    qualitySignals: {
      isOverlyVague: false,
      vagueCount: 0,
      vaguePhraseMatches: [],
      vagueStrength: 0,
      hasClearHiringContext: false,
      coherenceScore: 0,
    },
    titleQuality: evaluateTitleQuality(''),
  }

  if (!trimmed) return emptyResult

  const lower = trimmed.toLowerCase()
  const words = trimmed.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // -------------------------------------------------------------------------
  // Responsibilities detection
  // -------------------------------------------------------------------------
  const hasRespHeader =
    /responsibilities|what you['']ll do|key duties|role responsibilities|day in the life|your role|what you will do/i.test(
      trimmed
    )
  const bulletLines = trimmed.match(/^[\s]*[•\-\*]\s+.+/gm) || []
  const bulletCount = bulletLines.length
  const hasResponsibilities = hasRespHeader || bulletCount >= 3
  const responsibilityCount = bulletCount > 0 ? bulletCount : hasResponsibilities ? 3 : 0

  // -------------------------------------------------------------------------
  // Requirements detection
  // -------------------------------------------------------------------------
  const hasReqHeader =
    /requirements|qualifications|what we['']re looking for|skills required|who you are|experience required|must have|nice to have/i.test(
      trimmed
    )
  const hasRequirements =
    hasReqHeader ||
    (bulletCount >= 2 &&
      /experience|years|proficient|degree|bachelor|master|familiar with|knowledge of/i.test(lower))

  // -------------------------------------------------------------------------
  // Employment type
  // -------------------------------------------------------------------------
  const hasEmploymentType =
    /\bfull[\s-]?time\b|\bpart[\s-]?time\b|\bcontract\b|\bfreelance\b|\bpermanent\b|\btemporary\b|\binternship\b|\bco[\s-]?op\b/i.test(
      lower
    )

  // -------------------------------------------------------------------------
  // Application instructions
  // -------------------------------------------------------------------------
  const hasApplicationInstructions =
    /apply (via|through|at|on|using)|submit your (resume|cv|application)|send (your )?(resume|cv) to|apply by|how to apply|application process/i.test(
      lower
    )

  // -------------------------------------------------------------------------
  // Salary detection
  // -------------------------------------------------------------------------
  const salaryRegex =
    /(\$|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\b₹\b)\s?\d{2,3}(,\d{3})*(\s?-\s?(\$|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\b₹\b)?\s?\d{2,3}(,\d{3})*)?(\s?\/(yr|year|hr|hour|mo|month|k|annum))?/i
  const salaryMatch = trimmed.match(salaryRegex)
  const hasSalary =
    !!salaryMatch ||
    /\bsalary\b|\bcompensation\b|\bpay range\b|\/hr\b|\/year\b|k\/yr\b|\bper hour\b|\bper year\b|\bbase pay\b|\btotal comp\b/i.test(
      lower
    )
  const extractedSalaryText = salaryMatch ? salaryMatch[0] : undefined

  // -------------------------------------------------------------------------
  // Location & work arrangement
  // -------------------------------------------------------------------------
  const isRemote = /\bremote\b|\bwork from home\b|\bwfh\b|\banywhere\b|\bdistributed team\b/i.test(lower)
  const isHybrid = /\bhybrid\b|\bflexible location\b|\bpartial remote\b/i.test(lower)
  const isOnsite =
    /\bon[\s-]?site\b|\bin[\s-]?office\b|\bheadquarters\b|\boffice location\b|\bbased in\b/i.test(lower)
  const workArrangement = isRemote ? 'remote' : isHybrid ? 'hybrid' : isOnsite ? 'onsite' : 'unspecified'
  const hasLocation = isRemote || isHybrid || isOnsite || /\blocation\s*:/i.test(lower)

  // -------------------------------------------------------------------------
  // Contact channels
  // -------------------------------------------------------------------------
  const hasTelegram = /\btelegram\b|t\.me\/|@[a-z0-9_]+/i.test(lower) && /\btelegram\b|t\.me\//i.test(lower)
  const hasWhatsApp = /\bwhatsapp\b|wa\.me\//i.test(lower)

  const emailRegex = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/gi
  const detectedEmails: string[] = trimmed.match(emailRegex) || []
  const personalDomains = /gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|protonmail\.com/i
  const hasPersonalEmail = detectedEmails.some((e) => personalDomains.test(e))
  const hasCorporateEmail =
    detectedEmails.some((e) => !personalDomains.test(e)) ||
    (/@[a-z0-9\-]+\.(com|io|co|org|net|tech|ai|dev)/i.test(lower) && !hasPersonalEmail)
  const hasAtsUrl =
    /greenhouse\.io|lever\.co|workday\.com|bamboohr\.com|ashbyhq\.com|jobvite\.com|icims\.com|smartrecruiters\.com/i.test(
      lower
    )

  // -------------------------------------------------------------------------
  // Scam signals
  // -------------------------------------------------------------------------
  const scamKeywordMatches: string[] = []
  SCAM_PAYMENT_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) scamKeywordMatches.push(phrase)
  })

  const hasPaymentRequest =
    lower.includes('application fee') ||
    lower.includes('background check fee') ||
    lower.includes('registration fee') ||
    lower.includes('upfront payment')
  const hasTrainingFee =
    lower.includes('training fee') ||
    lower.includes('pay for training') ||
    lower.includes('course fee')
  const hasEquipmentPurchase =
    lower.includes('purchase equipment') ||
    lower.includes('buy equipment') ||
    lower.includes('check for equipment') ||
    lower.includes('equipment deposit')
  const hasMoneyTransferOrCheck =
    lower.includes('cashier check') ||
    lower.includes("cashier's check") ||
    lower.includes('deposit check') ||
    lower.includes('wire transfer') ||
    lower.includes('send money back') ||
    lower.includes('money order')
  const hasCryptoPayment =
    lower.includes('crypto payment') ||
    lower.includes('usdt') ||
    lower.includes('bitcoin') ||
    lower.includes('ethereum payment')

  let hasSensitiveDataUpfront = false
  SENSITIVE_PII_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) hasSensitiveDataUpfront = true
  })

  // Unrealistic income: "$X/week for Y hours" or "earn $X daily" type patterns
  const hasUnrealisticIncomeClaim =
    /earn \$[0-9,]+\s*(per|\/)\s*(day|week|hour) (with no|without|for minimal)/i.test(lower) ||
    /make \$[0-9,]+(\/|\s*per\s*)(week|day) (working|for) \d/i.test(lower) ||
    /guaranteed \$[0-9,]+\s*(daily|weekly|per week|per day)/i.test(lower) ||
    /no experience.{0,30}make \$[0-9]/i.test(lower)

  // -------------------------------------------------------------------------
  // Ghost signals
  // -------------------------------------------------------------------------
  const evergreenMatches: string[] = []
  EVERGREEN_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) evergreenMatches.push(phrase)
  })

  const hasEvergreenLanguage = evergreenMatches.length > 0
  const hasTalentPoolLanguage =
    lower.includes('talent pool') ||
    lower.includes('resume database') ||
    lower.includes('future openings') ||
    lower.includes('build our pipeline')
  const hasNoDefinedScope =
    !hasResponsibilities && wordCount < 120 && (hasEvergreenLanguage || lower.includes('general application'))

  // -------------------------------------------------------------------------
  // Vague language — proportional strength
  // -------------------------------------------------------------------------
  const vaguePhraseMatches: string[] = []
  VAGUE_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) vaguePhraseMatches.push(phrase)
  })
  const vagueCount = vaguePhraseMatches.length

  // Measure useful content: responsibilities + requirements + salary
  const usefulContentScore =
    (hasResponsibilities ? 2 : 0) +
    (hasRequirements ? 2 : 0) +
    (hasSalary ? 1 : 0) +
    (hasLocation ? 1 : 0) +
    (wordCount >= 150 ? 1 : 0)

  let vagueStrength: 0 | 1 | 2 | 3 = 0
  if (vagueCount === 0) {
    vagueStrength = 0
  } else if (vagueCount <= 2 && usefulContentScore >= 4) {
    // A couple of buzzwords in an otherwise solid posting — minimal impact
    vagueStrength = 1
  } else if (vagueCount <= 4 && usefulContentScore >= 2) {
    vagueStrength = 2
  } else if (vagueCount >= 3 && usefulContentScore <= 1) {
    // Many buzzwords + almost no real content
    vagueStrength = 3
  } else {
    vagueStrength = vagueCount >= 5 ? 3 : 2
  }

  const isOverlyVague = vagueStrength >= 2

  // -------------------------------------------------------------------------
  // Coherence score (0-10) — rough measure for quality
  // -------------------------------------------------------------------------
  let coherenceScore = 0
  if (wordCount >= 30) coherenceScore += 2
  if (wordCount >= 100) coherenceScore += 2
  if (hasResponsibilities) coherenceScore += 2
  if (hasRequirements) coherenceScore += 2
  if (hasSalary || hasLocation || hasEmploymentType) coherenceScore += 1
  if (vagueStrength >= 3) coherenceScore = Math.max(0, coherenceScore - 3)
  coherenceScore = Math.min(10, coherenceScore)

  const hasClearHiringContext =
    hasResponsibilities &&
    hasRequirements &&
    (hasLocation || workArrangement !== 'unspecified' || hasEmploymentType)

  return {
    hasText: true,
    wordCount,
    hasResponsibilities,
    responsibilityCount,
    hasRequirements,
    requirementCount: hasRequirements ? Math.max(3, bulletCount) : 0,
    hasEmploymentType,
    hasApplicationInstructions,
    hasSalary,
    extractedSalaryText,
    hasLocation,
    workArrangement,
    contactChannels: {
      hasTelegram,
      hasWhatsApp,
      hasPersonalEmail,
      hasCorporateEmail,
      hasAtsUrl,
      detectedEmails,
    },
    scamSignals: {
      hasPaymentRequest,
      hasTrainingFee,
      hasEquipmentPurchase,
      hasMoneyTransferOrCheck,
      hasCryptoPayment,
      hasSensitiveDataUpfront,
      hasUnrealisticIncomeClaim,
      scamKeywordMatches,
    },
    ghostSignals: {
      hasEvergreenLanguage,
      hasTalentPoolLanguage,
      hasNoDefinedScope,
      evergreenMatches,
    },
    qualitySignals: {
      isOverlyVague,
      vagueCount,
      vaguePhraseMatches,
      vagueStrength,
      hasClearHiringContext,
      coherenceScore,
    },
    titleQuality: evaluateTitleQuality(''), // placeholder — caller passes title separately
  }
}
