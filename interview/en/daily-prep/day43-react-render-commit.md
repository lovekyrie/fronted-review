# Day 43 React render / commit / batching

## Goals

- Finish React’s official Queueing State Updates + `/en/framework/react/hooks`
- Draw a React update flowchart: Trigger → Render (Reconciler) → Commit
- Produce an answer script for React 18 automatic batching

## Read in order

1. [Concurrency](../advanced/week4/concurrency)
2. [React Hooks](../framework/react/hooks)

## Practice and self-check

**Checkpoints**

- The Render phase can be interrupted / retried (Concurrent); the Commit phase cannot be interrupted
- Before React 18, batching only applied inside event handlers; after 18 it extends to Promise / setTimeout / native events
- `flushSync` is for “I must update immediately” — an escape hatch

**Produce or redraw from memory**

- Fiber architecture — [reference section](../advanced/week4/concurrency#day-43-fiber-architecture)
- React’s two update phases — [reference section](../advanced/week4/concurrency#day-43-react-s-two-update-phases)
- Automatic batching (React 18) — [reference section](../advanced/week4/concurrency#day-43-automatic-batching-react-18)
- Lanes priority model — [reference section](../advanced/week4/concurrency#day-43-lanes-priority-model)
- Full React update pipeline — [reference section](../advanced/week4/concurrency#day-43-full-react-update-pipeline)
- Batching comparison — [reference section](../advanced/week4/concurrency#day-43-batching-comparison)

**Answer aloud without reading a reference answer**

- 1. What did React 18’s automatic batching actually change?
- 2. What is the fundamental difference between the Render phase and the Commit phase?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Two update phases (Render is interruptible and does diff / Commit is not interruptible and mutates the DOM) + Commit’s three sub-phases (2 minutes)
2. React 18 automatic batching (compare 17’s four scenarios + the flushSync escape hatch) (1.5 minutes)
3. Lanes priority (Sync > Input > Default > Idle) + what startTransition does (1.5 minutes)

Self-check after recording:

- Did you state that Render is interruptible and Commit is not.
- Did you state that React 18 batches automatically in all scenarios.
- Did you state what flushSync is for.
- Did you state that Lanes is the priority model.

## Recap

The 3 points that most need follow-up today:

1. Fiber linked-list walk order (beginWork is depth-first, completeWork walks back).
2. When `useLayoutEffect` vs `useEffect` run during Commit.
3. How Concurrent mode resumes after a render is interrupted (workInProgress tree).
