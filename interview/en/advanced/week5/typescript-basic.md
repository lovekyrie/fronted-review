### TypeScript

In senior frontend interviews, TypeScript is not about whether you can write type annotations. What matters is:

- whether you understand TypeScript's boundaries
- whether you can use the type system to constrain business models
- whether you can design APIs that are inferable, reusable, and maintainable

If the answer stops at "strings, numbers, interfaces, enums, generics", the depth is usually not enough. A more effective way to prepare is to treat TypeScript as a **static modeling tool**, not as extra JavaScript syntax questions.

#### 1. What problem does TypeScript actually solve

TypeScript is not there to "make code more complicated". It exists so you can catch the following problems as early as possible during development:

- wrong argument types
- return values that do not match expectations
- inconsistent object shapes
- missed state branches
- callers silently breaking after a refactor

Its essence is: **turn some errors into compile-time errors before runtime.**

But you also need to be clear about the boundaries:

- TypeScript mainly works at compile time
- it does not replace runtime validation
- it does not make data from the backend inherently trustworthy

So a more accurate statement is: TypeScript improves "development-time type safety", not "completely eliminating bugs".

#### 2. A few basic TypeScript boundaries

##### 2.1 `any`, `unknown`, `never`

These three types are the basics interviewers most often push deeper on.

```ts
let valueAny: any = 'hello'
valueAny.trim()
valueAny.notExist.deep.call()

let valueUnknown: unknown = 'hello'
// valueUnknown.trim() // error

if (typeof valueUnknown === 'string') {
  valueUnknown.trim()
}

function fail(message: string): never {
  throw new Error(message)
}
```

- `any`: giving up on the type system, almost equivalent to telling the compiler "leave me alone"
- `unknown`: the safe top type; you must narrow it before use
- `never`: a type that can never be reached, common in throwing functions, infinite loops, and exhaustive checks

In senior projects, `unknown` is usually worth preferring over `any`, because it forces you to narrow types explicitly.

##### 2.2 TypeScript is a structural type system

TypeScript cares about "whether the structures are compatible", not "whether they are the same nominal type".

```ts
interface Point2D {
  x: number
  y: number
}

const p = { x: 1, y: 2, z: 3 }

const point: Point2D = p
```

Because `p` at least satisfies the structure `Point2D` requires, the assignment is allowed.

This flexibility is a benefit, but it also means you need to be clearer about which fields are the "minimum necessary structure", and which ones must be "explicitly distinguished for business reasons".

#### 3. Narrowing matters more than assertions

Many beginners reach for `as` as soon as they hit an error. That is a bad habit. Senior interviews usually care more about whether you can use "type narrowing" instead of "forcing an assertion".

##### 3.1 Common narrowing techniques

```ts
function printId(id: string | number) {
  if (typeof id === 'string') {
    return id.toUpperCase()
  }

  return id.toFixed(0)
}
```

Besides `typeof`, these are also common:

- `instanceof`
- `in`
- discriminant fields
- user-defined type predicates

##### 3.2 Custom type guards

```ts
type User = {
  name: string
}

function isUser(value: unknown): value is User {
  return typeof value === 'object'
    && value !== null
    && 'name' in value
}
```

This is especially important when handling API responses, URL parameters, and third-party input.

##### 3.3 Exhaustive checks

```ts
type RequestState
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: string[] }
    | { status: 'error'; message: string }

function renderState(state: RequestState) {
  switch (state.status) {
    case 'idle':
      return 'idle'
    case 'loading':
      return 'loading'
    case 'success':
      return state.data.join(',')
    case 'error':
      return state.message
    default: {
      const _exhaustiveCheck: never = state
      return _exhaustiveCheck
    }
  }
}
```

This style is very useful in state management, API state machines, and component render branches.

#### 4. How to choose between `type` and `interface`

This question is almost guaranteed, but do not just memorize "interfaces can merge, types cannot".

