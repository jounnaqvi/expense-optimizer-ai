# DEVLOG — AI Spend Audit

## Day 1 — 2026-05-06

Hours worked:
6

What I did:
Locked v1 scope: audit form → deterministic engine → single results view. Scaffolded Next.js App Router layout, dark shell, and stub routes for `/`, `/audit`, and `/results`. Drafted `TOOL_PRICING` for the first batch of tools so we could iterate on logic before UI polish.

What I learned:
Pricing is not uniform—per-seat vs flat tiers means `PlanPricing` has to encode assumptions up front or every helper becomes a one-off branch.

Blockers:
No Supabase project yet; mocked submit with a fake ID so we could still navigate to a stub results page.

Plan for tomorrow:
Provision Supabase, land the `audits` migration + RLS, and swap the mock for a real insert + redirect with the returned UUID.

## Day 2 — 2026-05-07

Hours worked:
7½

What I did:
Created the Supabase project, applied SQL for `audits` with anon insert/select for the no-login MVP. Wired `@supabase/supabase-js` and real `.insert().select('id').single()`. Spent time debugging why keys were undefined in the browser until we moved everything needed client-side under `NEXT_PUBLIC_*`.

What I learned:
TypeScript non-null assertions on `process.env` do not materialize values at runtime; missing public keys show up as opaque fetch `Headers` errors. Validating and trimming env at `lib/supabase` load is worth the extra lines.

Blockers:
A typo in the first RLS `WITH CHECK` policy blocked inserts; found it via Supabase logs after ruling out CORS.

Plan for tomorrow:
Ship the full audit form: dynamic plan dropdown per tool, `localStorage` draft persistence, and Zod + React Hook Form so junk never hits Postgres.

## Day 3 — 2026-05-08

Hours worked:
5

What I did:
Built the multi-tool form with `useFieldArray`, Zod resolver, and plan options from `getToolPlans()`. Added autosave to `localStorage` with try/catch for quota/private mode. Rewrote validation copy so errors read like product guidance, not exceptions.

What I learned:
`form.watch` inside `useEffect` returns a subscription—must unsubscribe on cleanup or HMR leaves duplicate listeners and weird double-saves.

Blockers:
One shadcn `Select` fought us when the controlled value was `''` vs `undefined`; aligned with the pattern the primitives expect so Radix stops warning.

Plan for tomorrow:
Results page: load audit by `?id=`, savings cards, and Recharts for current vs recommended and per-tool savings.

## Day 4 — 2026-05-09

Hours worked:
8

What I did:
Implemented `/results` with `useSearchParams` wrapped in `Suspense`, skeleton/empty states, and two bar charts. Centralized domain types in `lib/types.ts` so the engine, form, and UI agree. Stubbed lead capture for high-savings audits to test layout pressure.

What I learned:
Recharts is fast to ship but not free in KB—if we add more dashboards, lazy-import chart modules or we will pay on mobile Lighthouse.

Blockers:
Brief hydration warning on `/audit` from touching `localStorage` during first paint; moved restored defaults behind a `typeof window` guard and a stable `useState` init.

Plan for tomorrow:
Author the `generate-summary` Edge Function (OpenAI + fallback), wire the POST from results, and persist `ai_summary` with an update call.

## Day 5 — 2026-05-10

Hours worked:
6

What I did:
Shipped Deno Edge Function: OPTIONS + CORS, reads `OPENAI_API_KEY` from Supabase secrets, calls `gpt-4o-mini`, and returns template fallback if the key is absent or the API errors. Client posts JSON to `/functions/v1/generate-summary`, then updates `audits.ai_summary`. Exported `SUPABASE_URL` beside the client to avoid duplicating env wiring.

What I learned:
Edge logs beat guessing—log status codes and truncated error bodies (never secrets) and you fix cold-start and quota issues in one sitting.

Blockers:
Deferred tightening CORS from `*` to our production origin; acceptable for internal staging, flagged before public launch.

Plan for tomorrow:
Public `/report/[id]` route with `generateMetadata` for unfurls, clipboard share to that URL, and a deploy dry-run on preview env vars.

## Day 6 — 2026-05-11

Hours worked:
7

What I did:
Split report rendering: server metadata query for OG/Twitter fields, client `ReportContent` for read-only charts and copy. Added share button targeting `/report/:id`. Ran Lighthouse mobile; confirmed `next/font` keeps font CLS reasonable on the landing page.

What I learned:
Server Components that hit Supabase fail the same way the client does if preview env is incomplete—CI caught missing `NEXT_PUBLIC_SUPABASE_URL` before customers.

Blockers:
No dynamic OG image yet; Slack previews are text-only until we add `opengraph-image` or a static branded card—accepted for v1.

Plan for tomorrow:
Hardening: failed-submit UX, README/architecture notes, build on a clean tree, and a copy pass on recommendation strings so we do not overclaim precision.

## Day 7 — 2026-05-12

Hours worked:
5½

What I did:
Ensured failed audit inserts always reset submitting state and grouped error logs for easier support. Finished README env + RLS notes and ran `npm run build` from a clean checkout. Logged follow-ups: server-side recompute of audits, stricter Edge CORS, dynamic OG.

What I learned:
For an MVP, “shipped” means the prod path works with honest failure modes—not every polish item closed. A visible backlog beats silent tech debt.

Blockers:
None blocking release; we still trust client-computed numbers on insert until we add a server reconcile step.

Plan for tomorrow:
Dogfood with three real stacks, note where catalog pricing is wrong, and schedule a `TOOL_PRICING` refresh before any public launch thread.
