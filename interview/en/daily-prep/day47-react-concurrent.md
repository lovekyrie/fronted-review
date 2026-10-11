# Day 47 useTransition / useDeferredValue and Concurrent Features

## Goals

- Finish React useTransition, useDeferredValue, Suspense
- Produce a concurrent-rendering answer script: Lanes / interruptible Render / priority
- Pick a real scenario: a search box that renders a large result list while keeping input smooth

## Read in order

1. [Concurrency](../advanced/week4/concurrency)

## Practice and self-check

**Checkpoints**

- `useTransition` marks an update as **non-urgent**, so the browser can prioritize urgent work (input)
- `useDeferredValue` does not change the trigger; it **defers the consumer**; the two complement each other
- Concurrent is not multithreading; it is **interruptible scheduling** on a single thread

**Produce or redraw from memory**

- Core concurrent-rendering ideas — [reference section](../advanced/week4/concurrency#day-47-core-concurrent-rendering-ideas)
- useTransition — [reference section](../advanced/week4/concurrency#day-47-usetransition)
- useDeferredValue — [reference section](../advanced/week4/concurrency#day-47-usedeferredvalue)
- How to choose — [reference section](../advanced/week4/concurrency#day-47-how-to-choose)
- Working with Suspense — [reference section](../advanced/week4/concurrency#day-47-working-with-suspense)
- Full search-box example — [reference section](../advanced/week4/concurrency#day-47-full-search-box-example)
- Concurrent scheduling flow — [reference section](../advanced/week4/concurrency#day-47-concurrent-scheduling-flow)

**Answer aloud without reading a reference answer**

- 1. How do you choose between useTransition and useDeferredValue?
- 2. React concurrent is not multithreading, so where is the “concurrency”?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. What concurrent rendering means (single-thread interruptible scheduling + Lanes priority) (1.5 minutes)
2. useTransition search-box scenario + isPending (2 minutes)
3. useDeferredValue scenario + keeping old UI with Suspense (1.5 minutes)

Self-check after recording:

- Did you state that concurrent is not multithreading but interruptible scheduling.
- Did you state that startTransition marks low priority.
- Did you state that useTransition controls the trigger and useDeferredValue controls the consumer.
- Did you state that Suspense + Transition keeps the old UI and does not flash the fallback.

## Recap

The 3 points that most need follow-up today:

1. How `startTransition` and `useDeferredValue` differ in Lane assignment at the source level.
2. Suspense’s “reveal” strategy in Concurrent mode (when to show fallback vs keep the old UI).
3. How `useOptimistic` works together with Transition.
