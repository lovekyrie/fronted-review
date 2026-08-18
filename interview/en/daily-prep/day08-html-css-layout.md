# Day 8 HTML/CSS High-Frequency Layout Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 8 | HTML/CSS layout | [Layout](../html&css/layout), [Box Model](../html&css/box-model), [Responsive Design](../html&css/responsive-design), [CSS Advanced](../advanced/css-advanced) |

## Today's goals

- Finish `/en/html&css/layout`, `/en/box-model`, `/en/responsive-design`, `/en/advanced/css-advanced`, `/en/advanced/mobile-and-cross-platform`
- Summarize BFC trigger conditions + use cases
- Produce a rem / vw / safe-area selection comparison table

## Reading checkpoints

- Box model `content-box` vs `border-box`: whether computed width includes padding/border
- BFC is not only triggered by `overflow: hidden`; also `display: flow-root`, floats, positioning, etc.
- The 1px problem on mobile is essentially physical pixels vs CSS pixels when dpr > 1

## Cheat sheet / knowledge points

### Box model

- **`content-box`** (default): `width` is content only; actual space = width + padding + border.
- **`border-box`**: `width` includes content + padding + border; more intuitive.
- Engineering default: `*, *::before, *::after { box-sizing: border-box; }`

### BFC (Block Formatting Context)

Trigger conditions:

- `overflow` is not `visible` (e.g. `hidden / auto`)
- `display: flow-root` (the cleanest way)
- `float` is not `none`
- `position: absolute / fixed`
- `display: inline-block / flex / grid`

Use cases:

- Clear floats (parent `display: flow-root`).
- Prevent margin collapsing.
- Adaptive two-column layout (a BFC does not overlap floats).

### Flex layout

```text
main axis     →   justify-content  aligns on the main axis
cross axis    →   align-items      aligns on the cross axis
```

Common properties:

- `flex: 1` = `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`
- `gap`: spacing without margin, cleaner.
- `order`: reorder children.

### Grid layout

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

- `fr` unit: remaining space by ratio.
- `grid-template-areas`: named regions, good for complex page layouts.
- `minmax(200px, 1fr)`: responsive column width.

### Mobile adaptation options

| Option | Mechanism | Fit for |
|------|------|----------|
| `rem` + dynamic `html font-size` | proportional scale | campaign pages that scale as a whole |
| `vw / vh` | viewport percentage | preferred on modern mobile |
| `px` + media queries | breakpoint adaptation | multi-end responsive on PC |
| `safe-area-inset-*` | safe area | notch / home indicator |

### The 1px problem

Essence: when dpr > 1, 1 CSS px maps to multiple physical pixels, so borders look thicker.

Fixes:
- `transform: scaleY(0.5)` + a pseudo-element (most common).
- `border-image` / SVG.
- `@media (-webkit-min-device-pixel-ratio: 2)` conditional adaptation.

## Handwritten notes / flowcharts

### Three-column layout comparison

```css
/* Option 1: Flex (recommended) */
.container { display: flex; }
.left { width: 200px; }
.center { flex: 1; }
.right { width: 200px; }

/* Option 2: Grid */
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}

/* Option 3: float + BFC */
.left { float: left; width: 200px; }
.right { float: right; width: 200px; }
.center { overflow: hidden; /* BFC does not overlap floats */ }
```

### Horizontal and vertical centering (4 ways)

```css
/* 1. Flex */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. Grid */
.parent { display: grid; place-items: center; }

/* 3. Absolute positioning + transform */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* 4. Absolute positioning + margin: auto */
.child { position: absolute; inset: 0; margin: auto; width: 100px; height: 100px; }
```

## Oral questions

### 1. How do you solve the 1px problem?

Answer template:

> The 1px problem is that on high-dpr devices, 1 CSS pixel maps to 2 or 3 physical pixels, so borders look thicker.
>
> The most common fix is a pseudo-element + `transform: scaleY(0.5)`: add an `::after` with `border-bottom: 1px solid`, then scale with `transform: scaleY(0.5)` so it looks like 0.5px. You can also use `@media (-webkit-min-device-pixel-ratio: 2)` so it only applies on high-dpr devices.
>
> Other options: `border-image` drawing the line with SVG, or scaling the whole page with viewport `initial-scale=0.5` (large side effects, almost never used). In real projects the pseudo-element approach is the most stable.

### 2. How do you choose CSS Modules / CSS-in-JS / Tailwind?

Answer template:

> CSS Modules isolate scope at compile time by generating unique class names. They fit medium-to-large projects, similar to Vue scoped style, with zero runtime cost.
>
> CSS-in-JS (styled-components / Emotion) writes styles in JS. The benefit is using JS variables for dynamic styles, but there is runtime cost, and SSR needs extra handling. It is common in the React ecosystem and less so in Vue.
>
> Tailwind is atomic CSS: compose styles from predefined utility classes. Production bundles stay small (PurgeCSS) and development is fast, but templates get long. It fits fast iteration and teams with a unified design system.
>
> Selection: Vue projects prefer scoped style + CSS Modules; highly dynamic styles use CSS-in-JS; speed and consistency use Tailwind.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Box model (content-box vs border-box) + BFC triggers and uses (1.5 minutes)
2. Flex core + Grid basics + three-column layout (2 minutes)
3. Mobile adaptation + 1px fixes (1.5 minutes)

Self-check after recording:

- Did you name at least 3 BFC triggers?
- Did you expand `flex: 1`?
- Did you say the 1px problem is essentially dpr?
- Did you name at least 2 centering approaches?

## Today's review

The 3 points that most need follow-up today:

1. Concrete syntax and fit of `grid-template-areas` named regions.
2. Real iOS setup for `safe-area-inset-*` (`viewport-fit=cover` + `env()`).
3. How `flex-shrink` is computed (overflow space distributed by shrink ratio).
