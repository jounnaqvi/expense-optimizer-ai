# Economics — AI Spend Audit

This document is a **working financial model** for a hypothetical go-to-market on top of the current product (free audits, optional **consultation lead form** when modeled savings exceed **$500/mo**—see `app/results/page.tsx`).  

**Important:** All figures below are **illustrative assumptions** for planning and fundraising conversations—not audited financials. Replace inputs with your own cohort data as soon as you have 8–12 weeks of production metrics.

**Notation:** USD. **ARR** = annual recurring revenue. **MRR** = monthly recurring revenue. **CAC** = customer acquisition cost. **LTV** = lifetime value.

---

## 1. Executive snapshot (illustrative “base case”)

| Metric | Symbol | Base assumption | Notes |
|--------|--------|-----------------|--------|
| Marketing + content spend (monthly) | \(M\) | **$12,000** | Blended paid social, sponsorships, founder-led SEO. |
| Sales capacity | — | **0.4 FTE** SDR/BDR + founder closes | Early stage; no enterprise AE team. |
| Lead → paid customer (90-day) | \(p_{\text{win}}\) | **12%** | High-intent inbound from large savings context. |
| Average contract value (first year) | **ACV** | **$18,000** | Mix: paid audit retainer + lightweight “stack review” + optional ongoing advisory. |
| Gross margin (blended services + software) | **GM** | **55%** | Heavy human time in v1; improves if productized. |

These drive the calculations in later sections.

---

## 2. Conversion funnel (monthly, base case)

Funnel is anchored on **unique visitors** who could start an audit. Adjust top-of-funnel to your traffic reality.

| Stage | Rate (of prior step) | Count (example: 40,000 visitors/mo) |
|-------|----------------------|-------------------------------------|
| Site visitors | — | **40,000** |
| Start audit (click `/audit` or CTA) | **18%** | 7,200 |
| Complete audit (successful insert) | **35%** of starters | **2,520** |
| See “high savings” CTA (`>$500/mo` modeled) | **22%** of completers | **554** |
| Submit lead form (email + intent) | **12%** of CTA viewers | **67** |
| Sales-qualified lead (SQL) after reply | **45%** of form submits | **30** |
| Closed-won within 90 days | **12%** of SQLs | **3.6** ≈ **4** new customers/mo |

**Implied overall visitor → customer:**  
\(4 / 40{,}000 = 0.01\%\) per month in this toy model—reasonable for **high-ACV, low-volume** B2B if traffic quality is mixed.

**Sensitivity (completed audits → lead form):**

| Complete audits / mo | High-savings share | Form CTR on CTA | Leads / mo |
|------------------------|--------------------|-----------------|------------|
| 2,520 | 22% | 12% | **67** |
| 5,000 | 22% | 12% | **132** |
| 2,520 | 30% | 15% | **114** |

---

## 3. Estimated lead value (expected value per form submit)

Define:

- **ACV** = average first-year contract value from leads like these → **$18,000** base case.  
- **\(p_{\text{SQL}}\)** = probability a submitted lead becomes SQL after qualification → **45%**.  
- **\(p_{\text{win}}\)** = probability SQL becomes paying customer in 90 days → **12%**.

**Expected gross bookings per lead (before margin):**

\[
\text{EV}_{\text{lead}} = \text{ACV} \times p_{\text{SQL}} \times p_{\text{win}}
= 18{,}000 \times 0.45 \times 0.12 = \mathbf{\$972}
\]

| Scenario | ACV | \(p_{\text{SQL}}\) | \(p_{\text{win}}\) | **EV per lead** |
|----------|-----|--------------------|--------------------|-----------------|
| Conservative | $12,000 | 35% | 8% | **$336** |
| Base | $18,000 | 45% | 12% | **$972** |
| Optimistic | $24,000 | 55% | 18% | **$2,376** |

**Interpretation:** A lead is not “worth $972 in cash”—it is **risk-adjusted pipeline**. Use CRM stage probabilities to replace static \(p\) values as data arrives.

---

## 4. CAC calculations

### 4.1 CAC (fully loaded, marketing + sales)

Assume monthly **fully loaded** GTM spend:

| Line item | $ / mo |
|-----------|--------:|
| Paid acquisition (ads) | 7,000 |
| Tools (CRM, analytics, email) | 800 |
| Fractional SDR / VA follow-up | 3,200 |
| Founder sales time (imputed @ $150/h × 10 h) | 1,500 |
| **Total GTM** | **$12,500** |

With **4** new customers / mo from the funnel above:

\[
\text{CAC} = \frac{12{,}500}{4} \approx \mathbf{\$3{,}125 \text{ per new customer}}
\]

**Payback (months of gross profit):**  
With ACV $18k and GM 55%, gross profit per win ≈ **$9,900** year one → payback vs CAC is **< 1 deal** in this optimistic framing—but that ignores **sales cycle cash timing** and **missed quarters**. A safer headline: **CAC payback on first-year gross profit ≈ 0.35 years** if every customer pays upfront (often false).

### 4.2 CAC for “lead” (if you buy lists / ads to leads only)

If you attribute **only ad spend** to lead forms: **$7,000 / 67 leads ≈ $105 CPL**. Compare to **EV_lead** base $972 → plenty of headroom **if** conversion assumptions hold.

---

## 5. Profitability assumptions (simplified P&L view)

| Assumption | Value | Comment |
|------------|------:|---------|
| Blended gross margin | **55%** | Services-heavy; software margin later lifts this. |
| Operating expenses (ex-GTM) | **$35k/mo** | Tiny team: 2 engineers + infra + legal. |
| Post-sale delivery cost | **18% of revenue** | Implementation / calls bundled in ACV. |

