# Day 2 Closures / Scope / ES6 Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 2 | Closures / Scope / ES6 | [Scope and Closures](../jscore/basic/scope-closure), [Closures Advanced](../jscore/advanced/closure), [ES6](../jscore/basic/es6) |

## Today's goals

- Finish `/en/jscore/basic/scope-closure` and `/en/jscore/basic/es6`
- Produce one page of a *Closures and Scope* outline: 3 use cases + 2 leak-risk scenarios
- Prepare 2 oral questions and complete one 5-minute recording

## Reading checkpoints

- A closure is not “a function inside a function”; it is “a function + the outer variable environment it can access”
- `let / const` TDZ should be explained with real engineering problems, not just the definition
- Hoisting must distinguish `var` declaration hoisting, whole `function` declaration hoisting, and the TDZ of `let/const`
- ES Modules are “live bindings” (a reference to the value); CommonJS is “a copy of the value”; they behave completely differently under circular dependencies
- Arrow functions have no `this / arguments / prototype`, cannot be used with `new`, and are essentially syntactic sugar over closure semantics

## Cheat sheet / knowledge points

### Scope and the scope chain

JavaScript uses **lexical scope** (static scope). Scope is fixed when the function is defined, independent of where it is called.

Three kinds of scope:

- Global scope: lasts for the whole program lifetime.
- Function scope: created by `function`; not visible from the outside.
- Block scope: created by `let / const / class` inside `{}`.

Scope-chain lookup:

```text
current scope
  -> outer function scope
  -> ...
  -> global scope
  -> ReferenceError if not found
```

### Variable declaration comparison

| Dimension | `var` | `let` | `const` |
|------|-------|-------|---------|
| Scope | function | block | block |
| Hoisting | hoisted and initialized to `undefined` | hoisted but has TDZ | hoisted but has TDZ |
| Redeclaration | allowed | not allowed | not allowed |
| Reassignment | allowed | allowed | the reference is immutable |
| Global declaration attached to `window` | yes | no | no |

### Closures

Definition: **closure = a function + the outer variable environment it can access at definition time**.

Why they exist: lexical scope + an inner function being held from the outside for a long time, so outer variables cannot be GC’d.

Common uses:

- Data privacy (module pattern).
- Currying and partial application.
- Debounce, throttle, and memoize.
- Keeping each loop iteration’s index.

Leak risks:

- A closure holds a DOM reference + a listener that was never unbound.
- `setTimeout / setInterval` holds a large object for a long time.
- Circular references never manually set to `= null`.

### Execution context (simplified)

- Creation phase: determine `this`, create the VariableEnvironment and LexicalEnvironment.
- Execution phase: run line by line and assign values.
- Call stack: function calls push, returns pop.

### Must-know ES6 points

- `let / const` + block scope + TDZ.
- Arrow functions: no independent `this / arguments / prototype`, cannot `new`.
- Destructuring + default values.
- `Promise`: states are irreversible `pending -> fulfilled / rejected`.
- `class`: syntactic sugar over prototype inheritance; methods live on `prototype` by default and are non-enumerable.
- ES Modules: static analysis, live bindings, `import` is hoisted, strict mode by default.
- `Set / Map / WeakMap / WeakSet`: deduping, keys of any type, weak refs to avoid leaks.

### ESM vs CommonJS

| Dimension | CommonJS | ES Module |
|------|----------|-----------|
| Load timing | runtime | compile-time static analysis |
| Export | copy of the value | live binding (a reference) |
| Top-level `this` | `module.exports` | `undefined` |
| Async | synchronous | top-level `await` supported |
| Tree-shaking | unfriendly | friendly |

## Handwritten notes / flowcharts

### Closure counter (classic closure)

```js
function createCounter() {
  let count = 0
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
  }
}

const counter = createCounter()
counter.inc()
counter.inc()
counter.get() // 2
```

### Loop + closure trap and three fixes

