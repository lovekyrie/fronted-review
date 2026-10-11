# Day 54 Template Literal Types

## Goals

- Finish TypeScript Template Literal Types
- Handwrite string utility types `Join / Split / CamelCase / KebabCase`
- Build a route-parameter type-inference demo: `/user/:id/post/:postId` → `{ id: string; postId: string }`

## Read in order

1. [TypeScript Type Design](../advanced/week5/typescript-design)

## Practice and self-check

**Checkpoints**

- Template literal types use the same `${}` syntax as string literals, but only in type positions
- Often combined with `infer` for pattern extraction
- Watch union distribution: `T extends \`${infer H}.${infer T}\` ? ... : ...`

**Produce or redraw from memory**

- Template literal type syntax — [reference section](../advanced/week5/typescript-design#day-54-template-literal-type-syntax)
- Built-in string utility types — [reference section](../advanced/week5/typescript-design#day-54-built-in-string-utility-types)
- infer + template literals = string pattern matching — [reference section](../advanced/week5/typescript-design#day-54-infer-template-literals-string-pattern-matching)
- Route-parameter type inference — [reference section](../advanced/week5/typescript-design#day-54-route-parameter-type-inference)
- CamelCase — [reference section](../advanced/week5/typescript-design#day-54-camelcase)
- KebabCase — [reference section](../advanced/week5/typescript-design#day-54-kebabcase)
- Join — [reference section](../advanced/week5/typescript-design#day-54-join)
- Practical: event types — [reference section](../advanced/week5/typescript-design#day-54-practical-event-types)

**Answer aloud without reading a reference answer**

- 1. Typical uses of template literal types?
- 2. How do you infer route-parameter types?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Template literal syntax + union distribution + built-in utilities (Capitalize and so on) (1 minute)
2. infer + recursion for string matching (Split / CamelCase) (2 minutes)
3. Practical cases (route-parameter inference / event-name conversion) (2 minutes)

Self-check after recording:

- Did you state that template literals + unions distribute automatically.
- Did you state that infer does pattern matching inside template literals.
- Did you state the recursive approach for route-parameter inference.
- Did you mention built-in utilities such as Capitalize / Uncapitalize.

## Recap

The 3 points that most need follow-up today:

1. Performance issues of template literal types (large union permutations can cause type explosion).
2. Greedy matching rules of `infer` in template literals (left to right, shortest match).
3. Boundaries of template literals in real projects (overly complex type gymnastics hurt IDE performance and maintainability).
