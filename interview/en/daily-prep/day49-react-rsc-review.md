# Day 49 RSC + React Topic Follow-up Review Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 49 | RSC + review | [React 19 Features](../framework/react/react19-features), [Week 4 Roadmap](../advanced/week4/roadmap), [SSR/SSG](../advanced/ssr-ssg) |

## Today's Goals

- Finish React Server Components and `use server`
- Summarize Days 43–48 into a *React Track 15-Question Answer Book*
- Record an 8-minute take: the full path from setState to pixels on screen

## Reading Checkpoints

- RSC is not SSR; it can **run components directly on the server** and stream serialized results to the client
- “Server Component / Client Component” are distinguished by a `"use client"` marker
- RSC’s gains: smaller bundles, safe access to the data layer; costs: serialization limits, a mental-model shift

## Cheat Sheet / Knowledge Points

### RSC core model

| Concept | Meaning |
|------|------|
| Server Component | Default components; run on the server; not packed into the client bundle |
| Client Component | Marked with `"use client"`; run on the client; support interactivity |
| Serialization boundary | Props passed Server → Client must be serializable (JSON-compatible) |
| RSC Payload | Serialized format of the server render result (not HTML), streamed to the client |

### RSC vs SSR

| Dimension | SSR | RSC |
|------|-----|-----|
| Render output | HTML string | RSC Payload (serialized component tree) |
| JS bundle | Every component is bundled | Server Components are not in the bundle |
| Data fetching | Fetch on the server → serialize into HTML | async/await directly inside the component |
| Interactivity | Interactive only after hydrate | Client Components hydrate independently |
| Re-render | Full page | Can refetch a Server Component locally |

### RSC render flow

```text
1. Request arrives → server runs Server Components (can async/await the database)
2. Hits a Client Component → serialize as a reference marker + props
3. Serialize the whole tree as an RSC Payload → stream to the client
4. Client parses the RSC Payload → hits a Client Component reference → loads the matching JS
5. Client Component hydrates → the page becomes interactive
```

### RSC in the Next.js App Router

- Components under `app/` are Server Components by default.
- Components that need interactivity (onClick, useState) add `"use client"`.
- Server Actions are marked with `"use server"` and can be called from Client Components as server functions.

### When to use which

- **Use a Server Component**: data display, static UI, accessing the database/filesystem.
- **Use a Client Component**: user interaction, browser APIs, state/effect.

## Handwritten / Flowcharts

### RSC render pipeline

```text
Browser requests /dashboard
  → Next.js Server:
    → run layout.tsx (Server Component)
      → async: query the database for user info
      → run Sidebar (Server Component)
      → hit <InteractiveChart "use client" />
        → serialize: { type: "client-ref", module: "./InteractiveChart.js", props: { data } }
    → produce RSC Payload (streaming)
  → Client:
    → parse RSC Payload → render the static parts
    → load InteractiveChart.js → hydrate → the chart becomes interactive
    → Server Component JS never enters the bundle!
```

### Server Action example

```jsx
// actions.ts
'use server'
export async function createTodo(formData: FormData) {
  const text = formData.get('text')
  await db.todos.create({ text })
  revalidatePath('/todos')
}

// TodoForm.tsx
'use client'
import { createTodo } from './actions'

export function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  )
}
```

## Oral Questions

### 1. What is the essential difference between RSC and SSR?

Answer template:

> SSR renders components to an HTML string for the client, but all component JS still has to be bundled and sent; the client can interact only after hydrate. In essence SSR only “rendered HTML early”; it saves zero bytes of JS.
>
> RSC lets components run directly on the server; the render result is streamed to the client as an RSC Payload (a serialized format). Server Component JS **is never sent to the client**, which truly shrinks the bundle. Only components marked `"use client"` are packed for the client.
>
> Another difference is data fetching: SSR needs a dedicated entry (getServerSideProps) to fetch data in one place; RSC can async/await inside each Server Component, so data fetching sits next to the component tree and feels more natural.

### 2. 3 self-drawn follow-ups

**Q: What are RSC’s limits?**

> Server Components cannot use useState / useEffect / browser APIs, and cannot have event handlers. Props passed to Client Components must be serializable (no functions, no class instances). Server Components cannot import modules with interactive logic other than Client Components.

**Q: How do you share data between Server Components and Client Components?**

> Three ways. First, a Server Component passes props to a Client Component (must be serializable). Second, Server Actions let a Client Component call server logic. Third, share state across both ends via URL searchParams / cookies.

**Q: What does RSC mean for existing React projects?**

> Not every project needs RSC. For a pure SPA / admin dashboard, CSR is enough. RSC mainly fits content-heavy apps (e-commerce, social, docs sites), where shrinking the bundle and talking to the data layer directly pays off most. Migration cost is not low: you must draw Server / Client boundaries and change how you design components.

## 8-Minute Recording Sequence (React Topic Summary)

1. Full setState → render → commit pipeline + Fiber + Lanes (2 minutes)
2. useEffect’s three pitfalls + cleanup timing + Strict Mode (1.5 minutes)
3. The memo trio + failure cases + Compiler direction (1.5 minutes)
4. Concurrent rendering + useTransition + useDeferredValue (1.5 minutes)
5. React 19 Actions + RSC model + Server/Client boundary (1.5 minutes)

## Today's Review

The 3 React questions most likely to break you:

1. “What did React 18 automatic batching actually change? Where do scenarios differ?” — you need to name 4 scenarios + createRoot.
2. “Difference between useEffect and useLayoutEffect? When does cleanup run?” — you need to draw a timing diagram.
3. “How is RSC actually different from SSR?” — you need bundle differences + data-fetching differences + the serialization boundary.

3 new “why” questions this week:

1. Why did React choose immutable data instead of Vue’s mutable reactivity? (predictability + concurrent compatibility)
2. Why must render be a pure function in Concurrent mode? (interrupt-and-retry requires idempotence)
3. Why are RSC Server Components not packed for the client? (smaller bundle + safe access to server resources)
