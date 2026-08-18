---
title: Data Types and the Type System
description: High-frequency follow-ups and deeper principles of JavaScript primitives, reference types, type checking, and conversion
---

### Primitive types
In JavaScript, **primitive types** are simple values stored directly on the stack. They are immutable and accessed by value.

```js
// 7 primitive types
const str = 'hello' // String
const num = 42 // Number
const bool = true // Boolean
const n = null // Null
let u // Undefined
const sym = Symbol('1') // Symbol
const big = 42n // BigInt
```

### Reference types
**Reference types** live on the heap. The variable actually stores a **pointer** to a heap address, and that pointer itself lives on the stack.
Common reference types include `Object`, `Array`, `Function`, and so on.

```js
// Object types
const obj = {} // Object
const arr = [] // Array
function func() {} // Function
const date = new Date() // Date
```

### Function argument passing
In JavaScript, all function arguments are passed **by value**.
- For **primitives**, a copy of the value is passed.
- For **reference types**, a **copy of the pointer** is passed (a copy of the memory address). Mutating object properties inside the function affects the outer object, but reassigning the parameter (pointing it at a new object) does not affect the outer variable.

```js
const person = {
  name: 'Nicholas',
  age: 20,
}

// obj receives a reference (a copy of the stack value that points to person's heap address)
function setName(obj) {
  obj = {} // Reassign the parameter to a new value (a new heap address, so it no longer shares person's reference)
  obj.name = 'Greg' // Mutate name on this new object
}

setName(person)
console.log(person.name) // Nicholas
```

### Checking data types
Three common interview approaches, each with trade-offs.

#### typeof
The most basic check. Works for primitives (except `null`) and functions.
**Notes**:
- `typeof null` returns `'object'` (a historical bug).
- Reference types (except functions) all return `'object'`.

```js
console.log(typeof undefined) // "undefined"
console.log(typeof null) // "object"
console.log(typeof '11') // "string"
console.log(typeof 123) // "number"
console.log(typeof BigInt(1)) // "bigint"
console.log(typeof Symbol('4')) // "symbol"
console.log(typeof { a: 1 }) // "object"
console.log(typeof function () {}) // "function"
```

#### instanceof
Checks whether a constructor's `prototype` appears on an instance's prototype chain.
**How it works**: `left.__proto__.__proto__... === right.prototype`
**Downsides**: cannot correctly check primitives; affected by prototype-chain mutation.

```js
const obj = { a: 1 }
console.log(obj instanceof Object) // true

function Person() {}
const p = new Person()
console.log(p instanceof Person) // true
// p.__proto__ = Person.prototype
// Person.prototype.__proto__ = Object.prototype (see the prototype-chain diagram)
// Object.prototype.__proto__ = null
console.log(p instanceof Object) // true
```

#### Object.prototype.toString.call()
The most accurate check, often called the "universal method". It uses `toString` on `Object.prototype` and always returns `[object Type]`.

```js
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call('1') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(() => {}) // "[object Function]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(/123/g) // "[object RegExp]"
Object.prototype.toString.call(new Date()) // "[object Date]"
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call(document) // "[object HTMLDocument]"
Object.prototype.toString.call(window) // "[object Window]"
```

### Type conversion
Conversion is either **explicit** (coercion you write) or **implicit** (automatic).

#### Explicit conversion

**Number()**
Force-converts various types to numbers.
- **Boolean**: `true` -> 1, `false` -> 0
- **Null**: -> 0
- **Undefined**: -> `NaN`
- **Symbol**: throws TypeError
- **Object**: call `[Symbol.toPrimitive]` first, otherwise `valueOf()`, then `toString()`, then convert to a number.

**String()**
Converts a value to a string.
- **Symbol**: throws TypeError
- **Object**: call `[Symbol.toPrimitive](hint: "string")` -> `toString()` -> `valueOf()` in that order.

**parseInt(string, radix)**
Parses a string and returns an integer.
- **Rule**: start from the first non-whitespace character; stop at the first non-digit.
- **Note**: always pass `radix` (the base), e.g. `parseInt('10', 10)`, to avoid the old-browser octal pitfall.

**parseFloat(string)**
Parses a string and returns a float.
- Always parses as base 10.
- Stops at the first illegal character; recognizes the exponent `e`.

**Boolean()**
Everything is `true` except these **6 falsy values**:
`undefined`, `null`, `false`, `''` (empty string), `0` (+0/-0), `NaN`

#### Implicit conversion
Mainly happens with `==` and `+`.

**Implicit conversion rules for `==`**
1. **Same type**: compare directly (objects compare by reference).
2. **null == undefined**: returns `true`.
3. **Object vs Primitive**: convert the object to a primitive (ToPrimitive).
4. **String/Boolean vs Number**: convert to Number, then compare.
   - `true` -> 1
   - `'123'` -> 123

