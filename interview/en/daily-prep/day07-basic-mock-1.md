# Day 7 First Basic Mock Interview

## Goals

- Revisit weak spots from Days 1–6
- Do one 60-minute self mock (JS / browser / network)
- Produce a 10-item “basic stuck-question list”, classified as `don’t know / know but rusty / poor delivery`

## Read in order

1. [14-Day Sprint](../sprint-14-days)
2. [High-Frequency 50](../high-frequency-50)

## Practice and self-check

**Checkpoints**

- The mock must be strictly timed; looking back at docs is not allowed
- Score each answer immediately: **fluent / stalled / wrong**; phrases only, no long sentences

**Produce or redraw from memory**

- Mock question list (high-frequency from Days 1–6, 60-minute limit)
- Whiteboard handwritten questions (reference)

**Answer aloud without reading a reference answer**

- 1. Mock A: `this` binding priority
- 2. Mock B: closures and memory leaks

**Mock format and scoring**

### Mock question list (high-frequency from Days 1–6, 60-minute limit)

| # | Question | Focus | Self-score |
|---|------|--------|------|
| 1 | Why is `typeof null` `"object"`? | data types | |
| 2 | What is the `this` binding priority? | this rules | |
| 3 | The 4 steps of `new`ing a constructor? | prototype chain | |
| 4 | What is a closure? Which scenarios leak? | closures | |
| 5 | Engineering differences among `let / const / var`? | scope | |
| 6 | Why does `for + var` print only the last value? | closures + scope | |
| 7 | Event-loop order question (given code, judge the output) | async | |
| 8 | What is Promise value penetration? | Promise | |
| 9 | Is code after `await` sync or async? | async/await | |
| 10 | V8 young/old generation GC strategy? | memory | |
| 11 | How do you combine strong cache and negotiation cache? | HTTP cache | |
| 12 | When does a preflight request fire? | CORS | |

Self-score rubric: ✅ fluent / ⚠️ stalled / ❌ wrong

### Whiteboard handwritten questions (reference)

[Reference code](../handwrite/call#day-7-practice-code)

**Recording drill**

1. Pick the least familiar question and answer it fully (2 minutes)
2. Retell it with the correct structure (2 minutes)
3. Mark the difference between the two takes and find the weak delivery points (1 minute)

## Recap

Stuck-question Top 3:

1. Event-loop order questions easily miss where rAF sits.
2. Why `bind` ignores the bound object under `new` is hard to phrase clearly.
3. Cache-header priority is easy to mix up with the ETag vs Last-Modified pairing.

Classification summary:

- Don’t know (need to relearn): V8 incremental marking details
- Know but rusty (need more drills): quickly judging event-loop output questions
- Poor delivery (need to restructure): the order of explaining this priority
