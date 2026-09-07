/**
 * GhostFilter V2 — Regression Test Suite
 *
 * 15 test cases covering all audit findings.
 * For each case the test comment explains:
 *   WHY it should or should not be risky
 *   WHICH signals should drive the result
 *   WHAT should limit the risk
 *   WHICH category is primarily affected
 */

import { evaluateJobPosting } from '../lib/engine'
import type { JobFormInput } from '../types'

type TestResult = { ghostRisk: number; scamRisk: number; jobQuality: number }

let passed = 0
let failed = 0

function assert(
  condition: boolean,
  testName: string,
  result: TestResult,
  explanation: string
) {
  if (condition) {
    console.log(`  [PASS] ${testName}`)
    passed++
  } else {
    console.error(`  [FAIL] ${testName}`)
    console.error(`         Scores: Ghost=${result.ghostRisk} Scam=${result.scamRisk} Quality=${result.jobQuality}`)
    console.error(`         Reason: ${explanation}`)
    failed++
  }
}

function section(title: string) {
  console.log(`\n── ${title}`)
}

console.log('══════════════════════════════════════════════════════')
console.log('   GHOSTFILTER V2 — REGRESSION TEST SUITE            ')
console.log('══════════════════════════════════════════════════════\n')

// ─────────────────────────────────────────────────────────────────────────────
// TEST A — Perfectly legitimate job
// WHY low risk: fresh, verified ATS, detailed, salary disclosed
// LIMIT: all positive signals present
// AFFECTED: all three should be clean
// ─────────────────────────────────────────────────────────────────────────────
section('Test A — Perfectly Legitimate Job')
const testA: JobFormInput = {
  jobTitle: 'Senior React Developer',
  companyName: 'Stripe',
  platform: 'company-website',
  postingAge: 'today',
  salaryMentioned: 'yes',
  applicationMethod: 'external-ats',
  reposted: 'no',
  companySize: '1000+',
  description: `We are hiring a Senior React Developer to join our Billing UI team at Stripe.

Responsibilities:
- Build and maintain customer-facing payment dashboards in React and TypeScript.
- Optimize core web vitals and reduce frontend bundle sizes.
- Collaborate with product managers, designers, and backend engineers.
- Participate in code reviews and help establish frontend coding standards.
- Write unit and integration tests for all new features.

Requirements:
- 5+ years of professional experience with React or similar modern frameworks.
- Strong TypeScript, CSS, and browser performance proficiency.
- Experience with testing libraries such as Jest and React Testing Library.
- Familiarity with CI/CD pipelines and version control.

Compensation: $160,000–$190,000/year + equity + benefits.
Work arrangement: Full-time, hybrid (San Francisco, CA).
Apply via our Greenhouse careers page.`,
  contactInfo: 'recruiting@stripe.com',
}
const rA = evaluateJobPosting(testA)
assert(rA.ghostRisk <= 15, 'Ghost Risk should be very low (≤ 15)', rA, 'Fresh posting + verified ATS + detailed description + no reposting')
assert(rA.scamRisk === 0, 'Scam Risk should be zero', rA, 'No financial demands, no suspicious channels')
assert(rA.jobQuality >= 75, 'Job Quality should be high (≥ 75)', rA, 'Full description with salary, duties, requirements, location')

