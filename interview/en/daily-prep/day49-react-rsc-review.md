# Day 49 RSC + React Topic Follow-up Review

## Goals

- Finish React Server Components and `use server`
- Summarize Days 43–48 into a *React Track 15-Question Answer Book*
- Record an 8-minute take: the full path from setState to pixels on screen

## Read in order

1. [React 19 Features](../framework/react/react19-features)
2. [Week 4 Roadmap](../advanced/week4/roadmap)
3. [SSR/SSG](../advanced/ssr-ssg)

## Practice and self-check

**Checkpoints**

- RSC is not SSR; it can **run components directly on the server** and stream serialized results to the client
- “Server Component / Client Component” are distinguished by a `"use client"` marker
- RSC’s gains: smaller bundles, safe access to the data layer; costs: serialization limits, a mental-model shift

**Produce or redraw from memory**

- RSC core model
- RSC vs SSR
- RSC render flow
- RSC in the Next.js App Router
- When to use which
- RSC render pipeline
- Server Action example

**Answer aloud without reading a reference answer**

- 1. What is the essential difference between RSC and SSR?
- 2. 3 self-drawn follow-ups

**Mock format and scoring**

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

[Reference code](../framework/react/react19-features#day-49-practice-code)

**Recording drill**

1. Full setState → render → commit pipeline + Fiber + Lanes (2 minutes)
2. useEffect’s three pitfalls + cleanup timing + Strict Mode (1.5 minutes)
3. The memo trio + failure cases + Compiler direction (1.5 minutes)
4. Concurrent rendering + useTransition + useDeferredValue (1.5 minutes)
5. React 19 Actions + RSC model + Server/Client boundary (1.5 minutes)

## Recap

The 3 React questions most likely to break you:

1. “What did React 18 automatic batching actually change? Where do scenarios differ?” — you need to name 4 scenarios + createRoot.
2. “Difference between useEffect and useLayoutEffect? When does cleanup run?” — you need to draw a timing diagram.
3. “How is RSC actually different from SSR?” — you need bundle differences + data-fetching differences + the serialization boundary.

3 new “why” questions this week:

1. Why did React choose immutable data instead of Vue’s mutable reactivity? (predictability + concurrent compatibility)
2. Why must render be a pure function in Concurrent mode? (interrupt-and-retry requires idempotence)
3. Why are RSC Server Components not packed for the client? (smaller bundle + safe access to server resources)
