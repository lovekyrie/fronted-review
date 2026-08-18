# Day 53 Mapped Types and keyof Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 53 | Mapped types | [TypeScript Type Design](../advanced/week5/typescript-design) |

## Today's Goals

- Finish TypeScript Mapped Types
- Handwrite `Partial / Required / Readonly / Pick / Record`
- Understand the syntax for removing modifiers with `-readonly` / `-?`

## Reading Checkpoints

- Basic mapped-type syntax: `{ [K in keyof T]: ... }`
- `keyof` behaves the same for interface / type / class, but for `{}` it is `never`
- The `as` clause (remapping) can change key names together with template literal types

## Cheat Sheet / Knowledge Points

### Basic mapped-type syntax

```ts
type Mapped<T> = {
  [K in keyof T]: T[K]  // Iterate all keys of T, keep the value types
}
```

### Adding and removing modifiers

```ts
// Add readonly
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// Remove readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

// Add optional
type Partial<T> = { [K in keyof T]?: T[K] }

// Remove optional
type Required<T> = { [K in keyof T]-?: T[K] }
```

### Key remapping (`as` clause, TypeScript 4.1+)

```ts
// Change key names
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
// { name: string } → { getName: () => string }

// Filter keys (keys that map to never are removed)
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}
// OmitByType<{ a: string; b: number }, string> → { b: number }
```

### Implementations of built-in utility types

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Record<K extends keyof any, T> = { [P in K]: T }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

## Handwritten / Flowcharts

### Handwriting 5 built-in utility types

```ts
// 1. Partial
type MyPartial<T> = { [K in keyof T]?: T[K] }

// 2. Required
type MyRequired<T> = { [K in keyof T]-?: T[K] }

// 3. Readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// 4. Pick
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

// 5. Record
type MyRecord<K extends keyof any, T> = { [P in K]: T }
```

### Recursive DeepPartial

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// Usage
type Config = { db: { host: string; port: number }; debug: boolean }
type PartialConfig = DeepPartial<Config>
// { db?: { host?: string; port?: number }; debug?: boolean }
```

### DeepReadonly

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

### Practical: generating API response types

```ts
// Automatically generate query-parameter types from an interface type
type QueryParams<T> = {
  [K in keyof T as T[K] extends string | number ? K : never]?: T[K]
}

interface User { id: number; name: string; avatar: File }
type UserQuery = QueryParams<User>  // { id?: number; name?: string }
```

## Oral Questions

### 1. What is the implementation difference between Partial and DeepPartial?

Answer template:

> `Partial<T>` only handles the first level: `{ [K in keyof T]?: T[K] }`; nested object properties remain required. `DeepPartial<T>` needs recursion: first check whether `T[K]` is an object type; if so, recurse with `DeepPartial<T[K]>`, otherwise return it as-is.
>
> The key to the implementation is conditional types + recursion: `T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T`. Watch special objects such as arrays and Date — you usually add a branch like `T extends Array<infer U> ? Array<DeepPartial<U>>`.

### 2. When should mapped types be combined with remapping?

Answer template:

> Two scenarios. First, you need to change key names, such as auto-generating getters: `getXxx`, implemented with template literals + the `as` clause. Second, you need to filter keys by value type, such as keeping only properties whose values are string, mapping non-matching keys to `never`; never keys are removed automatically.
>
> Remapping was introduced in TypeScript 4.1. Previously you had to Extract/Exclude keyof first and then Pick; now it can be done in one step, and the code is cleaner.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Mapped-type syntax + the meaning of `[K in keyof T]` (1.5 minutes)
2. Modifiers (adding/removing readonly / ?) + key remapping (`as` clause) (2 minutes)
3. DeepPartial / DeepReadonly recursive approach + a practical case (1.5 minutes)

Self-check after recording:

- Did you state the syntax for removing modifiers with `-readonly` / `-?`.
- Did you state that the `as` clause can rename and filter.
- Did you state that the Deep series needs conditional types + recursion.
- Can you handwrite Partial and Pick.

## Today's Review

The 3 points that most need follow-up today:

1. Different results of `keyof` on `{}` / `object` / `unknown`.
2. Writing Omit with `as` plus `Exclude` in mapped types.
3. Preserving tuple types in mapped types (index signatures need special handling when mapping arrays).
