# Day 9 Semantics / Compatibility / Animation Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 9 | Semantics / compatibility / animation | [Semantic Tags](../html&css/semantic-tag), [Browser Compatibility](../html&css/browser-compatibility), [Animation](../html&css/animation), [HTML5 Features](../html&css/html5-feature) |

## Today's goals

- Finish `/en/html&css/semantic-tag`, `/en/browser-compatibility`, `/en/animation`
- Produce one page of an *HTML/CSS High-Frequency Pitfalls* outline
- Produce a table mapping animation properties to rendering cost

## Reading checkpoints

- Semantics is not only SEO; it is also accessibility (screen readers) and readability for team collaboration
- For CSS compatibility you should be able to explain the combined meaning of prefixes + PostCSS + Browserslist
- Only `transform / opacity` class animations go through the compositor; `width / height / top / left` trigger Layout

## Cheat sheet / knowledge points

### Semantic tags

| Tag | Meaning | Alternative |
|------|------|----------|
| `<header>` | page / section header | `<div class="header">` |
| `<nav>` | navigation | `<div class="nav">` |
| `<main>` | main content (unique on the page) | `<div class="main">` |
| `<article>` | independent content (citable) | `<div class="article">` |
| `<section>` | thematic section | `<div class="section">` |
| `<aside>` | sidebar / complementary content | `<div class="sidebar">` |
| `<footer>` | page / section footer | `<div class="footer">` |
| `<figure>` / `<figcaption>` | illustration + caption | `<div>` + `<p>` |

Three values of semantics:

1. **SEO**: search engines can understand page structure.
2. **Accessibility**: screen readers can announce page hierarchy correctly.
3. **Maintainability**: code is more readable in team collaboration.

### Browser compatibility pipeline

```text
Write modern syntax in development
  → PostCSS + Autoprefixer add prefixes automatically
  → Browserslist configures target browsers
  → Babel / core-js handle JS polyfills
  → Build output matches the target range
```

Browserslist config example:

```text
> 0.5%, last 2 versions, not dead
```

### Three CSS animation cost classes

| Property type | Stages triggered | Cost | Examples |
|----------|----------|------|------|
| Geometry | Layout + Paint + Composite | highest | `width / height / top / left / margin` |
| Appearance | Paint + Composite | medium | `color / background / box-shadow` |
| Compositor | Composite only | lowest | `transform / opacity` |

### CSS animation vs JS animation

- **CSS `transition` / `animation`**: simple state changes; the browser can optimize onto the compositor; good performance.
- **JS `requestAnimationFrame`**: complex control (pause, reverse, chaining); frame-synced.
- **Web Animations API**: combines the strengths; concise API; native browser support.

### HTML5 features cheat sheet

- `<canvas>` / `<svg>`: drawing.
- `<video>` / `<audio>`: media.
- `<input type="date/email/range">`: richer forms.
- `localStorage / sessionStorage`: local storage.
- `Geolocation / Drag & Drop / Web Worker`: device capabilities.

## Handwritten notes / flowcharts

### Animations that trigger Layout vs Composite-only

```css
/* ❌ Triggers Layout (reflow every frame) */
@keyframes move-bad {
  from { top: 0; }
  to { top: 100px; }
}
.box-bad {
  position: relative;
  animation: move-bad 1s infinite;
}

/* ✅ Composite only (GPU composite, high performance) */
@keyframes move-good {
  from { transform: translateY(0); }
  to { transform: translateY(100px); }
}
.box-good {
  animation: move-good 1s infinite;
  will-change: transform;
}
```

### Fade in / fade out

```css
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
```

## Oral questions

### 1. Why bother with semantics?

Answer template:

> Semantics has three core values. First, SEO: search engines can understand structure and weight from tags like `<article>`, `<nav>`, and `<main>`. Second, accessibility: screen readers build a navigation outline from semantic tags, so visually impaired users can jump to main content quickly. Third, team maintainability: `<header>` states intent more clearly than `<div class="header">`, which is obvious in code review.
>
> In practice: use `header / main / footer` as the page skeleton, `article / section` for content blocks, `aside` for sidebars, and `nav` for navigation. Associate form controls with `<label>` + `for`, and describe images with `alt`.

### 2. Why do some animations drop frames?

Answer template:

> Dropped frames mean one frame’s render time exceeds 16.67ms (the 60fps frame budget). The pipeline is Layout → Paint → Composite. If the animated property triggers Layout (for example `width / top / left`), every frame reflows, which is expensive and easy to miss the budget.
>
> The fix is to animate properties that only trigger Composite, mainly `transform` and `opacity`. They are handled by the GPU and skip Layout and Paint. You can also use `will-change: transform` to create a compositor layer ahead of time.
>
> Also note: heavy JS on the main thread delays animation frame callbacks. Use `requestAnimationFrame` for frame sync, or move heavy computation to a Web Worker.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Three values of semantics (SEO / accessibility / maintainability) (1 minute)
2. Compatibility pipeline (PostCSS + Browserslist + Babel) (2 minutes)
3. Animation performance layers (Layout / Paint / Composite) + why frames drop (2 minutes)

Self-check after recording:

- Did you name the 3 core values of semantics?
- Did you say how PostCSS and Browserslist work together?
- Did you say `transform / opacity` go through the compositor and skip Layout?
- Did you mention the 16.67ms frame budget?

## Today's review

The 3 points that most need follow-up today:

1. `<article>` vs `<section>` (`article` is independently citable; `section` is a thematic partition).
2. The memory cost of overusing `will-change`, and when to add it vs when not to.
3. Basic Web Animations API usage (`element.animate()`) compared with CSS animation.
