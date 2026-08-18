# 14-day foundation sprint

This is not the senior sprint. It is the **foundation lock-in** before you start senior frontend prep.

One goal: stabilize the base that every later topic sits on, so you do not jump into engineering, framework internals, and perf while still failing basics.

Default: **2–3 hours a day**.  
If time is tight, move “bonus” work to the weekend. Do not cut oral practice or the recap.

## What these 14 days cover

Four blocks only:

1. **JavaScript core**
2. **Browser and network basics**
3. **High-frequency HTML / CSS**
4. **Algorithm and handwritten warm-up**

When this ends you should be able to:

- Talk a basic topic for `3–5 minutes` without collapsing
- Stop answering with keyword lists
- Enter senior topics without the base giving out

## Rules (read first)

- Every day: **input → output → drill → self-test**.
- Output must be visible: an oral outline, a diagram, or a code snippet of your own.
- 15 minutes recap at night: the 3 points that stuck today.
- Days 7 and 14 are mock interviews, still focused on basics and delivery.
- Oral drills: `/en/daily-oral-sets-14`.

## Daily rhythm

1. **50–60 min**: read docs, structured notes.
2. **40–50 min**: handwritten code / diagram / answer template.
3. **30 min**: oral drill (record 5–8 min).
4. **10–15 min**: recap weak spots; they become tomorrow’s first item.

---

## Day 1: JS types, this, prototype

- **Input**: `/en/jscore/basic/data-type`, `/en/jscore/basic/this`, `/en/jscore/basic/prototype`
- **Output**:
  - One page *JS basics cheat sheet* (types, this binding, prototype)
  - Key steps of handwritten `call` / `bind` (reuse existing handwrite)
- **Drill**:
  - What is the `this` binding priority?
  - How do you walk the prototype chain and `new`?
- **Bar**: explain `this` and the prototype chain in 5 minutes without the docs.

## Day 2: Closures, scope, hoisting, ES6

- **Input**: `/en/jscore/basic/scope-closure`, `/en/jscore/basic/es6`
- **Output**:
  - One page *closures and scope* outline
  - 3 closure use cases + 2 leak / risk cases
- **Drill**:
  - What is a closure? Why can it see outer variables?
  - How do you talk `let` / `const` / `var` as an engineering issue, not a definition dump?
- **Bar**: closure as “definition → use → leak risk”.

## Day 3: Async model and the event loop

- **Input**: `/en/jscore/basic/event-loop`, `/en/jscore/basic/async-program`, `/en/jscore/advanced/promise`, `/en/jscore/advanced/async-await`
- **Output**:
  - Handwritten Promise core (state, `then` chaining)
  - A macrotask / microtask order diagram
- **Drill**:
  - Why does code after `await` *feel* synchronous?
  - `Promise.all` vs `allSettled`?
- **Bar**: get 3 event-loop output questions right.

## Day 4: DOM / BOM / Web APIs + events

- **Input**: `/en/jscore/basic/dom-bom-webapi`, `/en/jscore/basic/event-mechanism`, `/en/jscore/basic/other-web-apis`
- **Output**:
  - Event-delegation demo (`closest` + dynamic nodes)
  - Interview templates for `IntersectionObserver` + `sendBeacon`
- **Drill**:
  - Why can an SPA change the URL without a reload?
  - Capture / bubble in a real product story?
- **Bar**: 3 observer APIs and when to use each.

## Day 5: Memory and browser rendering

- **Input**: `/en/jscore/basic/memory-management`, `/en/network&broswer/broswer-render`
- **Output**:
  - A leak hunt flowchart (find → locate → fix → verify)
  - Render pipeline (DOM → CSSOM → Render Tree → Layout → Paint → Composite)
- **Drill**:
  - Why does WeakMap reduce leak risk?
  - Why is `transform` usually safer than `top/left`?
- **Bar**: one leak case + one render-perf question, end to end.

## Day 6: HTTP, cache, CORS, storage

- **Input**: `/en/network&broswer/http-protocol`, `/en/network&broswer/cache-mechanism`, `/en/network&broswer/cross-origin`, `/en/network&broswer/broswer-storage`
- **Output**:
  - A short “URL → pixels” flowchart
  - One page *cache answer template* (strong / negotiated / asset versioning)
