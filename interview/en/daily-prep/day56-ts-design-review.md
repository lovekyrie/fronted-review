# Day 56 TypeScript Type Design Practice + Follow-up Review Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 56 | Type design review | [Week 5 Roadmap](../advanced/week5/roadmap), [TypeScript Basics](../advanced/week5/typescript-basic), [TypeScript Type Design](../advanced/week5/typescript-design) |

## Today's Goals

- Pick a component or function (form / table / fetch wrapper) and do type design in TypeScript
- Summarize Day 50–55 into a *TypeScript Track 15-Question Answer Book*
- Output an answer script for “why type design ≠ being able to write TypeScript”

## Reading Checkpoints

- Type design cares about **the caller experience of the interface**, not “it can run”
- Inference > explicit annotations; callers should not have to pass generics by hand
- “Avoid any” is not the goal; “make errors show up at the call site instead of inside the library” is

## Cheat Sheet / Knowledge Points

### 5 principles of type design

1. **Inference first**: let TypeScript infer automatically and reduce manual annotations. Use inference inside functions; annotate at the boundary (parameters/return values).
2. **Narrow types beat wide types**: use `'success' | 'error'` instead of `string`, and discriminated unions instead of optional properties.
3. **Impossible states should be inexpressible**: use the type system to exclude illegal combinations (for example loading and error cannot both be true).
4. **Errors should surface at the call site**: generic constraints + conditional types make error messages appear where the user writes code, not inside the library.
5. **Minimal surface area**: export only necessary types; keep internal implementation types as `type` rather than `export type`.

### Typical anti-patterns

| Anti-pattern | Problem | Fix |
|--------|------|------|
| `any` everywhere | Lose type safety | Use `unknown` + narrowing |
| Overusing `as` assertions | Lying to the compiler | Improve type definitions |
| Abusing optional properties | Unclear state | Discriminated union |
| Too many generic parameters | Callers get confused | Use inference to reduce parameters |
| Types split from implementation | Types and code diverge | Extract from implementation with `typeof` / `satisfies` |

### Impossible states should be inexpressible

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

## Handwritten / Flowcharts

### Strongly typed EventEmitter

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

### Strongly typed fetch wrapper

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

## Oral Questions

### 1. What should a good TypeScript API look like?

Answer template:

> Three criteria. First, callers do not need to pass generics by hand — TypeScript can infer every type from arguments. For example `pick(obj, ['name', 'age'])`, both T and K are inferred from arguments. Second, error messages surface at the call site — if a wrong argument is passed, the error should point at the caller's line, not the library internals. That requires good design of generic constraints. Third, impossible usages should fail to compile — for example only accepting certain string literals, forbidding null, forbidding duplicate keys, and intercepting them at compile time with the type system.
>
> Essentially a good TypeScript API is "comfortable for callers to write, and safe for them to change".

### 2. What techniques have you used to "make errors surface as early as possible"?

Answer template:

> Five. First, discriminated unions instead of optional properties, so illegal state combinations are inexpressible at the type level. Second, `as const` + literal-type narrowing, for example making paths literals rather than string in route configs. Third, exhaustive check (`assertNever`), so forgetting to handle a newly added enum value fails to compile. Fourth, the `satisfies` operator (TypeScript 4.9+), which both type-checks and preserves literal inference. Fifth, generic constraints + conditional types, so illegal argument combinations error directly on the function signature.

## 8-Minute Recording Sequence (TypeScript Topic Summary)

1. Type basics (type vs interface / union narrowing / as const) (1.5 minutes)
2. Generics (3 motivations / extends constraints / inference direction) (2 minutes)
3. Conditional types + infer (distribution rules / ReturnType / Awaited implementations) (2 minutes)
4. Mapped types + template literals (modifiers / remapping / route-parameter inference) (1.5 minutes)
5. 3 type-design principles (inference first / narrow types / impossible states inexpressible) (1 minute)

## Today's Review

The 3 TypeScript questions most likely to trip you up:

1. "Handwrite the Omit type" — you need to state the Pick + Exclude composition, not just recite the result.
2. "When do distributive conditional types trigger? How do you turn them off?" — you need to state naked type parameter + wrapping with `[]`.
3. "Design types for a real scenario (such as a fetch wrapper)" — you need to write the full generic + conditional-type signature on the spot.

3 new "why" questions added this week:

1. Why did TypeScript choose structural typing instead of nominal typing? (It matches JavaScript's duck typing)
2. Why do utility types only need mapped + conditional + infer as underlying techniques? (They form a Turing-complete subset at the type level)
3. Why is "inference first" a good API design principle? (Reduces caller burden + avoids annotations drifting from actual values)
