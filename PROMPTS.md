# Prompts — AI Spend Audit

This document describes **every user-visible narrative path** for the post-audit “AI summary”: the **OpenAI prompt** used in the Supabase Edge Function, **why it is shaped that way**, what we **tried and discarded**, and how we **limit hallucinations**, **control tone**, and **personalize** without inventing data.

**Source of truth in code:** `supabase/functions/generate-summary/index.ts`  
**Secondary client copy:** `app/results/page.tsx` (`fetchAISummary` `catch` block)

---

## 1. Full OpenAI prompt (production)

The Edge handler builds a **single user message** string (no separate system message today). Template after JSON body is parsed:

```text
You are an AI cost optimization expert. Based on the following audit results, write a concise 100-word personalized summary for a startup founder.

Tools: ${tools.join(', ')}
Monthly savings potential: $${monthlySavings}
Recommendations: ${recommendations.map((r) =>
  `${r.toolName}: ${r.currentPlan} → ${r.suggestedPlan} (${r.reasoning})`
).join('; ')}

Write a professional, actionable summary. Be specific about the biggest savings opportunity.
```

### API parameters (same file)

| Parameter | Value | Role |
|-----------|-------|------|
| `model` | `gpt-4o-mini` | Cheap enough for per-audit calls; strong enough for tight prose. |
| `messages` | `[{ role: "user", content: prompt }]` | Entire instruction + data in one turn—simple, fewer round-trips. |
| `max_tokens` | `200` | Hard ceiling so summaries stay short even if the model ignores “~100 words.” |
| `temperature` | `0.7` | Slight variety without drifting into creative fiction; see [Tone control](#6-tone-control). |

### Example filled prompt (illustrative)

```text
You are an AI cost optimization expert. Based on the following audit results, write a concise 100-word personalized summary for a startup founder.

Tools: Cursor, ChatGPT, GitHub Copilot
Monthly savings potential: $142
Recommendations: Cursor: Pro → Business (Switching from Pro to Business saves $20/mo); ChatGPT: Team → Plus (...); GitHub Copilot: Business → Individual (...)

Write a professional, actionable summary. Be specific about the biggest savings opportunity.
```

---

## 2. Why the prompt was designed this way

**Ground the model in structured audit output only.**  
The narrative is not allowed to “browse the web” or recall 2024 blog pricing. Every dollar and plan transition is serialized from the same JSON the UI already showed: `toolName`, `currentPlan`, `suggestedPlan`, `reasoning`, plus aggregate `monthlySavings` and the tool list. That keeps the LLM in a **compression and emphasis** role instead of a **research** role.

**Audience pin: “startup founder.”**  
We want confident, time-scarce copy: short paragraphs, prioritization, and a clear “do this first” vibe. That framing also discourages academic hedging (“it depends on many factors…”) that reads like disclaimers soup.

**Explicit length target (“~100 words”) plus `max_tokens: 200`.**  
Models treat “concise” loosely; pairing a **word target in text** with a **token cap in API** reduces run-on summaries that push layout on `/results`.

**“Biggest savings opportunity” as the closing instruction.**  
Forces a **ranking** mindset: even if all three tools have recs, the model should foreground the largest lever—matching how a human PM would summarize the same table.

**Single user message (no system prompt).**  
Tradeoff: less separation of “persona” vs “data.” Benefit: fewer tokens and less ambiguity about which message the model should obey. If we split roles later, we would move static rules to `system` and keep only variable facts in `user`.

---

## 3. Failed prompt attempts (design history)

These are **realistic iterations** we considered or briefly tried before converging on the shipped template. They are not in the repo as alternate branches, but they inform why the current prompt is minimal.

| Attempt | What went wrong |
|---------|-------------------|
| **“Return JSON `{ headline, bullets }` only.”** | The UI expected a single string; adding parsing, schema validation, and empty-state UI doubled scope. We kept **plain prose** for v1. |
| **“List exact vendor prices from your knowledge.”** | Classic hallucination vector: model invents list prices or currency. We removed any invitation to use parametric knowledge outside the payload. |
| **“Write 250 words with executive summary + risks + next quarter roadmap.”** | Overlong for the card; users already have charts. Brevity won. |
| **Temperature 1.0 + “be creative.”** | Produced playful metaphors and occasional invented “team policies” or savings guarantees. Dropped to **0.7** and tightened instructions toward **actionable** not **clever**. |
| **Including raw `monthlySpend` per tool without structure.** | Noisy prompt; model latched onto random numbers and contradicted `monthlySavings`. We feed **recommendations** as the primary evidence trail instead. |
| **“You are a licensed financial advisor.”** | Misleading and risky; we never shipped wording that implies regulated advice. |

---

## 4. Hallucination prevention

**Data boundary**  
Only these fields are injected: `tools` (names), `monthlySavings`, and each recommendation’s `toolName`, `currentPlan`, `suggestedPlan`, `reasoning`. There is **no** company name, industry, or revenue—so the model cannot “personalize” into specifics it does not have.

**No web / no training-time recall**  
Instructions do not ask for current vendor URLs, competitor logos, or “latest ChatGPT price.” If we need live pricing, that belongs in **`TOOL_PRICING`** and `PRICING_DATA.md`, not in the LLM.

**Numeric anchor**  
`Monthly savings potential: $${monthlySavings}` is repeated as a **single aggregate** the model should align with verbally. Per-tool savings live inside `reasoning` strings from the deterministic engine, so the model should not invent new totals.

**Post-model guard**  
`const summary = data.choices?.[0]?.message?.content?.trim() || generateFallbackSummary(...)`  
If the API returns an empty string or missing `choices`, we **discard** the model output and use the same deterministic fallback as the no-key path.

**HTTP failure path**  
Non-2xx from OpenAI → **no partial model text**; immediate `generateFallbackSummary`. Prevents showing half-streamed or error-body garbage.

---

## 5. Fallback prompt strategy

There are **three** layers; only the first uses OpenAI.

### A. Edge: no `OPENAI_API_KEY`

`generateFallbackSummary(tools, monthlySavings, recommendations)` returns:

- If **no recommendations:** a short “stack is well-optimized” message listing tool names.  
- Else: **top three** recs as `Tool → suggestedPlan` joins, plus rounded `monthlySavings`.

**Why:** Zero-cost, zero-latency vendor dependency; demos and disaster recovery behave identically.

### B. Edge: OpenAI error or empty content

Same `generateFallbackSummary` as (A). **Same code path** so behavior is predictable in tests and support.

### C. Client: `fetch` throws (network, CORS misconfig, DNS)

`app/results/page.tsx` sets a **static** two-sentence summary using only `audit.monthly_savings` and `audit.tools.length`—no server round-trip.

**Why:** The results page must not spin forever or go blank if the Edge Function is unreachable; charts still carry truth.

### Design principle

**Fallbacks never call OpenAI** and never introduce new numbers—only **reformat** or **truncate** known fields.

---

## 6. Tone control

| Mechanism | Effect |
|-----------|--------|
| Role string (“AI cost optimization expert”) | Sets domain vocabulary (plans, seats, savings) without slang. |
| “Professional, actionable” | Pushes against jokes, memes, or scolding tone. |
| `temperature: 0.7` | Enough variation to avoid identical audits reading robotically; low enough to stay near facts. |
| `max_tokens: 200` | Caps rambling and reduces odds of a “by the way, here are ten more tips” tail. |

**Not done yet (backlog):** post-filter for banned phrases (“guaranteed”, “ROI”, “tax advice”), or a tiny second-pass model to strip hedging—would add latency and cost.

---

## 7. Personalization strategy

**What “personalized” means here**  
It means **conditional on this audit’s tools and recommendations**, not “we know your company.” There is no user profile, CRM segment, or email in the prompt.

**Levers we use**

1. **Tool list order** — `tools.join(', ')` mirrors the stack the user entered; the model often mirrors that order in prose.  
2. **Per-rec reasoning** — Engine-authored strings carry **why** a change was suggested; the model summarizes and emphasizes rather than inventing new causes.  
3. **Aggregate savings** — Gives a headline number consistent with cards on the page.  
4. **“Startup founder”** — Stylistic lens only; we do not pass company stage, funding, or headcount beyond what is already baked into recommendations.

**Future-safe upgrades (without breaking grounding)**

- Pass **`primary_use_case`** and **`team_size`** from the audit row into the prompt as labeled facts (still from DB, not guessed).  
- Add **`system`** message with immutable rules (“Do not exceed facts in JSON; do not add new dollar amounts”).  
- Use **structured outputs** once the UI can render blocks.

---

## 8. Operational checklist (before changing prompts)

1. Re-read **`PRICING_DATA.md`** if copy could be read as a price guarantee.  
2. Run a **dry call** with max-sized `recommendations` array to ensure prompt size stays under model context limits.  
3. Confirm **`max_tokens`** still matches layout on `/results` and `/report/[id]`.  
4. Log **OpenAI status** and latency at the Edge (never log full prompts with PII—this payload is usually anonymous but treat `reasoning` as user-influenced text).

---

## Related files

| File | Responsibility |
|------|----------------|
| `supabase/functions/generate-summary/index.ts` | Prompt assembly, OpenAI call, fallbacks. |
| `app/results/page.tsx` | Invokes function, persists `ai_summary`, client catch fallback. |
| `lib/audit-engine.ts` | Produces `reasoning` strings the prompt must not contradict. |

---

*Document version aligned with the Edge Function as implemented; update this file whenever the prompt string or fallback logic changes.*
