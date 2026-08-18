# Day 7 First Basic Mock Interview Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 7 | Basic mock interview 1 | [14-Day Sprint](../sprint-14-days), [High-Frequency 50](../high-frequency-50) |

## Today's goals

- Revisit weak spots from Days 1–6
- Do one 60-minute self mock (JS / browser / network)
- Produce a 10-item “basic stuck-question list”, classified as `don’t know / know but rusty / poor delivery`

## Reading checkpoints

- The mock must be strictly timed; looking back at docs is not allowed
- Score each answer immediately: **fluent / stalled / wrong**; phrases only, no long sentences

## Cheat sheet / knowledge points

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

## Handwritten notes / flowcharts

### Whiteboard handwritten questions (reference)

```js
// Question 1: handwritten call
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}

// Question 2: handwritten debounce
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## Oral questions

### 1. Mock A: `this` binding priority

> Answer recap: first the four bindings (default / implicit / explicit / new), then the priority `new > explicit > implicit > default`, and finally that arrow functions have no `this` of their own.

### 2. Mock B: closures and memory leaks

> Answer recap: first define a closure (function + outer variable environment), then 3 use cases (privacy, currying, debounce), then leaks (unbound listeners, long-lived setInterval), and emphasize closure ≠ leak.

## 5-minute recording order

1. Pick the least familiar question and answer it fully (2 minutes)
2. Retell it with the correct structure (2 minutes)
3. Mark the difference between the two takes and find the weak delivery points (1 minute)

## Today's review

Stuck-question Top 3:

1. Event-loop order questions easily miss where rAF sits.
2. Why `bind` ignores the bound object under `new` is hard to phrase clearly.
3. Cache-header priority is easy to mix up with the ETag vs Last-Modified pairing.

Classification summary:

- Don’t know (need to relearn): V8 incremental marking details
- Know but rusty (need more drills): quickly judging event-loop output questions
- Poor delivery (need to restructure): the order of explaining this priority
