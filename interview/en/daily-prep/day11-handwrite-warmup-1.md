# Day 11 Handwrite Warmup 1 (call / bind / new / instanceof)

## Goals

- Finish `/en/handwrite/call`, `bind`, `new`, `instanceof`
- Produce a "step template" for all 4 handwrite questions
- Produce a one-page *Handwrite Answer Order*: explain the idea first → then write the code → finally cover edge cases

## Read in order

1. [call](../handwrite/call)
2. [bind](../handwrite/bind)
3. [new](../handwrite/new)
4. [instanceof](../handwrite/instanceof)

## Practice and self-check

**Checkpoints**

- The essence of `call` is "attach the function to an object and invoke it"; use `Symbol` to avoid property collisions
- When `bind` is used with `new`, ignore the bound object; decide with `this instanceof boundFn`
- Four steps of `new`: create object → wire prototype → run constructor → return the object / new instance
- The essence of `instanceof` is walking `__proto__` until `prototype` is found

**Produce or redraw from memory**

- 4-question step comparison — [reference section](../handwrite/call#day-11-4-question-step-comparison)
- Handwrite answer order — [reference section](../handwrite/call#day-11-handwrite-answer-order)
- myCall — [reference section](../handwrite/call#day-11-mycall)
- myBind — [reference section](../handwrite/bind#day-11-mybind)
- myNew — [reference section](../handwrite/new#day-11-mynew)
- myInstanceof — [reference section](../handwrite/instanceof#day-11-myinstanceof)

**Answer aloud without reading a reference answer**

- 1. What is the essence of `call / bind / new` respectively?
- 2. What is the underlying judgment logic of `instanceof`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Core of call (attach to an object and invoke) + bind's compatibility with new (2 minutes)
2. Four steps of new + return-value logic (1.5 minutes)
3. instanceof prototype-chain walk + primitive edge case (1.5 minutes)

Self-check after recording:

- Did you mention `Symbol` to avoid property collisions?
- Did you mention that bind ignores the bound object when used with new?
- Did you mention new's "if the constructor returns an object, use that return value"?
- Did you mention that instanceof returns false immediately for primitives?

## Recap

The 3 points that most need follow-up today:

1. The function returned by `bind` must inherit the original function's `prototype`, otherwise instances created with `new` have a broken prototype chain.
2. The `result` check in `myNew` must exclude `null` (`typeof null === 'object'`).
3. How and when to customize instanceof with `Symbol.hasInstance`.
