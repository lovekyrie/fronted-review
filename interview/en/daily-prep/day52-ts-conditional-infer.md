# Day 52 Conditional Types and infer Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 52 | Conditional / infer | [TypeScript Type Design](../advanced/week5/typescript-design) |

## Today's Goals

- Finish TypeScript Conditional Types
- Handwrite common utility types: `ReturnType / Parameters / Awaited / ExtractPromise`
- Output an answer script for `distributive conditional types`

## Reading Checkpoints

- `T extends U ? X : Y` **distributes** when T is a naked type and is a union
- Wrapping with square brackets as `[T] extends [U] ? X : Y` can **turn off distribution**
- `infer` can only appear on the right-hand side of extends, used to “pull a type out of a structure”

## Cheat Sheet / Knowledge Points

### Conditional type syntax

```ts
T extends U ? X : Y
// If T is assignable to U, the result is X; otherwise Y
```

### Distributive conditional types

```ts
type ToArray<T> = T extends any ? T[] : never

// When T is a union type, it distributes:
type R = ToArray<string | number>
// = (string extends any ? string[] : never) | (number extends any ? number[] : never)
// = string[] | number[]

// Turn off distribution: wrap with []
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type R2 = ToArrayNonDist<string | number>
// = (string | number)[]
```

Distribution condition: it distributes automatically when T is a **naked type parameter** and T is a union type.

### The infer keyword

`infer` can only appear on the right-hand side of a conditional type's `extends`, used to "pull" a type out of a structure.

```ts
// Extract a function's return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Extract a function's parameter types
type Parameters<T> = T extends (...args: infer P) => any ? P : never

// Extract the inner type of a Promise (recursive unwrap)
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// Extract an array element type
type ElementOf<T> = T extends (infer E)[] ? E : never

// Extract the first parameter type
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never
```

### Inference rules for infer in different positions

| Position | Inference result |
|------|----------|
| Covariant position (return value) | Inferred as a union type |
| Contravariant position (parameter) | Inferred as an intersection type |

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never
type R1 = Foo<{ a: string; b: number }>  // string | number (covariant: union)

type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never
type R2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>  // string & number = never (contravariant: intersection)
```

## Handwritten / Flowcharts

### Implementations of common utility types

```ts
// 1. ReturnType
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never

// 2. Parameters
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer P) => any ? P : never

// 3. Awaited (recursively unwrap Promise)
type MyAwaited<T> =
  T extends Promise<infer U> ? MyAwaited<U> : T

// 4. ExtractPromise (extract Promise types from a union)
type ExtractPromise<T> = T extends Promise<any> ? T : never
type R = ExtractPromise<string | Promise<number> | boolean>  // Promise<number>

// 5. Flatten (array flatten type)
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T
type R2 = Flatten<number[][][]>  // number
```

## Oral Questions

### 1. What is a distributive conditional type? When do you need to turn it off?

Answer template:

> When T in the conditional type `T extends U ? X : Y` is a naked type parameter (not wrapped by `[]` / `Promise` and the like), and a union type is passed as T, the condition runs **on each member of the union separately**, then the results are merged. For example, `ToArray<string | number>` yields `string[] | number[]`.
>
> You need to turn off distribution when you want to treat the union as a whole. For example, `IsUnion<T>` checking whether T is a union type needs the `[T] extends [T]` trick. Or if you want `(string | number)[]` instead of `string[] | number[]`, use `[T] extends [any]` to turn off distribution.

### 2. What is the core value of `infer`?

Answer template:

> `infer` lets you **extract a subtype from a complex type**, like pattern matching at the type level. For example, `T extends Promise<infer U>` is asking "if T is a Promise, pull the inner type out and call it U".
>
> Its value is that you do not need to specify the subtype by hand; TypeScript infers it. That makes utility types such as `ReturnType`, `Parameters`, and `Awaited` possible. Advanced uses are recursive infer (such as recursively unwrapping Promise) and using covariance/contravariance rules in different positions.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Conditional type syntax + distribution rules + the `[]` trick to turn off distribution (1.5 minutes)
2. Core idea of infer + 4 examples (ReturnType / Parameters / Awaited / Flatten) (2 minutes)
3. Inference differences in covariant vs contravariant positions (1.5 minutes)

Self-check after recording:

- Did you state the trigger for distributive conditional types (naked type parameter + union).
- Did you state wrapping with `[]` to turn off distribution.
- Did you state that infer can only appear on the right-hand side of extends.
- Did you state that covariant positions infer unions and contravariant positions infer intersections.

## Today's Review

The 3 points that most need follow-up today:

1. Using `infer` in template literal types (for example parsing method and path from `'GET /api/user'`).
2. Depth limits of recursive conditional types (TypeScript defaults to at most 50 levels of recursion).
3. The `NoInfer<T>` utility type (TypeScript 5.4+), which stops a position from participating in inference.
