# Day 32 ref / reactive / computed / watch Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 32 | ref/reactive/computed/watch | [Reactivity](../advanced/week3/reactivity), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Finish the Vue Computed / Watchers docs
- Produce a comparison table of the 4 APIs: usage, reactivity boundary, common pitfalls
- Hand-write a minimal `ref` + `computed`

## Reading checkpoints

- `ref` is an object wrapper with `.value`; destructuring drops reactivity. `reactive` also drops reactivity when destructured; use `toRefs`
- `computed` is lazy: it only runs when accessed, and it caches the result
- What `watch` options `immediate / deep / flush` each solve

## Cheat sheet / knowledge points

### 4-API comparison table

| API | Best for | Reactivity boundary | Common pitfalls |
|-----|----------|----------|--------|
| `ref` | Primitives, objects that need wholesale replacement, return values from composables | Tracked via `.value` | Forgetting `.value` in JS; losing the connection after destructure |
| `reactive` | Forms, state objects, arrays, Map/Set and other structured data | Tracked via the proxy object getter/setter | Direct destructure; replacing the whole reference |
| `computed` | Cached values derived from existing state | Internally a lazy effect + dirty cache | Side effects in the getter, or using a method instead and recomputing every time |
| `watch` | Run a side effect after an explicit source changes | Calls the callback after the source changes; can get old and new values | Misusing deep watch; forgetting cleanup |
| `watchEffect` | Scattered dependencies with a simple side effect | Automatically collects dependencies read during the synchronous run | Dependencies read after `await` are unreliable; the source is not explicit enough |

- `ref` is essentially a reactive wrapper with `.value`. Primitives must be wrapped in an object so they can be tracked by getter/setter.
- `reactive` returns a proxy. The reactive connection comes from “accessing the proxy object”; values obtained by direct destructure are plain values and no longer go through the proxy.
- `toRef` / `toRefs` can turn `reactive` properties into refs while keeping the reactive connection to the source object.
- `computed` is for pure derived values, such as filter, sort, aggregate, class/style, and permission display. Do not send requests, write cache, or change the DOM inside computed.
- `computed` runs the getter only on first read, reuses the cache when dependencies have not changed, and marks dirty when they have.
- `watch` is for an explicit source plus a side effect, such as requests, analytics, syncing localStorage, or calling a third-party instance.
- `watchEffect` runs immediately and collects dependencies automatically, but it is less readable than explicit `watch`. Prefer an explicit source in complex cases.
- The essence of `deep: true` is recursively reading inner properties to collect dependencies. It is expensive on large objects; if you can watch a specific field, do not deep-watch.

### 3 typical ways reactivity is lost

```js
// 1. Destructure reactive directly
const state = reactive({ count: 0 })
const { count } = state // count is a plain value

// 2. Pass a plain value to watch
watch(state.count, () => {}) // wrong; pass a getter or a ref
watch(() => state.count, () => {})

// 3. Replace the reactive reference
let form = reactive({ name: 'A' })
form = reactive({ name: 'B' }) // old deps will not automatically point at the new proxy
```

## Hands-on / flowcharts

```js
function ref(value) {
  const r = {
    get value() {
      track(r, 'value')
      return value
    },
    set value(next) {
      if (next !== value) {
        value = next
        trigger(r, 'value')
      }
    },
  }

  return r
}

function computed(getter) {
  let value
  let dirty = true

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = runner()
        dirty = false
      }

      track(obj, 'value')
      return value
    },
  }

  return obj
}
```

```text
count.value++
  -> ref setter trigger count.value
  -> computed inner effect marked dirty
  -> render effect that uses computed.value is queued
  -> render reads computed.value again
  -> dirty is true, recompute and cache
```

## Oral questions

### 1. How do you choose between `ref` and `reactive`?

> Answer template: I start from the shape of the state and how it is updated. Prefer `ref` for primitives, because primitives cannot be proxied directly and need a `.value` wrapper. If an object is often replaced as a whole, such as a full API payload, wrapping it in `ref` also works. If you mainly mutate inner fields, such as a form, filters, or a state object, `reactive` is a better fit. With `reactive`, do not destructure directly and do not casually replace the whole proxy reference; use `toRef` or `toRefs` when you need to destructure. For large immutable data, third-party instances, or objects you do not want deeply proxied, consider `shallowRef` or `markRaw`.

### 2. How do you choose between `computed` and `watch`?

> Answer template: `computed` describes a derived value. Keep the getter as pure as possible. It has caching and lazy evaluation, so multiple reads do not re-run when dependencies are unchanged. List filtering, totals, button disabled state, and class/style all fit computed. `watch` is for side effects: it is not meant to produce a new value, but to send a request, write cache, sync an external system, track analytics, or access the DOM after data changes. If you need an explicit source, old/new values, and async cleanup, use `watch`. If sources are many and the logic is simple, `watchEffect` is fine, but in complex cases I prefer explicit `watch`.

## 5-minute recording outline

1. Usage boundaries of the 4 APIs (2 minutes)
2. 3 ways reactivity is lost (1.5 minutes)
3. computed lazy evaluation + cache (1.5 minutes)

## Today's review

1. Most likely follow-up: `computed` is not ordinary function memoization; it is a lazy effect + dirty flag + exposing a `.value` dependency.
2. Current gap: `watchEffect` auto-deps only cover the synchronous phase; dependencies after async `await` should not rely on implicit tracking.
3. Next follow-up: connect to Day 33 and put these APIs back into the Vue 2 vs Vue 3 reactivity architecture comparison.
