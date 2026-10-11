# Day 37 Vue Component Updates and Scheduling

## Goals

- Read the source chain of `setupRenderEffect` / `updateComponent`
- Draw a decision flowchart of “props change → parent re-render → child updates / is skipped”
- Understand the short-circuit checks in `shouldUpdateComponent`

## Read in order

1. [Rendering mechanism](../advanced/week3/rendering-mechanism)
2. [Lifecycle](../framework/vue/lifecycles)
3. [Component communication](../framework/vue/components-communication)

## Practice and self-check

**Checkpoints**

- Each component instance has a `ReactiveEffect`; when it changes, `effect.run` triggers re-render
- `shouldUpdateComponent` compares props / slots / dirs to decide whether to really update
- `v-memo` / `defineProps + withDefaults` can further cut updates

**Produce or redraw from memory**

- Component update trigger chain — [reference section](../advanced/week3/rendering-mechanism#day-37-component-update-trigger-chain)
- setupRenderEffect — [reference section](../advanced/week3/rendering-mechanism#day-37-setuprendereffect)
- shouldUpdateComponent — [reference section](../advanced/week3/rendering-mechanism#day-37-shouldupdatecomponent)
- Component vs element update — [reference section](../advanced/week3/rendering-mechanism#day-37-component-vs-element-update)
- Performance techniques — [reference section](../advanced/week3/rendering-mechanism#day-37-performance-techniques)
- Full update flow — [reference section](../advanced/week3/rendering-mechanism#day-37-full-update-flow)
- Props change decision — [reference section](../advanced/week3/rendering-mechanism#day-37-props-change-decision)

**Answer aloud without reading a reference answer**

- 1. Does a child always update when the parent updates?
- 2. How do you avoid unnecessary component updates?

**Recording drill**

Record in this order; do not restructure on the fly:

1. Component update trigger chain (data change → trigger → scheduler → nextTick → render → patch) (2 minutes)
2. shouldUpdateComponent decision logic (shallow props compare + slots) (1.5 minutes)
3. Five optimization techniques (v-memo / shallowRef / markRaw / split components / avoid temporary objects) (1.5 minutes)

Self-check after recording:

- Did you say every component has a ReactiveEffect?
- Did you say the scheduler uses queueJob for batched async updates?
- Did you say shouldUpdateComponent shallow-compares props?
- Did you say how this differs from React on "auto skip"?

## Recap

Three points to fill in today:

1. `queueJob` dedupe (the same job is not queued twice) and flush timing.
2. How `v-memo` is implemented (isMemoSame compares the deps array).
3. How `KeepAlive` affects component updates (activated / deactivated instead of mount / unmount).
