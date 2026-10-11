# Day 39 Hand-writing mini-vue Renderer

## Goals

- Add a minimal renderer to the mini-vue project: support `h / mount / patch / unmount`
- Implement three vnode types: element + text + fragment
- For children diff, first implement only **head-to-head + tail-to-tail + brute-force compare**; LIS is not required

## Read in order

1. [Rendering mechanism](../advanced/week3/rendering-mechanism)
2. [Vue diff](../framework/vue/dom-diff)

## Practice and self-check

**Checkpoints**

- vnode shape: `{ type, props, children, el, key }`
- `patchProps` must handle four kinds: `class / style / on* / plain attr`
- A component vnode calls render to get child vnodes, then mounts them

**Produce or redraw from memory**

- VNode shape — [reference section](../advanced/week3/rendering-mechanism#day-39-vnode-shape)
- patch dispatch logic — [reference section](../advanced/week3/rendering-mechanism#day-39-patch-dispatch-logic)
- Four kinds of patchProps — [reference section](../advanced/week3/rendering-mechanism#day-39-four-kinds-of-patchprops)
- Minimal renderer implementation — [reference section](../advanced/week3/rendering-mechanism#day-39-minimal-renderer-implementation)
- createApp sketch — [reference section](../advanced/week3/rendering-mechanism#day-39-createapp-sketch)

**Answer aloud without reading a reference answer**

- 1. What is the main difference between mount and patch?
- 2. If you built a renderer from scratch, how would you split it?

**Recording drill**

Record in this order; do not restructure on the fly:

1. VNode shape + h function (1 minute)
2. mount flow (createElement → props → children → appendChild) (2 minutes)
3. patch flow (reuse el → diff props → diff children) + connection to reactivity (2 minutes)

Self-check after recording:

- Did you name the core VNode fields?
- Did you say mount creates DOM and patch reuses DOM?
- Did you mention the four kinds of patchProps?
- Did you say effect connects render and reactivity?

## Recap

Three points to fill in today:

1. Event handling optimization: invoker pattern (do not remove/add; only swap the handler reference).
2. Fragment implementation: use an `anchor` comment node to locate when there is no root node.
3. Component VNode handling: call render to get child VNodes, then go through the element flow.
