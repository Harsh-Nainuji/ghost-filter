import { evaluateJobPosting } from '../lib/engine'
import { parseJobDescription } from '../lib/parser'
import type { JobFormInput } from '../types'

console.log('==================================================')
console.log('       GHOSTFILTER ENGINE AUDIT SUITE             ')
console.log('==================================================\n')

// 1. Deliberately Bad Job Posting
const badJobFormInput: JobFormInput = {
  jobUrl: '',
  jobTitle: 'Rokstar Seneor Engneer - Immediate Joiner',
  companyName: 'Unspecified Inc',
  platform: 'linkedin',
  postingAge: 'over-two-months',
  salaryMentioned: 'no',
  applicationMethod: ['easy-apply'],
  reposted: 'yes',
  companySize: 'unknown',
  description: 'We are looking for a rockstar superhero ninja to join our fast-paced environment and wear many hats! Must be willing to do whatever it takes. Work hard play hard like a family! Hit the ground running today!',
  contactInfo: '',
}

console.log('--- 1. NORMALIZED INPUT OBJECT PASSED TO ENGINE ---')
console.log(JSON.stringify(badJobFormInput, null, 2))
console.log('\n--- PARSED TEXT ANALYSIS RESULT ---')
const parsedBad = parseJobDescription(badJobFormInput.description)
console.log(JSON.stringify(parsedBad, null, 2))

console.log('\n--- 2. SIGNAL-BY-SIGNAL TRACE FOR BAD JOB POSTING ---')
const breakdownBad = evaluateJobPosting(badJobFormInput)

console.log(`\nFINAL COMPUTED SCORES:`)
console.log(`Ghost Risk:  ${breakdownBad.ghostRisk} / 100`)
console.log(`Scam Risk:   ${breakdownBad.scamRisk} / 100`)
console.log(`Job Quality: ${breakdownBad.jobQuality} / 100`)
console.log(`Verdict:     "${breakdownBad.verdict}"`)
console.log(`Summary:     "${breakdownBad.summary}"`)

console.log(`\nALL EVIDENCE & POINT CONTRIBUTIONS:`)
console.log(`----------------------------------------------------------------------------------`)
console.log(`CATEGORY  | SIGNAL NAME                      | STATE    | IMPACT`)
console.log(`----------------------------------------------------------------------------------`)
breakdownBad.allEvidence.forEach((e) => {
  const cat = e.category.toUpperCase().padEnd(9)
  const name = e.name.padEnd(32)
  const state = e.state.padEnd(8)
  const impact = (e.scoreImpact >= 0 ? `+${e.scoreImpact}` : `${e.scoreImpact}`).padStart(6)
  console.log(`${cat} | ${name} | ${state} | ${impact}`)
})
console.log(`----------------------------------------------------------------------------------`)

// 3. Controlled Test Cases 1 - 10
console.log('\n==================================================')
console.log('          CONTROLLED TEST CASES (1 - 10)          ')
console.log('==================================================\n')

