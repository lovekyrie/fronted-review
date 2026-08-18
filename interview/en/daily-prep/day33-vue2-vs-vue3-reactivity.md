# Day 33 Vue 2 vs Vue 3 Reactivity Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 33 | Vue 2 vs 3 | [Reactivity](../advanced/week3/reactivity), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Compare Vue 2 `Observer / Dep / Watcher` with Vue 3 `reactive / dep / effect` architecture
- Produce a migration FAQ list (arrays / added properties / Set Map support / when deep reactivity happens / performance)
- Be able to explain why Vue 2 has `Vue.set` and why Vue 3 does not need it

## Reading checkpoints

- Two limits of Vue 2 `Object.defineProperty`: cannot observe add/delete, cannot observe array indexes
- Vue 2 rewrites 7 array methods to work around the index problem; Vue 3 supports this naturally with Proxy
- Vue 3 reactivity is created **on demand** (lazy proxy), which is friendlier to large objects

## Cheat sheet / knowledge points

### Vue 2 vs Vue 3 reactivity role mapping

| Dimension | Vue 2 | Vue 3 |
|------|-------|-------|
| Interception | `Object.defineProperty` hijacks existing properties | `Proxy` wraps the whole object |
| Observation | `Observer` recursively walks the object | `reactive` creates proxies on demand |
| Dependency container | `Dep` | `dep: Set<ReactiveEffect>` |
| Side effect | `Watcher` | `ReactiveEffect` |
| Dependency collection | `dep.depend()` in getter | `track()` in Proxy get |
| Trigger update | `dep.notify()` in setter | `trigger()` in Proxy set/delete |
| Add property | Needs `Vue.set` | Ordinary assignment can trigger |
| Delete property | Needs `Vue.delete` | `deleteProperty` can intercept |
| Arrays | Rewrite 7 mutating methods | Proxy intercepts index and length, plus array-specific handling |
| Map/Set | Weak support | Dedicated collection proxy logic |

- Vue 2 recursively walks existing keys at init and turns each key into getter/setter; the deeper the object, the more obvious the init cost.
- Vue 3 deep reactivity is lazy proxying: a nested object is turned reactive only when it is read.
- Vue 2 cannot naturally observe add/delete, because a new key was never wrapped with `defineProperty` in advance.
- Vue 2 struggles with array indexes and `length`, so it rewrites `push/pop/shift/unshift/splice/sort/reverse`.
- Vue 3 does not mean “arrays need no special handling”; Proxy just makes index, length, and iteration easier to enter a unified reactivity system.
- Vue 3 `effect` can be scheduled by the scheduler, so component updates, computed, and watch can all be built on effect.
- The most visible migration change: `Vue.set` is no longer needed. You still need to watch out for losing reactivity by destructuring reactive, `ref` `.value`, and how you write watch sources.

## Hands-on / flowcharts

```text
Vue 2:

data
  -> Observer.walk(data)
  -> defineReactive(obj, key)
  -> getter: Dep.depend() collects Watcher
  -> setter: Dep.notify() notifies Watcher
  -> Watcher.update()
  -> render / patch

Limits:
  a new key has no getter/setter
  delete does not trigger setter
  array index and length are hard to intercept
```

```text
Vue 3:

state
  -> reactive(state) returns Proxy
  -> get: track(target, key)
  -> set/delete/has/ownKeys: trigger(target, key, type)
  -> ReactiveEffect / scheduler
  -> render effect is queued
  -> render / patch

Advantages:
  add, delete, iteration, arrays, Map/Set can all enter proxy semantics
  nested objects are proxied on demand
```

## Oral questions

### 1. What concrete problems does Vue 3 reactivity solve compared with Vue 2?

> Answer template: Vue 3 mainly solves the incomplete coverage of Vue 2 `Object.defineProperty`. Vue 2 can only hijack properties that already exist at init, so adding or deleting properties cannot naturally trigger updates, and array indexes and `length` are awkward; `Vue.set` and rewritten array methods have to fill the gaps. Vue 3 uses Proxy to wrap the whole object and can intercept `get/set/has/deleteProperty/ownKeys`, with more complete support for add, delete, iteration, arrays, and collection types. Another change is that Vue 3 can proxy nested objects on demand and does not need to recursively process the whole tree at init. With `ReactiveEffect` and the scheduler, computed, watch, and component updates can share a more unified reactive foundation.

### 2. Why did Vue 2 have `Vue.set` / `$set`?

> Answer template: Because Vue 2 reactivity defines getter/setter on existing properties with `Object.defineProperty`. A property that did not exist at init was never wrapped, so later writing `obj.age = 18` gives that new property no reactive getter/setter and will not trigger dependency updates. `Vue.set(obj, 'age', 18)` adds the reactive definition for that new key at runtime and manually notifies dependents. After Vue 3 switched to Proxy, adding a property itself enters the `set` trap, so this API is no longer needed.

## 5-minute recording outline

1. Vue 2 reactivity architecture (2 minutes)
2. Vue 2 pain points (1.5 minutes)
3. How Vue 3 solves them (1.5 minutes)

## Today's review

1. Most likely follow-up: Vue 3 is not simply “faster than Vue 2”; the set of interceptable operations is more complete, and the architecture is more unified.
2. Current gap: for arrays, do not only say Proxy supports them naturally; know that Vue still special-cases array methods, length, and index dependencies.
3. Next follow-up: connect to Day 34, enter template compilation, and explain the render function and vnode chain after reactivity triggers.
