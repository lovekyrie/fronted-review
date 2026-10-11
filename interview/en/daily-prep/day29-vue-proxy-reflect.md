# Day 29 Vue 3 Proxy / Reflect and the Reactivity Entry

## Goals

- Finish Vue Reactivity in Depth and `/en/framework/vue/reactivity`
- Produce a 13-trap Proxy cheat sheet, and mark the 4 commonly used in reactivity: `get / set / has / deleteProperty`
- Compare Vue 2 `Object.defineProperty` with Vue 3 Proxy

## Read in order

1. [Reactivity](../advanced/week3/reactivity)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- `Reflect` is not only "call the default behavior"; it also has the side effect of making `this` point at the receiver correctly
- Proxying array index / length is not "naturally usable"; Vue 3 adds special handling
- Only accessed properties fire getters. Deep reactivity is created **on demand**

**Produce or redraw from memory**

- Common Proxy traps — [reference section](../advanced/week3/reactivity#day-29-common-proxy-traps)
- Supplementary notes — [reference section](../advanced/week3/reactivity#day-29-supplementary-notes)

**Answer aloud without reading a reference answer**

- 1. Why did Vue 3 switch to Proxy?
- 2. Why use Reflect in a Proxy handler instead of `target[key]` directly?

**Recording drill**

1. Proxy's 13 traps + the 4 commonly used (2 minutes)
2. Reflect and receiver (1.5 minutes)
3. Vue 2 vs Vue 3 reactivity (1.5 minutes)

## Recap

1. Most likely follow-up: Proxy does not "automatically make everything reactive". Arrays and collection types still need Vue's dedicated proxy logic.
2. Current gap: map `get/set/has/deleteProperty/ownKeys` to read, write, `in`, delete, and iteration deps respectively.
3. Next to add: connect to Day 30, and explain where `track/trigger` fired by Proxy actually stores deps.
