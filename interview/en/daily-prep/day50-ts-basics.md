# Day 50 TypeScript Basics / Literals / Union / Intersection Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 50 | Type basics | [TypeScript Basics](../advanced/week5/typescript-basic) |

## Today's Goals

- Finish the opening of Types from Types in the TypeScript Handbook
- Produce a type / interface difference comparison table
- Write 5 small demos: literal types / union / intersection / literal widening / as const

## Reading Checkpoints

- `interface` supports declaration merging; `type` does not, but `type` can express unions and tuples
- Narrowing unions needs typeof / instanceof / in / discriminated union
- `as const` turns off literal widening and gives you the most precise literal types

## Cheat Sheet / Knowledge Points

### type vs interface

| Dimension | `type` | `interface` |
|------|--------|-------------|
| Union types | ✅ `type A = B \| C` | ❌ |
| Intersection types | ✅ `type A = B & C` | ✅ extends multiple |
| Tuples | ✅ `type T = [string, number]` | ❌ |
| Declaration merging | ❌ | ✅ same name merges automatically |
| Computed properties | ✅ mapped types | ❌ |
| extends | ❌ | ✅ `interface A extends B` |

How to choose: use `interface` for object shapes (extensible); use `type` for unions, tuples, and utility types.

### Literal types + widening

```ts
let a = 'hello'        // type: string (widened)
const b = 'hello'      // type: 'hello' (literal)
const c = { x: 1 }     // type: { x: number } (object fields widen)
const d = { x: 1 } as const  // type: { readonly x: 1 } (as const locks it)
```

### Union narrowing

```ts
// typeof
function fn(x: string | number) {
  if (typeof x === 'string') { /* x: string */ }
}

// instanceof
if (x instanceof Date) { /* x: Date */ }

// in
if ('name' in x) { /* x: { name: ... } */ }

// discriminated union (most recommended)
type Result = { ok: true; data: string } | { ok: false; error: string }
function handle(r: Result) {
  if (r.ok) { r.data }    // TypeScript narrows automatically
  else { r.error }
}
```

### Intersection types

```ts
type A = { name: string }
type B = { age: number }
type C = A & B  // { name: string; age: number }

// Note: intersecting primitive types yields never
type D = string & number  // never
```

## Handwritten / Flowcharts

### 5 demos

```ts
// 1. Literal types
type Direction = 'up' | 'down' | 'left' | 'right'

// 2. as const
const routes = ['/', '/about', '/contact'] as const
type Route = (typeof routes)[number]  // '/' | '/about' | '/contact'

// 3. discriminated union
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2
    case 'rect': return s.width * s.height
  }
}

// 4. Merge with an intersection type
type WithTimestamp<T> = T & { createdAt: Date; updatedAt: Date }
type User = WithTimestamp<{ name: string; email: string }>

// 5. exhaustive check
function assertNever(x: never): never {
  throw new Error('Unexpected: ' + x)
}
```

## Oral Questions

### 1. How do you choose type vs interface?

Answer template:

> My rule is “object shapes use interface, everything else uses type”. interface supports declaration merging (convenient when extending third-party library types) and extends inheritance, so semantically it fits “what this thing looks like”. type fits unions, tuples, mapped types, and other things interface cannot do.
>
> In a real project, a team-wide “always use type” is also fine; for describing object shapes the two are basically equivalent. The key is consistency. After TypeScript 4.x the performance difference is already small.

### 2. Why is a discriminated union better than a plain union?

Answer template:

> A plain union can only be narrowed with typeof / instanceof / in, which is hard to do precisely for complex object types. A discriminated union uses a shared “tag field” (such as `kind` / `type` / `ok`); TypeScript can automatically narrow to the concrete branch from the tag value.
>
> Three benefits. First, TypeScript infers automatically; you do not need assertions. Second, with switch + exhaustive check (`default: assertNever(x)`), forgetting to handle a new branch becomes a compile error. Third, readability is good: the tag tells you which case it is. API responses, state machines, and Redux actions in real projects all fit this well.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. type vs interface comparison + selection rule (1.5 minutes)
2. Literal types + widening + as const (1.5 minutes)
3. Four narrowing methods + discriminated union + exhaustive check (2 minutes)

Self-check after recording:

- Did you state that interface supports declaration merging and type supports unions and tuples.
- Did you state that as const turns off widening.
- Did you state that a discriminated union narrows via a tag field.
- Did you state how to write an exhaustive check.

## Today's Review

The 3 points that most need follow-up today:

1. Difference between `unknown` and `any` (unknown is the type-safe any; you must narrow before use).
2. When to use `never` (exhaustive check, unreachable branches, empty unions).
3. Trade-off between `enum` and union types (unions are lighter; enums have a runtime value).
