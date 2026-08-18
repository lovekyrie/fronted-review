# Day 14 Basic Mock Interview 2 + Transition Point Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 14 | Basic mock 2 | [14-day sprint](../sprint-14-days), [Top 50 questions](../high-frequency-50), [14 daily oral sets](../daily-oral-sets-14) |

## Today's goals

- Full recap of Day 1–13 weak spots
- Do a 90-minute combined mock: 45 min JS/browser/network + 20 min HTML/CSS + 15 min handwrite + 10 min framework mental model
- Produce a *Foundation Weak-Spot List* and *What I Still Lack Before Senior Phase*

## Reading checkpoints

- The point of the second mock is not "more questions"; it is "clear every stuck item from Day 7"
- The bar for entering the senior phase: **foundation questions no longer stall in large patches**, not "everything memorized"
- Question bank: `/en/high-frequency-50`

## Cheat sheet / knowledge points

### Foundation weak-spot list template

| Category | Core topics | Self-score | Weak details |
|------|----------|------|----------|
| JS core | this / prototype chain / closures / event loop / Promise | | |
| Browser | Render pipeline / GC / storage / compositing layers | | |
| Network | HTTP versions / cache / CORS / TCP/TLS | | |
| HTML&CSS | BFC / Flex / adaptation / animation performance | | |
| Handwrite | call/bind/new / debounce/throttle / Promise / EventEmitter | | |
| Framework mental model | Vue/React update mechanism / componentization / state management | | |

Self-score: ✅ fluent / ⚠️ occasional stall / ❌ needs re-learning

### Combined mock list (90 minutes)

**JS / browser / network (45 minutes)**:
1. Event-loop output question (given code, judge order)
2. Classic closure + for-loop question
3. Combined `this` binding question
4. Strong cache vs negotiation cache
5. When a CORS preflight is triggered
6. V8 GC young generation / old generation

**HTML/CSS (20 minutes)**:
7. Three-column layout implementations
8. BFC trigger conditions and uses
9. Solutions to the 1px problem
10. Mobile adaptation approaches

**Handwrite (15 minutes)**:
11. Handwrite `bind` (including new compatibility)
12. Handwrite debounce (including cancel)

**Framework mental model (10 minutes)**:
13. Vue reactivity in one sentence
14. React update flow in one sentence
15. Core value of componentization

## Handwritten code / flowcharts

### Mock-interview handwrite reference

```js
// Combined question: a cancelable request helper
function createCancelableRequest(url) {
  const controller = new AbortController()
  const promise = fetch(url, { signal: controller.signal })
    .then(res => res.json())

  return {
    promise,
    cancel: () => controller.abort()
  }
}

// Combined question: array to tree
function arrayToTree(items, parentId = null) {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => ({ ...item, children: arrayToTree(items, item.id) }))
}
```

## Oral questions

### 1. Mock A: event loop + microtask output

> Recap reference: find the synchronous code first and run it in order. Code inside a `Promise` constructor is synchronous; `then` callbacks go into the microtask queue. `setTimeout` goes into the macrotask queue. After sync work finishes, drain the microtask queue, then take a macrotask. List the output step by step in that order.

### 2. Mock B: from entering a URL to showing the page

> Recap reference: DNS lookup → TCP three-way handshake → TLS handshake → HTTP request → server response → browser parses HTML/CSS → build DOM + CSSOM → Render Tree → Layout → Paint → Composite. Each step can expand into optimizations (DNS prefetch, HTTP/2, strong cache, async JS loading, compositing layers, etc.).

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Walk the three core mechanisms quickly (event loop / prototype chain / render pipeline) (3 minutes)
2. Use one real project to string together the full chain "HTTP request + cache hit + page render + performance work" (2 minutes)

Self-check after recording:

- Can you clearly describe the event loop in 30 seconds?
- Can you name the prototype-chain lookup stop condition (`null`)?
- Can you fully list the steps from URL to page display?
- Can you naturally string knowledge points together in a project scenario?

## Today's review

*What I still lack before the senior phase*:

1. Engineering gaps: module system (ESM/CJS differences), bundler internals (Vite/Webpack core flow).
2. Framework-internals gaps: Vue reactivity source (Proxy + effect), React fiber scheduling.
3. Structured-expression gaps: answers tend to ramble; practice the four-part "definition → principle → scenario → edge cases".

Foundation-phase self-score (fluent / stall / wrong ratio):

- Target: fluent ≥ 60%, stall ≤ 30%, wrong ≤ 10%
- Actual: ___% / ___% / ___%
