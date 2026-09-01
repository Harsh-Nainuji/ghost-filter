# GhostFilter — Heuristic Ghost Job Diagnostic Engine

A transparent, client-side diagnostic application built to evaluate job postings against statistically verified hiring heuristics to estimate the risk of a posting being a "ghost job."

---

## Executive Overview

An estimated 43% of hiring managers admit to keeping job postings active with no current intent to hire. Companies maintain ghost jobs for passive resume harvesting, talent pooling, or creating an artificial perception of company growth.

GhostFilter provides job seekers with a transparent, rules-based diagnostic instrument. By evaluating structured input metadata—such as posting age, salary transparency, application routing, description vagueness, and repost history—GhostFilter calculates a weighted Ghost Score (0–100) alongside cited industry research.

---

## Key Features

- **8-Signal Heuristic Scoring Engine**: Evaluates job metadata against statistical hiring red flags using a deterministic point allocation formula.
- **Real-State Diagnostic Progress Scan**: Features an active diagnostic scanning transition (`INITIALIZING SCAN` -> `EVALUATING SIGNALS` -> `COMPUTING RISK INDEX`) with real progress indication.
- **Precision Instrument Gauge (`ScoreMeter`)**: Custom SVG half-circle arc meter featuring numeric count-up animation, perimeter tickmarks, and diagnostic index metadata.
- **Integrated Research Citations**: Displays verified research findings (Clarify Capital, LinkedIn Talent Trends, Harvard Business Review) and dynamic Google Search queries for every flagged signal.
- **Client-Side Privacy**: All processing and data storage execute locally inside the browser (`localStorage`). No backend servers, no data collection, no tracking.
- **Dataset History Dashboard**: Personal timeline and dataset management featuring a risk filter bar (`ALL`, `LOW RISK`, `MODERATE`, `HIGH RISK`, `CRITICAL`), Recharts risk distribution chart, and mobile-optimized stacked timeline records.
- **Technical Atmosphere**: Dark graphite theme (`#0a0c0c`), ambient teal radial fields, crisp 56px grid lines, interactive scanline radar, and responsive glass surfaces (`backdrop-blur-md`).
- **Accessibility**: Native support for `@media (prefers-reduced-motion: reduce)` to pause background animations gracefully.

---

## Heuristic Algorithm & Signal Matrix

The engine evaluates 8 weighted signals up to a maximum score of 100 points:

| Signal | Max Points | Risk Criteria & Weights | Research & Citation Basis |
| :--- | :---: | :--- | :--- |
| **Posting Age** | 15 pts | `Over 2 Months`: 15pts • `1–2 Months`: 10pts • `2–4 Weeks`: 5pts • `< 2 Weeks`: 0pts | *Clarify Capital Hiring Report*: Most legitimate urgent roles are filled within 30 days of posting. |
| **Salary Mentioned** | 15 pts | `No Salary`: 15pts • `Salary Listed`: 0pts | *LinkedIn Talent Trends Report*: Salary-transparent posts receive 30% more applicants. Unapproved headcount rarely lists compensation. |
| **Application Method** | 15 pts | `No Clear Method`: 15pts • `Email Only`: 12pts • `Easy Apply`: 8pts • `External ATS`: 0pts | *Clarify Capital & Industry Reports*: Easy Apply is heavily utilized for passive candidate harvesting without active intent to hire. |
| **Description Length** | 10 pts | `< 200 words`: 10pts • `200–399 words`: 5pts • `400+ words`: 0pts | *Harvard Business Review*: Short, vague job descriptions correlate strongly with undefined job scopes and unapproved headcount. |
| **Platform** | 10 pts | `Other`: 8pts • `Naukri`: 6pts • `Indeed`: 5pts • `LinkedIn`: 2pts • `Careers Page`: 0pts | *Resume Genius Analysis*: Job postings listed only on aggregators without a company careers page counterpart are difficult to verify. |
| **Reposted Status** | 15 pts | `Yes`: 15pts • `Not Sure`: 5pts • `No`: 0pts | *LinkedIn Internal Data*: Reposting the same listing repeatedly is the single strongest ghost job indicator. |
| **Vague Language** | 10 pts | `5+ buzzwords`: 10pts • `3–4`: 7pts • `1–2`: 4pts • `0`: 0pts *(Scans for terms like "rockstar", "self-starter", "wear many hats", "fast-paced")* | *Harvard Business Review*: Buzzword-heavy descriptions consistently obscure undefined responsibilities and lack of scope. |
| **Company Size** | 10 pts | `Unknown Size`: 5pts • `Verifiable Size`: 0pts | *Resume Genius Ghost Job Analysis*: Unverifiable company size prevents validation of whether headcount or budget exists for the role. |

### Risk Classification Spectrum

- **0 – 25**: Low Risk Detected (*"Looks Legitimate"*)
- **26 – 50**: Moderate Risk Detected (*"Proceed Carefully"*)
- **51 – 75**: High Risk Detected (*"High Ghost Risk"*)
- **76 – 100**: Critical Risk Detected (*"Very Likely a Ghost"*)

---

## Architecture & Technology Stack

### System Architecture

GhostFilter is engineered as a static, single-page client application built on Next.js App Router.

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Vanilla CSS Variables & Tailwind CSS v4
- **UI Icons**: Lucide React
- **Data Visualization**: Recharts
- **Typography**: Geist & Geist Mono (via Google Fonts)

### Data Flow & Persistence Model

```
[ User Input Form ] 
        │
        ▼
[ Heuristic Scoring Engine (lib/algorithm.ts) ]
        │
        ├── Calculates Weighted Score (0-100)
        ├── Maps Citations & Search Queries (lib/signals.ts)
        └── Increments Total Checks Counter
        │
        ▼
[ UI Render & Local Persistence (lib/storage.ts) ]
        │
        ├── Render Diagnostic ScoreMeter & Signals
        └── Write Record to localStorage ("ghostfilter_jobs")
```

All data processing occurs in-browser. No network requests are sent to external backends during evaluation.

---

## Deployment on Vercel

GhostFilter is optimized for one-click deployment on [Vercel](https://vercel.com).

### Deployment Steps

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and apply the optimal build configuration:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Click **Deploy**.

Because GhostFilter is a static client-side application, pages are pre-rendered at build time for instant global CDN delivery.

---

## Local Development & Setup

### Prerequisites

- Node.js v18.0.0 or higher
- npm, pnpm, or yarn

### Installation Commands

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ghost-filter.git
   cd ghost-filter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run production build**:
   ```bash
   npm run build
   ```

---

## Privacy & Data Security

GhostFilter operates under a strict zero-telemetry policy:
- No user input data or job descriptions leave the client device.
- All scoring logic executes locally in Web API execution contexts.
- Saved records remain entirely within browser `localStorage`.

---

## License

Distributed under the MIT License. See `LICENSE` for details.
