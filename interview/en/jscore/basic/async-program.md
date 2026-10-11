# Async programming overview

Start with a callback to understand why async work needs a completion signal. A Promise represents the eventual result; `async`/`await` lets you write Promise-based control flow in a direct style.

Read the details in this order:

1. [Event loop](./event-loop) — tasks, microtasks, and rendering opportunities.
2. [Promise](../advanced/promise) — states, chains, static methods, and errors.
3. [async/await](../advanced/async-await) — Generator model, `spawn`, and serial versus parallel work.

When choosing an API, ask whether the work depends on a previous result, whether all results are required, and how a failure should propagate.
