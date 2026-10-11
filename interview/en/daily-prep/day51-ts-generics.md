# Day 51 TypeScript Generics and Constraints

## Goals

- Finish the Generics chapter of the TypeScript Handbook
- Write 3 generic utility functions: `pick / pluck / deepMerge` (with constraints + inference)
- Output 3 generic-design rules: keep only necessary parameters, constrain with extends, let types infer automatically

## Read in order

1. [TypeScript Basics](../advanced/week5/typescript-basic)
2. [TypeScript Type Design](../advanced/week5/typescript-design)

## Practice and self-check

**Checkpoints**

- Generic parameters themselves can have defaults (`T = string`) and constraints (`T extends ...`)
- Prefer putting function generics in the parameter position so TypeScript infers from arguments, instead of forcing an explicit pass
- `<T extends readonly unknown[]>` is the usual pattern for working with tuples

**Produce or redraw from memory**

- Three motivations for using generics — [reference section](../advanced/week5/typescript-basic#day-51-three-motivations-for-using-generics)
- Generic constraints — [reference section](../advanced/week5/typescript-basic#day-51-generic-constraints)
- Generic defaults — [reference section](../advanced/week5/typescript-basic#day-51-generic-defaults)
- Inference direction — [reference section](../advanced/week5/typescript-basic#day-51-inference-direction)
- Three generic utility functions — [reference section](../advanced/week5/typescript-basic#day-51-three-generic-utility-functions)
- Three generic-design rules — [reference section](../advanced/week5/typescript-design#day-51-three-generic-design-rules)

**Answer aloud without reading a reference answer**

- 1. When should you add a generic?
- 2. How many uses does `extends` have in generics?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Three motivations for generics (input-output correlation / container abstraction / constrained but flexible) (1.5 minutes)
2. extends constraints + keyof constraints + multiple generics working together (2 minutes)
3. Inference direction (infer from the parameter position) + defaults + 3 rules (1.5 minutes)

Self-check after recording:

- Did you state the 3 motivations for using generics.
- Did you state the 3 uses of extends.
- Did you state the principle of "let TypeScript infer from arguments".
- Can you handwrite pick's generic signature.

## Recap

The 3 points that most need follow-up today:

1. Using generics on classes (`class Container<T> { ... }`).
2. The usual pattern of `<T extends readonly unknown[]>` for tuples.
3. When to choose function overloads vs generics.
