# Day 56 TypeScript Type Design Practice + Follow-up Review

## Goals

- Pick a component or function (form / table / fetch wrapper) and do type design in TypeScript
- Summarize Day 50–55 into a *TypeScript Track 15-Question Answer Book*
- Output an answer script for “why type design ≠ being able to write TypeScript”

## Read in order

1. [Week 5 Roadmap](../advanced/week5/roadmap)
2. [TypeScript Basics](../advanced/week5/typescript-basic)
3. [TypeScript Type Design](../advanced/week5/typescript-design)

## Practice and self-check

**Checkpoints**

- Type design cares about **the caller experience of the interface**, not “it can run”
- Inference > explicit annotations; callers should not have to pass generics by hand
- “Avoid any” is not the goal; “make errors show up at the call site instead of inside the library” is

**Produce or redraw from memory**

- 5 principles of type design
- Typical anti-patterns
- Impossible states should be inexpressible
- Strongly typed EventEmitter
- Strongly typed fetch wrapper

**Answer aloud without reading a reference answer**

- 1. What should a good TypeScript API look like?
- 2. What techniques have you used to "make errors surface as early as possible"?

**Mock format and scoring**

### 5 principles of type design

1. **Inference first**: let TypeScript infer automatically and reduce manual annotations. Use inference inside functions; annotate at the boundary (parameters/return values).
2. **Narrow types beat wide types**: use `'success' | 'error'` instead of `string`, and discriminated unions instead of optional properties.
3. **Impossible states should be inexpressible**: use the type system to exclude illegal combinations (for example loading and error cannot both be true).
4. **Errors should surface at the call site**: generic constraints + conditional types make error messages appear where the user writes code, not inside the library.
5. **Minimal surface area**: export only necessary types; keep internal implementation types as `type` rather than `export type`.

### Typical anti-patterns

| Anti-pattern | Problem | Fix |
|--------|------|------|
| `any` everywhere | Lose type safety | Use `unknown` + narrowing |
| Overusing `as` assertions | Lying to the compiler | Improve type definitions |
| Abusing optional properties | Unclear state | Discriminated union |
| Too many generic parameters | Callers get confused | Use inference to reduce parameters |
| Types split from implementation | Types and code diverge | Extract from implementation with `typeof` / `satisfies` |

### Impossible states should be inexpressible

[Reference code](../advanced/week5/typescript-design#day-56-practice-code)

### Strongly typed EventEmitter

[Reference code](../advanced/week5/typescript-design#day-56-practice-code)

### Strongly typed fetch wrapper

[Reference code](../advanced/week5/typescript-design#day-56-practice-code)

**Recording drill**

1. Type basics (type vs interface / union narrowing / as const) (1.5 minutes)
2. Generics (3 motivations / extends constraints / inference direction) (2 minutes)
3. Conditional types + infer (distribution rules / ReturnType / Awaited implementations) (2 minutes)
4. Mapped types + template literals (modifiers / remapping / route-parameter inference) (1.5 minutes)
5. 3 type-design principles (inference first / narrow types / impossible states inexpressible) (1 minute)

## Recap

The 3 TypeScript questions most likely to trip you up:

1. "Handwrite the Omit type" — you need to state the Pick + Exclude composition, not just recite the result.
2. "When do distributive conditional types trigger? How do you turn them off?" — you need to state naked type parameter + wrapping with `[]`.
3. "Design types for a real scenario (such as a fetch wrapper)" — you need to write the full generic + conditional-type signature on the spot.

3 new "why" questions added this week:

1. Why did TypeScript choose structural typing instead of nominal typing? (It matches JavaScript's duck typing)
2. Why do utility types only need mapped + conditional + infer as underlying techniques? (They form a Turing-complete subset at the type level)
3. Why is "inference first" a good API design principle? (Reduces caller burden + avoids annotations drifting from actual values)
