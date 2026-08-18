# Day 79 mock interview 2 (mixed round) — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 79 | Mock 2 | [High-frequency 50](../high-frequency-50), [Week 8 question bank](../advanced/week8/question-bank) |

## Today's goals

- 90-minute mixed round: 30min tech deep-dive + 30min project + 15min architecture/scenario + 15min HR
- Stress **structure** on project stories and architecture questions
- Record the whole session

## Reading checkpoints

- Mixed rounds test **engineering sense**: when you explain a design, do monitoring / tests / build / deploy / perf show up
- Project trap: features only, no decisions; “we” instead of “I”
- Architecture trap: listing options with no trade-off

## Cheat sheet / knowledge

### Mixed-round rubric

| Dimension | Strong | Weak |
|------|----------|----------|
| **Engineering breadth** | Monitoring / tests / build / deploy show up naturally | Features only |
| **Decision-making** | Trade-offs, reasons, comparisons | Options listed, no pick |
| **Control of the room** | Good pacing, you steer, you know when to stop | Interviewer drags you |
| **Project depth** | What **I** did + numbers + calm follow-ups | “We” did + no data |

### Time split

```text
Tech deep-dive (30min): 3-4 questions on resume tech
Project (30min): core STAR + 2-3 follow-up layers
Architecture / scenario (15min): design a system / open-ended problem
HR (15min): why you left / plan / salary / reverse questions
```

### Architecture answer structure

```text
1. Confirm the need (30s): "What's the core scenario? What user scale?"
2. Top-level design (60s): main modules and data flow
3. Key decisions (60s): stack + why those trade-offs
4. Edges (30s): failures, degradation, security
5. Extensibility (30s): where it evolves next
```

### Project-story checklist

```text
□ Always "I", never "we"
□ Concrete numbers (LCP / conversion / incident rate)
□ Why you chose it (not only what you did)
□ Volunteer one trap you hit and how you fixed it
□ Have an "if I did it again" reflection ready
```

## Handwritten / flow

### Architecture example: design a frontend tracking system

```text
Confirm the need:
  - Behavior tracking (clicks, dwell) + perf (LCP/CLS) + error tracking
  - DAU ~1M, ~10M events/day
  - Real-time alerts + offline analysis

Top-level design:
  Browser
    └─ Tracking SDK (auto + manual)
        ├─ Capture: global listeners + declarative directives + manual API
        ├─ Process: format + sample + aggregate + batch buffer
        └─ Report: sendBeacon / fetch keepalive
            ↓
  Gateway (Kafka)
    ├─ Real-time pipe → Flink → alerts (DingTalk/email)
    └─ Offline pipe → ClickHouse → dashboards (Grafana)

Key decisions:
  - SDK uses sendBeacon not XHR → unload does not drop data
  - Configurable sample rate (P0 errors 100%, behavior 10%) → cost control
  - Batch buffer (flush every 5s or 10 events) → fewer requests

Edges:
  - Offline → cache in IndexedDB, replay when back
  - SDK errors → try-catch so they never break the product
```

## Spoken questions (mock log)

### Question 1: Introduce your most important project (STAR)

> Live recap: (fill after the mock)
>
> Corrected: Use the Day 76 STAR script, finish in 2 minutes. S + T 15s each, A 60s for 3 core steps, R 30s for numbers.

### Question 2: If you designed an XX system, how would you do it?

> Live recap: (fill after the mock)
>
> Corrected: Five steps — confirm need → top-level design → key decisions → edges → extensibility. Sketch a diagram.

### Question 3: Three core HR questions

> Self-intro: (fill after the mock)
> Why you left: (fill after the mock)
> Salary: (fill after the mock)

### Questions 4–N

> (fill after the mock with the actual questions)

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Core project, 2-minute STAR (2 min)
2. Weakest architecture question, retold in five steps (2 min)
3. Recap of the three HR questions (1 min)

## Today's recap

Whole-session scores (fill after the mock):

- Tech deep-dive: ___/10
- Project story: ___/10
- Architecture / scenario: ___/10
- HR: ___/10

Top 3 project-story issues:

1. (fill after the mock)
2. (fill after the mock)
3. (fill after the mock)

Top 3 architecture issues:

1. (fill after the mock)
2. (fill after the mock)
3. (fill after the mock)
