# User interviews — AI Spend Audit

Synthetic-but-realistic **interview summaries** from discovery calls with teams that run Cursor, ChatGPT, Copilot, or API-heavy workflows. Names are **initials only**; companies anonymized.

**Method (assumed):** 30-minute Zoom, screen share of `/audit` → `/results` → `/report/:id`, think-aloud on first use.  
**Note:** Quotes are **paraphrased for readability** from notes taken during sessions, not verbatim transcripts.

---

## Interview 1 — M.K.

| Field | Detail |
|--------|--------|
| **Initials** | M.K. |
| **Role** | Head of Engineering |
| **Company stage** | Series A B2B SaaS, ~35 engineers, US |

### Context

M.K. owns vendor spend and sits in renewal conversations with Cursor and GitHub. Finance asked for a “single picture” of AI tools before Q4 planning; they had been maintaining a Notion table that was already two vendors out of date.

### Quotes

1. *“I don’t need another dashboard that needs SSO and three meetings to turn on. I need something I can do between two standups.”*  
2. *“The scary number for me wasn’t the total—it was that we were on Business for Copilot but half the team barely touches code review. Your chart made that legible without me naming names.”*  
3. *“If I send finance a link, it has to not look like a toy. The report page passed the ‘would I put this in the board pack?’ smell test—not perfect, but credible.”*

### Biggest insight

**Credibility beats cleverness.** Buyers in M.K.’s situation optimize for *defensibility in a budget conversation*, not novelty. Shareable `/report/:id` and chart density mattered more than AI-flavored summary copy.

### What changed in the product

- **Copy on results:** tightened language around “modeled savings” vs guaranteed savings (aligned with FAQ accuracy answer).  
- **Share CTA:** emphasized copying **`/report/`** link first (less noisy than full interactive results URL for execs).  
- **Backlog:** priority on optional **export** (PDF/PNG) after multiple interviewees asked for “something that survives Slack’s link preview dying.”

---

## Interview 2 — R.V.

| Field | Detail |
|--------|--------|
| **Initials** | R.V. |
| **Role** | CFO / fractional finance (contract) |
| **Company stage** | Seed-stage AI-native startup, ~12 FTE, remote EU |

### Context

R.V. was brought in to clean up “shadow AI” spend before an investor data room. Founders had ChatGPT Team, Claude, and a growing OpenAI API line item that engineering swore was “only experiments.” R.V. does not live in IDEs day to day.

### Quotes

1. *“I’m not going to log into Cursor. I need a number and a reason I can paste next to the line item in the model.”*  
2. *“When it said we could save six hundred a month, I immediately asked: is that list price or our contract? Your FAQ admitting enterprise discounts exist—that’s what made me trust the rest.”*  
3. *“The lead form for ‘big savings’ felt less slimy because it only showed up when the number was actually large. If it had popped up for forty bucks I would have closed the tab.”*

### Biggest insight

**Thresholded monetization builds trust.** High-savings-only consultation CTA (`monthly_savings > 500`) read as *signal*, not *spam*, to a finance persona who is allergic to growth hacks.

### What changed in the product

- **Lead capture block:** microcopy under the CTA clarifying *optional* consultation and no obligation to book.  
- **FAQ / PRICING_DATA alignment:** explicit line that API and enterprise numbers are **directional** unless reconciled to contracts.  
- **Audit form:** clearer labels on **monthly spend** vs “bill from vendor” to reduce CFO confusion when numbers don’t match invoices 1:1.

---

## Interview 3 — J.T.

| Field | Detail |
|--------|--------|
| **Initials** | J.T. |
| **Role** | Staff engineer + internal “tools guild” lead |
| **Company stage** | Post–Series B platform team, ~200 engineers, hybrid US |

### Context

J.T. runs an internal guild tracking dev tooling. They piloted the audit with five real stacks (redacted names) and compared output to internal license spreadsheets. Biggest friction was multi-tool entry and fear of losing half-filled forms during a meeting.

### Quotes

1. *“I started the audit on my laptop, got pulled into a incident, came back and my rows were still there—that small thing is actually huge for adoption.”*  
2. *“We have Windsurf pilots in one BU and Cursor in another. I wanted to see both in one run without pretending they’re the same seat model.”*  
3. *“The recommendations are only as good as your catalog. When Claude Team didn’t match our Anthropic invoice, I didn’t rage-quit—I knew where the gap was because the reasoning string said ‘plan tier’ explicitly.”*

### Biggest insight

**Draft persistence + explicit reasoning** reduce abandonment and support power-user validation. Internal champions will *stress-test* your catalog; transparency in `reasoning` turns skepticism into feedback instead of churn.

### What changed in the product

- **localStorage draft** on `/audit` was already live; interview pushed **backlog** for a visible *“Draft saved”* hint after first edit (today persistence is silent).  
- **Tool list:** documented supported vendors in README + landing FAQ so J.T.-style buyers see Windsurf and Cursor as first-class, not edge cases.  
- **Engine / docs:** internal pricing refresh note (→ `PRICING_DATA.md`) for **Claude Team** fidelity after vendor seat-type changes; prioritized catalog freshness over new chart types.

---

## Cross-cutting themes

| Theme | Implication |
|--------|-------------|
| **Link as artifact** | Report URL is the product for non-technical stakeholders. |
| **Honest uncertainty** | Saying “estimates” out loud increases trust and repeat usage. |
| **Champion workflow** | Engineers start audits; finance consumes links—optimize both paths. |

---

## Next interviews (suggested)

- **Procurement / IT** persona (vendor risk, DPA questions).  
- **Design org** heavy on Creative Cloud + Gemini (different stack, same pain).  
- **Agency** with per-client API keys (usage vs seat blur).

---

*These summaries are illustrative for product narrative and prioritization; replace with real anonymized notes when you run your own research program.*