- **Drill**:
  - How do you combine strong cache and negotiated cache?
  - When does a preflight fire?
- **Bar**: network answers reach headers / browser behavior.

## Day 7: First foundation mock

- **Input**: restudy Day 1–6 weak spots
- **Output**:
  - 60-minute mock notes
  - 10 “I stalled on this” basics
- **Range**: JS, browser, network
- **Bar**: classify stalls as “don’t know / know but rusty / bad delivery”.

---

## Day 8: High-frequency HTML / CSS layout

- **Input**: `/en/html&css/layout`, `/en/html&css/box-model`, `/en/html&css/responsive-design`, `/en/advanced/css-advanced`, `/en/advanced/mobile-and-cross-platform`
- **Output**:
  - How to trigger BFC + when it helps
  - rem / vw / safe-area comparison
- **Drill**:
  - 1px on retina?
  - CSS Modules vs CSS-in-JS vs Tailwind?
- **Bar**: layout, box model, adaptation in 10 minutes.

## Day 9: Semantics, compat, animation, paint

- **Input**: `/en/html&css/semantic-tag`, `/en/html&css/browser-compatibility`, `/en/html&css/animation`
- **Output**:
  - One page *HTML/CSS landmines*
  - Animation properties vs render cost
- **Drill**:
  - Why semantics?
  - Why do some animations drop frames?
- **Bar**: CSS answers go beyond “Flex and Grid”.

## Day 10: Algorithm warm-up 1

- **Input**: `/en/algorithm&data-structure/array-operation`, `/en/algorithm&data-structure/string-operation`, `/en/algorithm&data-structure/two-pointers`
- **Output**:
  - Templates for high-frequency array / string problems
  - When two pointers apply
- **Drill**:
  - When do you reach for two pointers first?
  - How do you classify dedup, flatten, sliding window?
- **Bar**: not volume — a clean story of the approach.

## Day 11: Handwrite warm-up 1

- **Input**: `/en/handwrite/call`, `/en/handwrite/bind`, `/en/handwrite/new`, `/en/handwrite/instanceof`
- **Output**:
  - Step templates for 4 handwritten problems
  - One page *order of answering a handwritten question*
- **Drill**:
  - What is `call` / `bind` / `new` at the core?
  - How does `instanceof` walk the chain?
- **Bar**: talk the approach, then write code.

## Day 12: Handwrite warm-up 2 + Promise / debounce / throttle

- **Input**: `/en/handwrite/debounce`, `/en/handwrite/throttle`, `/en/handwrite/promisify`, `/en/handwrite/event-emitter`
- **Output**:
  - Debounce vs throttle table
  - Oral templates for EventEmitter / promisify
- **Drill**:
  - When debounce vs throttle?
  - How do you turn a Promise-style API into async style?
- **Bar**: connect handwritten code to a product scene.

## Day 13: Framework preheat

- **Input**: `/en/framework/vue/vue3`, `/en/framework/react/basics`
- **Output**:
  - Vue vs React basics comparison
  - Shared outline: components, state, rendering
- **Drill**:
  - Why is modern frontend stuck with components?
  - What problem domain do Vue and React share?
- **Bar**: a ramp into the senior stage — not source-level detail today.

## Day 14: Second foundation mock + switch to senior

- **Input**: full recap + weak-spot list
- **Output**:
  - 90-minute foundation mock
  - Final *foundation weak-spot list*
  - *What I still lack before the senior stage*
- **Refs**: `/en/high-frequency-50`
- **Structure**:
  - 45 min JS / browser / network
  - 20 min HTML / CSS
  - 15 min handwritten
  - 10 min framework basics
- **Bar**:
  - Basics no longer stall in bulk
  - You can switch to the senior track instead of patching random basics

---

## Daily checklist

- [ ] At least one oral recording (5 min+)
- [ ] At least one code snippet or diagram
- [ ] At least 5 high-frequency Q&As written down
- [ ] Recap 3 questions you missed or delivered poorly

## After these 14 days

Do not keep expanding sideways on basics. Switch to the senior spine:

1. `advanced/week1` build pipeline
2. `advanced/week2` deploy and delivery
3. `advanced/week3-4` framework internals
4. `advanced/week5` TypeScript
5. `advanced/week6-8` perf, security, governance, architecture, project storytelling
