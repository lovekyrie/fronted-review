# Day 58 Browser Rendering Pipeline Execution Log

## Quick Navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 58 | Rendering pipeline | [Browser Rendering](../network&broswer/broswer-render), [Performance Optimization](../advanced/week6/performance-optimization) |

## Today's Goals

- Finish `/en/network&broswer/broswer-render` and the Chrome Rendering Performance docs
- Draw a complete rendering-pipeline diagram: Parse → Style → Layout → Paint → Composite
- Output an answer script for “what kind of CSS change only triggers Composite”

## Reading Checkpoints

- Reflow triggers Layout; Repaint does not trigger Layout; compositing only goes through Composite
- Will-change, transform3d, and position:fixed can all promote a compositing layer
- Too many compositing layers backfire too: GPU memory usage + layer-merging cost

## Cheat Sheet / Knowledge Points

### 5 steps of the rendering pipeline

```text
1. Parse: HTML → DOM tree, CSS → CSSOM tree
2. Style: DOM + CSSOM → Render Tree (does not include display:none)
3. Layout: compute geometry for each node (position, size)
4. Paint: generate paint commands (color, border, shadow, etc.)
5. Composite: merge multiple layers; GPU outputs to the screen
```

### Trigger-level comparison table

| Operation type | Triggered stages | Example properties |
|----------|----------|----------|
| **Reflow** | Layout → Paint → Composite | `width / height / margin / padding / display / position / font-size` |
| **Repaint** | Paint → Composite | `color / background / visibility / box-shadow / border-color` |
| **Composite only** | Composite | `transform / opacity / will-change` |

### Conditions for compositing-layer promotion

- `transform: translateZ(0)` or `translate3d()`
- `will-change: transform / opacity`
- `position: fixed` (some browsers)
- `<video>` / `<canvas>` / `<iframe>`
- CSS `filter` / `backdrop-filter`

### Common operations that trigger reflow

```js
// Reading layout information forces synchronous reflow (Layout Thrashing)
el.offsetTop / el.offsetHeight
el.getBoundingClientRect()
window.getComputedStyle(el)
el.scrollTop
```

## Handwritten / Flowcharts

### Complete rendering pipeline

```text
HTML bytes → decode → Tokenize → build DOM Tree
                                     ↓
CSS bytes → decode → Tokenize → build CSSOM Tree
                                     ↓
                              Render Tree (DOM + CSSOM, excluding display:none)
                                     ↓
                              Layout (compute geometry)
                                     ↓
                              Paint (generate paint commands, by layer)
                                     ↓
                              Composite (GPU composites layers, output to screen)
```

### Avoid Layout Thrashing

```js
// ❌ Alternating reads and writes; each read forces a synchronous reflow
for (let i = 0; i < items.length; i++) {
  items[i].style.width = container.offsetWidth + 'px'  // read → write → read → write
}

// ✅ Batch reads, then batch writes
const width = container.offsetWidth  // read once
for (let i = 0; i < items.length; i++) {
  items[i].style.width = width + 'px'  // write only
}
```

### Animations that only trigger Composite

```css
/* ✅ Only triggers the compositing layer; smooth 60fps animation */
.animate {
  transform: translateX(100px);
  opacity: 0.5;
  will-change: transform, opacity;
}

/* ❌ Triggers reflow; poor performance */
.animate-bad {
  left: 100px;  /* triggers Layout */
  width: 200px; /* triggers Layout */
}
```

## Oral Questions

### 1. Differences among Reflow / Repaint / Composite?

Answer template:

> They are different stages of the rendering pipeline. Reflow changes an element's geometry (position, size) and needs Layout → Paint → Composite again, which is the most expensive. Repaint only changes appearance (color, shadow), does not need Layout again, and skips one step. Composite only changes compositing-layer properties (transform, opacity), goes straight to GPU compositing, does not need the main thread, and is the most efficient.
>
> Optimization principle: try to make animations trigger only Composite. Use `transform` instead of `left/top`, and `opacity` instead of `visibility`. Use `will-change` to tell the browser in advance to create a compositing layer.

### 2. Are more compositing layers always better?

Answer template:

> No. The benefit of compositing layers is that animation does not go through the main thread and does not block JS execution. But each compositing layer needs extra GPU memory to store textures. If there are too many layers (for example adding `will-change` to every list item), GPU memory explodes and performance drops instead.
>
> There is also the "implicit compositing" problem: after an element is promoted to a compositing layer, elements stacked above it may also be promoted implicitly, causing layer count to run out of control. The right approach is to promote only elements that need animation, and check the actual layer count with Chrome DevTools' Layers panel.

## 5-Minute Recording Sequence

Record in this order; do not reorganize on the fly:

1. 5 steps of the rendering pipeline (Parse → Style → Layout → Paint → Composite) (1.5 minutes)
2. Trigger conditions for Reflow / Repaint / Composite + Layout Thrashing (2 minutes)
3. Conditions for compositing-layer promotion + trade-offs + will-change usage principles (1.5 minutes)

Self-check after recording:

- Did you state the 5-step pipeline.
- Did you state that transform/opacity only trigger Composite.
- Did you state that reading offsetTop forces a synchronous reflow.
- Did you state that too many compositing layers consume GPU memory.

## Today's Review

The 3 points that most need follow-up today:

1. The role of the CSS `contain` property (limit the scope of reflow).
2. The principle of `content-visibility: auto` for virtualized rendering.
3. How to identify long tasks and reflow in the Chrome Performance panel.
