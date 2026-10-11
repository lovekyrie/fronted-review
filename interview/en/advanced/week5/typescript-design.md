### TypeScript Type Design

If `week5-typescript-basic` is about “what core TypeScript capabilities exist”, this piece is more about:

- how to turn those capabilities into type design in a real project
- how to design APIs that feel better for callers
- how to avoid “types look strong, but they are not actually usable”

In senior frontend interviews, what usually separates people is not whether you can write `keyof`, but whether you can use the type system for business modeling and API design.

#### 1. Goals of type design

A good type design usually satisfies all of these:

1. **it can express business constraints**
2. **it lets common calls infer automatically**
3. **it surfaces errors as early as possible**
4. **it does not force callers to write `as` everywhere**
5. **it remains maintainable as the business evolves**

A lot of “advanced type gymnastics” has low value in real projects because they satisfy item 3, but break items 2 and 5.

#### 2. Design data models first, then utility types

The easiest place for type design to go wrong is jumping straight to complex generics without first splitting the business model clearly.

A more solid order is usually:

1. define domain objects
2. define state branches
3. then define derived types and utility types

For example a user module, do not let one type rule everything:

```ts
type ApiUser = {
  id: number
  user_name: string
  user_email: string
  created_at: string
}

type User = {
  id: number
  name: string
  email: string
  createdAt: Date
}

type UserFormValues = {
  name: string
  email: string
}
```

This is much more stable than letting `ApiUser` run straight through the API layer, state layer, form layer, and view layer.

#### 3. Prefer discriminated unions over “an optional-field grab bag”

A lot of business state is naturally a finite state machine.

Do not write it like this:

```ts
type UserState = {
  loading?: boolean
  data?: User
  error?: string
}
```

Because it allows many meaningless combinations, such as:

- `loading: true` while also having `data`
- `error` and `data` existing at the same time

A more solid write-up is a discriminated union:

```ts
type UserState
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: User }
    | { status: 'error'; error: string }
```

Benefits:

- branches are clearer
- component rendering is safer
- exhaustive checks are easier

#### 4. Type design for component APIs

In senior frontend work, a lot of type-design skill shows up in component APIs.

##### 4.1 Props should not be “it can be this and that” with no constraints

Bad example:

```ts
type ButtonProps = {
  href?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
}
```

This allows many combinations with unclear meaning.

A more solid way is to split modes with a union:

```ts
type ButtonAsLink = {
  kind: 'link'
  href: string
  onClick?: never
}

type ButtonAsAction = {
  kind: 'button'
  onClick: () => void
  href?: never
}

type ButtonProps = {
  loading?: boolean
  disabled?: boolean
} & (ButtonAsLink | ButtonAsAction)
```

Then the component can restrict illegal combinations at the type layer.

##### 4.2 Use generics to keep caller information

For example a table component:

```ts
type Column<T> = {
  key: keyof T
  title: string
  render?: (value: T[keyof T], record: T) => string
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
}
```

When calling:

```ts
type User = {
  id: number
  name: string
}

const props: TableProps<User> = {
  data: [{ id: 1, name: 'Alice' }],
  columns: [
    { key: 'name', title: 'Name' },
  ],
}
```

The core of this kind of generic component is not “you wrote `<T>`”, but keeping column config and the data structure in sync.

#### 5. Type design for custom hooks

The most important thing in hook type design is that callers write as few extra annotations as possible.

##### 5.1 Let the return value be inferred

```ts
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)

  function toggle() {
    setValue(v => !v)
  }

  return [value, toggle] as const
}
```

The value of `as const` here is keeping tuple semantics. Otherwise the return is more easily inferred as a plain array.

##### 5.2 Describe async hook state with a discriminated union

```ts
type AsyncState<T>
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error }

function useRequest<T>(request: () => Promise<T>): AsyncState<T> {
  // ...
  return { status: 'idle' }
}
```

Compared with returning:

```ts
{
  data?: T
  loading: boolean
  error?: Error
}
```

A discriminated union is a better fit for driving UI branches.

#### 6. “Constraining callers” is not “forcing callers to write lots of types”

This is a very important point in type design.

If an API is designed like this:

```ts
doSomething<User, UserPayload, UserResponse, UserError>(...)
```

It usually means the type system did not take complexity off the caller, and instead exposed that complexity.