##### 4.1 `interface` is a better fit for

- describing object shapes
- being implemented by classes
- declaration merging

##### 4.2 `type` is a better fit for

- union types
- intersection types
- conditional types
- mapped types
- template literal types

```ts
interface User {
  id: number
  name: string
}

type UserStatus = 'active' | 'disabled'
type UserWithStatus = User & { status: UserStatus }
```

A more engineering-minded answer is: **prefer `interface` when describing object contracts, and prefer `type` when expressing composition, transformation, and unions.**

#### 5. Generics are not about writing `<T>`

The real value of generics is: **keep type constraints while preserving information.**

##### 5.1 Basic generics

```ts
function identity<T>(value: T): T {
  return value
}
```

This is only the starting point. Senior interviews prefer to follow up on generic constraints and inference.

##### 5.2 Generic constraints

```ts
function getLength<T extends { length: number }>(value: T) {
  return value.length
}
```

`extends` here is not inheritance. It means "constrain T to at least satisfy some structure".

##### 5.3 Multiple generic parameters

```ts
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

This example is common because it strings several core capabilities together:

- generics
- `keyof`
- constraints
- indexed access types

#### 6. "Generating types from types" in the type system

This is a core differentiator for advanced TypeScript.

##### 6.1 `keyof`

`keyof` is used to get the union of keys of an object type.

```ts
type User = {
  id: number
  name: string
}

type UserKeys = keyof User
// 'id' | 'name'
```

##### 6.2 `typeof`

In a type context, `typeof` is used to derive a type from a value.

```ts
const config = {
  apiBase: '/api',
  timeout: 3000,
}

type Config = typeof config
```

##### 6.3 Indexed access types

```ts
type User = {
  id: number
  name: string
}

type UserId = User['id']
```

Combined with `keyof`, this lets you write very common generic helper functions.

##### 6.4 `as const`

```ts
const roles = ['admin', 'user', 'guest'] as const
type Role = typeof roles[number]
```

The value of `as const` is to preserve as much literal information as possible, instead of widening it to a plain `string[]`.

#### 7. Conditional types and `infer`

This is where many mid-level and senior frontend engineers pull apart.

##### 7.1 Conditional types

```ts
type MessageOf<T> = T extends { message: unknown } ? T['message'] : never
```

The meaning is: if `T` satisfies some structure, return the corresponding type; otherwise return `never`.

##### 7.2 `infer`

`infer` is used in conditional types to "declare a type variable to be inferred".

```ts
type ReturnTypeOf<T>
  = T extends (...args: any[]) => infer R ? R : never

type Result = ReturnTypeOf<() => Promise<string>>
// Promise<string>
```

You can think of it as: when matching a type pattern, extract some part of it.

##### 7.3 Distributive conditional types

```ts
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// string[] | number[]
```

When a conditional type is applied to a union, it usually distributes over each union member. That is one reason many utility types look "magical".

#### 8. Mapped types and template literal types

##### 8.1 Mapped types

The essence of mapped types is: **iterate a set of keys, then generate a new type.**

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type MyPartial<T> = {
  [K in keyof T]?: T[K]
}
```

This is also where utility types like `Readonly<T>` and `Partial<T>` come from.

##### 8.2 Template literal types

```ts
type EventName<T extends string> = `on${Capitalize<T>}`

type UserEvent = EventName<'click' | 'change'>
// 'onClick' | 'onChange'
```

This capability is valuable in these scenarios:

- event name constraints
- route name constraints
- form field paths
- component props composition

##### 8.3 key remapping

```ts
type PrefixKeys<T> = {
  [K in keyof T as `app_${string & K}`]: T[K]
}
```

This shows that mapped types are not just "copying a structure"; they can also rename keys.

#### 9. Discriminated unions are a powerful business modeling tool

In frontend projects, many states are a natural fit for discriminated-union modeling.

```ts
type FetchResult<T>
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: string }
```

The benefits:

