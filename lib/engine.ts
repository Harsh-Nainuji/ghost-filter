/**
 * GhostFilter V2 Scoring & Evidence Engine
 * Computes 3 independent scores: Ghost Risk, Scam Risk, Job Quality.
 * Implements a strict 3-state evidence system (Positive, Negative, Unknown)
 * where unknown values carry ZERO penalty.
 */

import type { JobFormInput, ScoreBreakdown, EvidenceItem, SignalCitation } from '@/types'
import { parseJobDescription } from './parser'
import { signalCitations } from './signals'

export function evaluateJobPosting(input: JobFormInput): ScoreBreakdown {
  const parsed = parseJobDescription(input.description || '')
  const evidence: EvidenceItem[] = []

  // -------------------------------------------------------------
  // 1. GHOST RISK EVALUATION (0 - 100)
  // -------------------------------------------------------------
  let ghostPoints = 0

  // Reposting History Signal
  if (input.reposted === 'yes') {
    ghostPoints += 30
    evidence.push({
      id: 'ghost-reposted-yes',
      name: 'Repeated Posting History',
      category: 'ghost',
      state: 'negative',
      title: 'Listing Marked as Reposted',
      detail: 'This role has been repeatedly published without being filled.',
      explanation: 'Repeated posting without headcount fulfillment is the strongest indicator of a ghost job or passive resume harvest.',
      scoreImpact: +30,
      citation: signalCitations.reposted,
    })
  } else if (input.reposted === 'no') {
    evidence.push({
      id: 'ghost-reposted-no',
      name: 'Single Initial Posting',
      category: 'ghost',
      state: 'positive',
      title: 'First-Time Original Posting',
      detail: 'Not marked as a recycled or reposted role.',
      explanation: 'Original listings carry significantly higher probability of active headcount approval.',
      scoreImpact: 0,
      citation: signalCitations.reposted,
    })
  } else {
    evidence.push({
      id: 'ghost-reposted-unknown',
      name: 'Reposting History',
      category: 'ghost',
      state: 'unknown',
      title: 'Reposting History Unverified',
      detail: 'Not enough historical data provided to determine repost frequency.',
      explanation: 'Unknown repost history is held neutral and produces zero score penalty.',
      scoreImpact: 0,
      citation: signalCitations.reposted,
    })
  }

  // Posting Age Signal
  if (input.postingAge === 'over-two-months') {
    ghostPoints += 25
    evidence.push({
      id: 'ghost-age-over-60',
      name: 'Stale Posting Age (>60 Days)',
      category: 'ghost',
      state: 'negative',
      title: 'Listing Active > 60 Days',
      detail: `Marked as posted ${input.postingAge.replaceAll('-', ' ')}.`,
      explanation: 'Most urgent open requisitions are filled within 30 days. Roles open beyond 60 days are frequently ghost posts.',
      scoreImpact: +25,
      citation: signalCitations.postingAge,
    })
  } else if (input.postingAge === 'one-to-two-months') {
    ghostPoints += 15
    evidence.push({
      id: 'ghost-age-30-60',
      name: 'Aging Posting (30-60 Days)',
      category: 'ghost',
      state: 'negative',
      title: 'Listing Active 30–60 Days',
      detail: 'Job has been live for over a month.',
      explanation: 'Aging postings indicate either high candidate drop-off or passive recruitment.',
      scoreImpact: +15,
      citation: signalCitations.postingAge,
    })
  } else if (input.postingAge === 'today' || input.postingAge === 'this-week') {
    evidence.push({
      id: 'ghost-age-recent',
      name: 'Recent Active Posting',
      category: 'ghost',
      state: 'positive',
      title: 'Fresh Requisition (< 7 Days)',
      detail: `Posted ${input.postingAge.replaceAll('-', ' ')}.`,
      explanation: 'Newly published listings represent immediate hiring needs.',
      scoreImpact: 0,
      citation: signalCitations.postingAge,
    })
  } else if (input.postingAge === 'two-to-four-weeks') {
    ghostPoints += 5
    evidence.push({
      id: 'ghost-age-moderate',
      name: 'Standard Active Window',
      category: 'ghost',
      state: 'positive',
      title: 'Posted 2–4 Weeks Ago',
      detail: 'Normal active hiring timeline.',
      explanation: 'Standard interview cycles typically span 2 to 4 weeks.',
      scoreImpact: 0,
      citation: signalCitations.postingAge,
    })
  } else {
    evidence.push({
      id: 'ghost-age-unknown',
      name: 'Posting Date',
      category: 'ghost',
      state: 'unknown',
      title: 'Posting Date Unspecified',
      detail: 'Date of posting was not provided.',
      explanation: 'Missing posting date carries zero penalty.',
      scoreImpact: 0,
      citation: signalCitations.postingAge,
    })
  }

  // Evergreen & Talent Pool Language Signal
  if (parsed.ghostSignals.hasEvergreenLanguage || parsed.ghostSignals.hasTalentPoolLanguage) {
    ghostPoints += 20
    evidence.push({
      id: 'ghost-evergreen-detected',
      name: 'Evergreen / Talent Pool Phrasing',
      category: 'ghost',
      state: 'negative',
      title: 'Talent Pipelining Phrases Found',
      detail: `Matched: ${parsed.ghostSignals.evergreenMatches.join(', ') || 'Talent pool language'}`,
      explanation: 'Phrases such as "always hiring" or "future pipeline" explicitly confirm there is no specific approved opening currently.',
      scoreImpact: +20,
      citation: signalCitations.vagueLanguage,
    })
  } else if (parsed.hasText) {
    evidence.push({
      id: 'ghost-evergreen-none',
      name: 'Specific Hiring Intent',
      category: 'ghost',
      state: 'positive',
      title: 'No Evergreen Phrasing Detected',
      detail: 'The job description reflects a specific, immediate hiring requisition.',
      explanation: 'Specific project or team hiring context strongly indicates real headcount.',
      scoreImpact: 0,
      citation: signalCitations.vagueLanguage,
    })
  }

  // Application Route Signal
  const hasDirectAts = input.applicationMethod.includes('external-ats') || input.applicationMethod.includes('company-website') || parsed.contactChannels.hasAtsUrl
  const isEasyApplyOnly = input.applicationMethod.includes('easy-apply') && !hasDirectAts

  if (hasDirectAts) {
    evidence.push({
      id: 'ghost-app-ats',
      name: 'Direct Company ATS Route',
      category: 'ghost',
      state: 'positive',
      title: 'Official Company Careers / ATS Link',
      detail: 'Applications route directly through an enterprise ATS (Greenhouse, Lever, Workday, etc.).',
      explanation: 'Direct ATS integration requires verified corporate configuration and active req IDs.',
      scoreImpact: 0,
      citation: signalCitations.applicationMethod,
    })
  } else if (isEasyApplyOnly) {
    ghostPoints += 15
    evidence.push({
      id: 'ghost-app-easyonly',
      name: 'Aggregator-Only Application',
      category: 'ghost',
      state: 'negative',
      title: 'Easy-Apply / One-Click Route Only',
      detail: 'No direct company careers link or ATS provided.',
      explanation: 'Easy Apply without a corresponding company portal is frequently used to passively collect resumes.',
      scoreImpact: +15,
      citation: signalCitations.applicationMethod,
    })
  } else if (input.applicationMethod.length === 0) {
    evidence.push({
      id: 'ghost-app-unknown',
      name: 'Application Method',
      category: 'ghost',
      state: 'unknown',
      title: 'Application Route Unspecified',
      detail: 'No application route selected.',
      explanation: 'Unspecified application route is unverified and produces zero penalty.',
      scoreImpact: 0,
      citation: signalCitations.applicationMethod,
    })
  }

  const finalGhostRisk = Math.min(100, Math.max(0, ghostPoints))

  // -------------------------------------------------------------
  // 2. SCAM RISK EVALUATION (0 - 100)
  // -------------------------------------------------------------
  let scamPoints = 0

  // Payment Requests / Financial Demands (Strong Scam Signal)
  if (parsed.scamSignals.hasPaymentRequest || parsed.scamSignals.hasTrainingFee || parsed.scamSignals.hasEquipmentPurchase) {
    scamPoints += 50
    evidence.push({
      id: 'scam-fee-demand',
      name: 'Upfront Payment / Fee Demand',
      category: 'scam',
      state: 'negative',
      title: 'Financial Demand Detected',
      detail: `Detected: ${parsed.scamSignals.scamKeywordMatches.join(', ') || 'Upfront fee request'}`,
      explanation: 'Legitimate employers NEVER require candidates to pay application fees, training costs, or equipment purchase deposits.',
      scoreImpact: +50,
      citation: {
        finding: 'Legitimate employers cover recruitment and onboarding costs. Demands for money or equipment purchases prior to work are almost universally fraudulent.',
        source: 'FTC Consumer Alert on Job Scams',
        searchQuery: 'employment scam application fee check cashing equipment purchase',
      },
    })
  }

  // Fake Check / Money Transfer Schemes
  if (parsed.scamSignals.hasMoneyTransferOrCheck || parsed.scamSignals.hasCryptoPayment) {
    scamPoints += 50
    evidence.push({
      id: 'scam-fake-check',
      name: 'Fake Check / Crypto Transfer',
      category: 'scam',
      state: 'negative',
      title: 'Financial Transfer or Crypto Scheme',
      detail: 'Mention of check cashing, wire transfers, or cryptocurrency payments.',
      explanation: 'Fake-check scams involve sending a fraudulent check and asking the victim to wire back funds before the bank discovers the check is fake.',
      scoreImpact: +50,
      citation: {
        finding: 'Fake check recruitment scams are among the most financially damaging employment frauds reported to consumer protection agencies.',
        source: 'FBI Internet Crime Complaint Center (IC3)',
        searchQuery: 'job scam fake check wire transfer crypto reimbursement',
      },
    })
  }

  // Suspicious Contact Channels
  const contactText = (input.contactInfo || '').toLowerCase() + ' ' + (input.description || '').toLowerCase()
  const usesTelegram = parsed.contactChannels.hasTelegram || contactText.includes('telegram') || contactText.includes('t.me')
  const usesWhatsApp = parsed.contactChannels.hasWhatsApp || contactText.includes('whatsapp') || contactText.includes('wa.me')

  if (usesTelegram || (usesWhatsApp && (scamPoints > 0 || parsed.contactChannels.hasPersonalEmail))) {
    const pts = usesTelegram ? 35 : 25
    scamPoints += pts
    evidence.push({
      id: 'scam-suspicious-messaging',
      name: 'Unverified Messaging Channel',
      category: 'scam',
      state: 'negative',
      title: `${usesTelegram ? 'Telegram' : 'WhatsApp'} Recruitment Channel`,
      detail: 'Hiring communication takes place exclusively via personal messaging platforms.',
      explanation: 'Legitimate corporate recruitment utilizes verified email domains or official ATS candidate portals rather than anonymous messaging apps.',
      scoreImpact: +pts,
      citation: {
        finding: 'Scammers heavily favor Telegram and WhatsApp due to end-to-end encryption and anonymous account creation.',
        source: 'Better Business Bureau Scam Tracker',
        searchQuery: 'recruiter reaching out on telegram whatsapp scam',
      },
    })
  }

  // Sensitive PII Request Upfront
  if (parsed.scamSignals.hasSensitiveDataUpfront) {
    scamPoints += 40
    evidence.push({
      id: 'scam-pii-upfront',
      name: 'Premature Sensitive Data Request',
      category: 'scam',
      state: 'negative',
      title: 'Banking / PII Details Requested Early',
      detail: 'Requests bank details, SSN, or passport copies before establishing a formal employment contract.',
      explanation: 'Personal identification documents and financial account details should only be provided during verified onboarding after a formal offer.',
      scoreImpact: +40,
      citation: {
        finding: 'Identity theft scams often disguise identity document collection as standard recruitment screening.',
        source: 'Identity Theft Resource Center',
        searchQuery: 'job application asking for ssn bank account before offer',
      },
    })
  }

  // Unrealistic Income Promises
  if (parsed.scamSignals.hasUnrealisticIncomeClaim) {
    scamPoints += 25
    evidence.push({
      id: 'scam-unrealistic-pay',
      name: 'Unrealistic Income Claim',
      category: 'scam',
      state: 'negative',
      title: 'Extremely High Pay for Minimal Work',
      detail: 'Promises high guaranteed income for trivial daily tasks or minimal effort.',
      explanation: 'Offers of substantial compensation without required experience or skills are a classic lure for task-based or advance-fee scams.',
      scoreImpact: +25,
      citation: {
        finding: 'Task-based work scams promise high hourly rates for minimal work to entice victims into depositing funds.',
        source: 'Global Anti-Scam Alliance',
        searchQuery: 'job scam high daily pay simple tasks no experience',
      },
    })
  }

  // Positive Scam Evidence if clean
  if (scamPoints === 0) {
    evidence.push({
      id: 'scam-clean',
      name: 'Standard Professional Hiring',
      category: 'scam',
      state: 'positive',
      title: 'No Fraudulent / Scam Indicators Detected',
      detail: 'No financial demands, suspicious messaging, or premature sensitive data requests found.',
      explanation: 'The recruitment process aligns with standard corporate hiring protocols.',
      scoreImpact: 0,
    })
  }

  const finalScamRisk = Math.min(100, Math.max(0, scamPoints))

  // -------------------------------------------------------------
  // 3. JOB QUALITY EVALUATION (0 - 100)
  // Higher score = Better Quality
  // -------------------------------------------------------------
  let qualityPoints = 30 // Base baseline

  if (input.jobTitle.trim().length > 3) {
    qualityPoints += 15
    evidence.push({
      id: 'quality-title',
      name: 'Clear Role Title',
      category: 'quality',
      state: 'positive',
      title: 'Well-Defined Position Title',
      detail: `Role title: "${input.jobTitle}"`,
      explanation: 'A specific title establishes clear domain accountability.',
      scoreImpact: +15,
    })
  }

  if (parsed.hasResponsibilities) {
    qualityPoints += 20
    evidence.push({
      id: 'quality-resp',
      name: 'Detailed Responsibilities',
      category: 'quality',
      state: 'positive',
      title: 'Concrete Role Scope & Duties',
      detail: `${parsed.responsibilityCount > 0 ? parsed.responsibilityCount + ' explicit duties' : 'Core responsibilities outlined'}.`,
      explanation: 'Detailed responsibilities demonstrate a well-scoped position approved by hiring managers.',
      scoreImpact: +20,
    })
  } else if (parsed.hasText) {
    evidence.push({
      id: 'quality-resp-missing',
      name: 'Vague Responsibilities',
      category: 'quality',
      state: 'negative',
      title: 'Missing Core Responsibilities',
      detail: 'No specific day-to-day duties or deliverables specified in description.',
      explanation: 'Postings without clear duties make candidate fit evaluation difficult.',
      scoreImpact: -15,
    })
  }

  if (parsed.hasRequirements) {
    qualityPoints += 15
    evidence.push({
      id: 'quality-req',
      name: 'Explicit Qualifications',
      category: 'quality',
      state: 'positive',
      title: 'Clear Skills & Experience Metrics',
      detail: 'Outlines specific skills, education, or experience prerequisites.',
      explanation: 'Explicit requirements help candidate self-selection and indicate structured screening.',
      scoreImpact: +15,
    })
  }

  if (input.salaryMentioned === 'yes' || parsed.hasSalary) {
    qualityPoints += 20
    evidence.push({
      id: 'quality-salary',
      name: 'Transparent Compensation',
      category: 'quality',
      state: 'positive',
      title: 'Salary / Compensation Disclosed',
      detail: parsed.extractedSalaryText ? `Disclosed pay: ${parsed.extractedSalaryText}` : 'Compensation range stated.',
      explanation: 'Disclosing compensation increases applicant trust and indicates an approved budget.',
      scoreImpact: +20,
      citation: signalCitations.salaryMentioned,
    })
  } else if (input.salaryMentioned === 'no') {
    evidence.push({
      id: 'quality-salary-missing',
      name: 'Compensation Undisclosed',
      category: 'quality',
      state: 'negative',
      title: 'No Pay Range Provided',
      detail: 'Listing omits salary ranges.',
      explanation: 'Missing compensation reduces posting transparency but does not prove a job is fake.',
      scoreImpact: -10,
      citation: signalCitations.salaryMentioned,
    })
  } else {
    evidence.push({
      id: 'quality-salary-unknown',
      name: 'Compensation Status',
      category: 'quality',
      state: 'unknown',
      title: 'Salary Status Unspecified',
      detail: 'User did not specify salary presence.',
      explanation: 'Unspecified salary status is held neutral.',
      scoreImpact: 0,
      citation: signalCitations.salaryMentioned,
    })
  }

  if (parsed.hasLocation || parsed.workArrangement !== 'unspecified') {
    qualityPoints += 10
    evidence.push({
      id: 'quality-location',
      name: 'Clear Work Arrangement',
      category: 'quality',
      state: 'positive',
      title: `Location: ${parsed.workArrangement.toUpperCase()}`,
      detail: 'Work arrangement and geographic boundaries are clear.',
      explanation: 'Clear work logistics ensure candidates understand attendance requirements.',
      scoreImpact: +10,
    })
  }

  const finalJobQuality = Math.min(100, Math.max(0, qualityPoints))

  // -------------------------------------------------------------
  // 4. VERDICT GENERATOR (Nuanced & Responsible)
  // -------------------------------------------------------------
  let verdictTitle = 'Proceed With Standard Application'
  let summary = 'The job posting demonstrates normal structural quality with no severe warning signs.'

  if (finalScamRisk > 40) {
    verdictTitle = 'High Caution — Scam Risk Indicators Detected'
    summary = 'Significant warning signs related to payment demands, suspicious messaging, or unusual compensation claims were detected. Do not transfer funds or share sensitive identity documents.'
  } else if (finalGhostRisk >= 60) {
    verdictTitle = 'Elevated Ghost Indicators — Proceed With Caution'
    summary = 'Multiple signals suggest this listing may be an aging post, reposted role, or passive talent pipeline without an immediate approved hire timeline.'
  } else if (finalGhostRisk >= 35) {
    verdictTitle = 'Moderate Risk — Potential Warning Signs Detected'
    summary = 'Some risk indicators were identified (such as posting age or general language). Verify role activity on the official company website before investing heavy effort.'
  } else if (finalJobQuality < 40) {
    verdictTitle = 'Low Posting Quality — Needs Verification'
    summary = 'The posting is poorly detailed or incomplete. While no fraud signals were detected, confirm specific duties with the recruiter.'
  } else {
    verdictTitle = 'Low Risk — Appears Structurally Legitimate'
    summary = 'The job posting provides detailed expectations, standard application routes, and clean communication channels with low risk markers.'
  }

  // Categorize Evidence Lists
  const strongestWarnings = evidence
    .filter((e) => e.state === 'negative')
    .sort((a, b) => Math.abs(b.scoreImpact) - Math.abs(a.scoreImpact))

  const positiveEvidence = evidence
    .filter((e) => e.state === 'positive')

  const unverifiedSignals = evidence
    .filter((e) => e.state === 'unknown')

  return {
    ghostRisk: finalGhostRisk,
    scamRisk: finalScamRisk,
    jobQuality: finalJobQuality,
    verdict: verdictTitle,
    summary,
    strongestWarnings,
    positiveEvidence,
    unverifiedSignals,
    allEvidence: evidence,
  }
}
