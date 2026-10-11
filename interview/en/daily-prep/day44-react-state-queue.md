# Day 44 React State Queue and Functional Updates

## Goals

- Finish React useState / Queueing State Updates
- Do 3 output questions (three consecutive `setCount(count + 1)` vs three `setCount(c => c + 1)`)
- Produce typical stale state / stale closure cases + how to fix them

## Read in order

1. [Week 4 Hooks](../advanced/week4/hooks)
2. [React Hooks](../framework/react/hooks)

## Practice and self-check

**Checkpoints**

- `setState` only enqueues an update; state does not change inside the current render
- A direct-value update uses the state **snapshot of this render**; a functional update uses **queue-accumulated** state
- Functional updates naturally fix the old “click the button 3 times and it only increments by 1” problem

**Produce or redraw from memory**

- State update model — [reference section](../advanced/week4/hooks#day-44-state-update-model)
- Direct value vs functional updates — [reference section](../advanced/week4/hooks#day-44-direct-value-vs-functional-updates)
- Queue processing rules — [reference section](../advanced/week4/hooks#day-44-queue-processing-rules)
- Typical stale closure scenario — [reference section](../advanced/week4/hooks#day-44-typical-stale-closure-scenario)
- 3 classic output questions — [reference section](../advanced/week4/hooks#day-44-3-classic-output-questions)

**Answer aloud without reading a reference answer**

- 1. Why does calling setState 3 times in a row only increment by 1?
- 2. What is a stale closure? How do you fix it?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. State enqueue model + snapshot mental model (1.5 minutes)
2. Direct value vs functional + 3 output questions (2 minutes)
3. Stale closure scenarios + three fixes (1.5 minutes)

Self-check after recording:

- Did you state that state in one render is a snapshot.
- Did you state that direct values use the snapshot and functional updates use the queue-accumulated value.
- Did you state a typical stale closure scenario and how to fix it.
- Can you compute the mixed question’s result out loud.

## Recap

The 3 points that most need follow-up today:

1. How `useReducer`’s update queue relates to `useState` (`useState` is `useReducer` underneath).
2. How `useEffectEvent` (React 19) isolates values you do not want to retrigger.
3. Immutable update patterns for object state (why you must spread a new object).
