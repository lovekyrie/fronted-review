---
title: Week 1 Hourly Checklist
description: Hour-by-hour execution plan for the Week 1 build-pipeline track
---

# Week 1 Hourly Checklist

## This week's goal

In one week, upgrade "build tools" from outline-level memory into an engineering pipeline you can defend under follow-up questions. At the weekend review, you should be able to explain fully:

- why Vite is usually faster in development
- what webpack's loader, plugin, and chunk each solve
- why tree-shaking depends on ESM
- where the boundaries are among Babel, bundler, runtime, and polyfill
- how splitting, caching, and source maps should be designed in production builds

## Rules

- After each study block, immediately write 3–5 sentences of your own summary
- The last 15 minutes of every day must be that day's review
- Do not only read docs with no output
- Prefer backfilling all new content into Markdown files in this repo

## Day 1

### Total time

`2 hours`

### 00:00-00:20

Read through [build-tools.md](../week1/build-tools) and [modules.md](../week1/modules). Separate points you can already explain from points you cannot go deep on.

### 00:20-00:50

Read Vite's official overview and Why Vite:

- https://vite.dev/guide/
- https://vite.dev/guide/why.html

Write 1 short summary: `What problem Vite solves, and where it is fast`

### 00:50-01:20

Read webpack Concepts:

- https://webpack.js.org/concepts/

Write 1 short summary: `What webpack's core abstractions actually are`

### 01:20-01:45

Draw one end-to-end pipeline diagram yourself. It must include at least these nodes:

- `ESM / CJS`
- `Babel`
- `dev server`
- `dependency graph`
- `bundle / chunk`
- `cache / deploy artifact`

### 01:45-02:00

Write that day's review. Answer two questions:

- What are today's 2 most easily confused concepts
- If asked "Vite vs webpack", where would you still get stuck

## Day 2

### Total time

`2 hours`

### 00:00-00:25

Read MDN module docs:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

Write 1 `ESM vs CommonJS` comparison table.

### 00:25-00:55

Read Babel docs:

- https://babeljs.io/docs/config-files
- https://babeljs.io/docs/babel-preset-env

Write 1 short summary: `What Babel is responsible for, and what it is not`

### 00:55-01:25

Read dynamic import and `import.meta`:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta

Also write down your own answers:

- why tree-shaking depends on ESM
- why dynamic `import()` becomes a split entry

### 01:25-01:45

Draft an outline to backfill into [modules.md](../week1/modules), with at least 5 section titles.

### 01:45-02:00

Review out loud for 5 minutes. Topic: `How Babel, the module system, and tree-shaking relate`

## Day 3

### Total time

`2 hours`

### 00:00-00:25

Read Vite Features:

- https://vite.dev/guide/features.html

List Vite's core capabilities in development.

### 00:25-00:55

Read dependency pre-bundling:

- https://vite.dev/guide/dep-pre-bundling

Focus on recording:

- why pre-bundling is needed
- why it relates to CommonJS compatibility
- why it relates to browser request count

### 00:55-01:20

Read env variables:

- https://vite.dev/guide/env-and-mode

Write 1 short summary: `Boundaries and common pitfalls of import.meta.env`

### 01:20-01:45

Write a standard answer for "why Vite is fast", limited to `180-250 words`. It must include:

- native ESM
- on-demand request
- dependency pre-bundling
- HMR

### 01:45-02:00

That day's review: check whether your answer still stops at "faster" without explaining "why faster".

## Day 4

### Total time

`2 hours`

### 00:00-00:25

Read webpack Getting Started and Concepts:

- https://webpack.js.org/guides/getting-started/
- https://webpack.js.org/concepts/

### 00:25-00:50

Unpack webpack's four core words one by one:

- entry
- dependency graph
- loader
- plugin

Explain each in 2 sentences. Do not copy official wording.

### 00:50-01:20

Write a standard answer for "what webpack is essentially doing". It must include:

- build a dependency graph from the entry
- bring non-JS assets into the build pipeline
- extend the build lifecycle via plugins

### 01:20-01:45

Write 1 `Vite dev vs webpack dev` comparison table. Cover at least:

- how modules are handled
- first startup
- page request path
- HMR granularity
- what production build depends on

### 01:45-02:00

That day's review. Answer: `Why you cannot explain the difference as only "Vite is newer than webpack"`

## Day 5

### Total time

`2 hours`

### 00:00-00:25

Read Vite Build:

- https://vite.dev/guide/build

Record the production bundler Vite depends on, the artifacts, and the configurable points.

### 00:25-00:55

Read webpack Code Splitting:

- https://webpack.js.org/guides/code-splitting/

Write 1 short summary: `Why dynamic import is a natural split entry`

### 00:55-01:20

Read webpack Caching:

- https://webpack.js.org/guides/caching/

Focus on:

- `contenthash`
- runtime chunk
- vendor chunk

### 01:20-01:45

Write 8 production-build follow-up questions. Suggested coverage:

- why split vendor
- why caches go stale
- why source maps must be handled carefully
- why tree-shaking sometimes does not work

### 01:45-02:00

That day's review: check whether you can already explain "splitting" and "caching" on the same pipeline.

## Day 6

### Total time

`2 hours`

### 00:00-00:30

Revisit the questions in [build-tools.md](../week1/build-tools). List the parts that must be rewritten.

### 00:30-01:20

Rewrite the doc structure. Suggested 5 sections:

1. Build pipeline overview
2. Vite dev internals
3. webpack build core
4. Production optimization and cache strategy
5. High-frequency follow-ups

### 01:20-01:45

Backfill the ESM and tree-shaking parts in [modules.md](../week1/modules).

### 01:45-02:00

That day's review: note 3 points you still cannot explain smoothly, and leave them for Day 7 mock interview.

## Day 7

### Total time

`1.5-2 hours`

### 00:00-00:20

Quickly reread all of this week's own summaries and question lists.

### 00:20-01:10

Do one mock interview. Answer at least these 8 questions:

1. Why Vite's development phase is usually faster than webpack
2. What Vite's development phase and build phase each do
3. Where webpack's loader and plugin boundaries are
4. Why tree-shaking depends on ESM
5. Why Babel and bundler duties must not be mixed up
6. Why dynamic `import()` often means a split
7. What `contenthash`, runtime chunk, and vendor chunk each solve
8. Why source maps are both important and sensitive in production

### 01:10-01:30

Review the mock. Classify each question's problem into one of these three:

- unclear concept
- incomplete pipeline
- missing engineering example

### 01:30-02:00

Write this week's summary. It must include at least:

- 3 pipelines I can now explain stably
- 3 points I still need to fill next week
- which content has already been backfilled into the repo

## This week's acceptance criteria

Week 1 is done only if you meet all of the following:

- you can explain Vite's dependency pre-bundling in your own words
- you can explain why ESM is a better fit for tree-shaking
- you can place Babel, webpack, and Vite on the same engineering pipeline and state their duties
- you have already deposited the core content back into the repo, instead of leaving it only in a notes app
