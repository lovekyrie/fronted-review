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
