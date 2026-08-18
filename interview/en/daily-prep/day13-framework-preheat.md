# Day 13 Vue / React Foundation Preheat Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 13 | Vue/React preheat | [Vue 3](../framework/vue/vue3), [React Basics](../framework/react/basics) |

## Today's goals

- Finish `/en/framework/vue/vue3`, `/en/framework/react/basics`
- Produce a Vue / React foundation comparison table (reactivity, components, state, lifecycle)
- Produce a shared outline of the three main lines: componentization, state, and rendering

## Reading checkpoints

- Vue "reactivity" and React "re-render" are not the same thing, but both ultimately sync the UI
- Componentization solves three problems: **reuse + isolation + composability**
- Do not dive into source details; today is only a "language → mental model" transition

## Cheat sheet / knowledge points

### Vue vs React comparison

| Dimension | Vue 3 | React 18+ |
|------|-------|-----------|
| Reactivity | Proxy auto-tracks dependencies | Manual setState triggers re-render |
| Template | SFC `<template>` + compile-time optimizations | JSX (essentially JS) |
| Component updates | Precise to the component (dependency collection) | Parent re-render also re-renders children by default |
| State management | Pinia (official) | Redux / Zustand / Jotai |
| Lifecycle | setup + onMounted, etc. | useEffect + cleanup |
| Performance | Compile time (static hoisting, PatchFlag) | Runtime (memo / useMemo / useCallback) |

### Three values of componentization

1. **Reuse**: the same component on different pages, less duplicated code.
2. **Isolation**: each component has its own state and style scope; they do not interfere.
3. **Composability**: small components compose into large ones, like building UI with blocks.

### Shared state-management idea

```text
Unidirectional data flow: State → View → Action → State
```

- Vue (Pinia): `state` + `getters` + `actions`; reactivity updates the view automatically.
- React (Redux): `store` + `reducers` + `dispatch`; immutable updates trigger re-render.
- Shared: centralized shared state, a single source of truth, predictable state changes.

### Design-philosophy differences

- **Vue**: progressive, low barrier, compile-time optimization, "do more for you".
- **React**: functional, pure UI = f(state), runtime scheduling, "give you more control".

## Handwritten code / flowcharts

### Component update trigger chain comparison

```text
Vue:  data change → dep.notify() → scheduler enqueue → nextTick → component render → patch (diff) → DOM update
React: setState → enqueue update → scheduler → fiber reconcile (render phase) → commit phase → DOM update
```

### Vue 3 reactivity sketch

```text
reactive(obj)
  → Proxy get: track(target, key) → collect the current effect
  → Proxy set: trigger(target, key) → notify all dependent effects to re-run
```

### React update sketch

```text
setState(newState)
  → create an update object and enqueue it
  → scheduleUpdateOnFiber → enter scheduling
  → render phase: walk the fiber tree, call function components, produce new VNodes
  → commit phase: compare old/new fibers, minimize DOM operations
```

## Oral questions

### 1. Why can modern frontend not live without componentization?

Answer template:

> Componentization solves three core problems: reuse, isolation, and composability. Reuse means the same button / form / dialog is used on many pages without rewriting. Isolation means each component has its own state and style scope, so changing one does not affect others. Composability means small components compose into large ones, building complex UI like blocks.
>
> Deeper still, componentization also brings separation of concerns: each component does one thing, which helps team division of labor, code review, testing, and performance work (e.g. lazy-loading at component granularity).

### 2. What shared problem domain do Vue and React address?

Answer template:

> The core problem they solve is the same: **data-driven views**. When state changes, how to efficiently sync the UI to the latest state without manually touching the DOM.
>
> Concretely there are three main lines: reactivity/state management (how to detect change), the component system (how to organize UI), and render/update (how to minimize DOM operations). Vue uses Proxy + compile-time optimization for precise updates; React uses immutable data + fiber scheduling for interruptible rendering. The design philosophies differ, but the problem domain is the same.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Vue / React design-philosophy differences (Proxy vs setState, compile time vs runtime) (2 minutes)
2. Three values of componentization (reuse / isolation / composability) (1.5 minutes)
3. Shared state-management ideas (unidirectional data flow + centralization + predictable change) (1.5 minutes)

Self-check after recording:

- Did you say Vue is compile-time optimization and React is runtime optimization?
- Did you name the three core values of componentization?
- Did you say both solve the "data-driven view" problem?
- Did you mention unidirectional data flow?

## Today's review

The 3 points that most need follow-up today:

1. What Vue's PatchFlag actually optimizes (skip comparing static nodes).
2. How React fiber interruptible rendering is implemented (time slicing + priority scheduling).
3. Pinia vs Vuex (no mutation, better TS support, Composition API).
