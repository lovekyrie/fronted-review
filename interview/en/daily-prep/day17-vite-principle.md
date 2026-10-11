# Day 17 Vite Internals

## Goals

- Finish Vite Guide / Why Vite / Features / Dependency Pre-Bundling
- Draw a Vite dev server flowchart
- Write a Vite vs webpack comparison (first half: development)

## Read in order

1. [Vite](../advanced/week1/vite)
2. [Build Tools](../advanced/week1/build-tools)
3. [Week 1 roadmap](../advanced/week1/roadmap)
4. [webpack vs Vite](../engineering/webpack-vs-vite)

## Practice and self-check

**Checkpoints**

- Vite does not bundle in development; it uses native browser ESM. That is the root cause of "fast cold start"
- Pre-bundling (esbuild) solves two things: CJS → ESM conversion + merging many files to cut requests
- HMR: Vite only invalidates affected modules; webpack must re-bundle the affected chunk

**Produce or redraw from memory**

- Vite development model — [reference section](../advanced/week1/vite#day-17-vite-development-model)
- Dependency Pre-Bundling — [reference section](../advanced/week1/vite#day-17-dependency-pre-bundling)
- HMR comparison — [reference section](../advanced/week1/vite#day-17-hmr-comparison)
- Production build — [reference section](../advanced/week1/vite#day-17-production-build)
- Vite vs webpack — [reference section](../advanced/week1/vite#day-17-vite-vs-webpack)
- Full Vite Dev Server flow — [reference section](../advanced/week1/vite#day-17-full-vite-dev-server-flow)
- Vite plugin API sketch — [reference section](../advanced/week1/vite#day-17-vite-plugin-api-sketch)

**Answer aloud without reading a reference answer**

- 1. Why is Vite usually faster than webpack in development?
- 2. Why does Vite's production build use Rollup instead of esbuild?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Vite's design philosophy (no source bundle + native ESM + compile on demand) (1.5 minutes)
2. Pre-bundling (esbuild for CJS→ESM + merging requests) + module-level HMR (2 minutes)
3. Comparison with webpack (startup, HMR, production) + why production uses Rollup (1.5 minutes)

Self-check after recording:

- Did you say the root cause of Vite's fast cold start is not bundling source?
- Did you name the two problems pre-bundling solves?
- Did you contrast module-level HMR vs webpack's chunk-level HMR?
- Did you explain why production uses Rollup?

## Recap

The 3 points that most need follow-up today:

1. Compatibility and differences between Vite plugin API and Rollup plugin API (Vite-only hooks such as `configureServer`).
2. When to use `optimizeDeps` (manually list deps that need pre-bundling).
3. Vite SSR support and how `vite-node` works.
