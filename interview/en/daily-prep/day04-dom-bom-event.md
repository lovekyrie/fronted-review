# Day 4 DOM / BOM / Web API + Event Mechanism

## Goals

- Finish `/en/jscore/basic/dom-bom-webapi`, `/en/jscore/basic/event-mechanism`, `/en/jscore/basic/other-web-apis`
- Build an event-delegation demo (`closest` + dynamic nodes)
- Prepare answer templates for `IntersectionObserver` + `sendBeacon`

## Read in order

1. [DOM/BOM/Web API](../jscore/basic/dom-bom-webapi)
2. [Event Mechanism](../jscore/basic/event-mechanism)
3. [Other Web APIs](../jscore/basic/other-web-apis)

## Practice and self-check

**Checkpoints**

- The three event phases: capture / target / bubble, and the difference between `stopPropagation` and `stopImmediatePropagation`
- SPA URL changes without a page refresh: `history.pushState` + `popstate`, and the trade-offs of the hash approach
- Boundaries of common observer APIs: Intersection, Mutation, Resize, Performance

**Produce or redraw from memory**

- DOM tree vs render tree — [reference section](../jscore/basic/dom-bom-webapi#day-4-dom-tree-vs-render-tree)
- Common BOM objects — [reference section](../jscore/basic/dom-bom-webapi#day-4-common-bom-objects)
- Three phases of the event flow — [reference section](../jscore/basic/event-mechanism#day-4-three-phases-of-the-event-flow)
- stopPropagation vs stopImmediatePropagation — [reference section](../jscore/basic/dom-bom-webapi#day-4-stoppropagation-vs-stopimmediatepropagation)
- Event Delegation — [reference section](../jscore/basic/event-mechanism#day-4-event-delegation)
- Common Observer API matrix — [reference section](../jscore/basic/dom-bom-webapi#day-4-common-observer-api-matrix)
- SPA routing: hash vs history — [reference section](../jscore/basic/dom-bom-webapi#day-4-spa-routing-hash-vs-history)
- sendBeacon — [reference section](../jscore/basic/other-web-apis#day-4-sendbeacon)
- Event-delegation demo: clicks on dynamic nodes matched with closest — [reference section](../jscore/basic/event-mechanism#day-4-event-delegation-demo-clicks-on-dynamic-nodes-matched-with-closest)
- Three-phase event-flow diagram — [reference section](../jscore/basic/event-mechanism#day-4-three-phase-event-flow-diagram)

**Answer aloud without reading a reference answer**

- 1. Why can an SPA change the URL without refreshing the page?
- 2. How do you explain capture / bubbling in a business context?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. DOM / BOM basics (1 minute)
2. Three event-flow phases + delegation in practice (2 minutes)
3. When to use IntersectionObserver / MutationObserver / sendBeacon (2 minutes)

Self-check after recording:

- Did you say the order capture → target → bubble?
- Did you say the difference between `stopPropagation` and `stopImmediatePropagation`?
- Did you say when event delegation fits (dynamic lists, fewer listeners)?
- Did you say the trade-offs between hash and history routing?

## Recap

The 3 points that most need follow-up today:

1. `focus`/`blur` do not bubble; in interviews you should be able to say use `focusin`/`focusout` instead.
2. `IntersectionObserver` threshold config and what `rootMargin` does.
3. `history.pushState` does not fire `popstate`; list clearly which actions do.
