# Day 29 Vue 3 Proxy / Reflect and the Reactivity Entry Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 29 | Proxy / Reflect | [Reactivity](../advanced/week3/reactivity), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Finish Vue Reactivity in Depth and `/en/framework/vue/reactivity`
- Produce a 13-trap Proxy cheat sheet, and mark the 4 commonly used in reactivity: `get / set / has / deleteProperty`
- Compare Vue 2 `Object.defineProperty` with Vue 3 Proxy

## Reading pitfalls

- `Reflect` is not only "call the default behavior"; it also has the side effect of making `this` point at the receiver correctly
- Proxying array index / length is not "naturally usable"; Vue 3 adds special handling
- Only accessed properties fire getters. Deep reactivity is created **on demand**

## Cheat sheet / key points

### Common Proxy traps

| trap | When it fires | Reactivity meaning |
|------|----------|------------|
| `get` | Read a property: `state.count` | Collect deps; turn nested objects reactive on demand |
| `set` | Write a property: `state.count = 1` | Detect add vs update, then trigger the matching deps |
| `has` | `key in state` | Track `in` as a dependency |
| `deleteProperty` | `delete state.name` | Trigger updates after a property is deleted |
| `ownKeys` | `Object.keys(state)` / `for...in` | Track changes to the object's key set |

- Vue 3 uses Proxy to wrap the whole object, so it can intercept adding properties, deleting properties, array index, `length`, `Map/Set`, and more.
- Vue 2 uses `Object.defineProperty` to hijack existing properties. New and deleted properties cannot trigger naturally, which is why patches such as `Vue.set` exist.
- Proxy deep reactivity does not recursively proxy every level at init. It turns child objects reactive on demand in `get`.
- `reactive` fits objects, arrays, `Map`, and `Set`; `ref` fits primitives or values you need to replace as a whole; `shallowReactive/shallowRef` only track the first layer.
- `readonly` is also proxy-based: reads and dep collection are allowed, writes are not. It is often used to expose read-only state.
- `Reflect.get(target, key, receiver)` is not only a default read. It also makes `this` inside a getter point at the proxy, so nested deps keep being collected.
- `Reflect.set` returns a boolean, matching the Proxy `set` trap convention. Direct `target[key] = value` easily drops default semantics.
- Do not treat "Proxy is faster" as the only conclusion. More accurately: Proxy makes reactivity semantics more complete, and init cost more controllable.

## Handwritten / flow diagrams

```js
function reactive(target) {
  return new Proxy(target, {
    get(t, k, r) {
      track(t, k)
      const value = Reflect.get(t, k, r)
      return isObject(value) ? reactive(value) : value
    },
    set(t, k, v, r) {
      const oldValue = t[k]
      const hadKey = Object.prototype.hasOwnProperty.call(t, k)
      const ok = Reflect.set(t, k, v, r)

      if (!hadKey) trigger(t, k, 'add')
      else if (oldValue !== v) trigger(t, k, 'set')

      return ok
    },
    deleteProperty(t, k) {
      const hadKey = Object.prototype.hasOwnProperty.call(t, k)
      const ok = Reflect.deleteProperty(t, k)
      if (hadKey && ok) trigger(t, k, 'delete')
      return ok
    },
  })
}
```

```text
Read state.user.name
  -> get(state, 'user'): track user, return reactive(user)
  -> get(user, 'name'): track name

Write state.user.name
  -> set(user, 'name')
  -> trigger(user, 'name')
  -> fire the effect / component update that depends on this field
```

## Oral questions

### 1. Why did Vue 3 switch to Proxy?

> Answer template: Vue 2's `Object.defineProperty` hijacks getters/setters of existing properties, so init has to recursively process existing keys. Adding properties, deleting properties, array index, and `length` are not naturally interceptable, so you need patches such as `Vue.set` and rewritten array methods. After Vue 3 switched to Proxy, it wraps the whole object and can intercept more operations such as `get/set/has/deleteProperty/ownKeys`, with more complete semantics for add, delete, iteration, arrays, and `Map/Set`. Nested objects can also be proxied on demand when read, instead of recursively walking the whole tree up front. In interviews I would not only say "it is faster"; I would stress that it solves coverage and semantic completeness of reactivity.

### 2. Why use Reflect in a Proxy handler instead of `target[key]` directly?

> Answer template: Think of `Reflect` as the standardized way to perform an object's default operation. `Reflect.get(target, key, receiver)` keeps original read semantics and passes `receiver` into the getter, so `this` inside the getter points at the proxy rather than the raw object. Further property access inside that getter then still goes through the proxy and collects deps. `Reflect.set` also returns a boolean, matching the Proxy `set` trap convention. Direct `target[key]` or `target[key] = value` can run in simple cases, but it breaks default semantics for accessors, inheritance, and read-only failures.

## 5-minute recording outline

1. Proxy's 13 traps + the 4 commonly used (2 minutes)
2. Reflect and receiver (1.5 minutes)
3. Vue 2 vs Vue 3 reactivity (1.5 minutes)

## Today's review

1. Most likely follow-up: Proxy does not "automatically make everything reactive". Arrays and collection types still need Vue's dedicated proxy logic.
2. Current gap: map `get/set/has/deleteProperty/ownKeys` to read, write, `in`, delete, and iteration deps respectively.
3. Next to add: connect to Day 30, and explain where `track/trigger` fired by Proxy actually stores deps.