**Implicit conversion rules for `+`**
1. **String concatenation**: if either side is a string, the other is converted to a string and concatenated.
2. **Numeric addition**: if neither side is a string, convert to numbers and add.
   - Special case: `Date` objects prefer string conversion.

**Object conversion rules (ToPrimitive)**
When an object must become a primitive (e.g. `obj + 1`), the engine calls:
1. `Symbol.toPrimitive(hint)`
2. `valueOf()`
3. `toString()`
4. If none of these returns a primitive, throw `TypeError`.

---

## High-frequency follow-ups and deeper principles

### Checking NaN: why `NaN !== NaN`

`NaN` is the only JavaScript value that is **not equal to itself**. This comes from the IEEE 754 floating-point spec.

```js
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true - Object.is handles this correctly
```

**Why is `NaN` not equal to itself?**
- `NaN` represents the result of an operation that is "not a number" (e.g. `0/0`)
- IEEE 754 says `NaN` comparisons always return `false`, so "indeterminate" results stay distinct from "determinate" ones

**How to check NaN correctly:**

```js
// Method 1: Number.isNaN (recommended)
Number.isNaN(NaN) // true
Number.isNaN('abc' / 2) // true

// Method 2: Object.is
Object.is(NaN, NaN) // true

// Method 3: rely on NaN !== NaN
const isNaN = (v) => v !== v // rely on NaN !== NaN

// Not recommended: isNaN() coerces first
isNaN('abc') // true - coerces 'abc' to NaN, then checks
Number.isNaN('abc') // false - no coercion
```

**Follow-up**: why can `Object.is` detect `NaN` correctly?
- `Object.is` is the ES2015 precise-equality method; its internal algorithm is `SameValueZero`
- Unlike `===`, both `Object.is(NaN, NaN)` and `Object.is(+0, -0)` return `true`

---

### Boxing and unboxing: how primitives get methods

JavaScript primitives (`string`, `number`, `boolean`) are not objects and should not have methods. Yet we can write:

```js
const str = 'hello'
console.log(str.toUpperCase()) // "HELLO"
```

This works because of **boxing**: **temporarily wrap the primitive in a wrapper object** so methods on that object can be called.

#### Boxing

```js
// Roughly what the engine does internally:
const str = 'hello'
const boxed = new String(str) // temporarily create a wrapper object
boxed.toUpperCase()          // call the method
boxed = null                 // discarded immediately after use (GC)
```

#### Unboxing

Convert a wrapper object back to a primitive:

```js
const boxed = new String('hello')
const primitive = boxed.valueOf() // "hello" - explicit unboxing
const primitive2 = boxed + ''     // "hello" - implicit unboxing
```

#### The role of Symbol.toPrimitive

When an object takes part in an operation, `Symbol.toPrimitive` lets you customize conversion:

```js
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42
    if (hint === 'string') return 'hello'
    return true
  }
}

console.log(obj + 1)      // 42 + 1 = 43 (hint: 'default')
console.log(obj * 2)      // 42 * 2 = 84 (hint: 'number')
console.log(String(obj))   // "hello" (hint: 'string')
```

---

### Floating-point precision: why `0.1 + 0.2 !== 0.3`

A classic pitfall in JavaScript (and any IEEE 754 language):

```js
console.log(0.1 + 0.2)        // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3) // false
```

**Why?**

JavaScript uses IEEE 754 double-precision floats (64-bit). In binary, `0.1` and `0.2` are repeating fractions:

```
0.1 (decimal) = 0.0001100110011001100... (binary)
0.2 (decimal) = 0.0011001100110011001... (binary)
```

IEEE 754 cannot represent these values exactly; it truncates to a 52-bit significand, so precision is lost.

**Practical workarounds:**

```js
// Approach 1: use integer arithmetic (required for money)
const cents = 10 + 20  // 30 cents, exact
const dollars = cents / 100 // 0.30, exact

// Approach 2: use toFixed or round
const sum = (0.1 + 0.2).toFixed(2) // "0.30", returns a string
const sumNum = Math.round((0.1 + 0.2) * 100) / 100 // 0.3

// Approach 3: use a dedicated library (e.g. decimal.js)
import Decimal from 'decimal.js'
new Decimal('0.1').plus('0.2').equals('0.3') // true

// Approach 4: ES2020 BigDecimal (still a draft)
```

**Interview answer template:**

> JavaScript's `0.1 + 0.2 !== 0.3` happens because IEEE 754 floats cannot exactly represent repeating binary fractions like `0.1` and `0.2`. The fix is integer arithmetic (e.g. store money in cents, not dollars), or combine `toFixed` / `Math.round`.

---

### Symbol use cases

`Symbol` is an ES2015 primitive for unique identifiers. Common uses:

#### 1. As an object key

