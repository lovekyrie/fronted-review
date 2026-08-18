# Day 78 mock interview 1 (pure tech) — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 78 | Mock 1 | [High-frequency 50](../high-frequency-50), [Week 8 question bank](../advanced/week8/question-bank) |

## Today's goals

- 90-minute self-mock or with a friend: pure tech
- Coverage: JS basics 20min + framework internals 25min + engineering 20min + scenarios 15min + handwritten 10min
- Record the whole session; after, tag how you did on each question

## Reading checkpoints

- A mock is not “do more questions”; it is “force an answer structure”
- On a question you do not know, practice a **structured admission**: “I have no direct production experience with X, but I know it is a Y-class problem; the usual approach is…”
- After each answer, volunteer a follow-up so you are not only reacting

## Cheat sheet / knowledge

### Scoring rubric

| Dimension | Strong | Weak |
|------|----------|----------|
| **Correctness** | Accurate concepts, code that would run | Mixed concepts, wrong pseudocode |
| **Structure** | Conclusion first, then layers | Stream of consciousness |
| **Extension** | Related knowledge, you steer the follow-up | Literal answer only, no extension |
| **Production** | Real experience, traps, numbers | Theory only, no production feel |

### Time split

```text
JS basics (20min): closures, prototype, event loop, Promise, this
Framework internals (25min): Vue/React core, diff, reactivity, hooks
Engineering (20min): Vite/Webpack, CI/CD, test strategy
Scenarios (15min): large-file upload, virtual list, permission design
Handwritten (10min): Promise.all / debounce / deep clone / pub-sub
```

### When you do not know

```text
Formula: "I have no direct production experience with X, but I know it is a Y-class problem.
      The usual approach is Z, because…. I can ramp up quickly if needed."

Example: "I have not shipped micro-frontends, but I know they mainly solve independent multi-team deploy.
      Common options are qiankun and Module Federation: qiankun is a runtime sandbox, MF shares at build time.
      I have read qiankun source and understand the Proxy sandbox."
```

## Handwritten / flow

### Common handwritten list

```text
Must-know (P0):
  □ Promise.all / Promise.race
  □ debounce / throttle
  □ Deep clone (circular refs)
  □ Pub-sub EventEmitter
  □ Array flatten
  □ Curry

High-frequency (P1):
  □ Concurrency control asyncPool
  □ instanceof
  □ new
  □ call / apply / bind
  □ LRU Cache
```

### Handwritten recap template

```text
Question: implement Promise.all
Live performance:
  - Core idea correct
  - Forgot empty array → resolve([])
  - Forgot to keep result order (use index, not push)
Corrected:
  [write the full correct code]
Time: X min (target under 5 min)
```

## Spoken questions (mock log)

### Question 1: What is a closure? Where is it used?

> Live recap: (fill after the mock)
>
> Corrected: A closure is a function plus a reference to its lexical environment. The inner function closes over outer variables; those variables survive after the outer function returns. Uses: module pattern, private state, factories, caches (memoize). Watch memory leaks.

### Question 2: Vue 3 reactivity?

> Live recap: (fill after the mock)
>
> Corrected: Proxy instead of Object.defineProperty. reactive uses Proxy on get/set: get → track (effect → dep), set → trigger. ref wraps primitives. computed is a lazy effect + dirty flag.

### Questions 3–N

> (fill after the mock with the actual questions)

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Re-tell the weakest question — first what went wrong live (2 min)
2. Re-tell it with the correct structure (2 min)
3. Contrast the two takes; name the fix (1 min)

## Today's recap

Whole-session score (fill after the mock):

- Fluent: ___% 
- Stalled but correct: ___% 
- Wrong or unknown: ___%

Top 3 weak areas:

1. (fill after the mock)
2. (fill after the mock)
3. (fill after the mock)

Three things that must be filled before the next mock:

1. (fill after the mock)
2. (fill after the mock)
3. (fill after the mock)
