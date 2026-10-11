# Day 41 Pinia / Vuex State Management

## Goals

- Finish `/en/framework/vue/state-management`
- Produce a Pinia vs Vuex comparison table: API shape, modularization, TypeScript friendliness, DevTools
- Draw a state-layering diagram: local / global / server cache (React Query / SWR thinking)

## Read in order

1. [Vue State Management](../framework/vue/state-management)

## Practice and self-check

**Checkpoints**

- Pinia natively supports the Composition API and no longer needs mutations
- State layering in large apps: in-component state / global store / server-state cache / URL state
- Persistence must distinguish “sync localStorage” vs “async IndexedDB”

**Produce or redraw from memory**

- Pinia vs Vuex comparison — [reference section](../framework/vue/state-management#day-41-pinia-vs-vuex-comparison)
- Two Pinia store styles — [reference section](../framework/vue/state-management#day-41-two-pinia-store-styles)
- State-layering architecture — [reference section](../framework/vue/state-management#day-41-state-layering-architecture)
- Persistence approach — [reference section](../framework/vue/state-management#day-41-persistence-approach)
- Pinia core idea (simplified) — [reference section](../framework/vue/state-management#day-41-pinia-core-idea-simplified)
- Vuex data flow — [reference section](../framework/vue/state-management#day-41-vuex-data-flow)

**Answer aloud without reading a reference answer**

- 1. Why did Pinia replace Vuex?
- 2. How do you talk about state layering as “architecture design” rather than “picking a library”?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Pinia’s three advantages (no mutations / TS-friendly / modularization) (1.5 minutes)
2. Two store styles + Vuex migration points (1.5 minutes)
3. Five-layer state architecture (component / global / server cache / URL / persistence) (2 minutes)

Self-check after recording:

- Did you state why Pinia dropped mutations.
- Did you state the Setup Store style and its advantages.
- Did you state at least 4 layers of state.
- Did you state the persistence approach (localStorage vs IndexedDB).

## Recap

The 3 points that most need follow-up today:

1. What `storeToRefs` is for (keeping reactivity when destructuring a store).
2. Pinia’s plugin system (how to write a custom plugin for logging, persistence, etc.).
3. How the server-state vs client-state boundary shows up in real projects.
