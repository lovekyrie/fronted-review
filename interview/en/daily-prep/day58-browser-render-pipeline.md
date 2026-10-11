# Day 58 Browser Rendering Pipeline

## Goals

- Finish `/en/network&broswer/broswer-render` and the Chrome Rendering Performance docs
- Draw a complete rendering-pipeline diagram: Parse → Style → Layout → Paint → Composite
- Output an answer script for “what kind of CSS change only triggers Composite”

## Read in order

1. [Browser Rendering](../network&broswer/broswer-render)
2. [Performance Optimization](../advanced/week6/performance-optimization)

## Practice and self-check

**Checkpoints**

- Reflow triggers Layout; Repaint does not trigger Layout; compositing only goes through Composite
- Will-change, transform3d, and position:fixed can all promote a compositing layer
- Too many compositing layers backfire too: GPU memory usage + layer-merging cost

**Produce or redraw from memory**

- 5 steps of the rendering pipeline — [reference section](../network&broswer/broswer-render#day-58-5-steps-of-the-rendering-pipeline)
- Trigger-level comparison table — [reference section](../network&broswer/broswer-render#day-58-trigger-level-comparison-table)
- Conditions for compositing-layer promotion — [reference section](../network&broswer/broswer-render#day-58-conditions-for-compositing-layer-promotion)
- Common operations that trigger reflow — [reference section](../network&broswer/broswer-render#day-58-common-operations-that-trigger-reflow)
- Complete rendering pipeline — [reference section](../network&broswer/broswer-render#day-58-complete-rendering-pipeline)
- Avoid Layout Thrashing — [reference section](../network&broswer/broswer-render#day-58-avoid-layout-thrashing)
- Animations that only trigger Composite — [reference section](../network&broswer/broswer-render#day-58-animations-that-only-trigger-composite)

**Answer aloud without reading a reference answer**

- 1. Differences among Reflow / Repaint / Composite?
- 2. Are more compositing layers always better?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. 5 steps of the rendering pipeline (Parse → Style → Layout → Paint → Composite) (1.5 minutes)
2. Trigger conditions for Reflow / Repaint / Composite + Layout Thrashing (2 minutes)
3. Conditions for compositing-layer promotion + trade-offs + will-change usage principles (1.5 minutes)

Self-check after recording:

- Did you state the 5-step pipeline.
- Did you state that transform/opacity only trigger Composite.
- Did you state that reading offsetTop forces a synchronous reflow.
- Did you state that too many compositing layers consume GPU memory.

## Recap

The 3 points that most need follow-up today:

1. The role of the CSS `contain` property (limit the scope of reflow).
2. The principle of `content-visibility: auto` for virtualized rendering.
3. How to identify long tasks and reflow in the Chrome Performance panel.