// ─────────────────────────────────────────────────────────────────────────────
// TEST B — Good job, no salary
// WHY quality impact: salary omitted
// LIMIT: good description otherwise, not a ghost or scam
// AFFECTED: Quality only (small reduction)
// ─────────────────────────────────────────────────────────────────────────────
section('Test B — No Salary, Otherwise Strong Job')
const testB: JobFormInput = {
  jobTitle: 'Backend Engineer',
  companyName: 'Acme Corp',
  platform: 'linkedin',
  postingAge: 'this-week',
  salaryMentioned: 'no',
  applicationMethod: 'external-ats',
  reposted: 'no',
  companySize: '51-200',
  description: `We are looking for a Backend Engineer to work on our core API services.

Responsibilities:
- Design and build scalable REST APIs using Node.js and PostgreSQL.
- Optimize database queries and improve system performance.
- Write technical documentation for APIs.
- Collaborate closely with the frontend team.

Requirements:
- 3+ years of backend development experience.
- Proficiency in Node.js, Express, and PostgreSQL.
- Familiarity with Docker and cloud deployments.

Full-time role, remote-first. Apply via Lever.`,
}
const rB = evaluateJobPosting(testB)
assert(rB.ghostRisk <= 20, 'Ghost Risk should be low (≤ 20)', rB, 'No reposting, fresh, verified ATS, detailed description')
assert(rB.scamRisk === 0, 'Scam Risk should be zero', rB, 'No fraud signals')
assert(rB.jobQuality >= 55, 'Job Quality should be moderate-to-good (≥ 55)', rB, 'Solid description but missing salary disclosure')

// ─────────────────────────────────────────────────────────────────────────────
// TEST C — Terrible job description
// WHY low quality: buzzwords, no responsibilities, no requirements
// LIMIT: freshly posted, not reposted → ghost should stay moderate
// AFFECTED: Quality primarily
// ─────────────────────────────────────────────────────────────────────────────
section('Test C — Terrible Job Description')
const testC: JobFormInput = {
  jobTitle: 'Developer',
  companyName: 'Acme',
  platform: 'indeed',
  postingAge: 'this-week',
  salaryMentioned: 'no',
  applicationMethod: 'easy-apply',
  reposted: 'no',
  companySize: '11-50',
  description: 'Looking for a rockstar ninja developer who wears many hats. Fast-paced environment. Do whatever it takes. Work hard play hard.',
}
const rC = evaluateJobPosting(testC)
assert(rC.scamRisk === 0, 'Scam Risk should be zero (no fraud signals)', rC, 'No payment demands or suspicious channels')
assert(rC.jobQuality < 40, 'Job Quality should be low (< 40)', rC, 'Heavy buzzwords with no responsibilities, requirements, or salary')
// Ghost should be somewhat elevated due to heavy vague language + easy apply, but not extremely high
assert(rC.ghostRisk < 60, 'Ghost Risk should not be extremely high (< 60) for a merely bad posting', rC, 'Bad quality alone should not = ghost job; it is freshly posted with no reposting')

// ─────────────────────────────────────────────────────────────────────────────
// TEST D — Confirmed reposted job
// WHY ghost risk elevated: confirmed repost
// LIMIT: recent posting, some description content
// AFFECTED: Ghost Risk
// ─────────────────────────────────────────────────────────────────────────────
section('Test D — Reposted Job')
const testD: JobFormInput = {
  jobTitle: 'Product Designer',
  companyName: 'DesignCo',
  platform: 'linkedin',
  postingAge: 'two-to-four-weeks',
  salaryMentioned: 'unknown',
  applicationMethod: 'easy-apply',
  reposted: 'yes',
  companySize: '51-200',
  description: `We are looking for a Product Designer to join our growing design team.

Responsibilities:
- Design user interfaces for our mobile applications.
- Collaborate with engineers to implement designs.

Requirements:
- 2+ years of product design experience.
- Proficiency in Figma.`,
}
const rD = evaluateJobPosting(testD)
assert(rD.ghostRisk >= 25, 'Ghost Risk should be elevated (≥ 25) for a confirmed repost', rD, 'Confirmed repost is a meaningful ghost indicator')
assert(rD.ghostRisk < 70, 'Ghost Risk should not be extremely high (< 70) for a single repost without other strong signals', rD, 'Just reposted once + 2-4 weeks old should be notable but not alarming')
assert(rD.scamRisk === 0, 'Scam Risk should be zero', rD, 'No fraud signals')

