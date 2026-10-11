# Day 1 JS Fundamentals

## Goals

- Finish the three fundamentals: `data types / this / prototype chain`.
- Produce one page of a *JS Fundamentals Cheat Sheet*.
- Write the handwritten steps for `call / bind`.
- Prepare 3 oral questions and complete one 5-minute recording.

## Read in order

1. [Data Types](../jscore/basic/data-type)
2. [this Keyword](../jscore/basic/this)
3. [Prototype Chain](../jscore/basic/prototype)

## Practice and self-check

**Checkpoints**

- `data-type`: it is easy to misdescribe passing a reference type as “pass by reference”; the accurate wording is “pass by value, and the value is a copy of the reference address”.
- `this`: first check whether it is an arrow function, then check how it is called; `new` binding outranks `bind`.
- `prototype`: `prototype` belongs to the constructor; `__proto__` belongs to the instance; property lookup continues upward along `__proto__`.

**Produce or redraw from memory**

- Data types — [reference section](../jscore/basic/data-type#day-1-data-types)
- this — [reference section](../jscore/basic/this#day-1-this)
- Prototype chain — [reference section](../jscore/basic/prototype#day-1-prototype-chain)
- Knowledge notes — [reference section](../jscore/basic/data-type#day-1-knowledge-notes)
- Practice example — [reference section](../jscore/basic/data-type#day-1-practice-example)

**Answer aloud without reading a reference answer**

- 1. What is the `this` binding priority?
- 2. How do you explain prototype-chain lookup and the `new` process?
- 3. What is the essence of `call` vs `bind`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Cover the four `this` bindings and their priority in 2 minutes.
2. Cover prototype-chain lookup and the `new` process in 2 minutes.
3. Cover the difference between `call` and `bind` in 1 minute.

Self-check after recording:

- Did you say `new > explicit > implicit > default`?
- Did you say arrow functions cannot change `this`?
- Did you say `instance.__proto__ === Constructor.prototype`?
- Did you say `call` runs immediately and `bind` returns a function?

## Recap

The 3 points that most need follow-up today:

1. When to use `typeof / instanceof / Object.prototype.toString.call`.
2. Why `bind` must ignore the bound object when called with `new`.
3. The relationship among `prototype / __proto__ / constructor` — draw it and explain it again.
