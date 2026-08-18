# Day 54 Template Literal Types Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 54 | Template literals | [TypeScript Type Design](../advanced/week5/typescript-design) |

## Today's Goals

- Finish TypeScript Template Literal Types
- Handwrite string utility types `Join / Split / CamelCase / KebabCase`
- Build a route-parameter type-inference demo: `/user/:id/post/:postId` → `{ id: string; postId: string }`

## Reading Checkpoints

- Template literal types use the same `${}` syntax as string literals, but only in type positions
- Often combined with `infer` for pattern extraction
- Watch union distribution: `T extends \`${infer H}.${infer T}\` ? ... : ...`

## Cheat Sheet / Knowledge Points

### Template literal type syntax

```ts
type Greeting = `Hello, ${string}`  // matches "Hello, xxx"
type EventName = `on${Capitalize<string>}`  // "onClick" | "onChange" | ...

// Unions distribute automatically
type Color = 'red' | 'blue'
type Size = 'sm' | 'lg'
type Style = `${Color}-${Size}`  // "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
```

### Built-in string utility types

| Type | Role | Example |
|------|------|------|
| `Uppercase<S>` | All uppercase | `'hello'` → `'HELLO'` |
| `Lowercase<S>` | All lowercase | `'HELLO'` → `'hello'` |
| `Capitalize<S>` | Capitalize the first letter | `'hello'` → `'Hello'` |
| `Uncapitalize<S>` | Lowercase the first letter | `'Hello'` → `'hello'` |

### infer + template literals = string pattern matching

```ts
// Extract the first character
type FirstChar<S> = S extends `${infer F}${infer _}` ? F : never

// Split by a delimiter
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]

type R = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

## Handwritten / Flowcharts

### Route-parameter type inference

```ts
type ExtractParams<S extends string> =
  S extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : S extends `${infer _}:${infer Param}`
      ? { [K in Param]: string }
      : {}

type R = ExtractParams<'/user/:id/post/:postId'>
// { id: string; postId: string }
```

### CamelCase

```ts
type CamelCase<S extends string> =
  S extends `${infer H}-${infer T}`
    ? `${Lowercase<H>}${CamelCase<Capitalize<T>>}`
    : S

type R = CamelCase<'foo-bar-baz'>  // 'fooBarBaz'
```

### KebabCase

```ts
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type R = KebabCase<'fooBarBaz'>  // 'foo-bar-baz'
```

### Join

```ts
type Join<T extends string[], D extends string> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? R['length'] extends 0
      ? F
      : `${F}${D}${Join<R, D>}`
    : ''

type R = Join<['a', 'b', 'c'], '.'>  // 'a.b.c'
```

### Practical: event types

```ts
type EventMap = {
  click: { x: number; y: number }
  change: { value: string }
}

type EventHandler<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (payload: T[K]) => void
}

type Handlers = EventHandler<EventMap>
// { onClick: (payload: { x: number; y: number }) => void; onChange: ... }
```

## Oral Questions

### 1. Typical uses of template literal types?

Answer template:

> Three typical scenarios. First, generating union types: combining multiple literal unions into every permutation, such as CSS class names `'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'`. Second, combining with infer for string pattern matching: extracting parameters from route paths, splitting strings, converting naming styles (camelCase ↔ kebab-case). Third, using `as` remapping to generate new key names: for example auto-generating `{ onClick: ... }` from `{ click: ... }`.
>
> Essentially, template literal types give TypeScript's type system "string processing" ability; combined with recursion they can do many things that were previously impossible.

### 2. How do you infer route-parameter types?

Answer template:

> Use template literals + infer + recursion. Match the pattern `${_}:${Param}/${Rest}`, extract the part after `:` and before `/` as the parameter name, then recurse on the remainder. The base cases are `${_}:${Param}` (the last parameter) and returning an empty object when there is no match.
>
> For example, `/user/:id/post/:postId` first matches `id` and the remainder `post/:postId`, then recursion matches `postId`, and they merge into `{ id: string; postId: string }`. The type systems of Next.js and vue-router both use similar tricks.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Template literal syntax + union distribution + built-in utilities (Capitalize and so on) (1 minute)
2. infer + recursion for string matching (Split / CamelCase) (2 minutes)
3. Practical cases (route-parameter inference / event-name conversion) (2 minutes)

Self-check after recording:

- Did you state that template literals + unions distribute automatically.
- Did you state that infer does pattern matching inside template literals.
- Did you state the recursive approach for route-parameter inference.
- Did you mention built-in utilities such as Capitalize / Uncapitalize.

## Today's Review

The 3 points that most need follow-up today:

1. Performance issues of template literal types (large union permutations can cause type explosion).
2. Greedy matching rules of `infer` in template literals (left to right, shortest match).
3. Boundaries of template literals in real projects (overly complex type gymnastics hurt IDE performance and maintainability).