// ─────────────────────────────────────────────────────────────────────────────
// TEST E — Old job (over 60 days, not reposted)
// WHY ghost elevated: listing age alone
// LIMIT: not reposted, no evergreen language
// AFFECTED: Ghost Risk moderately
// ─────────────────────────────────────────────────────────────────────────────
section('Test E — Old Job (Not Reposted)')
const testE: JobFormInput = {
  jobTitle: 'Data Analyst',
  companyName: 'DataFirm',
  platform: 'indeed',
  postingAge: 'over-two-months',
  salaryMentioned: 'yes',
  applicationMethod: 'unknown',
  reposted: 'no',
  companySize: '201-1000',
  description: `Data Analyst needed to join our analytics team.

Responsibilities:
- Analyze large datasets to identify trends.
- Build dashboards in Tableau and Power BI.
- Support business stakeholders with data insights.

Requirements:
- 2+ years of data analysis experience.
- SQL proficiency required. Python is a plus.
Salary: $70,000–$85,000/year. Full-time, hybrid.`,
}
const rE = evaluateJobPosting(testE)
assert(rE.ghostRisk >= 10, 'Ghost Risk should be somewhat elevated (≥ 10) for a listing over 60 days', rE, 'Age alone is a supporting signal')
assert(rE.ghostRisk < 50, 'Ghost Risk should not be very high (< 50) for old + not reposted with full description', rE, 'Age alone without reposting or evergreen language should not produce very high ghost risk')
assert(rE.scamRisk === 0, 'Scam Risk should be zero', rE, 'No fraud signals')

// ─────────────────────────────────────────────────────────────────────────────
// TEST F — Reposted + old
// WHY ghost elevated: compound evidence (age + repost)
// LIMIT: good description, not evergreen
// AFFECTED: Ghost Risk (compound boost)
// ─────────────────────────────────────────────────────────────────────────────
section('Test F — Reposted + Old')
const testF: JobFormInput = {
  jobTitle: 'Marketing Manager',
  companyName: 'BrandCo',
  platform: 'linkedin',
  postingAge: 'over-two-months',
  salaryMentioned: 'no',
  applicationMethod: 'easy-apply',
  reposted: 'yes',
  companySize: '51-200',
  description: `We are hiring a Marketing Manager.

Responsibilities:
- Develop and execute marketing campaigns.
- Manage social media channels.
- Coordinate with agency partners.

Requirements:
- 3+ years of marketing experience.
- Strong project management skills.

Full-time, on-site in New York.`,
}
const rF = evaluateJobPosting(testF)
// Reposted (22) + old age (15) + compound (10) + easy apply (8) = 55+
assert(rF.ghostRisk >= 45, 'Ghost Risk should be noticeably elevated (≥ 45) for reposted + old', rF, 'Compound evidence: confirmed repost + 60+ day age is a meaningful combination')
assert(rF.scamRisk === 0, 'Scam Risk should be zero', rF, 'No fraud signals')

// ─────────────────────────────────────────────────────────────────────────────
// TEST G — Reposted + old + terrible description
// WHY ghost very high: triple compound evidence
// ALL THREE category affected
// ─────────────────────────────────────────────────────────────────────────────
section('Test G — Reposted + Old + Terrible Description')
const testG: JobFormInput = {
  jobTitle: 'Various Roles Available',
  companyName: 'GenericCorp',
  platform: 'linkedin',
  postingAge: 'three-months-plus',
  salaryMentioned: 'no',
  applicationMethod: 'easy-apply',
  reposted: 'persistent',
  companySize: '201-1000',
  description: 'We are always accepting applications for our talent pool. Join our family. Rockstar self-starter needed. Fast-paced environment. Hit the ground running.',
}
const rG = evaluateJobPosting(testG)
assert(rG.ghostRisk >= 70, 'Ghost Risk should be high (≥ 70) for persistent repost + 90+ days + evergreen + vague', rG, 'Triple compound: old + persistent repost + evergreen/vague scope')
assert(rG.jobQuality < 30, 'Job Quality should be very low (< 30)', rG, 'No real content, heavy buzzwords, no duties, evergreen language')

