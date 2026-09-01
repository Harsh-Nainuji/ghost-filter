# GhostFilter

A browser-based tool that helps you estimate whether a job posting shows common signs of being a ghost job.

**Live Demo:** https://ghost-filter-seven.vercel.app/

**GitHub:** https://github.com/Harsh-Nainuji

## What is GhostFilter?

GhostFilter checks a job posting against a set of common warning signs, such as:

* How long the job has been posted
* Whether a salary is listed
* How candidates are asked to apply
* How detailed the job description is
* Whether the job has been reposted
* Use of vague or generic language
* Whether the company can be verified

Each signal adds a certain number of points to the final score.

The result is a score from **0 to 100**, where a higher score means the posting shows more potential warning signs.

GhostFilter is a heuristic tool. It does not determine whether a company is actually hiring or whether a job is fake.

## Why I Built It

Ghost jobs are frustrating for job seekers because a posting can look legitimate while the company may not currently be hiring for the role.

I wanted to build a simple tool that turns the available information in a job posting into something easier to evaluate.

The main focus was transparency. Instead of hiding the scoring behind an opaque model, GhostFilter shows which signals affected the result and why.

## Features

### Ghost Job Score

The scoring system evaluates 8 signals and produces a score from 0 to 100.

### Signal Breakdown

Each flagged signal is shown separately so you can see what contributed to the score.

### Diagnostic Scan

The evaluation includes a short scanning sequence that shows the tool processing the job information instead of instantly displaying the result.

### Research References

Signals include references to research and industry reports used when designing the scoring rules.

### Job History

Previous checks are saved locally in the browser. The history page lets you filter results by risk level and view the distribution of checked jobs.

### Local Storage

Job data and history are stored in the browser using `localStorage`.

There is no backend database for user data.

### Responsive Interface

The application is designed to work across desktop and mobile screen sizes.

### Reduced Motion Support

Background animations respect the user's `prefers-reduced-motion` setting.

## How the Score Works

GhostFilter uses a weighted scoring system rather than machine learning.

| Signal             | Maximum Points |
| ------------------ | -------------: |
| Posting Age        |             15 |
| Salary Mentioned   |             15 |
| Application Method |             15 |
| Description Length |             10 |
| Platform           |             10 |
| Reposted Status    |             15 |
| Vague Language     |             10 |
| Company Size       |             10 |
| **Total**          |        **100** |

The score is then grouped into four levels:

|  Score | Risk Level |
| -----: | ---------- |
|   0–25 | Low        |
|  26–50 | Moderate   |
|  51–75 | High       |
| 76–100 | Critical   |

For example, a job that has been online for several months, has no salary information, has been reposted multiple times, and uses very vague language will receive a higher score than a detailed job posted recently through a company's careers page.

## How It Works

The application runs entirely in the browser.

```text
Job Posting Information
        ↓
8 Heuristic Checks
        ↓
Weighted Score
        ↓
Risk Classification
        ↓
Signal Breakdown
        ↓
Saved Locally in Browser
```

The scoring logic is separated from the UI, which makes the rules easier to understand and modify.

## Tech Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS v4
* Recharts
* Lucide React
* localStorage
* Vercel

## Project Structure

```text
app/
  Application pages and layouts

components/
  UI components and score visualization

lib/
  Scoring logic
  Signal definitions
  Local storage utilities
```

The exact structure may change as the project evolves.

## Running Locally

### Requirements

* Node.js 18 or newer
* npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/Harsh-Nainuji/ghost-filter.git
cd ghost-filter
npm install
```

### Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Create a production build

```bash
npm run build
```

## Privacy

GhostFilter is designed to keep the information entered by the user on their device.

* No backend database is used for job checks.
* Job history is stored in browser `localStorage`.
* The scoring calculation runs in the browser.
* The application does not need an API key to perform a check.

## Limitations

GhostFilter should be treated as a decision-support tool, not a definitive ghost job detector.

A high score does not prove that a job is fake, and a low score does not prove that a company is actively hiring.

The result depends on the information available in the job posting and the rules used by the scoring system.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
