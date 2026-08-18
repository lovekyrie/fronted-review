# Day 41 Pinia / Vuex State Management Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 41 | Pinia / Vuex | [Vue State Management](../framework/vue/state-management) |

## Today's Goals

- Finish `/en/framework/vue/state-management`
- Produce a Pinia vs Vuex comparison table: API shape, modularization, TypeScript friendliness, DevTools
- Draw a state-layering diagram: local / global / server cache (React Query / SWR thinking)

## Reading Checkpoints

- Pinia natively supports the Composition API and no longer needs mutations
- State layering in large apps: in-component state / global store / server-state cache / URL state
- Persistence must distinguish “sync localStorage” vs “async IndexedDB”

## Cheat Sheet / Knowledge Points

### Pinia vs Vuex comparison

| Dimension | Pinia | Vuex |
|------|-------|------|
| API | `defineStore` | `new Vuex.Store` |
| mutations | ❌ not needed | ✅ must mutate through mutations |
| TypeScript | naturally friendly | needs extra type declarations |
| Modularization | each store is independent, imported on demand | global single store + modules |
| DevTools | ✅ supported | ✅ supported |
| Composition API | ✅ setup store | ❌ |
| Size | ~1KB | ~10KB |

### Two Pinia store styles

```ts
// 1. Options Store
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (state) => state.count * 2 },
  actions: { increment() { this.count++ } }
})

// 2. Setup Store (recommended)
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

### State-layering architecture

| Layer | Where it lives | Examples |
|------|----------|------|
| Component state | `ref / reactive` | form input, UI toggles |
| Global state | Pinia store | user info, permissions, theme |
| Server cache | TanStack Query / SWR | API data, lists, pagination |
| URL state | route query/params | search filters, page number, tab |
| Persistent state | localStorage / IndexedDB | token, user preferences |

### Persistence approach

```ts
// pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)

defineStore('user', {
  state: () => ({ token: '' }),
  persist: true  // defaults to localStorage
})
```

## Handwritten / Flowcharts

### Pinia core idea (simplified)

```text
defineStore('id', setup)
  → create a reactive store object
  → register it on the pinia instance (app.use(pinia))
  → the component calls useStore() → get existing / create new from pinia._stores
  → refs/reactives inside the store are tracked automatically
  → dependencies are collected during component render, and updates fire when data changes
```

### Vuex data flow

```text
Component → dispatch(action) → commit(mutation) → state changes → component updates
                 ↓
           can be async           must be sync
```

## Oral Questions

### 1. Why did Pinia replace Vuex?

Answer template:

> Three core reasons. First, Pinia dropped mutations: actions can mutate state directly, which cuts boilerplate. Vuex’s rule that mutations must be synchronous added a lot of redundant code in real projects.
>
> Second, Pinia’s TypeScript support is native: store state, getters, and actions all get full type inference. Vuex needs a large amount of extra type declarations.
>
> Third, Pinia’s modularization is more natural: each store is an independent file, imported on demand. There is no Vuex-style global single store plus nested modules. And the Setup Store style matches the component Composition API exactly, so the learning cost is low.

### 2. How do you talk about state layering as “architecture design” rather than “picking a library”?

Answer template:

> I layer by the state’s lifecycle and responsibility. UI state inside a component (forms, collapsible panels) uses `ref` and does not need to be global. Cross-component business state (user info, permissions) goes in a Pinia store. Server data is managed by libraries like TanStack Query, which handle caching, deduping, and auto-refresh — that should not be mixed into Pinia. URL-related state (search filters, pagination) lives in the route query so users can share the link. State that must persist across sessions (token, preferences) uses localStorage plus a persist plugin.
>
> Each layer then has a clear job: changing UI does not touch the store, changing cache does not touch the router. In an interview this sounds like architecture awareness, not “shove every piece of data into Vuex”.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Pinia’s three advantages (no mutations / TS-friendly / modularization) (1.5 minutes)
2. Two store styles + Vuex migration points (1.5 minutes)
3. Five-layer state architecture (component / global / server cache / URL / persistence) (2 minutes)

Self-check after recording:

- Did you state why Pinia dropped mutations.
- Did you state the Setup Store style and its advantages.
- Did you state at least 4 layers of state.
- Did you state the persistence approach (localStorage vs IndexedDB).

## Today's Review

The 3 points that most need follow-up today:

1. What `storeToRefs` is for (keeping reactivity when destructuring a store).
2. Pinia’s plugin system (how to write a custom plugin for logging, persistence, etc.).
3. How the server-state vs client-state boundary shows up in real projects.
