### Vue 3 Reactivity

In senior frontend interviews, Vue reactivity should not stop at “when data changes, the view updates automatically.” A better answer breaks it into a chain:

`reactive/ref creates reactive data -> track collects dependencies on read -> trigger fires dependencies on write -> scheduler schedules side effects -> the component render effect re-runs -> virtual DOM diff and patch`

That chain explains most follow-ups: why `computed` is cached, why `watch` fits side effects, why DOM updates are not synchronous and immediate, and why Vue 3 no longer needs `Vue.set`.

#### 1. Reactivity differences between Vue 2 and Vue 3

##### 1.1 Vue 2: `Object.defineProperty`

Vue 2’s core approach is to recursively walk object properties and intercept getters / setters with `Object.defineProperty`.

This works, but it has several inherent limits:

- Existing properties must be processed recursively at initialization
- Adding and deleting properties cannot be intercepted naturally
- Array index and `length` changes are awkward, so array methods have to be patched
- Collection types such as `Map` and `Set` are poorly supported

That is why Vue 2 carries historical baggage such as `Vue.set` and rewritten array methods.

##### 1.2 Vue 3: `Proxy`

Vue 3 switched to `Proxy`, which wraps the whole object.

It can intercept more than property reads and writes, including:

- `get`
- `set`
- `has`
- `deleteProperty`
- `ownKeys`
- Reads, writes, and iteration on `Map` / `Set`

The direct results:

- Adding a property can trigger updates
- Deleting a property can trigger updates
- Array indexes and `length` are easier to handle
- Collection types can enter the reactivity system
- There is no need to fully recursively hijack every property at startup the way Vue 2 did

Do not stop at “Vue 3 is faster because it uses Proxy.” A more accurate statement is: **Proxy widens the set of interceptable operations, makes reactivity semantics more complete, and removes the need for many Vue 2 special-case patches.**

#### 2. Core data structures of Vue 3 reactivity

Vue 3’s dependency relationships can be understood as a three-level mapping:

```ts
WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>
```

In other words:

```text
targetMap
  -> target original object
    -> key accessed property
      -> dep set of effects that depend on this property
```

A simplified version looks like this:

```ts
const targetMap = new WeakMap<object, Map<PropertyKey, Set<ReactiveEffect>>>()

function track(target: object, key: PropertyKey) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

function trigger(target: object, key: PropertyKey) {
  const depsMap = targetMap.get(target)
  const dep = depsMap?.get(key)

  dep?.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler()
    }
    else {
      effect.run()
    }
  })
}
```

A few key points:

- The `WeakMap` key is the original object, so when the object is released it can be GC’d together with the map entry
- The `Map` key is a specific property, so dependency granularity can go down to the property level
- `Set` is used for deduplication, so the same effect does not appear twice in the same dependency collection
- `trigger` does not necessarily run the effect immediately; it may hand it to a scheduler

#### 3. `reactive`, `ref`, and shallow reactivity

##### 3.1 `reactive`

`reactive` fits structured data such as objects, arrays, `Map`, and `Set`.

```ts
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
  },
})

state.count++
state.user.name = 'Bob'
```

When using `reactive`, watch two issues.

First, do not casually replace the entire reactive object reference:

```ts
let state = reactive({ count: 0 })

state = reactive({ count: 1 }) // existing dependents of state will not automatically follow the new reference
```

Second, destructuring directly drops the reactive connection:

```ts
const state = reactive({ count: 0 })
const { count } = state

state.count++
console.log(count) // still the old value
```

If you need to destructure, usually use `toRefs` or `toRef` to keep the connection.

##### 3.2 `ref`

`ref` essentially wraps a value in a reactive object with `.value`.

```ts
import { ref } from 'vue'

const count = ref(0)

count.value++
```

It is commonly used for:

- Primitive values
- Objects that need to be replaced as a whole
- Return values of composables

Templates auto-unwrap `ref`, but in JavaScript / TypeScript you still access it through `.value`.

##### 3.3 `shallowRef` and `shallowReactive`

Shallow reactivity only tracks the first level.

```ts
import { shallowRef } from 'vue'

const user = shallowRef({
  name: 'Alice',
})

user.value.name = 'Bob' // does not trigger an update
user.value = { name: 'Tom' } // triggers an update
```

It is a good fit for:

