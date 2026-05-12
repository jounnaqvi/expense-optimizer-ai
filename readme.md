# AI Spend Audit

**Live demo:** [expense-optimizer-ai.vercel.app](https://expense-optimizer-ai.vercel.app)

A focused web product that helps startups and engineering leaders **audit AI tool spend**, **surface concrete savings**, and **share results** with stakeholders—without a login wall for the core audit flow.

---

## Table of contents

1. [Introduction](#introduction)  
2. [Problem statement](#problem-statement)  
3. [Solution overview](#solution-overview)  
4. [Key features](#key-features)    
5. [Screenshots](#screenshots)  
6. [Demo video](#demo-video)  
7. [Tech stack](#tech-stack)  
8. [Folder structure](#folder-structure)  
9. [Installation](#installation)  
10. [Environment variables](#environment-variables)  
11. [Local development](#local-development)  
12. [Deployment](#deployment)  
13. [Audit engine](#audit-engine)  
14. [AI summary](#ai-summary)  
15. [Shareable reports](#shareable-reports)  
16. [Decisions & tradeoffs](#decisions--tradeoffs)  
17. [Lighthouse optimization notes](#lighthouse-optimization-notes)  
18. [Future improvements](#future-improvements)  
19. [Challenges faced](#challenges-faced)  
20. [Credits](#credits)  
21. [License](#license)  

---

## Introduction

**AI Spend Audit** is a Next.js application that combines a **rules-based pricing engine**, **Supabase-backed persistence**, and an **optional LLM-generated narrative** so teams can understand where their AI subscription money goes—and what to change next.

The product is designed for **clarity and speed**: a short form, immediate numbers, charts on the results page, and a **stable, shareable URL** for each audit so finance and leadership can review the same snapshot.

---

## Problem statement

Modern teams stack **many AI products** (IDE assistants, chat models, APIs, and bundled “AI” features). Pricing is fragmented, seats drift, and **monthly burn grows quietly** until someone asks for a spreadsheet nobody has time to maintain.

Teams need a **credible first pass**—not another dashboard that requires weeks of setup—something that:

- Accepts what they already know (tools, plans, rough spend, seats).
- Produces **actionable deltas** (plan changes, seat reality checks, free-tier alternatives where relevant).
- Can be **shared** without exporting PDFs or granting org-wide access.

---

## Solution overview

| Layer | Responsibility |
|--------|----------------|
| **Client (Next.js)** | Audit form, validation, charts, share UX, calls to Supabase and the summary Edge Function. |
| **`lib/audit-engine.ts`** | Deterministic savings logic from curated plan pricing and use-case hints. |
| **Supabase (Postgres)** | Stores audits and optional lead captures; RLS policies allow public insert/select for frictionless audits and sharing. |
| **Edge Function (`generate-summary`)** | Optional OpenAI call with **deterministic fallback** if no API key or upstream failure. |

Flow at a glance:

1. User completes the audit form → engine computes recommendations and totals.  
2. Client **inserts** a row in `audits` and navigates to `/results?id=…`.  
3. Results page loads the audit, optionally **POSTs** to `generate-summary`, then **updates** `ai_summary` on success.  
4. **`/report/[id]`** renders a read-only, share-friendly view with Open Graph metadata for links in Slack or email.

---

## Key features

- **Guided audit form** — Team size, primary use case, and one or more tools (plan, monthly spend, seats) with client-side validation (React Hook Form + Zod).
- **Recommendation engine** — Compares declared spend to expected catalog pricing; suggests cheaper tiers, flags likely overpayment, and surfaces free alternatives for coding workflows where configured.
- **Results dashboard** — Savings cards, Recharts visualizations, and recommendation cards per tool.
- **AI narrative (optional)** — Short founder-oriented summary via Edge Function; degrades gracefully without OpenAI.
- **Shareable reports** — Public read route by UUID with social preview metadata.
- **Lead capture (high-savings path)** — Optional form for teams with large detected savings.
- **Landing experience** — Hero, features, FAQ, and consistent dark UI (Tailwind + shadcn-style primitives).

---

## Screenshots

> Replace the placeholders below with real assets (e.g. `docs/screenshots/…`) once you capture them.

| Area | Placeholder |
|------|-------------|
| Landing — hero | `![Landing hero](docs/screenshots/hero.png)` |
| Audit form | `![Audit form](docs/screenshots/audit-form.png)` |
| Results — overview | `![Results overview](docs/screenshots/results-overview.png)` |
| Results — charts | `![Results charts](docs/screenshots/results-charts.png)` |
| Shareable report | `![Shareable report](docs/screenshots/report-share.png)` |

**Tip:** Use a consistent viewport (e.g. 1440×900) and the same browser zoom for a polished README gallery.

---

## Demo video

> Add a short Loom, YouTube, or hosted MP4 walkthrough (2–3 minutes: landing → audit → results → share link).

**Placeholder:** `[Demo video — insert URL here](https://example.com/your-demo)`

Suggested script beats: problem → run audit → interpret savings → copy share link → mention optional AI summary.

---

## Tech stack

| Category | Choices |
|----------|---------|
| **Framework** | Next.js (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, `next/font` (Inter), Radix-based UI primitives (`components/ui`) |
| **Forms & validation** | React Hook Form, Zod, `@hookform/resolvers` |
| **Charts** | Recharts |
| **Data** | Supabase JS client v2, PostgreSQL (JSONB for tools + recommendations) |
| **Serverless** | Supabase Edge Functions (Deno) for AI summary |
| **Hosting** | Vercel (demo); Netlify supported via `@netlify/plugin-nextjs` and `netlify.toml` |

Exact dependency versions are pinned in `package.json` (e.g. Next **13.5.x** in this repo—verify before claiming “Next 14” in external copy).

---

## Folder structure

```
project/
├── app/                      # Next.js App Router routes & layouts
│   ├── page.tsx              # Marketing landing
│   ├── layout.tsx            # Root layout, metadata, fonts
│   ├── globals.css
│   ├── audit/page.tsx        # Audit form + Supabase insert
│   ├── results/page.tsx      # Results dashboard + summary fetch/update
│   └── report/[id]/          # Shareable report (server metadata + client content)
├── components/               # Feature UI + marketing sections
│   ├── ui/                   # Reusable primitives (button, card, select, …)
│   └── …                     # Navbar, hero, charts wrappers, lead form, etc.
├── hooks/                    # Client hooks (e.g. toast)
├── lib/
│   ├── audit-engine.ts       # Pricing tables + runAudit()
│   ├── supabase.ts           # Browser/server Supabase client (validated env)
│   ├── types.ts              # Shared TypeScript models
│   └── utils.ts
├── supabase/
│   ├── migrations/           # SQL for audits + leads + RLS
│   └── functions/
│       └── generate-summary/ # Edge Function for optional LLM summary
├── netlify.toml              # Optional Netlify build config
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Installation

Prerequisites: **Node.js 18+** and **npm** (or pnpm/yarn with equivalent commands).

```bash
git clone <your-repo-url>
cd project
npm install
```

Copy environment variables (see next section), then start the dev server (see [Local development](#local-development)).

---

## Environment variables

### Next.js (required for any Supabase call)

Create **`.env.local`** in the project root (Next loads this automatically). Do not commit secrets.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Supabase project URL (`https://<ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase **anon** public key (safe for the browser with RLS). |

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`lib/supabase.ts` trims these values and **throws a clear error at startup** if either is missing, avoiding cryptic browser `Headers` errors from `undefined` keys.

### Supabase Edge Function (optional AI summary)

Configure in the Supabase dashboard (or CLI secrets) for the **`generate-summary`** function:

| Secret | Required | Description |
|--------|----------|-------------|
| `OPENAI_API_KEY` | No | If unset, the function returns a **template-based** summary built from audit JSON. |

---

## Local development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the **Audit** flow from the navbar, submit a test audit, and confirm a row appears in the Supabase `audits` table.

Other scripts:

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

**Supabase:** Apply migrations from `supabase/migrations/` via Supabase CLI or the SQL editor so `audits` / `leads` and RLS policies exist before testing inserts.

**Edge Function:** Deploy `supabase/functions/generate-summary` with the Supabase CLI if you want the live OpenAI path outside local mocks.

---

## Deployment

### Vercel (current demo)

1. Connect the Git repository to Vercel.  
2. Add **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** in Project → Settings → Environment Variables (Production + Preview).  
3. Redeploy. **`NEXT_PUBLIC_*`** variables are inlined at **build** time—changing them requires a new build.

### Netlify

This repo includes `netlify.toml` and `@netlify/plugin-nextjs`. Set the same `NEXT_PUBLIC_*` variables in the Netlify UI and deploy; the plugin handles the Next.js runtime on Netlify.

### Supabase checklist

- Run SQL migrations.  
- Deploy **`generate-summary`** and set **`OPENAI_API_KEY`** if you want LLM summaries in production.  
- Confirm RLS policies match your privacy expectations (this project uses broad **anon SELECT** on `audits` for shareable links—see [Shareable reports](#shareable-reports)).

---

## Audit engine

The engine lives in **`lib/audit-engine.ts`** and is **fully deterministic**: no network calls, same inputs → same outputs.

- **`TOOL_PRICING`** — Curated catalog: tool name → list of plans with **price per seat** (and optional **minimum seats**).  
- **`getExpectedSpend`** — Expected monthly cost for a named plan × seats.  
- **`findBestPlan`** — First plan eligible for the current seat count (minimum-seat rules).  
- **`generateRecommendation`** — Per tool, may return:  
  - Downgrade when current tier violates minimum seats.  
  - “Overpaying vs catalog” when spend exceeds expected cost by a margin.  
  - Cheaper tier when a lower list price exists and saves money.  
  - For **coding** use case, optional **free alternative** suggestions where defined (e.g. Continue, Codeium).  
- **`runAudit`** — Aggregates totals, builds `recommendations[]`, and flags stacks with **under $10/mo** savings as effectively efficient.

**Important:** Catalog prices are **approximations** for product education; they should be refreshed periodically from vendor pricing pages.

---

## AI summary

After an audit loads on **`/results`**, the client may call:

`POST {SUPABASE_URL}/functions/v1/generate-summary`

with JSON: tools, `monthlySavings`, and `recommendations`.

The Edge Function (**`supabase/functions/generate-summary/index.ts`**):

1. If **`OPENAI_API_KEY`** is missing → returns a **fallback** summary assembled from the payload.  
2. If present → calls **OpenAI** (`gpt-4o-mini`) with a short founder-focused prompt.  
3. On HTTP errors → again uses the **fallback** summary.  
4. The client may **persist** the returned text into `audits.ai_summary` for the shareable report.

This design keeps the UX working **without** OpenAI spend or keys, while still upgrading the narrative when configured.

---

## Shareable reports

- **Results URL:** `/results?id=<uuid>` — full interactive experience after submission.  
- **Report URL:** `/report/<uuid>` — read-only view intended for sharing; uses **`app/report/[id]/page.tsx`** for **metadata** (title/description/Open Graph) so links unfurl nicely in chat apps.

**Security / privacy tradeoff:** migrations grant **`anon` SELECT on `audits`** so anyone with the UUID can read that audit. That enables **zero-login sharing** but means URLs are **capability URLs**—treat them like unlisted links, not authentication. Tightening this (e.g. signed tokens, expiring links, or auth) is a product decision documented under [Decisions & tradeoffs](#decisions--tradeoffs).

---

## Decisions & tradeoffs

1. **Anonymous audits vs authenticated accounts**  
   *Decision:* Public insert/select on `audits` for speed and shareability.  
   *Tradeoff:* Anyone with the ID can read the audit; no per-user audit history unless you add auth.

2. **Curated pricing table vs live billing APIs**  
   *Decision:* Static `TOOL_PRICING` in TypeScript for instant, free computation.  
   *Tradeoff:* Numbers drift when vendors change prices; maintenance is manual.

3. **Client-side engine vs server-side audit API**  
   *Decision:* Run `runAudit()` in the browser before insert.  
   *Tradeoff:* Logic is visible and could be tampered with; for strict integrity you’d validate or recompute on the server.

4. **Optional OpenAI in Edge Function vs inline in Next**  
   *Decision:* Isolate LLM calls in Supabase Edge with CORS and secrets in Supabase, not in the Next bundle.  
   *Tradeoff:* Extra deploy surface and cold-start latency vs keeping everything in one Vercel function.

5. **Recharts in client results**  
   *Decision:* Rich charts for comprehension.  
   *Tradeoff:* JS weight and hydration cost vs Lighthouse performance; mitigated by loading charts only on results routes and keeping marketing pages lighter.

---

## Lighthouse optimization notes

- **Fonts:** `next/font` (Inter) avoids render-blocking external stylesheet requests for Google Fonts.  
- **Scope client components:** Prefer server components where possible; keep `'use client'` boundaries tight (audit, results, charts).  
- **Images:** Prefer `next/image` with explicit sizes for any new marketing imagery (current build is largely CSS + icons).  
- **Charts:** Recharts adds bundle size—lazy-load chart sections if you split the results page further.  
- **Env validation:** Failing fast on missing `NEXT_PUBLIC_*` avoids wasted runtime and confusing errors in production.

Re-run Lighthouse on **mobile** after meaningful UI changes; dark themes and large hero gradients can affect CLS and contrast audits.

---

## Future improvements

- **Server-side audit recomputation** on insert (Postgres function or API route) for tamper-resistant numbers.  
- **Auth + dashboard** for saved audits, teams, and export (CSV/PDF).  
- **Pricing ingestion pipeline** (scheduled job + admin UI) instead of hand-edited tables.  
- **Stripe** or similar for premium tiers (deeper benchmarks, SSO, org policies).  
- **Stricter sharing model** (signed URLs, optional password, expiry).  
- **Internationalization** and locale-aware currency formatting.

---

## Challenges faced

- **Next.js App Router + client-only APIs** — Balancing server metadata (report page) with client data fetching and charts.  
- **Supabase env in production** — Missing `NEXT_PUBLIC_*` at build time led to opaque browser `Headers` errors; addressed with explicit validation in `lib/supabase.ts`.  
- **Shareable data model** — Choosing RLS policies that enable sharing without a login layer while staying honest about UUID secrecy.  
- **Keeping recommendations trustworthy** — Heuristics (e.g. 10% over expected spend) are simple to explain but can misfire on discounts or annual billing—product copy and future “confidence” labels help.  
- **Edge Function resilience** — OpenAI outages or missing keys should not break the page; fallback summaries are required.

---

## Credits

- **UI primitives** — [shadcn/ui](https://ui.shadcn.com/)–style component patterns (Radix primitives, Tailwind).  
- **Backend** — [Supabase](https://supabase.com/) (Postgres, Auth-ready platform, Edge Functions).  
- **Framework** — [Next.js](https://nextjs.org/) and the React team’s [React](https://react.dev/).  
- **Charts** — [Recharts](https://recharts.org/).  
- **Optional LLM** — [OpenAI](https://openai.com/) API consumed from the Edge Function.  
- **Icons** — [Lucide](https://lucide.dev/).

If this project was forked or scaffolded (e.g. Bolt, Lovable, or a starter), add an explicit line here acknowledging that origin.

---

## License

This repository does not yet include a root **`LICENSE`** file by default. Before open-sourcing or redistributing, add one.

**Suggested default:** MIT License — permissive, startup-friendly, and common for Next.js apps.

```text
MIT License

Copyright (c) <year> <copyright holder>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Replace `<year>` and `<copyright holder>` and commit as **`LICENSE`** (no extension) in the repository root.
