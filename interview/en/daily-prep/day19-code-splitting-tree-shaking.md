# Day 19 Code Splitting / Tree Shaking / Caching

## Goals

- Finish webpack Code Splitting / Caching and Rollup tree shaking
- Produce a Tree Shaking prerequisites list (ESM / sideEffects / pure functions)
- Produce a production-cache answer script: filename hash, HTTP cache headers, CDN-layer cache

## Read in order

1. [Build Tools](../advanced/week1/build-tools)
2. [Hourly Checklist](../advanced/week1/hourly)

## Practice and self-check

**Checkpoints**

- `sideEffects: false` is a double-edged sword; a wrong config will tree-shake CSS away
- Dynamic `import()` splits a chunk by default; magic comments affect the chunk name
- Long-term cache must keep "app-code change does not change the vendor hash"

**Produce or redraw from memory**

- Tree Shaking prerequisites — [reference section](../advanced/week1/build-tools#day-19-tree-shaking-prerequisites)
- Common Tree Shaking failure cases — [reference section](../advanced/week1/build-tools#day-19-common-tree-shaking-failure-cases)
- Three levels of code splitting — [reference section](../advanced/week1/build-tools#day-19-three-levels-of-code-splitting)
- Three cache layers working together — [reference section](../advanced/week1/build-tools#day-19-three-cache-layers-working-together)
- Three styles of dynamic import — [reference section](../advanced/week1/build-tools#day-19-three-styles-of-dynamic-import)
- Tree Shaking check — [reference section](../advanced/week1/build-tools#day-19-tree-shaking-check)

**Answer aloud without reading a reference answer**

- 1. What are the prerequisites for Tree Shaking to work?
- 2. How should production cache and versioning be designed?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Four Tree Shaking prerequisites + failure cases (2 minutes)
2. Three-level code splitting (route / component / vendor) (1.5 minutes)
3. Three cache layers (browser / CDN / origin) + contenthash versioning (1.5 minutes)

Self-check after recording:

- Did you say tree shaking depends on ESM's static structure?
- Did you mention the `sideEffects` CSS pitfall?
- Did you mention contenthash + vendor split + runtime extraction?
- Did you explain why the CDN does not need an active purge?

## Recap

The 3 points that most need follow-up today:

1. Real usage of `/*#__PURE__*/` and toolchain support.
2. Tree-shaking detail differences between Rollup and webpack.
3. Code-splitting strategy for multi-page apps (when to extract shared chunks).
