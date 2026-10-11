# Day 69 Adding tests for handwrite/promise execution log

## Goals

- Look at the repo `hand-write/promise` or `hand-write/simulate/eventEmitter.js`
- Add Vitest unit tests for one of them: happy path + error path + edges
- Write up “3 steps to test a library”: map API edges → case matrix → add tests

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)
2. [promisify](../handwrite/promisify)
3. [Handwrite Promise](../handwrite/promise)

## Practice and self-check

**Checkpoints**

- For Promise, test: `then / catch / finally / resolve / reject / all / race / allSettled / any`
- For EventEmitter, test: `on / off / emit / once / argument passing / error isolation`
- Interviews often ask “what coverage do you have?” — you need to say **coverage is the result; the case matrix is the process**

**Produce or redraw from memory**

- Case-matrix method — [reference section](../advanced/week7/testing-strategy#day-69-case-matrix-method)
- Must-have Promise cases — [reference section](../advanced/week7/testing-strategy#day-69-must-have-promise-cases)
- Common misses — [reference section](../advanced/week7/testing-strategy#day-69-common-misses)
- Full MyPromise tests — [reference section](../advanced/week7/testing-strategy#day-69-full-mypromise-tests)

**Answer aloud without reading a reference answer**

- 1. How would you plan tests for a library?
- 2. How do you handle async flows in tests?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Case-matrix method (API edges → happy/error/edge) (1.5 min)
2. Key Promise cases (then chain / value piercing / all reject) (2 min)
3. How to read coverage + common misses (1.5 min)

After recording, self-check:

- Did you state the three-step case matrix.
- Did you mention then value piercing and multiple-resolve edges.
- Did you mention `async/await` in tests.
- Did you say coverage is the result; the case matrix is the process.

## Recap

The 3 points that most need review today:

1. Recursive unwrap tests when `then` returns a Promise.
2. EventEmitter `once` and `off` edge tests.
3. Using Vitest `--coverage` to find missed branches.
