# Day 43 React render / commit / batching Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 43 | render/commit | [Concurrency](../advanced/week4/concurrency), [React Hooks](../framework/react/hooks) |

## Today's Goals

- Finish React’s official Queueing State Updates + `/en/framework/react/hooks`
- Draw a React update flowchart: Trigger → Render (Reconciler) → Commit
- Produce an answer script for React 18 automatic batching

## Reading Checkpoints

- The Render phase can be interrupted / retried (Concurrent); the Commit phase cannot be interrupted
- Before React 18, batching only applied inside event handlers; after 18 it extends to Promise / setTimeout / native events
- `flushSync` is for “I must update immediately” — an escape hatch

## Cheat Sheet / Knowledge Points

### Fiber architecture

- Fiber is React’s unit of work; each component corresponds to a Fiber node.
- The Fiber tree is a linked structure: `child` / `sibling` / `return` (parent).
- Core value: the render phase can be **interrupted / resumed / reused**.

### React’s two update phases

| Phase | Role | Interruptible | Involves |
|------|------|--------|------|
| **Render** | Walk the Fiber tree, call component functions, compute new VNodes, diff and mark changes (effectTag) | ✅ interruptible | `beginWork` / `completeWork` |
| **Commit** | Sync changes to the real DOM | ❌ not interruptible | `BeforeMutation` / `Mutation` / `Layout` |

Commit has three sub-phases:
- **BeforeMutation**: `getSnapshotBeforeUpdate`, schedule `useEffect`.
- **Mutation**: actual DOM operations (insert / delete / update).
- **Layout**: `useLayoutEffect` / `componentDidMount` / `componentDidUpdate`.

### Automatic batching (React 18)

| Scenario | React 17 | React 18 |
|------|----------|----------|
| Event handlers | ✅ batched | ✅ batched |
| Promise.then | ❌ not batched | ✅ batched |
| setTimeout | ❌ not batched | ✅ batched |
| Native events | ❌ not batched | ✅ batched |

React 18 enables this with `createRoot`; all scenarios are batched automatically. `flushSync` can opt out of batching.

### Lanes priority model

```text
SyncLane (sync) > InputContinuousLane (continuous input) > DefaultLane (default) > IdleLane (idle)
```

- Each update carries a lane; the scheduler picks execution priority from the lane.
- `startTransition` marks an update as low priority (TransitionLane); it can be interrupted by higher priority.

## Handwritten / Flowcharts

### Full React update pipeline

```text
setState(newValue)
  → create an Update object, attach it to Fiber.updateQueue
  → scheduleUpdateOnFiber(fiber, lane)
  → ensureRootIsScheduled → pick a scheduling method based on lane
    → Sync: schedule as a microtask
    → Concurrent: MessageChannel / scheduler
  → Render phase:
    → workLoopSync / workLoopConcurrent
    → beginWork: call the component function, diff children, mark effectTag
    → completeWork: collect the effect list
  → Commit phase:
    → BeforeMutation: schedule useEffect
    → Mutation: DOM operations
    → Layout: useLayoutEffect runs synchronously
```

### Batching comparison

```jsx
function handleClick() {
  setCount(1)  // does not re-render immediately
  setFlag(true) // does not re-render immediately
  // one unified re-render after the event ends
}

// React 17: setTimeout is not batched:
setTimeout(() => {
  setCount(1)  // re-render
  setFlag(true) // re-render  → 2 times in total
}, 0)

// React 18 automatic batching: only 1 re-render
```

## Oral Questions

### 1. What did React 18’s automatic batching actually change?

Answer template:

> In React 17 and earlier, batching only applied inside React event handlers. Multiple setStates in Promise.then, setTimeout, or native events triggered multiple re-renders. After React 18 enables the new concurrent mode via `createRoot`, every scenario is batched automatically: multiple setStates trigger only one re-render.
>
> The principle is that React 18 changed scheduling: it no longer relies on a context flag from the React event system, and instead flushes the update queue at the microtask boundary. If a scenario really needs an immediate update (for example reading the DOM right after a mutation), you can force a sync flush with `flushSync`.

### 2. What is the fundamental difference between the Render phase and the Commit phase?

Answer template:

> Render is the “compute” phase: walk the Fiber tree, call component functions, diff which nodes need insert / delete / update, but do not touch the real DOM. Its key property is that it is **interruptible** — in Concurrent mode, if a higher-priority update arrives, the current render can pause so the higher-priority work can run first.
>
> Commit is the “execute” phase: sync the changes marked during render to the real DOM. This phase is **not interruptible**, because DOM operations must finish continuously, otherwise users would see an intermediate state. Commit has three sub-phases: BeforeMutation (snapshot), Mutation (actual DOM operations), Layout (sync effects).

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. Two update phases (Render is interruptible and does diff / Commit is not interruptible and mutates the DOM) + Commit’s three sub-phases (2 minutes)
2. React 18 automatic batching (compare 17’s four scenarios + the flushSync escape hatch) (1.5 minutes)
3. Lanes priority (Sync > Input > Default > Idle) + what startTransition does (1.5 minutes)

Self-check after recording:

- Did you state that Render is interruptible and Commit is not.
- Did you state that React 18 batches automatically in all scenarios.
- Did you state what flushSync is for.
- Did you state that Lanes is the priority model.

## Today's Review

The 3 points that most need follow-up today:

1. Fiber linked-list walk order (beginWork is depth-first, completeWork walks back).
2. When `useLayoutEffect` vs `useEffect` run during Commit.
3. How Concurrent mode resumes after a render is interrupted (workInProgress tree).
