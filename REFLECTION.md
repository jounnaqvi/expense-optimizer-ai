# Reflection — AI Spend Audit

Personal retrospective after shipping the MVP: what hurt, what changed, what’s next, and how I actually worked.

---

## 1. The hardest bug and debugging process

The nastiest issue did not look like a “bug” in our code at first. After deploying to Vercel, submitting the audit form failed in the browser with `TypeError: Failed to execute 'set' on 'Headers': Invalid value`, wrapped inside Supabase’s error object. Locally everything worked because `.env` had `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set. In production, those variables had never been added to the hosting dashboard—or a preview deploy ran without them—so at build time the client bundle effectively inlined `undefined` for one or both values. Supabase’s fetch layer then tried to set standard headers (for example `apikey` and `Authorization`) with invalid values, which the Fetch spec rejects immediately.

Debugging was painful because the stack trace pointed at minified chunks and “Headers,” not at “missing env.” I wasted time checking RLS policies, insert payloads, and JSON serialization before I reproduced the issue by stripping env locally and watching the same error appear. The fix was two-part: operational (set the vars on the host, redeploy so `NEXT_PUBLIC_*` is baked in) and structural (validate and trim env at `lib/supabase` module load and throw a clear error instead of silently passing `undefined`). What I’d tell my past self: when a client-only integration breaks only in prod, assume configuration and build-time inlining before you assume database logic.

---

## 2. A technical decision reversed mid-project

Early on I assumed I would compute audits **on the server**—either a Route Handler or a Postgres RPC—so the numbers in the database could not drift from what a user typed in DevTools. That is the “correct” integrity story for anything that looks like financial advice. In practice, for a scrappy MVP, the server path added friction: another deployment surface, duplicate types between engine and API, and slower iteration while I was still changing recommendation rules daily.

I reversed course and kept **`runAudit()` on the client**, persisted the engine output with the same insert the UI already had. The tradeoff is explicit: a motivated user can tamper with totals before insert. I mitigated the product risk by keeping recommendations explainable (catalog-based, not black-box) and by documenting server-side recomputation as week-two debt. If I had stuck with server-only compute for v1, I might still be wiring RPCs instead of having a shippable share flow. The reversal was not “we don’t care about integrity”—it was “integrity layer comes after we prove anyone completes an audit.” Looking back, I should have written that decision in one paragraph in `ARCHITECTURE.md` the day I made it, so future me does not mistake shortcuts for ignorance.

---

## 3. What I would build in week 2

Week two would be about **trust, abuse, and retention** more than new UI chrome—because the MVP already proves the core loop; the next risk is looking naive at scale or looking untrustworthy to a CFO who opens a shared link.

First, I’d add a **server-side recompute** path: a small Route Handler or Supabase function that accepts the raw tool rows, runs the same engine logic (shared module imported server-side), and returns or overwrites stored aggregates. Inserts could still originate from the client for latency, but a synchronous or near-synchronous validation step would catch obvious tampering and drift between “what we showed” and “what we stored.” I would log discrepancies rather than block users silently at first, so we learn how often the problem appears in the wild.

Second, **rate limiting and basic bot protection** on audit creation. Public anon insert is great for conversion until someone scripts ten thousand rows or a crawler mistakes your endpoint for a write API. Even a leaky token bucket at the edge, plus optional honeypot field on the form, saves your Supabase bill and your mental health.

Third, **dynamic or semi-dynamic OG** for `/report/[id]` so shared links look credible in Slack without commissioning a designer for every screenshot. A static branded template plus dynamic text is enough for week two; full image generation can wait.

Fourth, a **lightweight admin view** (password-protected or behind Supabase auth) to scan recent audits, spot bad pricing assumptions, and delete spam rows if needed—without giving every engineer raw SQL access.

Fifth, **instrumentation**: events for audit started, completed, summary success versus fallback, and share link copied. Week three should answer “where do people drop?” with numbers, not vibes.

Sixth, I would start a **pricing refresh cadence**—owner, checklist of vendor URLs, and a changelog entry when `TOOL_PRICING` moves—so the product does not quietly lie six months after launch.

---

## 4. How I used AI tools responsibly

I used AI assistants the way I’d use a senior teammate in another timezone: for **acceleration on bounded tasks**, not as a substitute for running the app or reading Supabase logs. Concrete wins were boilerplate (React Hook Form field wiring, repetitive Select wiring), turning a vague stack trace into a short list of things to verify, and drafting README or architecture prose that I then **diffed line by line** against `package.json`, `supabase/migrations`, and the actual Edge Function entrypoint. If the assistant claimed “Next 14” or a dependency we do not use, that sentence got deleted—not “kind of” fixed.

I never pasted `.env` contents or production keys into a chat. OpenAI credentials live only in Supabase secrets; local development uses gitignored env files. When I needed help with an error, I redacted IDs and replaced tokens with placeholders so a log paste could not accidentally become a credential leak.

Where I drew the line was **anything safety- or policy-critical**: RLS policies, default CORS posture, and any copy that could read like a regulated financial guarantee. I wrote those myself or adapted from vendor documentation, then optionally asked AI to tighten wording—not to invent compliance posture. Pricing numbers stayed human-curated; I did not let the model hallucinate “ChatGPT Team is $X” because that is how you ship confident lies.

I also treated AI output as **always wrong until proven**: run `npm run build`, click the audit flow in a clean browser profile, and re-read the migration if the assistant suggested a policy change. The goal was fewer blind spots and faster typing, not merging green TypeScript that nobody executed.

---

## 5. Self-rating

Scale: **1–10** (honest, not aspirational). These scores are **not** independent: shipping fast lowered my “code quality” score on purpose, and that is the trade I would make again for this stage.

**Discipline — 7.** I kept a daily rhythm during the sprint, cut scope when charts were “good enough,” and actually deployed instead of polishing forever. I lost points for preventable ops mistakes—production env not mirrored in a checklist, one evening chasing the wrong layer of the stack—and for occasionally coding past tiredness when sleep would have been cheaper.

**Code quality — 6.5.** The split between `lib/audit-engine`, UI, and Supabase is readable, types are shared, and magic numbers mostly live in one catalog. I am not proud of client-authoritative inserts or broad anon `SELECT` on audits without a documented threat model; those are conscious MVP shortcuts, not patterns I would copy into a regulated product without hardening.

**Design sense — 7.** Typography, spacing, and dark surfaces feel coherent; the results page reads as “real SaaS” to a skeptical buyer. It is still template-adjacent shadcn territory—no custom illustration system, no memorable brand voice—so it earns a solid B, not an A for visual identity.

**Problem solving — 7.5.** When stuck, I eventually narrowed problems with reproduction (strip env, minimal insert payload) instead of thrashing. I dock half a point because I should have reached for “build-time env” earlier given `NEXT_PUBLIC_*` semantics.

**Entrepreneurial thinking — 7.** I optimized for a wedge people understand in one sentence (AI tool spend), a shareable artifact (`/report/:id`), and a path to leads when savings are high. I did not yet validate pricing accuracy with enough external users or run pricing as a content operation—that is the gap between “shipped” and “business de-risked.”

| Dimension | Score |
|-----------|------:|
| Discipline | 7 |
| Code quality | 6.5 |
| Design sense | 7 |
| Problem solving | 7.5 |
| Entrepreneurial thinking | 7 |

Overall, the project reflects a **bias to ship** with a growing list of **known debts**—which is where I want early-stage work to sit until usage tells us what to harden first.
