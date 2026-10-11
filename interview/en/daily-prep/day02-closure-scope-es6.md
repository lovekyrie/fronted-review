# Day 2 Closures / Scope / ES6

## Goals

- Finish `/en/jscore/basic/scope-closure` and `/en/jscore/basic/es6`
- Produce one page of a *Closures and Scope* outline: 3 use cases + 2 leak-risk scenarios
- Prepare 2 oral questions and complete one 5-minute recording

## Read in order

1. [Scope and Closures](../jscore/basic/scope-closure)
2. [Closures Advanced](../jscore/advanced/closure)
3. [ES6](../jscore/basic/es6)

## Practice and self-check

**Checkpoints**

- A closure is not “a function inside a function”; it is “a function + the outer variable environment it can access”
- `let / const` TDZ should be explained with real engineering problems, not just the definition
- Hoisting must distinguish `var` declaration hoisting, whole `function` declaration hoisting, and the TDZ of `let/const`
- ES Modules are “live bindings” (a reference to the value); CommonJS is “a copy of the value”; they behave completely differently under circular dependencies
- Arrow functions have no `this / arguments / prototype`, cannot be used with `new`, and are essentially syntactic sugar over closure semantics

**Produce or redraw from memory**

- Scope and the scope chain — [reference section](../jscore/basic/scope-closure#day-2-scope-and-the-scope-chain)
- Variable declaration comparison — [reference section](../jscore/basic/scope-closure#day-2-variable-declaration-comparison)
- Closures — [reference section](../jscore/basic/scope-closure#day-2-closures)
- Execution context (simplified) — [reference section](../jscore/basic/scope-closure#day-2-execution-context-simplified)
- Must-know ES6 points — [reference section](../jscore/basic/es6#day-2-must-know-es6-points)
- ESM vs CommonJS — [reference section](../jscore/basic/es6#day-2-esm-vs-commonjs)
- Closure counter (classic closure) — [reference section](../jscore/basic/scope-closure#day-2-closure-counter-classic-closure)
- Loop + closure trap and three fixes — [reference section](../jscore/basic/scope-closure#day-2-loop-closure-trap-and-three-fixes)
- Flowchart: memory leak caused by a closure — [reference section](../jscore/basic/scope-closure#day-2-flowchart-memory-leak-caused-by-a-closure)
- Simplified debounce (a closure use case) — [reference section](../jscore/basic/scope-closure#day-2-simplified-debounce-a-closure-use-case)

**Answer aloud without reading a reference answer**

- 1. What is a closure? Why can it access outer variables?
- 2. How do you talk about `let / const / var` as an engineering problem?
- 3. What is the difference between ES Modules and CommonJS? (backup)

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Closure definition + lexical scope + execution context (2 minutes).
2. 3 use cases: module privacy, currying, debounce/throttle (2 minutes).
3. Closure leak risks + engineering differences among `let / const / var` (1 minute).

Self-check after recording:

- Did you say “closure = function + outer variable environment”?
- Did you say the difference between TDZ and `var` hoisting?
- Did you say the classic `for + var` bug and the `let` fix?
- Did you say a closure is not the same as a memory leak?

## Recap

The 3 points that most need follow-up today:

1. The essential difference between lexical scope and dynamic scope, and how it determines closure behavior.
2. The underlying implementation of `let` creating a new block scope each `for` iteration (the compiler produces multiple `LexicalEnvironment`s).
3. How ESM live bindings behave under circular dependencies — draw it and explain it again.
