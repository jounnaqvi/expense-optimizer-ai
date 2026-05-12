# Testing — AI Spend Audit

This document describes **what** to verify for the AI Spend Audit product, **where** automated tests should live once wired up, and **how** to run checks **today** (the repo currently has no `*.test.ts` / Playwright suite—use the manual steps until `npm test` is added).

---

## Overview

| Area | Intended automated file | Manual fallback |
|------|-------------------------|-------------------|
| Audit engine logic | `lib/__tests__/audit-engine.logic.test.ts` | §1 checklist |
| Savings calculations | `lib/__tests__/audit-engine.savings.test.ts` | §2 checklist |
| Form validation | `lib/__tests__/audit-form-schema.test.ts` | §3 checklist |
| AI fallback summary | `supabase/functions/generate-summary/__tests__/fallback.test.ts` | §4 checklist |
| Shareable report | `e2e/report-share.spec.ts` (or `app/report/[id]/__tests__/metadata.test.ts`) | §5 checklist |

---

## 1. Audit engine logic

**Filename:** `lib/__tests__/audit-engine.logic.test.ts`

**What it tests:** Pure functions in `lib/audit-engine.ts`: tool/plan resolution from `TOOL_PRICING`, minimum-seat eligibility, downgrade paths when `minSeats` is violated, “overpaying vs catalog” branch, plan-change recommendations when a cheaper eligible plan exists, and coding use-case free-alternative hints where configured.

**Why it matters:** All user-visible savings narratives derive from this module. A regression here silently changes dollars on the screen and in the database—worse than a broken button because it erodes trust.

**How to run:**

- **Automated (once added):** `npx vitest run lib/__tests__/audit-engine.logic.test.ts` (or your runner of choice).
- **Manual (now):** With `npm run dev`, complete audits that hit each rule: (a) tool on a plan below `minSeats` vs a valid lower tier, (b) declared monthly spend clearly above catalog × seats × tolerance, (c) tool where a cheaper plan exists in the table, (d) coding use case with a tool that defines `freeAlternative`. Compare UI recommendations to hand-calculated expectations from `TOOL_PRICING`.

---

## 2. Savings calculations

**Filename:** `lib/__tests__/audit-engine.savings.test.ts`

**What it tests:** `runAudit()` aggregates: `totalMonthlySpend` as the sum of `monthlySpend`, `recommendedMonthlySpend` when mixing tools with and without recommendations, `monthlySavings` and `annualSavings` (`monthlySavings * 12`), and `isEfficient` when savings fall under the product threshold.

**Why it matters:** Dashboard cards and charts read these numbers directly. Off-by-one or double-counting bugs show up as false “you save $X/mo” claims.

**How to run:**

- **Automated (once added):** `npx vitest run lib/__tests__/audit-engine.savings.test.ts`.
- **Manual (now):** Build a stack of 2–3 tools with known spends; after submit, confirm results page totals match a spreadsheet sum. Confirm annual savings equals monthly × 12 on the same row from Supabase (Table Editor or SQL).

---

## 3. Form validation

**Filename:** `lib/__tests__/audit-form-schema.test.ts`

**What it tests:** The same Zod rules used on `app/audit/page.tsx` (team size ≥ 1, primary use case required, at least one tool, each tool with non-empty name/plan, non-negative spend, seats ≥ 1). Coercion behavior for numeric fields from string inputs.

**Why it matters:** Invalid payloads should never hit Supabase; they waste writes, confuse users, and can mask UI bugs in `Select` / `Input` wiring.

**How to run:**

- **Automated (once added):** Import the shared schema (extract from `page.tsx` into e.g. `lib/audit-form-schema.ts` first) and run `npx vitest run lib/__tests__/audit-form-schema.test.ts`.
- **Manual (now):** On `/audit`, attempt submit with empty tool name, empty plan, team size 0, negative spend, and 0 seats; confirm inline errors and that the network tab shows **no** `audits` insert until the form is valid.

---

## 4. AI fallback summary

**Filename:** `supabase/functions/generate-summary/__tests__/fallback.test.ts`

**What it tests:** Edge Function behavior when `OPENAI_API_KEY` is unset: HTTP 200, JSON body with `summary` string built from tools + savings + top recommendations (see `generateFallbackSummary` in `supabase/functions/generate-summary/index.ts`). Optionally: when the key is set but OpenAI returns non-2xx, response still contains a fallback summary.

**Why it matters:** Production must not depend on a third-party API for a readable narrative; fallback copy is part of the product contract.

**How to run:**

- **Automated (once added):** Deno test or `vitest` with mocked `fetch` for OpenAI; `deno test supabase/functions/generate-summary/__tests__/fallback.test.ts` (exact command depends on your Deno setup).
- **Manual (now):** Temporarily remove `OPENAI_API_KEY` from the function’s secrets (or call from local Supabase with no secret), `POST` to `/functions/v1/generate-summary` with a sample body matching the app; assert `summary` is non-empty and references tools/savings. Restore the secret afterward.

---

## 5. Shareable report generation

**Filename:** `e2e/report-share.spec.ts` (recommended) *or* `app/report/[id]/__tests__/metadata.test.ts` for server-only metadata.

**What it tests:** Given a valid audit UUID, `/report/[id]` returns 200, renders read-only content consistent with stored `audits` row, and `generateMetadata` in `app/report/[id]/page.tsx` produces title/description containing savings and tool names (Open Graph / Twitter fields for unfurls).

**Why it matters:** Shared links are a distribution channel; broken routes or empty metadata make the product look unfinished when pasted into Slack.

**How to run:**

- **Automated (once added):** Playwright: create audit via UI or API fixture, open `/report/{id}`, assert headings and chart presence; optionally `expect(page).toHaveTitle(...)` or fetch metadata via a small script.
- **Manual (now):** After creating an audit, visit `/report/<id>` in a logged-out browser window; verify numbers match `/results?id=`. Paste the URL in iMessage/Slack/Twitter card debugger and confirm title/description are populated.

---

## Related commands (current repo)

```bash
npm run lint      # Static analysis
npm run typecheck # TypeScript
npm run build     # Production compile
```

Adding **`vitest`** (or **Jest**) + **`@playwright/test`** is the natural next step so the filenames above become real files and CI can run `npm test`.

---

## Suggested order when implementing automation

1. **`audit-engine`** tests (fast, no browser, highest ROI).  
2. **Form schema** tests after extracting Zod to `lib/`.  
3. **Edge Function** fallback tests with mocks.  
4. **E2E** report flow last (slower, but catches routing and env integration).

---

*Last updated to match the AI Spend Audit codebase layout; adjust paths if you reorganize `lib/` or move the audit form schema.*
