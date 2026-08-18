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
