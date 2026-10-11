# Day 15 ESM vs CommonJS vs UMD

## Goals

- Finish `/en/advanced/week1/modules` and MDN Modules
- Produce a module-spec comparison: import/export syntax / load timing / circular-dependency behavior / bundle-output differences
- Be able to explain "why `require` and `import` behave differently in Node"

## Read in order

1. [Modules](../advanced/week1/modules)
2. [webpack vs Vite](../engineering/webpack-vs-vite)

## Practice and self-check

**Checkpoints**

- ESM is **static analysis**, CJS is **dynamic execution**; that is the root reason tree-shaking can or cannot work
- ESM "values are bindings", CJS "values are copies"; they behave differently under circular dependencies
- Interop issues from Node 16+ `.mjs` / `"type": "module"`

**Produce or redraw from memory**

- Module-spec comparison — [reference section](../advanced/week1/modules#day-15-module-spec-comparison)
- ESM core traits — [reference section](../advanced/week1/modules#day-15-esm-core-traits)
- CJS core traits — [reference section](../advanced/week1/modules#day-15-cjs-core-traits)
- Interop in Node.js — [reference section](../advanced/week1/modules#day-15-interop-in-node-js)
- ESM live binding demo — [reference section](../advanced/week1/modules#day-15-esm-live-binding-demo)
- Circular-dependency behavior comparison — [reference section](../advanced/week1/modules#day-15-circular-dependency-behavior-comparison)

**Answer aloud without reading a reference answer**

- 1. Why can ESM be tree-shaken while CJS cannot?
- 2. How do ESM and CJS differ under circular dependencies?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Evolution of module specs (globals → IIFE → AMD → CJS → ESM) (1 minute)
2. Core ESM vs CJS differences (static/dynamic, live binding/value copy, tree-shaking) (2 minutes)
3. Node.js interop + circular-dependency behavior (2 minutes)

Self-check after recording:

- Did you say ESM is static analysis and CJS is runtime execution?
- Did you explain live binding vs value copy?
- Did you explain why tree-shaking needs a static structure?
- Did you mention `.mjs` / `"type": "module"` in Node.js?

## Recap

The 3 points that most need follow-up today:

1. Uses of `import.meta` (`import.meta.url`, `import.meta.env`).
2. How `export default` vs `export` show up in the bundle.
3. How dynamic `import()` does code splitting and loading strategy.