- Large immutable data
- Third-party library instances
- Objects you do not want Vue to deeply proxy
- Cases where you only care about root-reference changes

In a senior interview you can add: **Not every object should be deeply proxied. For external instances, large objects, and immutable data, shallow reactivity or `markRaw` is often a better fit.**

#### 4. What `track` and `trigger` actually track

Vue 3 does not only track “a property was read.” Different operations map to different dependency kinds.

##### 4.1 Ordinary properties

```ts
effect(() => {
  console.log(state.count)
})

state.count++
```

Reading `state.count` collects the `count` key; mutating `state.count` triggers the effects associated with that key.

##### 4.2 Adding and deleting properties

```ts
effect(() => {
  console.log(Object.keys(state))
})

state.age = 18
delete state.name
```

Here the effect does not depend on a specific value, but on the object’s set of keys. Internally Vue uses a special key similar to `ITERATE_KEY` to track iteration dependencies.

So when properties are added or deleted, Vue must trigger not only the specific key, but also iteration-related dependencies.

##### 4.3 Arrays

Arrays are more involved in two places:

- Reading an index depends on that specific index
- Iterating or accessing length depends on `length`

For example:

```ts
effect(() => {
  console.log(list.length)
})

list.push(1)
```

`push` does not only add an index; it also changes `length`, so effects that depend on `length` must re-run as well.

##### 4.4 `Map` and `Set`

Collection types involve operations such as `get`, `set`, `add`, `delete`, `forEach`, and iterators.

```ts
const map = reactive(new Map<string, number>())

effect(() => {
  console.log(map.size)
})

map.set('count', 1)
```

`map.size` depends on structural changes to the collection, not on an ordinary property. Vue 3 has dedicated proxy logic for collection types, which is one reason `Proxy` fits a modern reactivity system better than `Object.defineProperty`.

#### 5. `ReactiveEffect` and the effect stack

What the reactivity system actually collects is not the component, and not the function itself, but a `ReactiveEffect`.

Think of it as a side-effect wrapper that can be collected, scheduled, and stopped.

```ts
class ReactiveEffect {
  active = true
  deps: Set<ReactiveEffect>[] = []

  constructor(
    public fn: () => unknown,
    public scheduler?: () => void,
  ) {}

  run() {
    if (!this.active) return this.fn()

    effectStack.push(this)
    activeEffect = this

    const result = this.fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return result
  }

  stop() {
    if (!this.active) return

    this.deps.forEach(dep => dep.delete(this))
    this.deps.length = 0
    this.active = false
  }
}
```

```ts
const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined
```

The real implementation is more complex, because it has to handle:

- Nested effects
- Dependency cleanup
- Preventing duplicate collection
- Preventing recursive triggering
- Releasing dependencies after an effect is stopped

##### 5.1 Why an effect stack is needed

If effects can nest, a single `activeEffect` would be overwritten.

```ts
effect(() => {
  effect(() => {
    console.log(state.inner)
  })

  console.log(state.outer)
})
```

So Vue needs an effect stack internally: push when entering an effect, then restore the previous effect after it finishes.

##### 5.2 Why dependencies must be cleaned up

Dependencies are not append-only.

```ts
effect(() => {
  if (state.visible) {
    console.log(state.name)
  }
  else {
    console.log(state.age)
  }
})
```

After `visible` changes from `true` to `false`, this effect should depend on `age` and should no longer depend on `name`. So before each re-run, old dependencies must be cleaned up, then new ones collected.

#### 6. Scheduler: why the DOM may not update immediately when data changes

A common follow-up: after you mutate reactive data, does the DOM update synchronously?

The answer: **Reactive dependencies are triggered synchronously, but component updates usually enter an async queue and are flushed in batches.**

##### 6.1 Component updates are essentially a render effect

Component rendering can be simplified as:

```ts
effect(
  () => {
    const vnode = render()
    patch(prevVNode, vnode)
  },
  {
    scheduler: queueJob,
  },
)
```

When the component render function runs, it reads reactive data, and those reads `track`. When data changes, `trigger` finds the component’s render effect, but it does not re-render immediately every time — it hands the work to the scheduler.

##### 6.2 Why batching is needed

```ts
state.count++
state.count++
state.count++
```

If every mutation immediately patched the DOM, you would get many meaningless intermediate states. Vue queues the same component’s update jobs, deduplicates them, and flushes them together in the same microtask turn.

