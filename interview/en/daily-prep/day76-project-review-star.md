# Day 76 project recap: polish STAR — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 76 | Project STAR | [Project recap](../project-review) |

## Today's goals

- Read the `/en/project-review` template
- Polish STAR for 2–3 core resume projects: Situation / Task / Action / Result
- Update `project-review.md` so every project can take 3 layers of “why”

## Reading checkpoints

- Interviewers care about **what you did + why + quantified impact**
- Common anti-pattern: “our team did XX” — always return to **your** actions
- Result needs **numbers**: first paint from X to Y, incident rate down Z%

## Cheat sheet / knowledge

### STAR template

| Piece | What to say | Length |
|------|--------|------|
| **S**ituation | Business context + pain (one sentence) | 15s |
| **T**ask | Your role + goal (concrete metric) | 15s |
| **A**ction | What you did (2-3 core steps) | 60s |
| **R**esult | Quantified gain + later impact | 30s |

### How to quantify

| Weak | Strong |
|------|-----|
| "Improved performance" | "LCP from 4.2s to 2.1s" |
| "Fewer bugs" | "Production incident rate down 60%" |
| "More efficient" | "Build time from 180s to 45s" |
| "Better UX" | "Bounce rate down 15%" |

### Three-layer follow-up plan

```text
Layer 1: What did you do? → STAR body
Layer 2: Why that way? → design rationale (what you compared, why this one)
Layer 3: If you did it again? → reflection + improvements (shows growth)
```

### Admitting a gap

```text
"I have no direct production experience here, but I know it is an [X-class] problem.
The usual approach is [Y]. I can ramp up quickly if needed."
```

## Handwritten / flow

### STAR example templates

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

## Spoken questions

### 1. Walk through a project you owned

STAR script (2-minute version):

> **S**: Our e-commerce homepage LCP P75 sat around 4.2s, bounce above industry average.
>
> **T**: I owned frontend; goal was LCP under 2.5s.
>
> **A**: First, Lighthouse and CrUX: two main issues — hero was PNG with no preload, JS bundle 280KB blocking render. Second, four moves — WebP + preload; route-based Code Split down to a 90KB first-screen chunk; inline Critical CSS; preconnect the API origin. Third, Lighthouse CI on every PR so scores cannot slide.
>
> **R**: LCP P75 to 2.1s, bounce down 15%. After launch we kept web-vitals RUM on.

### 2. What was the hardest part?

Answer template:

> Hardest was finding the bottleneck, not optimizing blindly. The team wanted SSR first; Lighthouse showed the bottleneck was not TTFB but asset size and load strategy. SSR cost (Node ops, rewrite) was far higher than static work. Cheaper moves (Code Split + image work + preload) landed a better result.
>
> The other hard part was keeping the win — code regresses. So I pushed Lighthouse CI and Bundle Analyzer so each release cannot silently get slower.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Project A STAR (2 min)
2. Project B STAR (2 min)
3. Generic follow-ups (why / if again / admitting a gap) (1 min)

After recording, self-check:

- Each project is what **I** did, not “we”.
- Result has numbers.
- You prepared 2 layers of follow-up.
- Admitting a gap sounds calm, not defensive.

## Today's recap

The 3 points that most need a follow-up today:

1. Stack versions and key APIs used in the project — interviewers may drill details.
2. “If you did it again” reflection must be ready; do not invent it live.
3. Numbers must be believable; they will ask where the data came from.
