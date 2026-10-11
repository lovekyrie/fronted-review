# Day 13 Vue / React Foundation Preheat

## Goals

- Finish `/en/framework/vue/vue3`, `/en/framework/react/basics`
- Produce a Vue / React foundation comparison table (reactivity, components, state, lifecycle)
- Produce a shared outline of the three main lines: componentization, state, and rendering

## Read in order

1. [Vue 3](../framework/vue/vue3)
2. [React Basics](../framework/react/basics)

## Practice and self-check

**Checkpoints**

- Vue "reactivity" and React "re-render" are not the same thing, but both ultimately sync the UI
- Componentization solves three problems: **reuse + isolation + composability**
- Do not dive into source details; today is only a "language → mental model" transition

**Produce or redraw from memory**

- Vue vs React comparison — [reference section](../framework/vue/vue3#day-13-vue-vs-react-comparison)
- Three values of componentization — [reference section](../framework/vue/vue3#day-13-three-values-of-componentization)
- Shared state-management idea — [reference section](../framework/vue/vue3#day-13-shared-state-management-idea)
- Design-philosophy differences — [reference section](../framework/vue/vue3#day-13-design-philosophy-differences)
- Component update trigger chain comparison — [reference section](../framework/vue/vue3#day-13-component-update-trigger-chain-comparison)
- Vue 3 reactivity sketch — [reference section](../framework/vue/vue3#day-13-vue-3-reactivity-sketch)
- React update sketch — [reference section](../framework/react/basics#day-13-react-update-sketch)

**Answer aloud without reading a reference answer**

- 1. Why can modern frontend not live without componentization?
- 2. What shared problem domain do Vue and React address?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Vue / React design-philosophy differences (Proxy vs setState, compile time vs runtime) (2 minutes)
2. Three values of componentization (reuse / isolation / composability) (1.5 minutes)
3. Shared state-management ideas (unidirectional data flow + centralization + predictable change) (1.5 minutes)

Self-check after recording:

- Did you say Vue is compile-time optimization and React is runtime optimization?
- Did you name the three core values of componentization?
- Did you say both solve the "data-driven view" problem?
- Did you mention unidirectional data flow?

## Recap

The 3 points that most need follow-up today:

1. What Vue's PatchFlag actually optimizes (skip comparing static nodes).
2. How React fiber interruptible rendering is implemented (time slicing + priority scheduling).
3. Pinia vs Vuex (no mutation, better TS support, Composition API).