That is why immediately reading the DOM in the code below may still see the old value:

```ts
count.value++

await nextTick()
// read the DOM here to get the updated result
```

##### 6.3 `flush` timing

`watch` and `watchEffect` can control callback timing with `flush`:

- `pre`: default; runs before the component DOM updates
- `post`: runs after the component DOM updates; suitable for reading the updated DOM
- `sync`: runs synchronously; use sparingly, as it easily loses the benefits of batching

```ts
watch(
  count,
  () => {
    console.log(el.value?.textContent)
  },
  { flush: 'post' },
)
```

A senior answer should connect this with `nextTick`: **Vue’s scheduler queue is usually flushed via microtasks. `nextTick` waits for the current update queue to finish — it does not make data reactive.**

#### 7. Key points of `computed`

`computed` is not ordinary function memoization. It is essentially a lazy effect.

##### 7.1 Lazy evaluation and caching

```ts
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})
```

The core mechanism can be simplified as:

```ts
function computed(getter) {
  let value
  let dirty = true

  const effect = new ReactiveEffect(getter, () => {
    if (!dirty) {
      dirty = true
      trigger(obj, 'value')
    }
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effect.run()
        dirty = false
      }

      track(obj, 'value')
      return value
    },
  }

  return obj
}
```

This logic answers three questions:

- The getter runs only on the first `.value` read
- If dependencies have not changed, later reads return the cache
- When dependencies change, it does not recompute immediately — it first marks `dirty` as `true`

##### 7.2 Why `computed` can itself be depended on

Using `computed` in a component:

```ts
const total = computed(() => price.value * count.value)
```

When the template reads `total`, the component render effect depends on `total.value`. When `price` or `count` changes, the inner `computed` effect is marked dirty first, then outer effects that depend on `total.value` are triggered to update.

So there are two layers of dependency:

- The `computed getter` depends on the original reactive data
- Places that use `computed.value` depend on this computed ref

##### 7.3 Boundaries of `computed`

`computed` is for describing “a value derived from existing state.”

Good for:

- Filtering, sorting, aggregation
- Derived class / style
- Form display values
- Permission, status, and UI branch decisions

Not good for:

- Sending requests
- Writing to localStorage
- Mutating other reactive state
- Touching the DOM
- Sending analytics events

Those are side effects and belong in `watch` or event handlers.

#### 8. `watch` and `watchEffect`

The biggest difference between `watch` and `computed` is: `computed` produces derived values, `watch` runs side effects.

##### 8.1 `watch`

`watch` has an explicit source and is lazy by default.

```ts
watch(
  () => props.userId,
  async (userId, oldUserId, onCleanup) => {
    const controller = new AbortController()

    onCleanup(() => {
      controller.abort()
    })

    await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    })
  },
  { immediate: true },
)
```

It is a good fit for:

- Watching a specific data source
- Sending requests when a parameter changes
- Syncing external state
- Logic that needs to compare old and new values

##### 8.2 `watchEffect`

`watchEffect` runs immediately and automatically collects reactive dependencies read during the synchronous run.

```ts
watchEffect(() => {
  console.log(user.value.name)
  console.log(route.params.id)
})
```

It fits cases where dependency sources are scattered, but the side-effect logic is straightforward.

Note: `watchEffect` only auto-collects dependencies read in the synchronous phase. Reactive data read after `await` in an async function may not be tracked.

```ts
watchEffect(async () => {
  console.log(query.value) // will be tracked

  await fetch('/api')

  console.log(page.value) // do not rely on this kind of implicit tracking
})
```

##### 8.3 How to choose among `watch`, `watchEffect`, and `computed`

- Need a cached derived value: use `computed`
- Need to watch an explicit source and run a side effect: use `watch`
- Need to auto-collect multiple dependencies and run a side effect: use `watchEffect`
- Need to read the updated DOM: use `watch` with `flush: 'post'`
- Need to cancel the previous async task: use `onCleanup`

#### 9. Deep watching and performance

When `watch` listens to an object, the easiest pitfall is deep watching.

```ts
watch(
  () => state.user,
  () => {
    // only fires when the state.user reference changes
  },
)
```

To watch inner property changes, you need:

```ts
watch(
  () => state.user.name,
  () => {
    // only care about name
  },
)
```

