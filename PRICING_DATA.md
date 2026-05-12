# Pricing data — AI Spend Audit

This document ties **vendor-facing pricing** to the **catalog encoded in** `lib/audit-engine.ts` (`TOOL_PRICING`). The audit engine uses **USD per seat per month** (`pricePerSeat`) unless a plan is explicitly free or pay-as-you-go at **$0** in the model.

**Global verification date (this document):** **2026-05-12**  
Meaning: links and summaries were checked for accuracy *as of that date*. Vendors change plans, names, and numbers frequently—**always treat the official URL as the source of truth** before updating the codebase.

**Currency:** USD, excluding taxes and regional adjustments unless the vendor page states otherwise.

---

## How to use this file

| Column / field | Purpose |
|----------------|--------|
| **Modeled price** | Value in `TOOL_PRICING` today—drives savings math in the product. |
| **Official pricing URL** | Where to re-verify before editing the engine. |
| **Notes** | Drift, renaming (e.g. ChatGPT Business vs “Team”), or non-literal mappings. |

When official pricing diverges from the model, either **update `TOOL_PRICING`** and this doc together, or add a “confidence” label in the product copy—not only here.

---

## Cursor

**Official pricing URL:** [https://cursor.com/pricing](https://cursor.com/pricing)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Map to vendor reality |
|--------------------|----------------------------------|-----------|------------------------|
| Free | $0 | — | Aligns with a free/hobby-style tier; vendor naming may differ. |
| Pro | $20 | — | Matches common **Pro** list positioning on Cursor’s page. |
| Business | $40 | 5 | Aligns with **Teams**-style per-seat list pricing; Cursor has published team pricing changes—confirm seat minimums and usage-based components on the official page. |

**Why it matters:** Cursor’s team product has moved toward usage-inclusive and overage models; the app still uses **flat per-seat** numbers for fast comparison—acceptable for education, risky if presented as a quote.

---

## ChatGPT

**Official pricing URL:** [https://openai.com/chatgpt/pricing/](https://openai.com/chatgpt/pricing/) (consumer) · [https://openai.com/business/chatgpt-pricing/](https://openai.com/business/chatgpt-pricing/) (business / enterprise sales)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Free | $0 | — | Consumer free tier; limits per OpenAI. |
| Plus | $20 | — | Common consumer Plus positioning; confirm on consumer pricing page. |
| Team | $25 | 3 | OpenAI has renamed/repositioned team-style plans (e.g. toward **Business** naming and seat rules). **Reconcile plan name and min seats** with the current business page before relying on this row in sales contexts. |
| Enterprise | $60 | — | **Placeholder in the engine.** Real **Enterprise** is typically **contact sales**, not a public flat rate—treat `$60` as a modeling assumption unless you replace it with contract data. |

**Why it matters:** Enterprise cannot be honestly represented by a single public integer; the app should avoid implying guaranteed enterprise list pricing.

---

## Claude (Anthropic consumer / team product)

**Official pricing URL:** [https://www.anthropic.com/pricing?subjects=claude&type=product](https://www.anthropic.com/pricing?subjects=claude&type=product)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Free | $0 | — | Subject to Anthropic’s free-tier policy. |
| Pro | $20 | — | Check **Pro** list price on Anthropic’s pricing page (regional variation possible). |
| Team | $30 | 5 | Anthropic’s published **Team** pricing uses **standard vs premium** seats and different minima than this simplified row—**update the catalog** if you need fidelity for finance. |
| Enterprise | $75 | — | Often **custom**; treat as internal modeling unless backed by a quote. |

**Why it matters:** Claude Team has nuanced seat types; a single `pricePerSeat` per “Team” is an intentional MVP simplification.

---

## GitHub Copilot

**Official pricing URL:** [https://github.com/features/copilot/plans](https://github.com/features/copilot/plans)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Individual | $10 | — | Maps to **Copilot Pro**–style individual paid tier in docs. |
| Business | $19 | — | **Copilot Business** list positioning. |
| Enterprise | $39 | — | **Copilot Enterprise** list positioning. |

**Why it matters:** GitHub has announced billing model transitions (e.g. usage-oriented changes on future dates); confirm whether your audience still maps to per-seat list prices at read time.

---

## Gemini (Google consumer / Google One AI)

**Official pricing URL:** [https://one.google.com/about/google-ai-plans/](https://one.google.com/about/google-ai-plans/) · [https://gemini.google/subscriptions](https://gemini.google/subscriptions)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Free | $0 | — | Subject to Google’s free access limits. |
| Advanced | $20 | — | Historically aligned with **Gemini Advanced**–style consumer bundles; Google has rebranded tiers (e.g. **Google AI Pro / Ultra**). **Rename and re-price** in `TOOL_PRICING` when you align marketing copy with Google’s current names. |
| Business | $30 | — | **Simplified** B2B-style anchor; verify against Google Workspace / Gemini for Workspace pricing for real org deals. |
| Enterprise | $40 | — | **Simplified** anchor; enterprise Workspace pricing is quote-driven. |

**Why it matters:** Google’s AI subscription naming has shifted; stale labels confuse users even if the dollar amount is “close enough.”

---

## OpenAI API

**Official pricing URL:** [https://openai.com/api/pricing/](https://openai.com/api/pricing/) (also: [https://platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing))  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Pay-as-you-go | $0 | — | **Not literal $0 spend**—means “no fixed seat fee” in the engine; real cost is **per token / per request**. |
| Tier 1 | $100 | — | **Not an official OpenAI “plan name.”** Product-internal monthly **placeholder** for “small committed or typical team burn”—replace with your own convention or remove. |
| Tier 2 | $500 | — | Same as above—**placeholder** for a higher burn bucket. |

**Why it matters:** API spend is not seat-based; keeping these rows avoids divide-by-zero in the UI but **must not** be presented as OpenAI’s official price list.

---

## Anthropic API

**Official pricing URL:** [https://www.anthropic.com/pricing#api](https://www.anthropic.com/pricing#api) (API section on Anthropic pricing)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Pay-as-you-go | $0 | — | Represents **no fixed monthly seat fee** in the model; actual cost is usage-based per model pricing table. |
| Tier 1 | $100 | — | **Placeholder** monthly bucket (same caveats as OpenAI API). |
| Tier 2 | $500 | — | **Placeholder** monthly bucket. |

**Why it matters:** Mixing **API usage** with **seat SaaS** in one audit is useful for a “stack total” narrative but dangerous if users think tiers map to Anthropic product SKUs.

---

## Windsurf

**Official pricing URL:** [https://windsurf.com/pricing](https://windsurf.com/pricing)  
**Verification date:** 2026-05-12

| Plan name (in app) | Modeled price (USD / seat / mo) | Min seats | Notes |
|--------------------|----------------------------------|-----------|--------|
| Free | $0 | — | Confirm current free-tier limits on Windsurf’s page. |
| Pro | $15 | — | Vendor list pricing may differ (e.g. higher Pro list or additional tiers like **Max**); update `TOOL_PRICING` when you refresh. |
| Team | $25 | 3 | Compare to Windsurf **Teams** list pricing and seat minimums on the official page. |

**Why it matters:** Windsurf’s tier lineup has changed over time; this row set is optimized for **relative** comparison inside the app, not for invoicing.

---

## Changelog (suggested)

Maintain a short table when you edit `TOOL_PRICING`:

| Date | Tool | Change | Verified against URL |
|------|------|--------|-------------------------|
| *(example)* | Cursor | Business → $40 | cursor.com/pricing |

---

## Related files

- `lib/audit-engine.ts` — canonical **`TOOL_PRICING`** used at runtime.  
- `readme.md` / `ARCHITECTURE.md` — product context for how pricing drives recommendations.

---

*This file is documentation only; it does not change application behavior until `TOOL_PRICING` is updated in code.*