A better direction:

- infer from arguments as much as possible
- expose generics only when necessary
- defaults and overloads should serve call-site experience

#### 7. Common design tools

##### 7.1 `keyof` + indexed access

```ts
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(key => obj[key])
}
```

##### 7.2 Conditional types for pattern branching

```ts
type ValueType<T>
  = T extends { value: infer V } ? V : never
```

##### 7.3 Mapped types for structure transforms

```ts
type FormErrors<T> = {
  [K in keyof T]?: string
}
```

##### 7.4 Template literal types for naming constraints

```ts
type EventName<T extends string> = `on${Capitalize<T>}`
```

These capabilities themselves are not the point. The point is knowing when to use them to constrain a real API.

#### 8. Common type-design anti-patterns

##### 8.1 Catch-all `any`

Once a public API uses `any`, downstream basically loses type protection.

##### 8.2 Assertions everywhere

```ts
const user = data as User
```

If this is everywhere in the project, the design never really established a trusted boundary.

##### 8.3 Using complex types to hide a bad model

If the business model itself is messy, complex types only make the problem harder to maintain.

##### 8.4 Not layering internal and external models

Feeding backend DTOs straight to UI, forms, and state machines couples the whole system very tightly.

#### 9. How to answer “how do you use TypeScript in the project”

In senior interviews, rather than “I used interfaces, generics, and utility types”, a better answer is:

1. I first model the API layer, domain layer, and form layer separately
2. I use discriminated unions for state flows, to avoid illegal state combinations
3. For public APIs of components and hooks, I prioritize inference-friendly design
4. For high-risk input I start with `unknown`, then add runtime validation
5. For complex cases I add constraints with conditional types, mapped types, and template literal types

#### 10. High-frequency interview questions

##### 10.1 What is an “inference-friendly” API

In most cases the caller does not need to write too many generics or assertions. Types come naturally from arguments and context.

##### 10.2 Why a discriminated union is more stable than multiple optional fields

Because it collapses state combinations into a finite set, avoiding object shapes that contradict themselves semantically.

##### 10.3 Why type design should layer models first

Because API responses, frontend state, form editing, and UI display have different concerns. Sharing one type directly causes coupling and semantic mess.

##### 10.4 How type design relates to runtime validation

Type design owns modeling and constraints at development time. Runtime validation owns untrusted input. They complement each other and cannot replace each other.

## Daily practice reference

### Day 51: Three generic-design rules

```text
1. Keep only necessary generic parameters — do not require passing what can be inferred
2. Constrain the range with extends — give the generic a boundary so errors are friendlier
3. Let types infer automatically — put generic parameters in the function-argument position
```

### Day 52: Conditional type syntax

```ts
T extends U ? X : Y
// If T is assignable to U, the result is X; otherwise Y
```

### Day 52: Distributive conditional types

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

### Day 52: The infer keyword

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

### Day 52: Inference rules for infer in different positions

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

### Day 52: Implementations of common utility types

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

### Day 53: Basic mapped-type syntax

```ts
type Mapped<T> = {
  [K in keyof T]: T[K]  // Iterate all keys of T, keep the value types
}
```

### Day 53: Adding and removing modifiers

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

### Day 53: Key remapping (`as` clause, TypeScript 4.1+)

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

### Day 53: Implementations of built-in utility types

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Record<K extends keyof any, T> = { [P in K]: T }
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

### Day 53: Handwriting 5 built-in utility types

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

### Day 53: Recursive DeepPartial

```ts
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// Usage
type Config = { db: { host: string; port: number }; debug: boolean }
type PartialConfig = DeepPartial<Config>
// { db?: { host?: string; port?: number }; debug?: boolean }
```

### Day 53: DeepReadonly

```ts
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T
```

### Day 53: Practical: generating API response types

```ts
// Automatically generate query-parameter types from an interface type
type QueryParams<T> = {
  [K in keyof T as T[K] extends string | number ? K : never]?: T[K]
}

interface User { id: number; name: string; avatar: File }
type UserQuery = QueryParams<User>  // { id?: number; name?: string }
```

### Day 54: Template literal type syntax

```ts
type Greeting = `Hello, ${string}`  // matches "Hello, xxx"
type EventName = `on${Capitalize<string>}`  // "onClick" | "onChange" | ...

// Unions distribute automatically
type Color = 'red' | 'blue'
type Size = 'sm' | 'lg'
type Style = `${Color}-${Size}`  // "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
```

