# Metrics — AI Spend Audit

**Product shape:** Free, no-login **AI spend audits** with optional **high-intent lead capture** (consultation CTA when modeled **monthly savings > $500**) and **shareable reports** (`/report/:id`).  
**Business model (assumed):** B2B **lead generation** → sales-assisted closes (services, retainers, or future paid product). Metrics below are sized for an **early-stage** team validating demand—not a mature PLG SaaS with millions of MAU.

---

## North star metric

| North star | Definition | Target direction (first 90 days) |
|------------|------------|-----------------------------------|
| **Qualified pipeline created per week** | Sum of **(A)** `leads` rows with valid email + `monthly_savings > 500` **and** **(B)** manual SQL tag “qualified” within 7 days of submit | **↑** week-over-week; absolute number depends on traffic—see [Pivot thresholds](#7-pivot-thresholds) |

**Why not “audits completed” alone?** Audits are cheap to inflate with junk traffic; the star metric must tie to **revenue-adjacent intent**. If you later add self-serve paid tiers, you can split the north star into **pipeline** + **MRR** with equal weight.

**Proxy (if CRM tagging lags):** **“High-savings audits with lead form submit”** per week—automatically measurable from Supabase.

---

## Input metrics (leading indicators)

These explain *why* the north star moves. Track weekly.

| Metric | Definition | Example healthy range (early B2B) |
|--------|------------|-------------------------------------|
| **Unique visitors** | Sessions or users on `/` + `/audit` (deduped) | Growth or stable with rising conversion |
| **Audit starts** | `/audit` loads with ≥1 interaction (or “Run audit” CTA click from landing) | 12–25% of visitors |
| **Audit completions** | Successful `audits` insert (or redirect to `/results?id=`) | 25–45% of starts |
| **High-savings audits** | Completions where `monthly_savings > 500` | 15–30% of completions (stack-dependent) |
| **Lead form views** | Impressions of lead block (if instrumented) | ≈ high-savings audits |
| **Lead submits** | Rows in `leads` | 8–18% of high-savings audits (ICP-sensitive) |
| **Report link copies** | `copy_share_link` events | 20–40% of completions (champions sharing) |
| **Blended CAC** | GTM spend ÷ (leads or SQLs—pick one and never mix) | Falling over time if organic mix improves |

**Operational inputs (non-product):** reply time to leads, % contacted within 24h, meetings booked per 10 leads.

---

## Funnel tracking

### Canonical funnel (event names are suggestions for your analytics layer)

| Step | Event name (suggested) | Primary source of truth |
|------|-------------------------|---------------------------|
| 1 | `landing_view` | Web analytics (Plausible, PostHog, GA4) |
| 2 | `audit_start` | Client event on `/audit` first field focus or first tool row added |
| 3 | `audit_submit` | After successful Supabase insert (client) or server log |
| 4 | `results_view` | Page view with `id` query param |
| 5 | `ai_summary_success` / `ai_summary_fallback` | Edge function outcome or client parse |
| 6 | `report_view` | `/report/:id` page view |
| 7 | `share_link_copy` | Clipboard button success |
| 8 | `lead_form_view` | When savings > 500 block mounts |
| 9 | `lead_submit` | On successful `leads` insert |

### Example funnel table (fill with your data)

| Week | Visitors | Starts | Completions | High savings | Lead submits |
|------|----------|--------|---------------|----------------|----------------|
| W01 | — | — | — | — | — |
| W02 | — | — | — | — | — |

**Conversion rates to compute each week:**

- Start rate = starts ÷ visitors  
- Completion rate = completions ÷ starts  
- Lead rate = submits ÷ high-savings (or ÷ completions for conservative “intent density”)

---

## Analytics plan

| Layer | Tooling (examples) | What to implement |
|-------|-------------------|-------------------|
| **Product analytics** | PostHog, Mixpanel, Amplitude, or Plausible + custom events | Client events in `app/audit/page.tsx`, `app/results/page.tsx`, `components/lead-capture-form.tsx`, `app/report/[id]/report-content.tsx` |
| **Backend truth** | Supabase SQL + dashboards | Counts by `created_at` on `audits` / `leads`; segment by `monthly_savings` buckets |
| **Errors** | Sentry / Logflare | Failed inserts, Edge function 5xx, OpenAI non-2xx |
| **Experimentation** | Feature flags (optional) | Headline tests on landing; threshold tests for `$500` CTA |

**Privacy:** avoid PII in analytics payloads (no raw email in third-party tools; use hashed `audit_id` only if needed).

**Minimum viable analytics (week 1):** Supabase-only counts + spreadsheet until event taxonomy stabilizes.

---

## Retention assumptions

This product is **not** classic daily-use SaaS. Reframe “retention” for a **periodic audit + champion loop**.

| Concept | Definition | Realistic assumption (early) |
|---------|------------|-------------------------------|
| **Audit repeat rate** | Same browser or same org running a second audit within 90 days | **8–15%** without reminders; **20–30%** with quarterly email you actually send |
| **Report re-opens** | Unique sessions on `/report/:id` after day 0 | Often **spiky** (board meeting week); track 7- and 30-day return |
| **Lead nurture** | Opens/clicks on follow-up mail | Baseline B2B; tie to SQL creation |

**“Churn”** for free users is meaningless; instead track **decay**: completions per week falling while spend is flat = acquisition problem, not retention.

---

## Activation metrics

**Define activation** as the smallest behavior that predicts a lead or a share (leading indicator of value).

| Tier | Definition | Why it matters |
|------|------------|----------------|
| **A1 — Activated** | Completed ≥1 audit with ≥2 tools in stack | Shows real engagement vs toy single-tool |
| **A2 — Strong activation** | Completed audit **and** (`share_link_copy` **or** `report_view` from external referrer) | Signals internal distribution |
| **A3 — Monetization-adjacent** | High-savings audit **and** `lead_submit` | Directly feeds pipeline |

**Targets (directional, first quarter post-launch):**

- **A1:** ≥ **35%** of audit starters (raise bar on form UX if lower).  
- **A2:** ≥ **15%** of completions (if near zero, improve report headline + copy-to-share).  
- **A3:** benchmark against [ECONOMICS.md](./ECONOMICS.md) funnel; even **2–5%** of completions can work if ACV is high.

**Time-to-activate:** median minutes from `landing_view` to `audit_submit`; aim **< 4 minutes** for P50.

---

## Pivot thresholds

Use these as **decision triggers**, not moral judgments. Adjust numbers to your burn and runway.

| Signal | Threshold (example) | Response |
|--------|---------------------|----------|
| **Traffic without completions** | < **20%** completion rate from starts for **4 consecutive weeks** | Simplify audit UX, reduce fields, A/B hero promise, check mobile breakage |
| **Completions without high savings** | < **10%** of completions exceed **$500/mo** modeled | ICP mismatch—tighten acquisition (ads/SEO) toward larger teams or API-heavy stacks; revisit catalog |
| **High savings without leads** | < **5%** lead submit rate among high-savings for **6 weeks** | CTA copy, trust block, or offer (calendar vs PDF); verify form errors / RLS |
| **Leads without SQLs** | < **20%** SQL rate after human follow-up for **30 leads** | Reposition offer; disqualify faster; fix “consultation” expectation |
| **North star flat** | **0** QoQ growth in qualified pipeline for **2 quarters** with stable traffic | Pivot wedge (e.g. API-only SKU, vertical niche, or paid compliance report) |

**Green light (double down):** lead submit rate **> 12%** on high-savings *and* **> 40%** meeting-booked from leads with **< 48h** first touch—scale GTM spend cautiously.

---

## Review cadence

| Cadence | Audience | Focus |
|---------|----------|--------|
| Weekly | Founder + eng | Funnel steps, errors, top pages |
| Monthly | Founder + GTM | CAC, SQL, win rate, catalog refresh |
| Quarterly | Full team | North star, pivot check, roadmap |

---

## Related documents

- [ECONOMICS.md](./ECONOMICS.md) — funnel math and ACV assumptions.  
- [readme.md](./readme.md) — product overview and setup.

---

*Replace placeholder targets with cohort-specific baselines as soon as you have 4–8 weeks of production data.*
