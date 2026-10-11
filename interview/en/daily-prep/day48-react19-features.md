# Day 48 React 19 New Features

## Goals

- Finish React 19 official What’s New + useOptimistic / useActionState / Actions
- Produce a React 19 cheat sheet: Actions / useOptimistic / useActionState / use / ref as prop
- Think about how these features would change how you write in existing projects

## Read in order

1. [React 19 Features](../framework/react/react19-features)

## Practice and self-check

**Checkpoints**

- Actions connect form submit, async requests, state updates, and optimistic UI into one pipeline
- `useOptimistic` is **temporary state**; it rolls back if the server fails
- `use` can read a Promise / Context directly in render; it is a foundation for RSC

**Produce or redraw from memory**

- React 19 new API checklist — [reference section](../framework/react/react19-features#day-48-react-19-new-api-checklist)
- Actions concept — [reference section](../framework/react/react19-features#day-48-actions-concept)
- useActionState — [reference section](../framework/react/react19-features#day-48-useactionstate)
- useOptimistic — [reference section](../framework/react/react19-features#day-48-useoptimistic)
- use — [reference section](../framework/react/react19-features#day-48-use)
- ref as prop (no more forwardRef) — [reference section](../framework/react/react19-features#day-48-ref-as-prop-no-more-forwardref)
- Full form + useActionState + useOptimistic example — [reference section](../framework/react/react19-features#day-48-full-form-useactionstate-useoptimistic-example)

**Answer aloud without reading a reference answer**

- 1. What previously painful problems do Actions solve?
- 2. How is useOptimistic different from handwritten optimistic updates?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. React 19 new API overview (quickly cover the 6 key changes) (1 minute)
2. Actions + useActionState (form-submit scenario + isPending + error handling) (2 minutes)
3. useOptimistic + use (automatic optimistic rollback + reading a Promise in render) (2 minutes)

Self-check after recording:

- Did you state that Actions automatically manage pending / error / optimistic.
- Did you state that useOptimistic rolls back automatically.
- Did you state that `use` can be called inside conditionals.
- Did you state that ref as prop removes forwardRef.

## Recap

The 3 points that most need follow-up today:

1. When to use `useFormStatus` and its limits (only inside a form’s child components).
2. How `use` interacts with Suspense when reading a Promise (how to avoid waterfall requests).
3. How React 19 relates to Server Actions (how functions marked `"use server"` work with Actions).
