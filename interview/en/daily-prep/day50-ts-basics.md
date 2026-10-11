# Day 50 TypeScript Basics / Literals / Union / Intersection

## Goals

- Finish the opening of Types from Types in the TypeScript Handbook
- Produce a type / interface difference comparison table
- Write 5 small demos: literal types / union / intersection / literal widening / as const

## Read in order

1. [TypeScript Basics](../advanced/week5/typescript-basic)

## Practice and self-check

**Checkpoints**

- `interface` supports declaration merging; `type` does not, but `type` can express unions and tuples
- Narrowing unions needs typeof / instanceof / in / discriminated union
- `as const` turns off literal widening and gives you the most precise literal types

**Produce or redraw from memory**

- type vs interface — [reference section](../advanced/week5/typescript-basic#day-50-type-vs-interface)
- Literal types + widening — [reference section](../advanced/week5/typescript-basic#day-50-literal-types-widening)
- Union narrowing — [reference section](../advanced/week5/typescript-basic#day-50-union-narrowing)
- Intersection types — [reference section](../advanced/week5/typescript-basic#day-50-intersection-types)
- 5 demos — [reference section](../advanced/week5/typescript-basic#day-50-5-demos)

**Answer aloud without reading a reference answer**

- 1. How do you choose type vs interface?
- 2. Why is a discriminated union better than a plain union?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. type vs interface comparison + selection rule (1.5 minutes)
2. Literal types + widening + as const (1.5 minutes)
3. Four narrowing methods + discriminated union + exhaustive check (2 minutes)

Self-check after recording:

- Did you state that interface supports declaration merging and type supports unions and tuples.
- Did you state that as const turns off widening.
- Did you state that a discriminated union narrows via a tag field.
- Did you state how to write an exhaustive check.

## Recap

The 3 points that most need follow-up today:

1. Difference between `unknown` and `any` (unknown is the type-safe any; you must narrow before use).
2. When to use `never` (exhaustive check, unreachable branches, empty unions).
3. Trade-off between `enum` and union types (unions are lighter; enums have a runtime value).