const testCases: { name: string; input: JobFormInput; expectedNote: string }[] = [
  {
    name: 'Case 1: Everything Legitimate',
    input: {
      jobTitle: 'Senior React Engineer',
      companyName: 'Stripe',
      platform: 'company-website',
      postingAge: 'today',
      salaryMentioned: 'yes',
      applicationMethod: ['external-ats'],
      reposted: 'no',
      companySize: '1000+',
      description: 'Senior React Engineer at Stripe. Responsibilities:\n- Build high performance web applications in React and TypeScript.\n- Maintain component library.\nRequirements:\n- 5+ years frontend experience.\nSalary: $160,000 - $190,000 / year.',
    },
    expectedNote: 'Low Ghost Risk (<=15), 0 Scam Risk, High Quality (>=80)',
  },
  {
    name: 'Case 2: Only No Salary',
    input: {
      jobTitle: 'Senior Software Engineer',
      companyName: 'TechCorp',
      platform: 'company-website',
      postingAge: 'today',
      salaryMentioned: 'no',
      applicationMethod: ['external-ats'],
      reposted: 'no',
      companySize: '201-1000',
      description: 'Senior Software Engineer. Responsibilities:\n- Build web apps.\nRequirements:\n- 5+ years experience.',
    },
    expectedNote: 'Quality penalized for no salary (-10), Ghost Risk 0',
  },
  {
    name: 'Case 3: Only Reposted',
    input: {
      jobTitle: 'Software Engineer',
      companyName: 'TechCorp',
      platform: 'company-website',
      postingAge: 'today',
      salaryMentioned: 'yes',
      applicationMethod: ['external-ats'],
      reposted: 'yes',
      companySize: '201-1000',
      description: 'Software Engineer. Responsibilities:\n- Build web apps.\nRequirements:\n- 3+ years experience.\nSalary: $120,000 / year.',
    },
    expectedNote: 'Ghost Risk +30 for Reposted = 30 / 100',
  },
  {
    name: 'Case 4: Only Terrible Description',
    input: {
      jobTitle: 'Engineer',
      companyName: 'Company Inc',
      platform: 'company-website',
      postingAge: 'today',
      salaryMentioned: 'yes',
      applicationMethod: ['external-ats'],
      reposted: 'no',
      companySize: '51-200',
      description: 'Rockstar needed! Must wear many hats and hit the ground running! Work hard play hard!',
    },
    expectedNote: 'Low Quality (<50), Ghost Risk low (0) because reposted=no and age=today',
  },
  {
    name: 'Case 5: Reposted + Terrible Description',
    input: {
      jobTitle: 'Engineer',
      companyName: 'Company Inc',
      platform: 'company-website',
      postingAge: 'today',
      salaryMentioned: 'yes',
      applicationMethod: ['external-ats'],
      reposted: 'yes',
      companySize: '51-200',
      description: 'Rockstar needed! Must wear many hats and hit the ground running! Work hard play hard!',
    },
    expectedNote: 'Ghost Risk 30 (reposted=yes), Low Quality (<50)',
  },
  {
    name: 'Case 6: Reposted + No Salary + Terrible Description',
    input: {
      jobTitle: 'Engineer',
      companyName: 'Company Inc',
      platform: 'linkedin',
      postingAge: 'over-two-months',
      salaryMentioned: 'no',
      applicationMethod: ['easy-apply'],
      reposted: 'yes',
      companySize: 'unknown',
      description: 'Rockstar needed! Must wear many hats and hit the ground running! Work hard play hard!',
    },
    expectedNote: 'Ghost Risk 70 (30 reposted + 25 age + 15 easy-apply), Quality < 40',
  },
  {
    name: 'Case 7: Legitimate Company + No Salary + Detailed Description',
    input: {
      jobTitle: 'Lead Architect',
      companyName: 'Enterprise Org',
      platform: 'company-website',
      postingAge: 'this-week',
      salaryMentioned: 'no',
      applicationMethod: ['external-ats'],
      reposted: 'no',
      companySize: '1000+',
      description: 'Lead Architect. Responsibilities:\n- Lead cloud architecture migration.\n- Manage team of 8 engineers.\nRequirements:\n- 10+ years enterprise architecture experience.',
    },
    expectedNote: 'High Job Quality despite no salary, Ghost Risk 0',
  },
  {
    name: 'Case 8: Old Posting + Official Careers Page + Detailed Description',
    input: {
      jobTitle: 'Staff Backend Engineer',
      companyName: 'Enterprise Org',
      platform: 'company-website',
      postingAge: 'over-two-months',
      salaryMentioned: 'yes',
      applicationMethod: ['external-ats'],
      reposted: 'no',
      companySize: '1000+',
      description: 'Staff Backend Engineer. Responsibilities:\n- Design distributed storage services.\nRequirements:\n- 8+ years Go/Java experience.\nSalary: $200,000 / year.',
    },
    expectedNote: 'Ghost Risk 25 (over 60 days age), Quality high (90+)',
  },
  {
    name: 'Case 9: Unknown Repost Status',
    input: {
      jobTitle: 'Full Stack Engineer',
      companyName: 'Startup',
      platform: 'linkedin',
      postingAge: 'unknown',
      salaryMentioned: 'unknown',
      applicationMethod: [],
      reposted: 'not-sure',
      companySize: 'unknown',
      description: 'Full Stack Engineer. Responsibilities:\n- Build React & Node apps.\nRequirements:\n- 3+ years experience.',
    },
    expectedNote: 'Ghost Risk 0 (Unknown signals = 0 penalty), Unverified signals populated',
  },
  {
    name: 'Case 10: Missing Description',
    input: {
      jobTitle: 'Marketing Manager',
      companyName: 'Agency',
      platform: 'linkedin',
      postingAge: 'this-week',
      salaryMentioned: 'no',
      applicationMethod: ['easy-apply'],
      reposted: 'not-sure',
      companySize: '11-50',
      description: '',
    },
    expectedNote: 'Job Quality low (30 base), Ghost Risk 15 (easy-apply)',
  },
]

testCases.forEach((tc, idx) => {
  const res = evaluateJobPosting(tc.input)
  console.log(`--- CASE ${idx + 1}: ${tc.name} ---`)
  console.log(`Expected: ${tc.expectedNote}`)
  console.log(`Actual Ghost Risk:  ${res.ghostRisk} / 100`)
  console.log(`Actual Scam Risk:   ${res.scamRisk} / 100`)
  console.log(`Actual Job Quality: ${res.jobQuality} / 100`)
  console.log(`Verdict: "${res.verdict}"`)
  console.log(`Warnings Count: ${res.strongestWarnings.length}, Positives Count: ${res.positiveEvidence.length}, Unknowns Count: ${res.unverifiedSignals.length}\n`)
})
