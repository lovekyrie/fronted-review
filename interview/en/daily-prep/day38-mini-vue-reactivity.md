# Day 38 Hand-writing mini-vue Reactivity Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 38 | mini-vue reactivity | [Reactivity](../advanced/week3/reactivity), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Create a mini-vue-reactivity directory under `hand-write/` in the repo (or update `vue-book/reactive-system`)
- Implement the five-piece set `reactive / ref / effect / computed / watch`
- Write 3 test cases: basic reactivity / nested effect / computed cache

## Reading checkpoints

- You must implement `effectStack` to handle nested effects
- `cleanup` is an optimization: remove yourself from deps before each run, then collect again
- `computed` uses a `dirty` flag + lazy evaluation, and visitors must be able to receive its trigger

## Cheat sheet / knowledge points

### Dependency collection data structure

```text
targetMap: WeakMap<target, Map<key, Set<ReactiveEffect>>>

WeakMap {
  target → Map {
    'count' → Set [ effect1, effect2 ]
    'name'  → Set [ effect3 ]
  }
}
```

- **WeakMap**: key is the original object, does not affect GC.
- **Map**: key→deps mapping.
- **Set**: deduped effect collection.

### Relationship of the five-piece set

```text
reactive(obj)  → Proxy → track on get / trigger on set
ref(val)       → { _value, get value() → track, set value() → trigger }
effect(fn)     → create ReactiveEffect → run fn immediately → access reactive data → collect deps
computed(fn)   → lazy effect + dirty flag + cached value
watch(source, cb) → effect + call cb in scheduler
```

### Implementation points

| Module | Core | Easy mistakes |
|------|------|--------|
| `reactive` | Proxy get/set | Recursively proxy nested objects; dedupe already-proxied objects |
| `ref` | class instance + get/set | Auto unwrap and interop with reactive |
| `effect` | activeEffect + effectStack | activeEffect gets confused with nested effects |
| `computed` | dirty + lazy effect | Visitors must also receive trigger |
| `watch` | effect + scheduler | oldValue / newValue compare, immediate |

## Hands-on / flowcharts

### Core implementation of reactive + effect + computed

```js
const targetMap = new WeakMap()
let activeEffect = null
const effectStack = []

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
  activeEffect.deps.push(deps) // reverse record, used for cleanup
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (!deps) return
  const effectsToRun = new Set(deps) // avoid infinite loops
  effectsToRun.forEach(effect => {
    if (effect.scheduler) effect.scheduler()
    else effect.run()
  })
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      return typeof result === 'object' && result !== null ? reactive(result) : result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) trigger(target, key)
      return result
    }
  })
}

class ReactiveEffect {
  constructor(fn, scheduler) {
    this.fn = fn
    this.scheduler = scheduler
    this.deps = []
  }
  run() {
    cleanup(this) // clear old deps
    activeEffect = this
    effectStack.push(this)
    const result = this.fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return result
  }
}

function cleanup(effect) {
  effect.deps.forEach(dep => dep.delete(effect))
  effect.deps.length = 0
}

function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  if (!options.lazy) _effect.run()
  return _effect
}

function computed(getter) {
  let dirty = true, value
  const _effect = effect(getter, {
    lazy: true,
    scheduler() { dirty = true; trigger(obj, 'value') }
  })
  const obj = {
    get value() {
      track(obj, 'value')
      if (dirty) { value = _effect.run(); dirty = false }
      return value
    }
  }
  return obj
}
```

## Oral questions

### 1. What pitfalls did you hit while hand-writing mini-vue?

Answer template:

> Three typical pitfalls. The first is **nested effect**: if the inner effect sets `activeEffect` to null when it finishes, the outer effect will not collect dependencies. You must manage this with an `effectStack`.
>
> The second is **cleanup**: with conditional rendering `flag ? a : b`, when flag goes from true to false, a’s deps should be cleared; otherwise a changing still triggers unrelated updates. Before each effect.run(), remove yourself from all deps, then collect again.
>
> The third is **computed dirty scheduling**: computed is lazy, so the getter should not run immediately. When deps change, set dirty to true and trigger its own `'value'`, so effects that use computed know they should update.

### 2. Why do nested effects need a stack?

Answer template:

> Consider `effect(() => { effect(() => { b.value }) ; a.value })`. While the outer effect runs, `activeEffect` points at the outer one. Entering the inner effect switches it to the inner one. If the inner effect sets `activeEffect` to null when it finishes, later access to `a.value` in the outer effect sees `activeEffect` as null and the dependency is not collected.
>
> With a stack: push before entering an effect, pop when finished, and `activeEffect` always points at the top. Nested cases are handled correctly. Vue source uses the same idea.

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. Five-piece relationship diagram + data structure (WeakMap → Map → Set) (2 minutes)
2. Three pitfalls (nested effect / cleanup / computed dirty) (2 minutes)
3. Gap vs Vue source (scheduler priority / batching / ref unwrap) (1 minute)

Self-check after recording:

- Did you say the three-level WeakMap → Map → Set structure?
- Did you say effectStack solves nesting?
- Did you say cleanup solves stale deps from conditional branches?
- Did you say computed’s dirty + scheduler mechanism?

## Today's review

Three points to fill in today:

1. How `ref` auto-unwrap is handled inside reactive.
2. Implementation differences of `watch` `immediate / flush: 'post'`.
3. Sorting in source `triggerEffects` (computed effects run first).
