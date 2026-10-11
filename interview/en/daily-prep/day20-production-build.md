# Day 20 Production Build Practice

## Goals

- Finish Vite Build / Env and Mode, webpack Caching
- Review the repo's existing Vite config (`.vitepress` or another project) and add comments for what each option does
- Write a Vite vs webpack **production build** comparison table

## Read in order

1. [Build Tools](../advanced/week1/build-tools)
2. [Hourly Checklist](../advanced/week1/hourly)

## Practice and self-check

**Checkpoints**

- `mode` decides `process.env.NODE_ENV`, but Vite also has a `.env.[mode]` load order
- Be able to name which of the 7 source-map types production should use (`hidden-source-map` is the most common)
- Build artifacts must be judged on **size / request count / cache hit rate** together

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week1/build-tools#day-20-knowledge-notes)
- Practice example — [reference section](../advanced/week1/build-tools#day-20-practice-example)

**Answer aloud without reading a reference answer**

- 1. How do you handle production source maps?
- 2. Which 3 dimensions would you start artifact optimization from?

**Recording drill**

1. env / mode model (1 minute)
2. Artifact splitting + chunk strategy (2 minutes)
3. source map + artifact analysis (2 minutes)

## Recap

1. Most likely follow-up: Vite being fast in development does not mean production skips bundling. Production still faces Rollup splitting, hashing, minify, and source-map strategy.
2. Current gap: `manualChunks` cannot just mechanically split `vendor`; weigh first-screen path, dep size, cache stability, and request count.
3. Next follow-up: take a real project's artifacts, mark first-screen large chunks, duplicate deps, and deferrable modules with an analyzer.
