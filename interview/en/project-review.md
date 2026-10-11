# Project review (STAR)

Prepare 2–3 of your strongest projects and tell them with STAR.

## 1. STAR

### S (Situation)

- What was the business goal?
- What was the boundary of the module you owned?

### T (Task)

- What was the core problem?
- What time / resource constraints did you have?

### A (Action)

- How did you locate the problem (tools, method)?
- What were the key changes you made?

### R (Result)

- How much did the metrics move?
- Did anything reusable land in the team?

## 2. Example: first-paint performance

- **S**: Campaign page conversion was low; first paint was a long white screen.
- **T**: Bring the key metrics into an acceptable range in two weeks.
- **A**:
  - Performance + Lighthouse: large bundles, first-paint resources blocking.
  - Route lazy load, split shared deps, WebP images, Gzip / Brotli.
  - `preload` critical assets; defer the rest.
- **R**:
  - LCP 4s → 1.2s.
  - First-paint JS size down 40%+.
  - Conversion up (fill in your real numbers).

## 3. High-frequency follow-ups

- Which change paid off the most?
- If you did it again, what would you change?
- How do you prove it was “faster in data”, not “felt faster”?

## 4. 3-minute template

```text
Situation: the business goal was XXX; the core problem was XXX; the metric it hit was XXX.
Task: I owned XXX and had X weeks to reach XXX.
Action: I found the root cause with XXX, then did 1) XXX 2) XXX 3) XXX.
Result: the core metric went from A to B; production error rate dropped C%; we shipped XXX as a team standard / tool.
Review: the highest-leverage move was XXX; next time I would do XXX earlier.
```

## 5. Quantifiable metrics (prepare at least 6)

- Perf: LCP, FCP, CLS, API latency, bundle size, first paint.
- Stability: JS error rate, white-screen rate, API failure rate, alert count.
- Business: conversion, retention, order rate, time-on-page.
- Efficiency: release frequency, rollback rate, build time, CI pass rate.

## 6. Handling follow-ups

### Q1: How do you prove *your* change caused this?

- A/B, canary data, same-definition monitoring before/after, other variables ruled out.

### Q2: Did anything fail?

- Admit it, then why it failed, how you stopped the bleed, how you fixed it.

### Q3: What was your core value on this project?

- Move from “I wrote code” to “I closed the loop”: locate → design → drive → verify.

## Daily practice reference

### Day 76: STAR template

| Piece | What to say | Length |
|------|--------|------|
| **S**ituation | Business context + pain (one sentence) | 15s |
| **T**ask | Your role + goal (concrete metric) | 15s |
| **A**ction | What you did (2-3 core steps) | 60s |
| **R**esult | Quantified gain + later impact | 30s |

### Day 76: How to quantify

| Weak | Strong |
|------|-----|
| "Improved performance" | "LCP from 4.2s to 2.1s" |
| "Fewer bugs" | "Production incident rate down 60%" |
| "More efficient" | "Build time from 180s to 45s" |
| "Better UX" | "Bounce rate down 15%" |

### Day 76: Three-layer follow-up plan

```text
Layer 1: What did you do? → STAR body
Layer 2: Why that way? → design rationale (what you compared, why this one)
Layer 3: If you did it again? → reflection + improvements (shows growth)
```

### Day 76: Admitting a gap

```text
"I have no direct production experience here, but I know it is an [X-class] problem.
The usual approach is [Y]. I can ramp up quickly if needed."
```

### Day 76: STAR example templates

```text
Project A: e-commerce homepage perf
────────────────────────────────────────
S: Homepage LCP P75 = 4.2s, bounce above industry average; product wanted < 2.5s
T: As frontend owner, lead homepage perf work; target LCP < 2.5s
A:
  1. Lighthouse + CrUX: hero image not preloaded, 280KB JS blocking render
  2. Images: WebP + preload + fetchpriority="high" + CDN
  3. JS: route-based Code Split, first-screen chunk 280KB → 90KB
  4. CSS: inline Critical CSS, async the rest
  5. Lighthouse CI to stop regressions
R: LCP P75 to 2.1s, bounce down 15%, keep watching with web-vitals RUM

Follow-up plan:
  Q: Why not SSR? → team had no Node ops; ROI worse than static work
  Q: If again? → introduce Lighthouse CI earlier so releases do not regress
```

```text
Project B: admin permission rewrite
────────────────────────────────────────
S: Permissions hardcoded in frontend routes; every new role needed a code release; ops kept pinging eng
T: Design a dynamic permission system so ops can configure roles and menus
A:
  1. Three layers: API (backend middleware) + route (dynamic addRoute) + button (v-auth)
  2. Backend permission API; frontend builds routes and menus from the response
  3. Wrap v-auth + useAuth so the team uses one API
  4. Add component tests around permission
R: Ops self-serve; frontend release frequency down 40%; permission bugs down 70%

Follow-up plan:
  Q: How do menus stay in sync with routes? → one data source; menus derived from route config
  Q: Can frontend permission stop attacks? → no, UX fallback only; backend must check
```