```js
// Problem: var has no block scope, so all 3 callbacks share the same i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 3 3 3
}

// Fix 1: let (a new block scope each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0) // 0 1 2
}

// Fix 2: IIFE to create a closure explicitly
for (var i = 0; i < 3; i++) {
  ;(function (j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
```

### Flowchart: memory leak caused by a closure

```text
createLeak() runs
  -> create large object bigData (10MB)
  -> return inner function fn
  -> outer fn = createLeak()

createLeak finishes
  -> but fn still references the closure scope
  -> the closure scope references bigData
  -> GC cannot collect bigData

Release: fn = null
  -> the closure loses its reference
  -> bigData can be collected
```

### Simplified debounce (a closure use case)

```js
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
```

## Oral questions

### 1. What is a closure? Why can it access outer variables?

Answer template:

> A closure is a function plus the outer variable environment it can access at definition time. It can access outer variables because JavaScript is lexically scoped: a function’s scope is fixed when it is defined.
>
> When an inner function is held from the outside for a long time — returned as a value, or attached to a callback or timer — the outer function has finished, but its variable environment is still referenced by the inner function, so GC will not collect it. That is a closure.
>
> Common uses include data privacy, currying, debounce/throttle, and caching. The cost is that those variables stay in memory, so one extra point: a closure is not the same as a memory leak. It only becomes a leak when those variables are no longer needed but still cannot be collected because the closure holds them. Typical cases: unbound DOM listeners and long-lived `setInterval`.

### 2. How do you talk about `let / const / var` as an engineering problem?

Answer template:

> The main differences are scope, hoisting, and redeclaration. `var` is function-scoped, hoisted and initialized to `undefined`, allows redeclaration, and a global declaration is also attached to `window`, which easily pollutes the global scope. `let` and `const` are block-scoped; they are also hoisted, but they have a temporal dead zone, so accessing them before the declaration runs throws; `const` also requires initialization at declaration time, and the reference address cannot change.
>
> Real engineering impact: first, a `var` loop counter is still accessible after the loop, and together with closures you get the classic “only the last value is printed” bug; `let` naturally gives each iteration its own block scope. Second, `var` pollutes global `window` and collides easily when multiple scripts cooperate. Third, `const` strongly encodes “this reference does not change”, which makes intent clearer, and with ESLint `prefer-const` it can also force a consistent team style.
>
> My own default: `const` by default, `let` only when reassignment is needed, and no `var`.

### 3. What is the difference between ES Modules and CommonJS? (backup)

Answer template:

> The main differences are load timing, export semantics, and static-ness. CommonJS loads synchronously at runtime and exports a copy of the value, so later changes inside the module are not visible outside. ES Modules are statically analyzed at compile time and import a live binding, so updates inside the module are visible outside.
>
> Static analysis is the key point: it lets ESM support tree-shaking, so bundlers can drop unused exports at build time and shrink the bundle. ESM also has top-level `this` as `undefined`, strict mode by default, and top-level `await` — none of which CommonJS has.
>
> Circular dependencies also differ: CJS gets “whatever has already been exported at that moment”; ESM is a reference, so you can later read the complete value. Modern projects default to ESM and only use CJS when they still need older Node ecosystem compatibility.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Closure definition + lexical scope + execution context (2 minutes).
2. 3 use cases: module privacy, currying, debounce/throttle (2 minutes).
3. Closure leak risks + engineering differences among `let / const / var` (1 minute).

Self-check after recording:

- Did you say “closure = function + outer variable environment”?
- Did you say the difference between TDZ and `var` hoisting?
- Did you say the classic `for + var` bug and the `let` fix?
- Did you say a closure is not the same as a memory leak?

## Today's review

The 3 points that most need follow-up today:

1. The essential difference between lexical scope and dynamic scope, and how it determines closure behavior.
2. The underlying implementation of `let` creating a new block scope each `for` iteration (the compiler produces multiple `LexicalEnvironment`s).
3. How ESM live bindings behave under circular dependencies — draw it and explain it again.
