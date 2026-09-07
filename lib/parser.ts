/**
 * Job Description Analyzer & Text Parser Engine V2
 * Extracts key structural elements, scam patterns, evergreen language,
 * and role clarity from raw job posting text.
 */

export interface ParsedJobDescription {
  hasText: boolean
  wordCount: number
  hasResponsibilities: boolean
  responsibilityCount: number
  hasRequirements: boolean
  requirementCount: number
  hasSalary: boolean
  extractedSalaryText?: string
  hasLocation: boolean
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'unspecified'
  contactChannels: {
    hasTelegram: boolean
    hasWhatsApp: boolean
    hasPersonalEmail: boolean
    hasCorporateEmail: boolean
    hasAtsUrl: boolean
  }
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
  ghostSignals: {
    hasEvergreenLanguage: boolean
    hasTalentPoolLanguage: boolean
    hasNoDefinedScope: boolean
    evergreenMatches: string[]
  }
  qualitySignals: {
    isOverlyVague: boolean
    vaguePhraseMatches: string[]
    hasClearRoleTitle: boolean
    hasClearHiringContext: boolean
  }
}

const EVERGREEN_PHRASES = [
  'continuously hiring',
  'always looking for talent',
  'evergreen opening',
  'talent pool',
  'resume database',
  'future opportunities',
  'pipeline requisition',
  'general interest',
  'always open',
  'unspecified start date',
]

const VAGUE_PHRASES = [
  'rockstar',
  'ninja',
  'self-starter',
  'wear many hats',
  'fast-paced environment',
  'hit the ground running',
  'superhero',
  'work hard play hard',
  'like a family',
  'do whatever it takes',
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
  'crypto payment',
  'usdt',
  'bitcoin',
  'buy software',
  'send money back',
  'task earning',
  'daily payout guaranteed',
]

const SENSITIVE_PII_PHRASES = [
  'bank account number upfront',
  'social security number in application',
  'passport copy before interview',
  'credit card details',
  'direct deposit authorization upfront',
]

