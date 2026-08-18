# Day 55 Handwriting Utility Types + JS → TS Migration Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 55 | Utility types | [TypeScript Type Design](../advanced/week5/typescript-design), [TypeScript Basics](../advanced/week5/typescript-basic) |

## Today's Goals

- Handwrite 15 common utility types: `Partial / Required / Readonly / Pick / Omit / Exclude / Extract / NonNullable / ReturnType / Parameters / Awaited / Record / ConstructorParameters / ThisParameterType / OmitThisParameter`
- Rewrite 2 JS examples in `hand-write/` into strict TypeScript versions
- Output a JS → TS migration checklist

## Reading Checkpoints

- Internally `Omit` is `Pick<T, Exclude<keyof T, K>>`, not native built-in magic
- `Exclude` / `Extract` are based on distributive conditional types
- When migrating JS to TypeScript, prioritize filling in API-boundary types; let function bodies use inference

## Cheat Sheet / Knowledge Points

### 15 utility types in 5 groups

| Group | Type | One-liner |
|------|------|--------|
| **Property modifiers** | `Partial<T>` | Make every property optional |
| | `Required<T>` | Make every property required |
| | `Readonly<T>` | Make every property readonly |
| **Selection** | `Pick<T, K>` | Pick properties of T corresponding to K |
| | `Omit<T, K>` | Omit properties of T corresponding to K |
| | `Record<K, T>` | Build an object whose keys are K and values are T |
| **Union operations** | `Exclude<U, E>` | Remove E from union U |
| | `Extract<U, E>` | Extract E from union U |
| | `NonNullable<T>` | Remove null and undefined |
| **Functions** | `ReturnType<T>` | Extract a function's return type |
| | `Parameters<T>` | Extract a function's parameter tuple |
| | `ConstructorParameters<T>` | Extract constructor parameters |
| | `ThisParameterType<T>` | Extract the this parameter type |
| | `OmitThisParameter<T>` | Remove the this parameter |
| **Async** | `Awaited<T>` | Recursively unwrap Promise |

### Classification by underlying implementation

```text
Based on mapped types: Partial / Required / Readonly / Pick / Record
Based on conditional types (distributive): Exclude / Extract / NonNullable
Based on conditional types + infer: ReturnType / Parameters / Awaited / ConstructorParameters
Composition: Omit = Pick + Exclude
```

## Handwritten / Flowcharts

### Implementations of 15 utility types

```ts
// Property modifiers
type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyRequired<T> = { [K in keyof T]-?: T[K] }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// Selection
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>
type MyRecord<K extends keyof any, T> = { [P in K]: T }

// Union operations (distributive conditional types)
type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never
type MyNonNullable<T> = T extends null | undefined ? never : T

// Functions (infer)
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never
type MyParameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never
type MyThisParameterType<T> =
  T extends (this: infer U, ...args: any) => any ? U : unknown
type MyOmitThisParameter<T> =
  T extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : T

// Async (recursive infer)
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
```

### JS → TS migration checklist

```text
1. Enable strict mode (tsconfig.json: "strict": true)
2. Start from API boundaries: function parameters + return values + props interfaces
3. Replace any with unknown, then narrow step by step
4. Define core business types (User / Order / ApiResponse)
5. Use typeof / ReturnType / Parameters to extract types from runtime code
6. Configure ESLint TypeScript rules (no-explicit-any / strict-boolean-expressions)
7. Incremental: first .js → .ts, then fill in types gradually
```

## Oral Questions

### 1. How do you implement the 5 utility types you use most?

Answer template:

> `Partial<T>` uses a mapped type `{ [K in keyof T]?: T[K] }`, iterating all keys and adding `?`. `Pick<T, K>` is also a mapped type `{ [P in K]: T[P] }`, but it only iterates the passed-in K. `Omit<T, K>` is composition: first `Exclude<keyof T, K>` to exclude from the key union, then `Pick`.
>
> `Exclude<T, U>` is based on distributive conditional types: `T extends U ? never : T`; after the union distributes, members matching U become never and are removed. `ReturnType<T>` uses a conditional type + infer: `T extends (...args: any) => infer R ? R : never`, extracting the return type from the function signature.
>
> There are essentially three techniques: mapped types for property transforms, distributive conditionals for union filtering, and infer for structural extraction.

### 2. Where do you start when converting JS to TypeScript?

Answer template:

> Change API boundaries first, then internal implementations. Concrete steps: first, turn on strict mode so TypeScript reports every implicit any. Second, define core business types (User / Order and the like), because they are referenced everywhere. Third, add types to function signatures — parameters and return values; TypeScript can usually infer inside the function. Fourth, replace any with unknown, forcing yourself to narrow before use.
>
> The key principle is incremental: do not convert everything at once. First rename .js → .ts, tolerate some any, and change a portion in each PR. Prioritize the most depended-on modules (utils / api / types) for the biggest effect.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. The 5-group classification of utility types + the three underlying techniques (mapped / distributive / infer) (2 minutes)
2. Handwrite the three implementations of Partial / Omit / ReturnType (1.5 minutes)
3. JS → TS migration flow (start from boundaries + incremental) (1.5 minutes)

Self-check after recording:

- Did you state the three underlying techniques: mapped types, distributive conditionals, infer.
- Did you state the composition Omit = Pick + Exclude.
- Did you state that JS-to-TS starts with API boundaries.
- Did you state the importance of enabling strict mode.

## Today's Review

The 3 points that most need follow-up today:

1. Real use cases for `ConstructorParameters` and `InstanceType` (factory functions, DI containers).
2. Clever uses of the `satisfies` operator (TypeScript 4.9+) in type checking.
3. Writing third-party library type declarations (`.d.ts`) and using `declare module`.
