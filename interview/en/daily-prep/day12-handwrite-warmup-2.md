# Day 12 Handwrite Warmup 2 (debounce / throttle / Promise / EventEmitter / promisify)

## Goals

- Finish `/en/handwrite/debounce`, `throttle`, `promisify`, `event-emitter`
- Produce a debounce / throttle comparison table (when they fire, leading/trailing options, cancel semantics)
- Produce oral templates for EventEmitter / promisify

## Read in order

1. [debounce](../handwrite/debounce)
2. [throttle](../handwrite/throttle)
3. [event-emitter](../handwrite/event-emitter)
4. [promisify](../handwrite/promisify)

## Practice and self-check

**Checkpoints**

- Debounce = wait a bit and only run the last call; throttle = run at a fixed frequency
- Common follow-ups: the edge case when `leading: true, trailing: true` are both on, and how to implement `cancel`
- EventEmitter's `once` is implemented with a wrapper plus removal
- `promisify` targets error-first callbacks; watch `this` binding

**Produce or redraw from memory**

- Debounce vs throttle — [reference section](../handwrite/debounce#day-12-debounce-vs-throttle)
- EventEmitter minimum API — [reference section](../handwrite/event-emitter#day-12-eventemitter-minimum-api)
- promisify in three steps — [reference section](../handwrite/promisify#day-12-promisify-in-three-steps)
- debounce (with leading / trailing / cancel) — [reference section](../handwrite/debounce#day-12-debounce-with-leading-trailing-cancel)
- throttle (timestamp version) — [reference section](../handwrite/throttle#day-12-throttle-timestamp-version)
- EventEmitter — [reference section](../handwrite/event-emitter#day-12-eventemitter)
- promisify — [reference section](../handwrite/promisify#day-12-promisify)

**Answer aloud without reading a reference answer**

- 1. How do you choose debounce vs throttle by scenario?
- 2. How do you explain turning a Promise-style API into async style?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Debounce/throttle principle + scenarios + leading/trailing (2 minutes)
2. EventEmitter's 4 APIs + how once is implemented (1.5 minutes)
3. promisify's three steps + the error-first callback convention (1.5 minutes)

Self-check after recording:

- Did you say debounce = "wait until it stops", throttle = "fixed frequency"?
- Did you say once uses a wrapper + off after running?
- Did you mention promisify's error-first callback convention?
- Did you mention what the `cancel` method is for?

## Recap

The 3 points that most need follow-up today:

1. Edge handling when `leading: true, trailing: true` are both on (run once at the start and once at the end).
2. Array mutation if EventEmitter's `off` is called while `emit` is iterating (copy before iterating).
3. Extending `promisify` for multi-value callbacks such as `(err, data1, data2)`.