Or:

```ts
watch(
  () => state.user,
  () => {
    // deeply traverse properties inside user
  },
  { deep: true },
)
```

The essence of `deep: true` is recursively walking the object so inner properties are read and thus collected as dependencies. The larger the object, the higher the traversal cost.

So a senior interview answer can be: **If you can watch a specific field, do not default to deep watching. Deep watching is not magic — it trades traversal for dependency collection.**

#### 10. The full chain from reactivity to component updates

You can connect it with one example:

```ts
const count = ref(0)
const double = computed(() => count.value * 2)

watch(count, (value) => {
  console.log('count changed:', value)
})
```

Used in the template:

```vue
<template>
  <div>{{ double }}</div>
</template>
```

When `count.value++` runs:

1. The `ref` setter fires `trigger`
2. The `computed` effect that depends on `count.value` is scheduled and marked `dirty`
3. The `watch` job that depends on `count.value` is added to the scheduler queue
4. The component render effect that depends on `double.value` is added to the update queue
5. Jobs in the same update turn are deduplicated and flushed in order
6. Render reads `double.value` again
7. `computed` sees `dirty`, recomputes, and caches
8. A new vnode is created, then diff and patch run
9. After `nextTick`, you can read the updated DOM

This is much closer to what a senior interview expects than “data changed, so the page changed.”

#### 11. Common senior follow-ups

##### 11.1 Why Vue 3 does not need `Vue.set`

Because `Proxy` can intercept `set` for newly added properties. Vue 2’s `Object.defineProperty` can only hijack existing properties, so new properties needed `Vue.set` to be made reactive by hand.

##### 11.2 Why `computed` is cached and methods are not

`computed` has a lazy effect and a `dirty` flag internally. When dependencies have not changed, reading `.value` returns the previous result directly.

A method is just a normal function. Each time the template re-renders and calls it, it runs again, with no dependency-level cache.

##### 11.3 Why `watch` fits side effects

Because `watch` is not meant to produce a value. It runs external actions after reactive data changes, such as requests, cache writes, logging, DOM access, and syncing third-party instances.

##### 11.4 Differences between `watchEffect` and `watch`

`watch` specifies the source explicitly, can receive old and new values, and is lazy by default.

`watchEffect` auto-collects dependencies read during the synchronous run and executes immediately, but the sources are less obvious than with `watch`.

##### 11.5 Why DOM updates wait for `nextTick`

Data changes trigger dependencies, but component render updates usually enter the scheduler queue. Vue flushes update jobs in a microtask in batches, so multiple state changes in the same turn do not cause multiple DOM patches.

`nextTick` waits for that batch of update jobs to finish.

##### 11.6 Why destructuring `reactive` loses reactivity

`reactive`’s reactivity comes from the proxy object’s getters. Direct destructuring yields plain values. Later access no longer goes through the proxy, so tracking cannot continue.

To keep the connection, use `toRef` or `toRefs`.

##### 11.7 Is deep reactivity always better?

Not necessarily. Deep proxying pulls nested objects into the reactivity system, which fits ordinary business state. For large data, immutable data, class instances, and third-party library objects, deep proxying can add cost or break object semantics.

In those cases consider `shallowRef`, `shallowReactive`, and `markRaw`.

#### 12. Interview answer template

If the interviewer asks “how does Vue 3 reactivity work,” you can answer in this order:

1. Vue 3 creates a reactive proxy with `Proxy`. Reading a property enters `track`; mutating a property enters `trigger`
2. Dependencies live in a `WeakMap -> Map -> Set` structure, with granularity down to a specific object key
3. What gets collected is a `ReactiveEffect`. Component rendering, `computed`, and `watch` can all be built on effects
4. After `trigger`, side effects do not necessarily run immediately. Component updates usually enter a scheduler queue, get batched and deduplicated, then flush in a microtask
5. `computed` is a lazy effect that uses a `dirty` flag for caching and invalidation
6. `watch` / `watchEffect` are mainly for side effects. The differences are whether the source is explicit, whether they run immediately by default, and whether old/new values are needed
7. Compared with Vue 2, Vue 3 can natively handle added properties, deleted properties, array indexes, and `Map` / `Set`, and no longer needs `Vue.set`

That answer covers the main chain and leaves room for follow-ups.
