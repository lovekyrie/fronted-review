# Day 15 ESM vs CommonJS vs UMD Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 15 | Modules | [Modules](../advanced/week1/modules), [webpack vs Vite](../engineering/webpack-vs-vite) |

## Today's goals

- Finish `/en/advanced/week1/modules` and MDN Modules
- Produce a module-spec comparison: import/export syntax / load timing / circular-dependency behavior / bundle-output differences
- Be able to explain "why `require` and `import` behave differently in Node"

## Reading checkpoints

- ESM is **static analysis**, CJS is **dynamic execution**; that is the root reason tree-shaking can or cannot work
- ESM "values are bindings", CJS "values are copies"; they behave differently under circular dependencies
- Interop issues from Node 16+ `.mjs` / `"type": "module"`

## Cheat sheet / knowledge points

### Module-spec comparison

| Dimension | ESM | CommonJS | UMD |
|------|-----|----------|-----|
| Syntax | `import / export` | `require / module.exports` | IIFE wrapper |
| Load timing | Compile-time static analysis | Runtime dynamic execution | Runtime |
| Value binding | live binding (reference) | value copy | depends on the inner implementation |
| Circular deps | Can see the latest value | Gets a snapshot at that moment of execution | — |
| tree-shaking | ✅ supported | ❌ not supported | ❌ |
| Native in browser | ✅ `<script type="module">` | ❌ needs bundling | ❌ needs bundling |

### ESM core traits

- **Static structure**: `import / export` must be at the top level, not inside `if`. That lets bundlers analyze the dependency graph at compile time.
- **live binding**: what you import is a binding (reference); after the exporting module mutates the value, importers see the latest value.
- **Strict mode**: ESM is strict by default; no `"use strict"` needed.
- **Async loading**: dynamic `import()` returns a Promise.

### CJS core traits

- **Dynamic execution**: `require()` can appear anywhere and supports conditional imports.
- **Value copy**: `module.exports` exports a copy of the value; later mutations do not affect importers.
- **Synchronous loading**: fits Node.js on the server, not browsers.
- **Cache**: the first `require` caches the result; later calls return the cache.

### Interop in Node.js

- `.mjs` files are forced ESM; `.cjs` files are forced CJS.
- `"type": "module"` in `package.json` makes `.js` default to ESM.
- ESM can `import` CJS modules (taking `module.exports` as the default export).
- CJS cannot `require` ESM modules directly (needs dynamic `import()`).

## Handwritten code / flowcharts

### ESM live binding demo

```js
// counter.mjs
export let count = 0
export function increment() { count++ }

// main.mjs
import { count, increment } from './counter.mjs'
console.log(count)   // 0
increment()
console.log(count)   // 1  ← live binding, you see the latest value

// With CJS, the second console.log would still be 0 (value copy)
```

### Circular-dependency behavior comparison

```js
// === CJS circular dependency ===
// a.js
exports.loaded = false
const b = require('./b.js')  // runs b.js
console.log('b.loaded:', b.loaded)  // true
exports.loaded = true

// b.js
const a = require('./a.js')  // gets a's partial exports (loaded = false)
console.log('a.loaded:', a.loaded)  // false ← value-copy snapshot
exports.loaded = true

// === ESM circular dependency ===
// a.mjs
import { loaded as bLoaded } from './b.mjs'
export let loaded = false
console.log('b.loaded:', bLoaded)  // true (live binding)
loaded = true
```

## Oral questions

### 1. Why can ESM be tree-shaken while CJS cannot?

Answer template:

> Tree-shaking requires the bundler to know at compile time which exports are unused. ESM `import / export` is static syntax and must sit at the top level, so the bundler can analyze the full dependency graph and export usage without executing the code, then drop unused exports.
>
> CJS `require()` is a runtime function call. It can appear in `if`, loops, or even concatenated variables (`require('./' + name)`). The bundler cannot know at compile time what will be loaded, so it cannot safely remove code.

### 2. How do ESM and CJS differ under circular dependencies?

Answer template:

> With CJS circular deps, `require` returns a **snapshot of what has already executed** (value copy). If A requires B and B requires A, B only gets properties A assigned before that `require`; later mutations on A are invisible to B.
>
> With ESM circular deps, `import` gets a **live binding** (reference). Variables are in the TDZ (temporal dead zone) before A's `export` runs, but once assigned, B sees the latest value. So ESM handles circular deps better, with the caveat of TDZ errors.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Evolution of module specs (globals → IIFE → AMD → CJS → ESM) (1 minute)
2. Core ESM vs CJS differences (static/dynamic, live binding/value copy, tree-shaking) (2 minutes)
3. Node.js interop + circular-dependency behavior (2 minutes)

Self-check after recording:

- Did you say ESM is static analysis and CJS is runtime execution?
- Did you explain live binding vs value copy?
- Did you explain why tree-shaking needs a static structure?
- Did you mention `.mjs` / `"type": "module"` in Node.js?

## Today's review

The 3 points that most need follow-up today:

1. Uses of `import.meta` (`import.meta.url`, `import.meta.env`).
2. How `export default` vs `export` show up in the bundle.
3. How dynamic `import()` does code splitting and loading strategy.
