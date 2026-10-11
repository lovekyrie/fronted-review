# Day 55 Handwriting Utility Types + JS → TS Migration

## Goals

- Handwrite 15 common utility types: `Partial / Required / Readonly / Pick / Omit / Exclude / Extract / NonNullable / ReturnType / Parameters / Awaited / Record / ConstructorParameters / ThisParameterType / OmitThisParameter`
- Rewrite 2 JS examples in `hand-write/` into strict TypeScript versions
- Output a JS → TS migration checklist

## Read in order

1. [TypeScript Type Design](../advanced/week5/typescript-design)
2. [TypeScript Basics](../advanced/week5/typescript-basic)

## Practice and self-check

**Checkpoints**

- Internally `Omit` is `Pick<T, Exclude<keyof T, K>>`, not native built-in magic
- `Exclude` / `Extract` are based on distributive conditional types
- When migrating JS to TypeScript, prioritize filling in API-boundary types; let function bodies use inference

**Produce or redraw from memory**

- 15 utility types in 5 groups — [reference section](../advanced/week5/typescript-design#day-55-15-utility-types-in-5-groups)
- Classification by underlying implementation — [reference section](../advanced/week5/typescript-design#day-55-classification-by-underlying-implementation)
- Implementations of 15 utility types — [reference section](../advanced/week5/typescript-design#day-55-implementations-of-15-utility-types)
- JS → TS migration checklist — [reference section](../advanced/week5/typescript-design#day-55-js-→-ts-migration-checklist)

**Answer aloud without reading a reference answer**

- 1. How do you implement the 5 utility types you use most?
- 2. Where do you start when converting JS to TypeScript?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. The 5-group classification of utility types + the three underlying techniques (mapped / distributive / infer) (2 minutes)
2. Handwrite the three implementations of Partial / Omit / ReturnType (1.5 minutes)
3. JS → TS migration flow (start from boundaries + incremental) (1.5 minutes)

Self-check after recording:

- Did you state the three underlying techniques: mapped types, distributive conditionals, infer.
- Did you state the composition Omit = Pick + Exclude.
- Did you state that JS-to-TS starts with API boundaries.
- Did you state the importance of enabling strict mode.

## Recap

The 3 points that most need follow-up today:

1. Real use cases for `ConstructorParameters` and `InstanceType` (factory functions, DI containers).
2. Clever uses of the `satisfies` operator (TypeScript 4.9+) in type checking.
3. Writing third-party library type declarations (`.d.ts`) and using `declare module`.