**Monthly revenue** at **4** new customers × ACV amortized linearly is misleading (cash upfront vs ratable). Simpler **steady-state** illustration:

| MRR (recurring only) | One-time / quarter | Monthly gross profit (55% of rev) | GTM | Net (illustrative) |
|----------------------|--------------------|-------------------------------------|-----|----------------------|
| $40,000 | +$18k spread over quarter → +$6k/mo equiv | **$25,300** | $12,500 | **$12,800** before fixed $35k |

So **$1M ARR-style recurring (~$83k MRR)** is needed to cover **$35k fixed + $12.5k GTM** with margin headroom—see [Section 8](#8-assumptions-for-reaching-1m-arr).

---

## 6. Consultation conversion estimates

The product CTA is framed as a **free consultation** after large modeled savings.

| Milestone | Base rate | Notes |
|-----------|------------|--------|
| Lead form → human reply < 24h | **85%** | Operational, not math—failure here kills \(p_{\text{win}}\). |
| Reply → discovery call booked | **55%** | Calendar friction. |
| Call → proposal sent | **40%** of calls | Scope creep risk if audit engine outputs are weak. |
| Proposal → signed | **35%** | B2B procurement; multi-stakeholder. |

**Compound (illustrative):**  
\(0.85 \times 0.55 \times 0.40 \times 0.35 \approx 6.5\%\) from **replied lead** to **signed**—separate from the earlier **12% SQL → win**; use one consistent definition in your spreadsheet.

---

## 7. Revenue projections (3-year sketch)

Assumptions: **ACV grows** slightly as you productize; **new logos / month** ramp with traffic and brand; **net retention** not modeled (set to 100%)—add churn when you have renewals.

| Year | New customers / mo (avg) | Implied new ARR booked | Expansion / upsell | **Net ARR (end)** |
|------|--------------------------|-------------------------|-------------------|-------------------|
| 1 | 2 → 5 (ramp) | ~$360k booked (lumpy) | minimal | **~$280k** |
| 2 | 6 → 12 | ~$1.1M booked | +15% on base | **~$720k** |
| 3 | 12 → 20 | ~$2.0M booked | +20% NRR assumption | **~$1.4M+** |

**Year 1 detail (bookings, not recognized revenue):**

| Quarter | **New ARR booked** | Comment |
|---------|-------------------|--------|
| Q1 | **~$70k** | Founder-led; long sales cycles starting. |
| Q2 | **~$85k** | Repeatable pitch from audit artifact. |
| Q3 | **~$95k** | Case studies improve win rate slightly. |
| Q4 | **~$110k** | End-of-year budget flush (assumed). |
| **Year** | **~$360k** | Rounded; recognize per contract / milestone. |

Numbers are **internally consistent orders of magnitude**, not a forecast.

---

## 8. Assumptions for reaching $1M ARR

**Definition:** \( \text{ARR} \approx \text{MRR} \times 12 \). Target **MRR ≈ $83,333**.

### Path A — Higher ACV, fewer logos (consulting-led)

| Parameter | Value |
|-----------|------:|
| Average MRR per customer (steady) | **$4,500** |
| Customers needed | \(83{,}333 / 4{,}500 \approx\) **19** |
| New logos / mo (steady state) | **1.6** |

If CAC stays **$3,125**, you need **LTV/CAC > 3×** for healthy SaaS—implies **LTV > ~$9.4k** at that CAC, tight for **$54k ARR-year-one** revenue per logo unless multi-year contracts.

**Implication:** Path A needs **higher ACV ($25k–$60k)** or **lower CAC** (founder-led, inbound, partnerships).

### Path B — Productized subscription + lighter services

| Parameter | Value |
|-----------|------:|
| Blended **$499/mo** “Team” product | **$499** |
| Logos at steady state | \(83{,}333 / 499 \approx\) **167** paying teams |
| Monthly gross adds (net of churn) | Depends on churn; if **2%/mo** logo churn, need **~4 gross adds/mo** just to stand still at 167 logos |

**Implication:** Path B needs **self-serve conversion**, **retention**, and **much larger top-of-funnel** than the audit-only MVP provides today.

### Path C — Hybrid (realistic startup)

| Stream | MRR @ steady | % of $83k |
|--------|--------------|-----------|
| Managed stack reviews (retainer) | $45,000 | 54% |
| SaaS “monitoring + quarterly re-audit” | $28,000 | 34% |
| Affiliate / vendor intro (low touch) | $10,333 | 12% |
| **Total** | **$83,333** | 100% |

**Operational requirements:** pricing page, contracts, renewal playbook, and **server-side audit integrity** so enterprise buyers trust the numbers.

---

## 9. KPIs to replace assumptions (first 90 days)

| KPI | Why |
|-----|-----|
| Audit completion rate | Funnel integrity; form UX quality. |
| Share of audits with `monthly_savings > 500` | CTA addressable population. |
| Lead form CTR & completion time | Friction / copy. |
| Cost per completed audit (CPA ÷ completions) | Efficiency of traffic. |
| SQL rate & reason codes | ICP fit. |
| Win rate by ACV band | Pricing power. |
| Days to close | Cash planning vs CAC. |

---

## 10. Disclaimer

This file is **not** tax, legal, or investment advice. Rounding, churn, seasonality, and contract timing materially change outcomes. Rebuild the model in a spreadsheet with **monthly cohorts** before making hiring or spend commitments.

---

## Related documents

- `readme.md` — product overview.  
- `PRICING_DATA.md` — vendor list prices vs in-app modeling (affects trust, not ARR math directly).
