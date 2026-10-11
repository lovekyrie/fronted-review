# Day 52 Conditional Types and infer

## Goals

- Finish TypeScript Conditional Types
- Handwrite common utility types: `ReturnType / Parameters / Awaited / ExtractPromise`
- Output an answer script for `distributive conditional types`

## Read in order

1. [TypeScript Type Design](../advanced/week5/typescript-design)

## Practice and self-check

**Checkpoints**

- `T extends U ? X : Y` **distributes** when T is a naked type and is a union
- Wrapping with square brackets as `[T] extends [U] ? X : Y` can **turn off distribution**
- `infer` can only appear on the right-hand side of extends, used to “pull a type out of a structure”

**Produce or redraw from memory**

- Conditional type syntax — [reference section](../advanced/week5/typescript-design#day-52-conditional-type-syntax)
- Distributive conditional types — [reference section](../advanced/week5/typescript-design#day-52-distributive-conditional-types)
- The infer keyword — [reference section](../advanced/week5/typescript-design#day-52-the-infer-keyword)
- Inference rules for infer in different positions — [reference section](../advanced/week5/typescript-design#day-52-inference-rules-for-infer-in-different-positions)
- Implementations of common utility types — [reference section](../advanced/week5/typescript-design#day-52-implementations-of-common-utility-types)

**Answer aloud without reading a reference answer**

- 1. What is a distributive conditional type? When do you need to turn it off?
- 2. What is the core value of `infer`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Conditional type syntax + distribution rules + the `[]` trick to turn off distribution (1.5 minutes)
2. Core idea of infer + 4 examples (ReturnType / Parameters / Awaited / Flatten) (2 minutes)
3. Inference differences in covariant vs contravariant positions (1.5 minutes)

Self-check after recording:

- Did you state the trigger for distributive conditional types (naked type parameter + union).
- Did you state wrapping with `[]` to turn off distribution.
- Did you state that infer can only appear on the right-hand side of extends.
- Did you state that covariant positions infer unions and contravariant positions infer intersections.

## Recap

The 3 points that most need follow-up today:

1. Using `infer` in template literal types (for example parsing method and path from `'GET /api/user'`).
2. Depth limits of recursive conditional types (TypeScript defaults to at most 50 levels of recursion).
3. The `NoInfer<T>` utility type (TypeScript 5.4+), which stops a position from participating in inference.
