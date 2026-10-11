# Day 36 Vue Renderer and Diff

## Goals

- Read the core `patch / patchElement / patchChildren` fragments in `runtime-core/src/renderer.ts`
- Draw a three-path flowchart of mount / patch / unmount
- Produce a Vue 3 diff algorithm script (two-ended comparison + longest increasing subsequence)

## Read in order

1. [Rendering mechanism](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## Practice and self-check

**Checkpoints**

- Vue 3 diff core is **two-ended comparison + LIS for the disordered middle**, reducing real DOM moves
- `processElement / processComponent / processFragment` dispatch by vnode type
- Fragment needs an extra `anchor` to locate the insertion point

**Produce or redraw from memory**

- Renderer entry architecture — [reference section](../advanced/week3/rendering-mechanism#day-36-renderer-entry-architecture)
- patchElement flow — [reference section](../advanced/week3/rendering-mechanism#day-36-patchelement-flow)
- Three stages of children diff (Vue 3) — [reference section](../advanced/week3/rendering-mechanism#day-36-three-stages-of-children-diff-vue-3)
- Longest increasing subsequence (LIS) — [reference section](../advanced/week3/rendering-mechanism#day-36-longest-increasing-subsequence-lis)
- Role of key — [reference section](../advanced/week3/rendering-mechanism#day-36-role-of-key)
- Full children diff flowchart — [reference section](../advanced/week3/rendering-mechanism#day-36-full-children-diff-flowchart)
- LIS algorithm core — [reference section](../advanced/week3/rendering-mechanism#day-36-lis-algorithm-core)

**Answer aloud without reading a reference answer**

- 1. Why does Vue 3 diff use longest increasing subsequence?
- 2. What does `key` do in diff?

**Recording drill**

Record in this order; do not restructure on the fly:

1. Renderer architecture (patch entry dispatches by type → element / component / fragment) (1.5 minutes)
2. Three stages of children diff (head → tail → disordered + LIS) (2 minutes)
3. LIS benefit + role of key + cost of missing key (1.5 minutes)

Self-check after recording:

- Did you say children diff has three stages?
- Did you say LIS finds the "largest set that does not need to move"?
- Did you say key + type identifies the same node?
- Did you say missing key can scramble state?

## Recap

Three points to fill in today:

1. Fragment `anchor` positioning (how to find the insert point when there is no real root node).
2. Branching of mount vs update inside `processComponent`.
3. Concrete differences between Vue 2 two-ended diff and Vue 3 fast diff + LIS.
