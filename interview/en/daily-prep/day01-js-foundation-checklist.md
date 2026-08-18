# Day 1 JS Fundamentals Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 1 | Data types / this / prototype chain | [Data Types](../jscore/basic/data-type), [this Keyword](../jscore/basic/this), [Prototype Chain](../jscore/basic/prototype) |

## Today's goals

- Finish the three fundamentals: `data types / this / prototype chain`.
- Produce one page of a *JS Fundamentals Cheat Sheet*.
- Write the handwritten steps for `call / bind`.
- Prepare 3 oral questions and complete one 5-minute recording.

## Reading checkpoints

- `data-type`: it is easy to misdescribe passing a reference type as “pass by reference”; the accurate wording is “pass by value, and the value is a copy of the reference address”.
- `this`: first check whether it is an arrow function, then check how it is called; `new` binding outranks `bind`.
- `prototype`: `prototype` belongs to the constructor; `__proto__` belongs to the instance; property lookup continues upward along `__proto__`.

## JS fundamentals cheat sheet

### Data types

JavaScript has 7 primitive types:

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

Reference types all belong to the object system. Common ones:

- `Object`
- `Array`
- `Function`
- `Date`
- `RegExp`

How to tell them apart:

- `typeof`: good for primitives and functions, but `typeof null === "object"` is a historical leftover.
- `instanceof`: checks whether the constructor’s `prototype` appears on the instance’s prototype chain; not suitable for primitives.
- `Object.prototype.toString.call(value)`: better for precise type checks.

Prefer this for arrays:

```js
Array.isArray(value)
```

### this

Where `this` points is decided by how the function is called, not by where it is defined.

Common binding rules:

1. Default binding: a plain function called standalone; in non-strict mode it points to the global object, in strict mode it is `undefined`.
2. Implicit binding: called as an object method; `this` points to the object that called it.
3. Explicit binding: `this` is specified via `call / apply / bind`.
4. `new` binding: when called as a constructor, `this` points to the newly created instance.

Priority:

```text
new binding > explicit binding > implicit binding > default binding
```

Arrow functions have no `this` of their own. They capture the outer scope’s `this` at definition time and cannot be changed with `call / apply / bind`.

### Prototype chain

Core relationships:

```js
instance.__proto__ === Constructor.prototype
Constructor.prototype.constructor === Constructor
```

Property lookup:

```text
the object itself
  -> object.__proto__
  -> Constructor.prototype
  -> Object.prototype
  -> null
```

What `new` does:

1. Create a new object.
2. Link the new object’s prototype to the constructor’s `prototype`.
3. Run the constructor with the new object as `this`.
4. If the constructor returns an object, return that object; otherwise return the new object.

## Handwritten `call` steps

Essence: call the function immediately, and explicitly set `this` for that call.

Steps:

1. The caller must be a function.
2. Handle `thisArg`; if it is empty, point to the global object.
3. Use `Symbol` as a temporary key so existing properties are not overwritten.
4. Temporarily attach the current function to `thisArg`.
5. Call it via `thisArg[fn](...args)`.
6. Delete the temporary property.
7. Return the function’s result.

```js
Function.prototype.myCall = function (thisArg, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('caller must be a function')
  }

  const context = thisArg == null ? globalThis : Object(thisArg)
  const fnKey = Symbol('fn')

  context[fnKey] = this
  const result = context[fnKey](...args)
  delete context[fnKey]

  return result
}
```

## Handwritten `bind` steps

Essence: do not call immediately; return a new function with `this` and some arguments already bound.

Steps:

1. The caller must be a function.
2. Save the original function, the bound object, and the preset arguments.
3. Return a new function.
4. On a normal call, use the bound object as `this`.
5. On a `new` call, ignore the bound object and let `this` be the new instance.
6. Merge preset arguments with call-time arguments.
7. Keep the prototype relationship so `new boundFn()` can still reach methods on the original function’s prototype.

```js
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('caller must be a function')
  }

  const originalFn = this

  function boundFn(...laterArgs) {
    const isNewCall = this instanceof boundFn
    const context = isNewCall ? this : thisArg

    return originalFn.apply(context, [...presetArgs, ...laterArgs])
  }

  boundFn.prototype = Object.create(originalFn.prototype)

  return boundFn
}
```

## Oral questions

### 1. What is the `this` binding priority?

Answer template:

> Where `this` points is mainly decided by how the function is called. There are four common bindings: default, implicit, explicit, and `new`.
>
> Default binding is a standalone call: the global object in non-strict mode, `undefined` in strict mode. Implicit binding is calling it as an object method; `this` points to that object. Explicit binding sets `this` with `call / apply / bind`. `new` binding is a constructor call; `this` points to the newly created instance.
>
> Priority: `new` binding outranks explicit binding, which outranks implicit binding, which outranks default binding. A special case: arrow functions have no `this` of their own; they capture the outer scope’s `this` at definition time, so `call / apply / bind` cannot change it.

### 2. How do you explain prototype-chain lookup and the `new` process?

Answer template:

> JavaScript shares properties and implements inheritance through the prototype chain. Every instance has an implicit prototype `__proto__`, which points to the constructor’s `prototype`. When you access a property, the engine looks on the object itself first; if it is missing, it walks up `__proto__` until `Object.prototype`, then `null`.
>
> `new` can be split into four steps: first, create a new object; second, link that object’s prototype to the constructor’s `prototype`; third, run the constructor with this new object as `this`; fourth, if the constructor returns an object, return that object; otherwise return the newly created object.

### 3. What is the essence of `call` vs `bind`?

Answer template:

> Both `call` and `bind` exist to control `this` when a function is invoked.
>
> `call` runs the function immediately and explicitly sets `this` for that call. The handwritten core is to hang the function on the target object temporarily, invoke it as a method so `this` points at that object, then delete the temporary property.
>
> `bind` does not run immediately; it returns a new function that stores the original function, the bound object, and preset arguments. On a normal call it uses the bound object as `this`, but if that new function is called with `new`, `this` should be the new instance and must not keep using the originally bound object.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Cover the four `this` bindings and their priority in 2 minutes.
2. Cover prototype-chain lookup and the `new` process in 2 minutes.
3. Cover the difference between `call` and `bind` in 1 minute.

Self-check after recording:

- Did you say `new > explicit > implicit > default`?
- Did you say arrow functions cannot change `this`?
- Did you say `instance.__proto__ === Constructor.prototype`?
- Did you say `call` runs immediately and `bind` returns a function?

## Today's review

The 3 points that most need follow-up today:

1. When to use `typeof / instanceof / Object.prototype.toString.call`.
2. Why `bind` must ignore the bound object when called with `new`.
3. The relationship among `prototype / __proto__ / constructor` — draw it and explain it again.
