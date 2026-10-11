# Day 72 scenario: massive data / virtual list — execution log

## Goals

- Finish `/en/scenarios/massive-data-rendering`
- Output three virtual-list tiers: fixed height / dynamic height / variable height + buffer
- Handwrite a minimal fixed-height virtual-list demo

## Read in order

1. [Massive data rendering](../scenarios/massive-data-rendering)

## Practice and self-check

**Checkpoints**

- A virtual list only renders the viewport + buffer, then shifts with transform
- Dynamic height needs a **real-height index**; cache heights and binary-search into it
- With nested scrollers, listen on the right container or you get jank

**Produce or redraw from memory**

- Core idea — [reference section](../scenarios/massive-data-rendering#day-72-core-idea)
- Fixed-height math — [reference section](../scenarios/massive-data-rendering#day-72-fixed-height-math)
- Three tiers — [reference section](../scenarios/massive-data-rendering#day-72-three-tiers)
- Buffer strategy — [reference section](../scenarios/massive-data-rendering#day-72-buffer-strategy)
- Fixed-height core — [reference section](../scenarios/massive-data-rendering#day-72-fixed-height-core)
- Dynamic-height idea — [reference section](../scenarios/massive-data-rendering#day-72-dynamic-height-idea)

**Answer aloud without reading a reference answer**

- 1. Three main hard parts of a virtual list?
- 2. How do you locate rows precisely with dynamic height?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Why a virtual list (perf of 10,000 DOM nodes) (1 min)
2. Fixed-height impl (`scrollTop` → `startIndex` → visible items → transform offset) (2 min)
3. Dynamic height (estimate → measure → binary search) + buffer + recommended libs (2 min)

After recording, self-check:

- Did you say viewport-only + buffer.
- Did you state the fixed-height formulas.
- Did you mention binary search for dynamic height.
- Did you recommend a mature lib.

## Recap

The 3 points that most need a follow-up today:

1. Replacing scroll listeners with `IntersectionObserver` (fewer scroll events).
2. `content-visibility: auto` as a lightweight alternative.
3. Combining a virtual list with infinite scroll.
