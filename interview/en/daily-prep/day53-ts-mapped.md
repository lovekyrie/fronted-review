# Day 53 Mapped Types and keyof

## Goals

- Finish TypeScript Mapped Types
- Handwrite `Partial / Required / Readonly / Pick / Record`
- Understand the syntax for removing modifiers with `-readonly` / `-?`

## Read in order

1. [TypeScript Type Design](../advanced/week5/typescript-design)

## Practice and self-check

**Checkpoints**

- Basic mapped-type syntax: `{ [K in keyof T]: ... }`
- `keyof` behaves the same for interface / type / class, but for `{}` it is `never`
- The `as` clause (remapping) can change key names together with template literal types

**Produce or redraw from memory**

- Basic mapped-type syntax — [reference section](../advanced/week5/typescript-design#day-53-basic-mapped-type-syntax)
- Adding and removing modifiers — [reference section](../advanced/week5/typescript-design#day-53-adding-and-removing-modifiers)
- Key remapping (`as` clause, TypeScript 4.1+) — [reference section](../advanced/week5/typescript-design#day-53-key-remapping-as-clause-typescript-4-1)
- Implementations of built-in utility types — [reference section](../advanced/week5/typescript-design#day-53-implementations-of-built-in-utility-types)
- Handwriting 5 built-in utility types — [reference section](../advanced/week5/typescript-design#day-53-handwriting-5-built-in-utility-types)
- Recursive DeepPartial — [reference section](../advanced/week5/typescript-design#day-53-recursive-deeppartial)
- DeepReadonly — [reference section](../advanced/week5/typescript-design#day-53-deepreadonly)
- Practical: generating API response types — [reference section](../advanced/week5/typescript-design#day-53-practical-generating-api-response-types)

**Answer aloud without reading a reference answer**

- 1. What is the implementation difference between Partial and DeepPartial?
- 2. When should mapped types be combined with remapping?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Mapped-type syntax + the meaning of `[K in keyof T]` (1.5 minutes)
2. Modifiers (adding/removing readonly / ?) + key remapping (`as` clause) (2 minutes)
3. DeepPartial / DeepReadonly recursive approach + a practical case (1.5 minutes)

Self-check after recording:

- Did you state the syntax for removing modifiers with `-readonly` / `-?`.
- Did you state that the `as` clause can rename and filter.
- Did you state that the Deep series needs conditional types + recursion.
- Can you handwrite Partial and Pick.

## Recap

The 3 points that most need follow-up today:

1. Different results of `keyof` on `{}` / `object` / `unknown`.
2. Writing Omit with `as` plus `Exclude` in mapped types.
3. Preserving tuple types in mapped types (index signatures need special handling when mapping arrays).
