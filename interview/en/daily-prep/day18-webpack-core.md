# Day 18 webpack Core Concepts

## Goals

- Finish webpack Concepts / Code Splitting / Caching
- Draw a webpack build pipeline (entry → loader → module graph → chunk → asset)
- Write a minimal webpack config that actually runs

## Read in order

1. [webpack](../advanced/week1/webpack)
2. [Build Tools](../advanced/week1/build-tools)
3. [webpack vs Vite](../engineering/webpack-vs-vite)

## Practice and self-check

**Checkpoints**

- loaders transform **a single file**; plugins act on the **whole build lifecycle**
- Be able to contrast `SplitChunksPlugin` defaults vs manual config
- Long-term cache hinges on `contenthash` + a separate runtime + stable module ids

**Produce or redraw from memory**

- webpack's 5 core concepts — [reference section](../advanced/week1/webpack#day-18-webpack-s-5-core-concepts)
- Loader execution order — [reference section](../advanced/week1/webpack#day-18-loader-execution-order)
- Plugin lifecycle — [reference section](../advanced/week1/webpack#day-18-plugin-lifecycle)
- Chunk types — [reference section](../advanced/week1/webpack#day-18-chunk-types)
- SplitChunksPlugin defaults — [reference section](../advanced/week1/webpack#day-18-splitchunksplugin-defaults)
- Long-term cache strategy — [reference section](../advanced/week1/webpack#day-18-long-term-cache-strategy)
- webpack build pipeline — [reference section](../advanced/week1/webpack#day-18-webpack-build-pipeline)
- Minimal webpack config — [reference section](../advanced/week1/webpack#day-18-minimal-webpack-config)

**Answer aloud without reading a reference answer**

- 1. What is the essential difference between a loader and a plugin?
- 2. How do you design a chunk strategy that caches well long-term?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Five core concepts (Entry / Output / Loader / Plugin / Mode) (2 minutes)
2. Code splitting (SplitChunks) + four-step long-term cache (2 minutes)
3. Loader order (right-to-left) + Plugin lifecycle hooks (1 minute)

Self-check after recording:

- Did you say loaders transform at file level and plugins extend at build level?
- Did you say loaders run right-to-left?
- Did you mention contenthash + runtimeChunk + deterministic moduleIds?
- Did you mention SplitChunksPlugin's cacheGroups?

## Recap

The 3 points that most need follow-up today:

1. webpack Module Federation in micro-frontends.
2. When `resolve.alias` vs `externals` apply.
3. How webpack 5 persistent cache (`cache: { type: 'filesystem' }`) works.
