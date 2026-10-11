# Day 16 Babel: AST / preset / plugin

## Goals

- Finish the Babel config docs and Babel Parser
- Produce a Babel three-phase flowchart: parse → transform → generate
- Walk a real preset-env transform case as AST reading

## Read in order

1. [Build Tools](../advanced/week1/build-tools)
2. [webpack vs Vite](../engineering/webpack-vs-vite)

## Practice and self-check

**Checkpoints**

- `preset-env` + `core-js` together only cover **syntax downleveling** and **polyfill injection**; the two jobs are different
- Babel does not bundle; it only does **per-file syntax rewriting**
- `@babel/runtime` and `@babel/plugin-transform-runtime` solve duplicated helper injection

**Produce or redraw from memory**

- Babel's three phases — [reference section](../advanced/week1/build-tools#day-16-babel-s-three-phases)
- Core AST nodes — [reference section](../advanced/week1/build-tools#day-16-core-ast-nodes)
- preset vs plugin — [reference section](../advanced/week1/build-tools#day-16-preset-vs-plugin)
- Three key preset-env options — [reference section](../advanced/week1/build-tools#day-16-three-key-preset-env-options)
- preset-env vs core-js responsibilities — [reference section](../advanced/week1/build-tools#day-16-preset-env-vs-core-js-responsibilities)
- @babel/plugin-transform-runtime — [reference section](../advanced/week1/build-tools#day-16-babel-plugin-transform-runtime)
- Full Babel pipeline — [reference section](../advanced/week1/build-tools#day-16-full-babel-pipeline)
- Minimal Babel plugin example — [reference section](../advanced/week1/build-tools#day-16-minimal-babel-plugin-example)

**Answer aloud without reading a reference answer**

- 1. What does `preset-env` actually do, and how does it relate to `core-js`?
- 2. Why use `@babel/plugin-transform-runtime`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Babel's three phases (parse → transform → generate) + the AST idea (1.5 minutes)
2. Three key preset-env options + the split with core-js (2 minutes)
3. The problem transform-runtime solves + the Babel vs bundler boundary (1.5 minutes)

Self-check after recording:

- Did you say Babel only rewrites syntax per file and does not bundle?
- Did you say preset-env owns syntax and core-js owns APIs?
- Did you mention on-demand injection with `useBuiltIns: "usage"`?
- Did you say transform-runtime solves duplicated helpers?

## Recap

The 3 points that most need follow-up today:

1. Hands-on AST Explorer so you can quickly locate node types.
2. Plugin vs preset execution order (plugins left-to-right, presets right-to-left).
3. Bundle-size difference and when to use `useBuiltIns: "entry"` vs `"usage"`.
