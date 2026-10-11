# Day 5 Memory Management and Browser Rendering Basics

## Goals

- Finish `/en/jscore/basic/memory-management`, `/en/network&broswer/broswer-render`
- Produce a “memory-leak investigation flowchart” (discover → locate → fix → verify)
- Produce a browser rendering flowchart (DOM → CSSOM → Render Tree → Layout → Paint → Composite)

## Read in order

1. [Memory Management](../jscore/basic/memory-management)
2. [Browser Rendering](../network&broswer/broswer-render)

## Practice and self-check

**Checkpoints**

- V8 GC: young generation Scavenge + old generation Mark-Sweep / Mark-Compact
- Common leak sources: globals, closures holding data, unbound events, detached DOM, timers
- `transform` / `opacity` go through the compositor layer, skip layout, and outperform `top / left`

**Produce or redraw from memory**

- V8 generational GC — [reference section](../jscore/basic/memory-management#day-5-v8-generational-gc)
- Common memory-leak scenarios — [reference section](../jscore/basic/memory-management#day-5-common-memory-leak-scenarios)
- WeakMap / WeakSet — [reference section](../jscore/basic/memory-management#day-5-weakmap-weakset)
- Browser rendering pipeline — [reference section](../network&broswer/broswer-render#day-5-browser-rendering-pipeline)
- Conditions that create a compositor layer — [reference section](../network&broswer/broswer-render#day-5-conditions-that-create-a-compositor-layer)
- Investigation flow — [reference section](../jscore/basic/memory-management#day-5-investigation-flow)
- Full rendering-pipeline diagram — [reference section](../network&broswer/broswer-render#day-5-full-rendering-pipeline-diagram)
- DevTools steps for investigating memory leaks — [reference section](../jscore/basic/memory-management#day-5-devtools-steps-for-investigating-memory-leaks)

**Answer aloud without reading a reference answer**

- 1. Why can `WeakMap` reduce leak risk?
- 2. Why are `transform` animations usually more stable than `top/left`?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. GC (young-generation Scavenge + old-generation Mark-Sweep) + 6 leak scenarios (2 minutes)
2. Investigation flow (discover → locate → fix → verify) + the WeakMap approach (1.5 minutes)
3. Rendering pipeline + reflow / repaint / composite + why `transform` wins (1.5 minutes)

Self-check after recording:

- Did you say how the young and old generations divide the work?
- Did you say 3+ leak scenarios and the matching fixes?
- Did you say `transform` goes through the compositor and does not trigger Layout?
- Did you say what WeakMap weak references mean?

## Recap

The 3 points that most need follow-up today:

1. The concrete flow of V8 incremental / concurrent marking, and how to say it briefly in an interview.
2. Side effects of overusing `will-change` (extra GPU memory).
3. How to read the Performance panel frame chart, and which metrics indicate jank.
