import { evaluateJobPosting } from '../lib/engine'
import type { JobFormInput } from '../types'

function runTests() {
  console.log('==================================================')
  console.log('   GHOSTFILTER V2 — AUTOMATED REGRESSION SUITE   ')
  console.log('==================================================\n')

  let passed = 0
  let total = 0

  const assert = (condition: boolean, testName: string, detail?: string) => {
    total++
    if (condition) {
      console.log(`[PASS] ${testName}`)
      passed++
    } else {
      console.error(`[FAIL] ${testName} -> ${detail || 'Assertion failed'}`)
    }
  }

  // 1. Legitimate Tech Role
  const legitInput: JobFormInput = {
    jobTitle: 'Senior React Developer',
    companyName: 'Stripe',
    platform: 'company-website',
    postingAge: 'today',
    salaryMentioned: 'yes',
    applicationMethod: ['external-ats', 'company-website'],
    reposted: 'no',
    companySize: '1000+',
    description: `We are hiring a Senior React Developer to join our Billing UI team.
    Responsibilities:
    - Build customer-facing payment dashboards in React and TypeScript.
    - Optimize core web vitals and frontend bundle sizes.
    - Collaborate with product managers and backend engineers.
    Requirements:
    - 5+ years of experience with modern frontend frameworks.
    - Deep knowledge of TypeScript, CSS, and browser performance.
    Salary range: $160,000 - $190,000 / year + equity.
    Apply directly on our Greenhouse careers page.`,
  }
  const legitResult = evaluateJobPosting(legitInput)
  assert(legitResult.ghostRisk <= 15, 'Legitimate Job: Ghost Risk <= 15', `Got ${legitResult.ghostRisk}`)
  assert(legitResult.scamRisk === 0, 'Legitimate Job: Scam Risk === 0', `Got ${legitResult.scamRisk}`)
  assert(legitResult.jobQuality >= 75, 'Legitimate Job: Job Quality >= 75', `Got ${legitResult.jobQuality}`)

  // 2. Poor Quality Job (Not a Scam, Not a Ghost)
  const poorInput: JobFormInput = {
    jobTitle: 'Developer',
    companyName: 'Acme',
    platform: 'indeed',
    postingAge: 'this-week',
    salaryMentioned: 'no',
    applicationMethod: ['easy-apply'],
    reposted: 'no',
    companySize: '11-50',
    description: 'Looking for a rockstar developer who wears many hats. Work hard play hard.',
  }
  const poorResult = evaluateJobPosting(poorInput)
  assert(poorResult.scamRisk === 0, 'Poor Quality Job: Scam Risk === 0', `Got ${poorResult.scamRisk}`)
  assert(poorResult.jobQuality < 50, 'Poor Quality Job: Job Quality < 50', `Got ${poorResult.jobQuality}`)

  // 3. Classic Ghost Job
  const ghostInput: JobFormInput = {
    jobTitle: 'Product Designer',
    companyName: 'GenericCorp',
    platform: 'linkedin',
    postingAge: 'over-two-months',
    salaryMentioned: 'no',
    applicationMethod: ['easy-apply'],
    reposted: 'yes',
    companySize: '201-1000',
    description: 'We are continuously accepting applications for future talent pool positions. Resume database requisition.',
  }
  const ghostResult = evaluateJobPosting(ghostInput)
  assert(ghostResult.ghostRisk >= 60, 'Ghost Job: Ghost Risk >= 60', `Got ${ghostResult.ghostRisk}`)
  assert(ghostResult.scamRisk === 0, 'Ghost Job: Scam Risk === 0', `Got ${ghostResult.scamRisk}`)

  // 4. Upfront Payment Scam Role
  const scamInput: JobFormInput = {
    jobTitle: 'Data Entry Assistant',
    companyName: 'QuickCash LLC',
    platform: 'other',
    postingAge: 'today',
    salaryMentioned: 'yes',
    applicationMethod: ['email-only'],
    reposted: 'no',
    companySize: '1-10',
    description: 'Remote position. Requires $50 background check fee and equipment purchase from vendor via wire transfer. Contact recruiter on Telegram @quickcash_recruiter.',
  }
  const scamResult = evaluateJobPosting(scamInput)
  assert(scamResult.scamRisk >= 70, 'Scam Job: Scam Risk >= 70', `Got ${scamResult.scamRisk}`)

  // 5. Missing Data Zero Penalty Rule
  const missingDataInput: JobFormInput = {
    jobTitle: 'Frontend Engineer',
    companyName: 'Vercel',
    platform: 'company-website',
    postingAge: 'unknown',
    salaryMentioned: 'unknown',
    applicationMethod: [],
    reposted: 'not-sure',
    companySize: 'unknown',
    description: 'Responsibilities: Build modern UI components.',
  }
  const missingResult = evaluateJobPosting(missingDataInput)
  assert(missingResult.ghostRisk <= 10, 'Missing Data Zero Penalty: Ghost Risk <= 10', `Got ${missingResult.ghostRisk}`)
  assert(missingResult.unverifiedSignals.length >= 3, 'Missing Data Zero Penalty: Has Unverified Signals', `Got ${missingResult.unverifiedSignals.length}`)

  console.log(`\n==================================================`)
  console.log(`   TEST RESULTS: ${passed} / ${total} PASSED`)
  console.log(`==================================================\n`)

  if (passed !== total) {
    process.exit(1)
  }
}

runTests()
