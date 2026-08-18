# Day 51 TypeScript Generics and Constraints Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 51 | Generics | [TypeScript Basics](../advanced/week5/typescript-basic), [TypeScript Type Design](../advanced/week5/typescript-design) |

## Today's Goals

- Finish the Generics chapter of the TypeScript Handbook
- Write 3 generic utility functions: `pick / pluck / deepMerge` (with constraints + inference)
- Output 3 generic-design rules: keep only necessary parameters, constrain with extends, let types infer automatically

## Reading Checkpoints

- Generic parameters themselves can have defaults (`T = string`) and constraints (`T extends ...`)
- Prefer putting function generics in the parameter position so TypeScript infers from arguments, instead of forcing an explicit pass
- `<T extends readonly unknown[]>` is the usual pattern for working with tuples

## Cheat Sheet / Knowledge Points

### Three motivations for using generics

1. **Input-output correlation**: the parameter type determines the return type (`function identity<T>(x: T): T`).
2. **Container abstraction**: generic containers such as `Array<T>`, `Promise<T>`, and `Ref<T>`.
3. **Constrained but flexible**: `extends` limits the range, while the concrete type is decided by the caller.

### Generic constraints

```ts
// Basic constraint
function getLength<T extends { length: number }>(x: T): number {
  return x.length
}

// keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Multiple generics working together
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}
```

### Generic defaults

```ts
type ApiResponse<T = unknown> = {
  code: number
  data: T
  message: string
}
// You can omit the argument: ApiResponse → data: unknown
// Or specify it: ApiResponse<User> → data: User
```

### Inference direction

```ts
// ✅ Let TypeScript infer from arguments; no need to pass the generic manually
function first<T>(arr: T[]): T | undefined { return arr[0] }
const x = first([1, 2, 3])  // T is inferred as number automatically

// ❌ Avoid: forcing the caller to pass the generic manually
const y = first<number>([1, 2, 3])
```

## Handwritten / Flowcharts

### Three generic utility functions

```ts
// 1. pick: pick specified keys from an object
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => { result[key] = obj[key] })
  return result
}

// 2. pluck: extract a key's values from an array of objects
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key])
}

// 3. deepMerge (simplified)
function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const result = { ...target } as T & U
  for (const key in source) {
    const sv = source[key]
    const tv = (result as any)[key]
    if (typeof sv === 'object' && sv !== null && typeof tv === 'object' && tv !== null) {
      (result as any)[key] = deepMerge(tv, sv)
    } else {
      (result as any)[key] = sv
    }
  }
  return result
}
```

### Three generic-design rules

```text
1. Keep only necessary generic parameters — do not require passing what can be inferred
2. Constrain the range with extends — give the generic a boundary so errors are friendlier
3. Let types infer automatically — put generic parameters in the function-argument position
```

## Oral Questions

### 1. When should you add a generic?

Answer template:

> Three scenarios need generics. First, the input and output are type-related — for example, whatever type the function parameter is, the return value is that same type. Second, you are writing a generic container or utility — such as `Array<T>`, `Ref<T>`, or `pick<T, K>`, where you need abstraction while keeping type safety. Third, constrained but flexible — use `extends` to limit the parameter range, while the concrete type is decided by the caller.
>
> Conversely, if the function's parameter and return types are fixed and do not need to be related, you should not add a generic; it only adds unnecessary complexity.

### 2. How many uses does `extends` have in generics?

Answer template:

> Three. First, **generic constraints**: `T extends SomeType` restricts T to a certain structure, such as `T extends { length: number }`. Second, **conditional types**: `T extends U ? X : Y` picks a type branch based on whether T is assignable to U. Third, **keyof constraints**: `K extends keyof T` restricts K to one of T's keys, which is very common in utility types such as pick / getProperty.
>
> Essentially, `extends` in the type system expresses "assignability", not object-oriented "inheritance".

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Three motivations for generics (input-output correlation / container abstraction / constrained but flexible) (1.5 minutes)
2. extends constraints + keyof constraints + multiple generics working together (2 minutes)
3. Inference direction (infer from the parameter position) + defaults + 3 rules (1.5 minutes)

Self-check after recording:

- Did you state the 3 motivations for using generics.
- Did you state the 3 uses of extends.
- Did you state the principle of "let TypeScript infer from arguments".
- Can you handwrite pick's generic signature.

## Today's Review

The 3 points that most need follow-up today:

1. Using generics on classes (`class Container<T> { ... }`).
2. The usual pattern of `<T extends readonly unknown[]>` for tuples.
3. When to choose function overloads vs generics.