export function parseJobDescription(text: string): ParsedJobDescription {
  const trimmed = text.trim()
  if (!trimmed) {
    return {
      hasText: false,
      wordCount: 0,
      hasResponsibilities: false,
      responsibilityCount: 0,
      hasRequirements: false,
      requirementCount: 0,
      hasSalary: false,
      hasLocation: false,
      workArrangement: 'unspecified',
      contactChannels: {
        hasTelegram: false,
        hasWhatsApp: false,
        hasPersonalEmail: false,
        hasCorporateEmail: false,
        hasAtsUrl: false,
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
        hasNoDefinedScope: false,
        evergreenMatches: [],
      },
      qualitySignals: {
        isOverlyVague: false,
        vaguePhraseMatches: [],
        hasClearRoleTitle: false,
        hasClearHiringContext: false,
      },
    }
  }

  const lower = trimmed.toLowerCase()
  const words = trimmed.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Responsibilities & Requirements detection
  const hasRespHeader = /responsibilities|what you'll do|key duties|role responsibilities|day in the life|your role/i.test(trimmed)
  const bulletCount = (trimmed.match(/^[•\-\*]\s+/gm) || []).length
  const hasResponsibilities = hasRespHeader || bulletCount >= 3

  const hasReqHeader = /requirements|qualifications|what we're looking for|skills required|who you are|experience required/i.test(trimmed)
  const hasRequirements = hasReqHeader || (bulletCount >= 2 && /experience|years|proficient|degree|bachelor|master/i.test(lower))

  // Salary extraction in text
  const salaryRegex = /(\$|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\b₹\b)\s?\d{2,3}(,\d{3})*(\s?-\s?(\$|\bUSD\b|\bEUR\b|\bGBP\b|\bINR\b|\b₹\b)?\s?\d{2,3}(,\d{3})*)?(\s?\/(yr|year|hr|hour|mo|month|k|annum))?/i
  const salaryMatch = trimmed.match(salaryRegex)
  const hasSalary = !!salaryMatch || /salary|compensation|pay range|\/hr|\/year|k\/yr|per hour|per year/i.test(lower)
  const extractedSalaryText = salaryMatch ? salaryMatch[0] : undefined

  // Location & Work Arrangement
  const isRemote = /remote|work from home|wfh|anywhere|distributed team/i.test(lower)
  const isHybrid = /hybrid|flexible location|partial remote/i.test(lower)
  const isOnsite = /on-site|onsite|in-office|headquarters|office location/i.test(lower)
  const workArrangement = isRemote ? 'remote' : isHybrid ? 'hybrid' : isOnsite ? 'onsite' : 'unspecified'
  const hasLocation = isRemote || isHybrid || isOnsite || /location:|city:|state:|country:|based in/i.test(lower)

  // Contact Channels
  const hasTelegram = /telegram|t\.me\/|\b@t_me\b/i.test(lower)
  const hasWhatsApp = /whatsapp|wa\.me\/|\bwa_me\b/i.test(lower)
  const hasPersonalEmail = /@[gmail|yahoo|hotmail|outlook|icloud]\.com/i.test(lower)
  const hasCorporateEmail = /@[a-z0-9-]+\.(com|io|co|org|net|tech|ai|dev)/i.test(lower) && !hasPersonalEmail
  const hasAtsUrl = /greenhouse\.io|lever\.co|workday\.com|bamboohr\.com|ashbyhq\.com|jobvite\.com|icims\.com|smartrecruiters\.com/i.test(lower)

  // Scam Signals
  const scamKeywordMatches: string[] = []
  SCAM_PAYMENT_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) {
      scamKeywordMatches.push(phrase)
    }
  })

  const hasPaymentRequest = lower.includes('application fee') || lower.includes('background check fee') || lower.includes('registration fee')
  const hasTrainingFee = lower.includes('training fee') || lower.includes('pay for training') || lower.includes('course fee')
  const hasEquipmentPurchase = lower.includes('purchase equipment') || lower.includes('buy equipment from our vendor') || lower.includes('check for equipment')
  const hasMoneyTransferOrCheck = lower.includes('cashier check') || lower.includes('deposit check') || lower.includes('wire transfer') || lower.includes('send money back')
  const hasCryptoPayment = lower.includes('crypto payment') || lower.includes('usdt') || lower.includes('bitcoin')
  
  let hasSensitiveDataUpfront = false
  SENSITIVE_PII_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) {
      hasSensitiveDataUpfront = true
    }
  })

  const hasUnrealisticIncomeClaim = /make \$[1-9]\d{3,}\/week for 2 hours|guaranteed \$[1-9]\d{3,}|no experience needed make \$[0-9]{2,}\/hr/i.test(lower)

  // Ghost Signals
  const evergreenMatches: string[] = []
  EVERGREEN_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) {
      evergreenMatches.push(phrase)
    }
  })

  const hasEvergreenLanguage = evergreenMatches.length > 0
  const hasTalentPoolLanguage = lower.includes('talent pool') || lower.includes('resume database') || lower.includes('future openings')
  const hasNoDefinedScope = !hasResponsibilities && wordCount < 120 && (hasEvergreenLanguage || lower.includes('general application'))

  // Quality Signals
  const vaguePhraseMatches: string[] = []
  VAGUE_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase)) {
      vaguePhraseMatches.push(phrase)
    }
  })

  const isOverlyVague = vaguePhraseMatches.length >= 2 || (wordCount < 60 && !hasResponsibilities)
  const hasClearRoleTitle = words.length > 3 && !isOverlyVague
  const hasClearHiringContext = hasResponsibilities && hasRequirements && (hasLocation || workArrangement !== 'unspecified')

  return {
    hasText: true,
    wordCount,
    hasResponsibilities,
    responsibilityCount: bulletCount > 0 ? bulletCount : hasResponsibilities ? 3 : 0,
    hasRequirements,
    requirementCount: hasRequirements ? 3 : 0,
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
      vaguePhraseMatches,
      hasClearRoleTitle,
      hasClearHiringContext,
    },
  }
}