- accessible fields in each state are clearer
- component render branches are safer
- exhaustive checks are easier

Compared with a loose shape like `data?: T; error?: string; loading: boolean`, discriminated unions are usually more solid.

#### 10. Know how to use utility types, and know why

Common utility types include:

- `Partial<T>`
- `Required<T>`
- `Readonly<T>`
- `Pick<T, K>`
- `Omit<T, K>`
- `Record<K, V>`
- `Exclude<T, U>`
- `Extract<T, U>`
- `NonNullable<T>`
- `ReturnType<T>`
- `Parameters<T>`

Do not just memorize the names. A better way to prepare is to understand the three ideas behind them:

1. reshape object structures with `keyof` and mapped types
2. filter union members with conditional types
3. extract inner types of functions or containers with `infer`

#### 11. Type design priorities in real projects

##### 11.1 Prefer types that can be inferred

Rather than handwriting types everywhere, a better design is usually:

- function signatures can infer arguments and return values
- hooks can preserve information passed in by callers
- component APIs do not require users to write extra generics

If an API requires callers to manually fill in many types every time, the design is usually not good enough yet.

##### 11.2 Do not overuse assertions

```ts
const user = response as User
```

This kind of code exists in many projects, but it only "tells the compiler to trust me". It does not actually validate the response shape.

A more solid approach is:

- start with `unknown`
- then do runtime validation
- finally narrow to the target type

##### 11.3 Layer the frontend/backend boundary

It is better to keep these distinct:

- raw API type `ApiUser`
- frontend domain model `User`
- form model `UserFormValues`
- presentation-layer derived types

Do not let "one backend DTO type" run through every frontend layer, or later changes will become rigid.

##### 11.4 Strict mode is worth turning on

Without `strict`, many type-safety benefits are significantly weakened.

In senior interviews you can casually mention the value of these common options:

- `strict`
- `noImplicitAny`
- `strictNullChecks`
- `noUncheckedIndexedAccess`

#### 12. TypeScript characteristics already visible in this repository

This repository already has a few `.ts` practice files, such as `js-of-30-days/no3/implementation1.ts`, but overall it has not yet formed a complete advanced TypeScript topic. Most of it is still at the "add annotations to JS" level.

To push toward senior frontend interviews, this area should keep being strengthened:

- rewrite more handwritten problems and utility functions in TS
- add type constraints for complex return values, state flows, and event models
- train the ability to "generate types from types", instead of only writing interfaces

#### 13. Frequently asked interview questions

##### 13.1 What is the difference between `any` and `unknown`

`any` is basically opting out of the type system; you can do anything. `unknown` means "I do not know the concrete type yet"; you must narrow it before use, so it is safer.

##### 13.2 How to choose between `type` and `interface`

When describing object contracts, usually prefer `interface`. When expressing unions, intersections, conditionals, mapped types, and template literals, usually prefer `type`.

##### 13.3 Why do so many advanced types ultimately depend on `keyof`, conditional types, and `infer`

Because complex type design is essentially three things: get a set of keys, filter by condition, and extract some part of a structure.

##### 13.4 Why TypeScript cannot replace runtime validation

Because TypeScript is erased after compilation. Network data, URL parameters, and localStorage data at runtime can still be untrustworthy.

##### 13.5 What problems are discriminated unions good at solving

They are especially good at modeling "a finite set of states", such as request status, component modes, form steps, and dialog states, because each branch has a clear field boundary.

#### 14. Interview answer suggestions

When asked about TypeScript, do not start with "what are the basic types". A more solid structure is:

1. first say what problem TypeScript solves, and what its boundaries are
2. then cover core mechanisms such as narrowing, generics, `keyof`, and conditional types
3. then explain how discriminated unions or utility types land in real business modeling
4. finally add one piece of experience: how to avoid `any` spreading, and how to design APIs that infer better

That is how the answer upgrades from "can use TypeScript" to "can use the type system to design frontend code".
