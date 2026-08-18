# Day 30 Vue track / trigger / effect Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 30 | track / trigger | [Reactivity](../advanced/week3/reactivity) |

## Today's goals

- Read `@vue/reactivity` `effect.ts` (source or a mini implementation)
- Draw a full flow of dependency collection + triggering updates
- Produce a relationship diagram of `activeEffect / effectStack / targetMap / depsMap / dep`

## Reading pitfalls

- `activeEffect` is a global. Nested effects need a **stack** to restore it
- `targetMap: WeakMap<object, depsMap>`, `depsMap: Map<key, dep>`, `dep: Set<effect>`
- `trigger` should copy the set to an array (or a new set) before iterating, so adding/removing effects during iteration does not infinite-loop

## Cheat sheet / key points

- Vue 3's reactive dependency structure can be summarized as: `WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>`.
- The `WeakMap` key is the raw object, so the dep table does not strongly hold an object that is otherwise unreachable, which helps GC.
- The `Map` key is a concrete property, so dep granularity is per-property, not "any field on the object triggers everything".
- The `Set` stores effects and dedupes naturally, so the same effect is not collected twice into the same dep set.
- `activeEffect` is the currently running side effect. Only reads of reactive data during an effect run get tracked.
- Nested effects need `effectStack`. After a child effect finishes, the parent effect must be restored, or deps get collected onto the wrong effect.
- `track` "builds the relation on read": target -> key -> activeEffect.
- `trigger` "finds the relation and runs it on write": target -> key -> effects; if an effect has a scheduler, hand it to the scheduler.
- cleanup removes old deps, so after a conditional branch switches, the effect does not keep subscribing to properties it no longer reads.
- Before iterating a dep, `trigger` usually copies the collection, so re-collecting or deleting deps while an effect runs does not infinite-loop.

## Handwritten / flow diagrams

```text
reactive.get → track(target, key) → depsMap[key].add(activeEffect)
reactive.set → trigger(target, key) → [...dep].forEach(run)
```

```js
const targetMap = new WeakMap()
let activeEffect
const effectStack = []

function effect(fn, options = {}) {
  const runner = () => {
    cleanup(runner)
    activeEffect = runner
    effectStack.push(runner)
    const result = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return result
  }

  runner.deps = []
  runner.scheduler = options.scheduler
  runner()
  return runner
}

function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, depsMap = new Map())

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, dep = new Set())

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap?.get(key)
  if (!dep) return

  const effects = new Set(dep)
  effects.forEach((effect) => {
    if (effect.scheduler) effect.scheduler(effect)
    else effect()
  })
}

function cleanup(effect) {
  effect.deps.forEach(dep => dep.delete(effect))
  effect.deps.length = 0
}
```

```text
effect runs
  -> activeEffect = current effect
  -> render / fn reads state.count
  -> proxy get
  -> track(state, 'count')
  -> targetMap[state]['count'].add(activeEffect)

state.count++
  -> proxy set
  -> trigger(state, 'count')
  -> find dep
  -> scheduler(effect) or effect()
```

## Oral questions

### 1. Why is the dep-collection structure `WeakMap<obj, Map<key, Set<effect>>>`?

> Answer template: This structure matches "which properties of which object are depended on by which side effects". The first layer is a `WeakMap` keyed by the raw object, so when the object is no longer used it is not kept alive by the dep table. The second layer is a `Map` keyed by a concrete property, so collection is per-property and a change to any field does not fire every effect. The third layer is a `Set` of effects, for deduping: reading the same property many times still collects the effect once. This lets Vue build precise relations on read and fire only the relevant side effects on write.

### 2. Why do nested effects need a stack?

> Answer template: Because `activeEffect` is a global current pointer. For a normal effect, pointing it at the current effect is enough. If one effect runs another, the inner one overwrites `activeEffect`. After the inner one finishes, if you do not restore the outer effect, later reads get collected onto the inner effect by mistake. A stack can push on enter and pop on exit, restoring the previous effect. That keeps parent and child effect dep boundaries from mixing in nested cases.

## 5-minute recording outline

1. track flow (2 minutes)
2. trigger flow (1.5 minutes)
3. effect stack + cleanup (1.5 minutes)

## Today's review

1. Most likely follow-up: deps are not stored on the Proxy. They live in the global `targetMap`. Proxy is only the read/write intercept entry.
2. Current gap: be able to explain cleanup clearly, especially why old deps must be cleared when conditional-branch deps switch.
3. Next to add: connect to Day 31, and explain why a component update after trigger usually does not patch the DOM synchronously right away.