// ─────────────────────────────────────────────────────────────────────────────
// TEST H — Empty description
// WHY low quality: no content at all
// LIMIT: no false ghost/scam from emptiness alone
// ─────────────────────────────────────────────────────────────────────────────
section('Test H — Empty Description')
const testH: JobFormInput = {
  jobTitle: 'Software Engineer',
  companyName: 'Unknown',
  platform: 'other',
  postingAge: 'unknown',
  salaryMentioned: 'unknown',
  applicationMethod: 'unknown',
  reposted: 'not-sure',
  companySize: 'unknown',
  description: '',
}
const rH = evaluateJobPosting(testH)
assert(rH.jobQuality <= 15, 'Job Quality should be very low (≤ 15) for empty description', rH, 'Empty description means quality can only come from title and other metadata')
assert(rH.scamRisk === 0, 'Scam Risk should be zero for empty description', rH, 'Empty description cannot contain scam signals')
assert(rH.ghostRisk <= 20, 'Ghost Risk should not be high (≤ 20) from empty description alone', rH, 'Empty description should not produce fake ghost risk — only not-sure repost adds a tiny precautionary signal')

// ─────────────────────────────────────────────────────────────────────────────
// TEST I — Classic scam with payment demands
// WHY scam very high: payment fee + wire transfer + telegram
// Ghost not necessarily high
// ─────────────────────────────────────────────────────────────────────────────
section('Test I — Classic Payment Scam')
const testI: JobFormInput = {
  jobTitle: 'Data Entry Assistant',
  companyName: 'QuickCash LLC',
  platform: 'other',
  postingAge: 'today',
  salaryMentioned: 'yes',
  applicationMethod: 'telegram',
  reposted: 'no',
  companySize: '1-10',
  description: 'Remote position available. Requires $50 background check fee payable to our vendor. Equipment purchase via wire transfer required. Contact recruiter on Telegram @quickcash_recruiter for details.',
  contactInfo: 'quickcash_recruiter on Telegram',
}
const rI = evaluateJobPosting(testI)
assert(rI.scamRisk >= 70, 'Scam Risk should be very high (≥ 70)', rI, 'Payment demand + wire transfer + Telegram-only application')

// ─────────────────────────────────────────────────────────────────────────────
// TEST J — Well-written scam (no obvious flags in writing, but financial scheme)
// WHY scam high: payment/check scheme exists despite professional tone
// AFFECTED: Scam Risk
// ─────────────────────────────────────────────────────────────────────────────
section('Test J — Well-Written Scam')
const testJ: JobFormInput = {
  jobTitle: 'Remote Administrative Assistant',
  companyName: 'Global Solutions Ltd',
  platform: 'indeed',
  postingAge: 'this-week',
  salaryMentioned: 'yes',
  applicationMethod: 'email-only',
  reposted: 'no',
  companySize: '11-50',
  description: `We are seeking a detail-oriented Administrative Assistant for a fully remote role.

Responsibilities:
- Manage incoming correspondence and maintain digital filing systems.
- Coordinate schedules and prepare reports for senior management.
- Process incoming payments and deposits using our company system.

Requirements:
- Strong organizational skills and attention to detail.
- Comfortable handling financial transactions.
- Must be willing to receive and deposit cashier checks on behalf of the company.

Compensation: $25/hr. Flexible hours.`,
}
const rJ = evaluateJobPosting(testJ)
assert(rJ.scamRisk >= 40, 'Scam Risk should be elevated (≥ 40) due to fake-check language', rJ, '"Receive and deposit cashier checks on behalf of the company" is a fake-check scam pattern')