### Day 54: Built-in string utility types

| Type | Role | Example |
|------|------|------|
| `Uppercase<S>` | All uppercase | `'hello'` → `'HELLO'` |
| `Lowercase<S>` | All lowercase | `'HELLO'` → `'hello'` |
| `Capitalize<S>` | Capitalize the first letter | `'hello'` → `'Hello'` |
| `Uncapitalize<S>` | Lowercase the first letter | `'Hello'` → `'hello'` |

### Day 54: infer + template literals = string pattern matching

```ts
// Extract the first character
type FirstChar<S> = S extends `${infer F}${infer _}` ? F : never

// Split by a delimiter
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]

type R = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

### Day 54: Route-parameter type inference

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

### Day 54: CamelCase

```ts
type CamelCase<S extends string> =
  S extends `${infer H}-${infer T}`
    ? `${Lowercase<H>}${CamelCase<Capitalize<T>>}`
    : S

type R = CamelCase<'foo-bar-baz'>  // 'fooBarBaz'
```

### Day 54: KebabCase

```ts
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type R = KebabCase<'fooBarBaz'>  // 'foo-bar-baz'
```

### Day 54: Join

```ts
type Join<T extends string[], D extends string> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? R['length'] extends 0
      ? F
      : `${F}${D}${Join<R, D>}`
    : ''

type R = Join<['a', 'b', 'c'], '.'>  // 'a.b.c'
```

### Day 54: Practical: event types

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

### Day 55: 15 utility types in 5 groups

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

### Day 55: Classification by underlying implementation

```text
Based on mapped types: Partial / Required / Readonly / Pick / Record
Based on conditional types (distributive): Exclude / Extract / NonNullable
Based on conditional types + infer: ReturnType / Parameters / Awaited / ConstructorParameters
Composition: Omit = Pick + Exclude
```

### Day 55: Implementations of 15 utility types

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

### Day 55: JS → TS migration checklist

```text
1. Enable strict mode (tsconfig.json: "strict": true)
2. Start from API boundaries: function parameters + return values + props interfaces
3. Replace any with unknown, then narrow step by step
4. Define core business types (User / Order / ApiResponse)
5. Use typeof / ReturnType / Parameters to extract types from runtime code
6. Configure ESLint TypeScript rules (no-explicit-any / strict-boolean-expressions)
7. Incremental: first .js → .ts, then fill in types gradually
```

## Day 56 practice code

```ts
// ❌ Anti-pattern: loading + error + data can combine arbitrarily
type BadState = {
  loading: boolean
  error: string | null
  data: User | null
}

// ✅ Correct: use a discriminated union; each state only contains legal properties
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: User }
```

```ts
type EventMap = {
  login: { userId: string; timestamp: number }
  logout: void
  error: { code: number; message: string }
}

class TypedEmitter<T extends Record<string, any>> {
  private handlers = new Map<keyof T, Set<Function>>()

  on<K extends keyof T>(
    event: K,
    handler: T[K] extends void ? () => void : (payload: T[K]) => void
  ) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler)
    return () => this.handlers.get(event)?.delete(handler)
  }

  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [payload: T[K]]
  ) {
    this.handlers.get(event)?.forEach(fn => fn(...args))
  }
}

const emitter = new TypedEmitter<EventMap>()
emitter.on('login', (payload) => { /* payload: { userId, timestamp } */ })
emitter.emit('login', { userId: '1', timestamp: Date.now() })
emitter.emit('logout')  // no arguments
```

```ts
type ApiRoutes = {
  'GET /users': { response: User[]; query: { page: number } }
  'GET /users/:id': { response: User; params: { id: string } }
  'POST /users': { response: User; body: CreateUserDto }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

function api<K extends keyof ApiRoutes>(
  route: K,
  ...args: ApiRoutes[K] extends { body: infer B }
    ? [options: { body: B }]
    : ApiRoutes[K] extends { query: infer Q }
      ? [options?: { query: Q }]
      : []
): Promise<ApiRoutes[K]['response']> {
  // implementation...
  return {} as any
}

// Full type hints at the call site
const users = await api('GET /users', { query: { page: 1 } })
```
