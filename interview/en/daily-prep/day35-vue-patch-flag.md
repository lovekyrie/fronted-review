# Day 35 Patch Flag / Static Hoisting / Block Tree

## Goals

- Go deep into Patch Flag enums (TEXT / CLASS / STYLE / PROPS / FULL_PROPS / HYDRATE_EVENTS / STABLE_FRAGMENT…)
- Draw a Block Tree structure diagram and contrast it with traditional VDOM Diff
- Produce a Vue 3 compiler-optimization answer script

## Read in order

1. [Rendering mechanism](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## Practice and self-check

**Checkpoints**

- A Block is a “dynamic node container”; diff only walks `block.dynamicChildren`, not the whole tree
- Patch Flag decides which fast path `patch` takes, avoiding a full props diff
- `v-if / v-for` create a new block and cut off collection, changing the range of dynamic nodes collected

**Produce or redraw from memory**

- Patch Flag enums — [reference section](../advanced/week3/rendering-mechanism#day-35-patch-flag-enums)
- Block Tree — [reference section](../advanced/week3/rendering-mechanism#day-35-block-tree)
- Static Hoisting — [reference section](../advanced/week3/rendering-mechanism#day-35-static-hoisting)
- Traditional VDOM diff vs Block Tree diff — [reference section](../framework/vue/dom-diff#day-35-traditional-vdom-diff-vs-block-tree-diff)
- Patch Flag fast paths — [reference section](../advanced/week3/rendering-mechanism#day-35-patch-flag-fast-paths)

**Answer aloud without reading a reference answer**

- 1. How does Patch Flag speed up diff specifically?
- 2. What is the difference between Block Tree and traditional VDOM?

**Recording drill**

Record in this order; do not restructure on the fly:

1. Patch Flag motivation and enums (TEXT/CLASS/STYLE/PROPS) + fast-path principle (1 minute)
2. Block Tree structure + contrast with traditional diff + v-if/v-for cut-off (2 minutes)
3. Static hoisting principle + HOISTED flag + real benefits (2 minutes)

Self-check after recording:

- Did you say Patch Flag is marked at compile time and used at runtime?
- Did you say a Block collects dynamicChildren for flattened diff?
- Did you say v-if / v-for create a new Block?
- Did you say static hoisting skips diff and reuses references?

## Recap

Three points to fill in today:

1. `BAIL` flag (-2) exit-optimization cases: hand-written render functions, non-compiled templates.
2. Relationship between `v-once` and static hoisting: `v-once` marks the whole subtree as static.
3. How `cacheHandlers` (event handler caching) works with Patch Flag.
