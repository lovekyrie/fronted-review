# Day 11 Handwrite Warmup 1 (call / bind / new / instanceof) Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 11 | Handwrite 1 (call/bind/new/instanceof) | [call](../handwrite/call), [bind](../handwrite/bind), [new](../handwrite/new), [instanceof](../handwrite/instanceof) |

## Today's goals

- Finish `/en/handwrite/call`, `bind`, `new`, `instanceof`
- Produce a "step template" for all 4 handwrite questions
- Produce a one-page *Handwrite Answer Order*: explain the idea first → then write the code → finally cover edge cases

## Reading checkpoints

- The essence of `call` is "attach the function to an object and invoke it"; use `Symbol` to avoid property collisions
- When `bind` is used with `new`, ignore the bound object; decide with `this instanceof boundFn`
- Four steps of `new`: create object → wire prototype → run constructor → return the object / new instance
- The essence of `instanceof` is walking `__proto__` until `prototype` is found

## Cheat sheet / knowledge points

### 4-question step comparison

| Question | Core steps | Key edge cases |
|------|----------|----------|
| `call` | Attach the function to the target object and invoke it | If `thisArg == null`, use `globalThis`; use `Symbol` to avoid property collisions |
| `bind` | Return a new function with preset arguments | When called with `new`, ignore the bound object (`this instanceof` check) |
| `new` | Create object → wire prototype → run constructor → return | If the constructor returns an object, use that return value; otherwise use the new instance |
| `instanceof` | Walk `__proto__` looking for `prototype` | Stop at `null`; primitives return `false` immediately |

### Handwrite answer order

```text
1. Explain the idea first (one sentence for the core principle)
2. Write the code (explain each step as you write)
3. Cover edge cases (null handling, Symbol to avoid collisions, new compatibility, etc.)
```

## Handwritten code / flowcharts

### myCall

```js
Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')
  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]
  return result
}
```

### myBind

```js
Function.prototype.myBind = function (thisArg, ...preset) {
  const originFn = this
  const boundFn = function (...args) {
    // When called with new, this is an instance of boundFn; ignore the bound object
    return originFn.apply(
      this instanceof boundFn ? this : thisArg,
      [...preset, ...args]
    )
  }
  // Inherit the original function's prototype
  if (originFn.prototype) {
    boundFn.prototype = Object.create(originFn.prototype)
  }
  return boundFn
}
```

### myNew

```js
function myNew(Ctor, ...args) {
  // 1. Create a new object whose prototype is Ctor.prototype
  const obj = Object.create(Ctor.prototype)
  // 2. Run the constructor with this bound
  const result = Ctor.apply(obj, args)
  // 3. If the constructor returns an object, use that value; otherwise use the new instance
  return result !== null && typeof result === 'object' ? result : obj
}
```

### myInstanceof

```js
function myInstanceof(obj, Ctor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') {
    return false
  }
  let proto = Object.getPrototypeOf(obj)
  while (proto !== null) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
```

## Oral questions

### 1. What is the essence of `call / bind / new` respectively?

Answer template:

> The essence of `call` is "temporarily attach the function to the target object and invoke it": `context[Symbol] = fn` makes `this` implicitly bind to `context`, then delete after the call. `apply` works the same way; only the arguments are passed as an array.
>
> The essence of `bind` is "return a new function with `this` and some arguments preset" (a currying idea). The key edge case: when the bound function is called with `new`, ignore the bound `this` and let `this` point to the new instance. The check is `this instanceof boundFn`.
>
> The essence of `new` is 4 steps: create an empty object → set the object's `__proto__` to the constructor's `prototype` → run the constructor with that object as `this` → if the constructor returned an object, use it; otherwise return the newly created instance.

### 2. What is the underlying judgment logic of `instanceof`?

Answer template:

> The essence of `instanceof` is walking the object's prototype chain (`__proto__`) upward, looking for the constructor's `prototype`. If found, return `true`; if you reach `null` (the top of the chain), return `false`.
>
> Note: primitives (e.g. `'hello' instanceof String`) return `false` immediately because they have no prototype chain. `Symbol.hasInstance` can customize `instanceof` behavior.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Core of call (attach to an object and invoke) + bind's compatibility with new (2 minutes)
2. Four steps of new + return-value logic (1.5 minutes)
3. instanceof prototype-chain walk + primitive edge case (1.5 minutes)

Self-check after recording:

- Did you mention `Symbol` to avoid property collisions?
- Did you mention that bind ignores the bound object when used with new?
- Did you mention new's "if the constructor returns an object, use that return value"?
- Did you mention that instanceof returns false immediately for primitives?

## Today's review

The 3 points that most need follow-up today:

1. The function returned by `bind` must inherit the original function's `prototype`, otherwise instances created with `new` have a broken prototype chain.
2. The `result` check in `myNew` must exclude `null` (`typeof null === 'object'`).
3. How and when to customize instanceof with `Symbol.hasInstance`.