// ─────────────────────────────────────────────────────────────────────────────
// TEST K — Poorly written legitimate startup job
// WHY NOT high ghost/scam: fresh, some content, not reposted
// AFFECTED: Quality (low), Ghost (low-moderate), Scam (zero)
// ─────────────────────────────────────────────────────────────────────────────
section('Test K — Poorly Written Legitimate Startup Job')
const testK: JobFormInput = {
  jobTitle: 'Fullstack Dev',
  companyName: 'TinyStartup',
  platform: 'linkedin',
  postingAge: 'this-week',
  salaryMentioned: 'no',
  applicationMethod: 'email-only',
  reposted: 'no',
  companySize: '1-10',
  description: 'Early stage startup looking for a developer who can help build our product. TypeScript, React, Node. Fully remote. Send CV to jobs@tinystartup.io.',
  contactInfo: 'jobs@tinystartup.io',
}
const rK = evaluateJobPosting(testK)
assert(rK.scamRisk === 0, 'Scam Risk should be zero for a legitimate startup job', rK, 'No payment demands, no suspicious channels')
assert(rK.ghostRisk <= 30, 'Ghost Risk should be low-to-moderate (≤ 30) despite minimal description', rK, 'Fresh posting, not reposted — poor quality should not automatically become ghost risk')
assert(rK.jobQuality < 55, 'Job Quality should be below average (< 55)', rK, 'Very short description, no explicit duties, missing salary')

// ─────────────────────────────────────────────────────────────────────────────
// TEST L — Old but legitimate evergreen role (long-standing opening, verified)
// WHY NOT high ghost: verified ATS + detailed + specific despite age
// AFFECTED: Ghost partially (age), offset by positive signals
// ─────────────────────────────────────────────────────────────────────────────
section('Test L — Old But Legitimate Posting')
const testL: JobFormInput = {
  jobTitle: 'Site Reliability Engineer',
  companyName: 'MegaCorp',
  platform: 'company-website',
  postingAge: 'over-two-months',
  salaryMentioned: 'yes',
  applicationMethod: 'external-ats',
  reposted: 'no',
  companySize: '1000+',
  description: `MegaCorp is seeking a Site Reliability Engineer (SRE) to join our Infrastructure team.

Responsibilities:
- Design and maintain highly available distributed systems.
- Lead incident response and post-mortem processes.
- Implement automation for deployment and monitoring.
- Mentor junior engineers on reliability best practices.
- Define and track Service Level Objectives (SLOs).

Requirements:
- 4+ years of SRE or DevOps experience.
- Strong knowledge of Kubernetes, Terraform, and cloud platforms (AWS/GCP).
- Proficiency in Python or Go for automation scripts.
- Experience with observability tooling (Prometheus, Grafana, Datadog).

Compensation: $140,000–$170,000/year + benefits.
Location: Remote, US timezones preferred. Full-time.
Apply via our Workday portal.`,
  contactInfo: 'sre-recruiting@megacorp.com',
}
const rL = evaluateJobPosting(testL)
// Old (15) - ATS offset (-8) - company domain match (-6) - detailed offset (-10) + not-reposted (0) ≈ low
assert(rL.ghostRisk <= 30, 'Ghost Risk should remain moderate or lower (≤ 30) for old but verified + detailed job', rL, 'ATS + detailed description + company domain email should offset posting age')
assert(rL.scamRisk === 0, 'Scam Risk should be zero', rL, 'No fraud signals')
assert(rL.jobQuality >= 70, 'Job Quality should be high (≥ 70)', rL, 'Comprehensive description with salary, duties, requirements, location')

// ─────────────────────────────────────────────────────────────────────────────
// TEST M — Company verified, recruiter domain matches
// WHY positive: domain verification reduces ghost suspicion
// ─────────────────────────────────────────────────────────────────────────────
section('Test M — Company Verified, Recruiter Domain Matches')
const testM: JobFormInput = {
  jobTitle: 'DevOps Engineer',
  companyName: 'stripe',
  platform: 'company-website',
  postingAge: 'two-to-four-weeks',
  salaryMentioned: 'yes',
  applicationMethod: 'company-careers-page',
  reposted: 'no',
  companySize: '1000+',
  description: `Stripe is hiring a DevOps Engineer for our Platform team.

Responsibilities:
- Manage CI/CD pipelines across multiple cloud environments.
- Automate infrastructure provisioning using Terraform.
- Monitor production systems and respond to incidents.

Requirements:
- 3+ years of DevOps or platform engineering experience.
- Strong AWS and Kubernetes knowledge.
- Experience with monitoring tools.

Full-time, hybrid in San Francisco. $130,000–$155,000/year.`,
  contactInfo: 'devops-recruiting@stripe.com',
}
const rM = evaluateJobPosting(testM)
assert(rM.ghostRisk <= 10, 'Ghost Risk should be very low (≤ 10) with domain match + verified route + no repost', rM, 'All positive signals: company domain match, careers page, original post')
assert(rM.scamRisk === 0, 'Scam Risk should be zero', rM, 'No fraud signals')