```js
const sym = Symbol('description')
const obj = {
  name: 'hello',
  [sym]: 'world' // symbol as a key
}
obj[sym] // "world"
Object.keys(obj) // ["name"] - Symbol keys are not enumerated
```

#### 2. Symbol.iterator: define an iterator

```js
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from
    return {
      next() {
        if (current <= this.to) {
          return { value: current++, done: false }
        }
        return { done: true }
      }
    }
  }
}

for (const num of range) {
  console.log(num) // 1, 2, 3, 4, 5
}
```

#### 3. Symbol.toPrimitive: custom type conversion

```js
const distance = {
  value: 100,
  unit: 'km',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.value
    if (hint === 'string') return `${this.value}${this.unit}`
    return this.value
  }
}

console.log(distance + 0)       // 100
console.log(String(distance))   // "100km"
```

#### 4. Symbol.replace / Symbol.split: customize regex-like behavior

```js
const replacer = {
  [Symbol.replace](str, replacement) {
    return str.replace(/foo/g, replacement)
  }
}
```

#### 5. Global Symbol vs local Symbol

```js
// Local Symbol (unique on every call)
const s1 = Symbol('key')
const s2 = Symbol('key')
s1 === s2 // false

// Global Symbol (same key returns the same reference)
const gs1 = Symbol.for('key')
const gs2 = Symbol.for('key')
gs1 === gs2 // true
Symbol.keyFor(gs1) // "key" - look up the key from a symbol
```

---

### BigInt limits and use cases

BigInt is an ES2020 primitive for integers beyond `Number.MAX_SAFE_INTEGER` (2^53 - 1).

#### Basic usage

```js
const big = 9007199254740991n  // n suffix
const alsoBig = BigInt(9007199254740991)

// Large-integer arithmetic
big + 1n // 9007199254740992n
big * 2n // 18014398509481982n
```

#### Limits

```js
// 1. Cannot mix with Number in arithmetic
1n + 1 // TypeError
1n + BigInt(1) // 2n - OK

// 2. Cannot use Math methods
Math.max(1n, 2n) // TypeError

// 3. Cannot JSON.stringify
JSON.stringify(1n) // TypeError

// 4. typeof returns "bigint"
typeof 1n // "bigint"
```

#### Use cases

```js
// 1. Finance (amounts, exchange rates)
const price = 1000000000000000000n // 1e18 yuan, exact

// 2. ID generation (beyond Number's safe range)
const id = BigInt(Date.now()) * 1000000n + BigInt(Math.random() * 999999)

// 3. Bitwise operations
const flags = 1n << 64n // left shift 64 bits
```

---

### Hand-written instanceof polyfill

`instanceof` walks the object's prototype chain and checks whether the constructor's `prototype` appears on it.

```js
function myInstanceof(left, right) {
  // Guard: left must be an object, right must be a function
  if (typeof left !== 'object' || left === null) {
    return false
  }
  if (typeof right !== 'function') {
    return false
  }

  // Get left's prototype
  let proto = Object.getPrototypeOf(left)
  const prototype = right.prototype

  // Walk the prototype chain
  while (proto !== null) {
    if (proto === prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

// Tests
function Person(name) {
  this.name = name
}
const p = new Person('Nicholas')

myInstanceof(p, Person)        // true
myInstanceof(p, Object)        // true
myInstanceof(p, String)        // false
myInstanceof('hello', String)  // false (primitive)
myInstanceof(null, Object)     // false (null check)
```

**Interview follow-up**: `instanceof` vs `typeof`?

| Dimension | typeof | instanceof |
|------|--------|------------|
| Primitives | Can distinguish them (except null) | Cannot |
| Reference types | Only returns object/function | Can check inheritance |
| Prototype-chain mutation | Unaffected | May be affected |
| Cross-iframe | Unaffected | May be affected |

---

## Interview answer template

**Question**: What characterizes JavaScript's type system?

**High-scoring answer**:

> JavaScript has 7 primitive types (string, number, boolean, null, undefined, symbol, bigint) and 1 reference type (object).
>
> Primitives live on the stack, are accessed by value, and are **immutable**; reference types live on the heap, and the variable stores a **pointer**.
>
> Arguments are always passed by value. For reference types that value is a copy of the pointer, so a function can mutate object properties but cannot reassign the outer variable.
>
> Prefer `typeof` for primitives and functions, `Object.prototype.toString.call()` for a precise check, and `instanceof` for inheritance.
>
> Implicit conversion mainly happens with `==` and `+`. The core rule is **object → primitive** (ToPrimitive), then convert to a number or string depending on the operator. Watch out for `NaN !== NaN` and floating-point precision (use integers or a dedicated library for large-number math).

---

## Related links

- [MDN JavaScript data types](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)
- [MDN Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [IEEE 754 floating-point calculator](https://www.h-schmidt.net/FloatConverter/IEEE754.html)