// ─────────────────────────────────────────────────────────────────────────────
// TEST N — Unverified recruiter domain (personal email, otherwise clean)
// WHY mild warning: personal email is a supporting signal, not proof
// AFFECTED: Ghost slightly
// ─────────────────────────────────────────────────────────────────────────────
section('Test N — Unverified Recruiter Domain (Personal Email)')
const testN: JobFormInput = {
  jobTitle: 'Marketing Coordinator',
  companyName: 'StartupXYZ',
  platform: 'linkedin',
  postingAge: 'this-week',
  salaryMentioned: 'yes',
  applicationMethod: 'email-only',
  reposted: 'no',
  companySize: '1-10',
  description: `We are looking for a Marketing Coordinator to support our growing team.

Responsibilities:
- Create and schedule social media content.
- Support email marketing campaigns.
- Coordinate with design team for assets.

Requirements:
- 1–2 years of marketing experience.
- Comfortable with Mailchimp and Canva.

Full-time, remote. $45,000–$55,000/year.`,
  contactInfo: 'marketer_random123@gmail.com',
}
const rN = evaluateJobPosting(testN)
assert(rN.ghostRisk <= 30, 'Ghost Risk should be low-to-moderate (≤ 30) — personal email is a mild warning, not a verdict', rN, 'Personal email is a supporting signal only; fresh, not reposted, no evergreen language')
assert(rN.scamRisk === 0, 'Scam Risk should be zero for personal email without financial fraud signals', rN, 'Personal email alone is not a scam indicator')

// ─────────────────────────────────────────────────────────────────────────────
// TEST O — WhatsApp-only, no other scam evidence
// WHY NOT high scam: WhatsApp alone without financial fraud is a mild signal
// LIMIT: no payment requests, no sensitive data requests
// ─────────────────────────────────────────────────────────────────────────────
section('Test O — WhatsApp Only, No Other Scam Evidence')
const testO: JobFormInput = {
  jobTitle: 'Sales Executive',
  companyName: 'RegionalSales Ltd',
  platform: 'other',
  postingAge: 'this-week',
  salaryMentioned: 'yes',
  applicationMethod: 'whatsapp',
  reposted: 'no',
  companySize: '11-50',
  description: `We are looking for an experienced Sales Executive to grow our client base in the region.

Responsibilities:
- Identify and prospect new business opportunities.
- Manage client relationships and close deals.
- Report pipeline status to management.

Requirements:
- 2+ years of B2B sales experience.
- Strong communication and negotiation skills.
- Own transport preferred.

Salary: $40,000–$60,000 + commission. Full-time, field-based.
Contact us on WhatsApp to apply: +1 555 123 4567.`,
  contactInfo: '+1 555 123 4567 (WhatsApp)',
}
const rO = evaluateJobPosting(testO)
// WhatsApp (method=whatsapp, description mentions whatsapp) without other scam signals = 15 pts
assert(rO.scamRisk < 35, 'Scam Risk should be low (< 35) for WhatsApp-only without any financial fraud signals', rO, 'WhatsApp alone is common in some regions and markets; without financial fraud indicators, risk should be moderate at most')
assert(rO.ghostRisk <= 25, 'Ghost Risk should be low (≤ 25) for a fresh, not-reposted posting', rO, 'Fresh, not reposted, has content — WhatsApp route does not prove ghost job')

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════')
console.log(`   RESULTS: ${passed} PASSED  /  ${failed} FAILED  /  ${passed + failed} TOTAL`)
console.log('══════════════════════════════════════════════════════\n')

if (failed > 0) {
  process.exit(1)
}
