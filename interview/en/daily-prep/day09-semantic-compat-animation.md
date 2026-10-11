# Day 9 Semantics / Compatibility / Animation

## Goals

- Finish `/en/html&css/semantic-tag`, `/en/browser-compatibility`, `/en/animation`
- Produce one page of an *HTML/CSS High-Frequency Pitfalls* outline
- Produce a table mapping animation properties to rendering cost

## Read in order

1. [Semantic Tags](../html&css/semantic-tag)
2. [Browser Compatibility](../html&css/browser-compatibility)
3. [Animation](../html&css/animation)
4. [HTML5 Features](../html&css/html5-feature)

## Practice and self-check

**Checkpoints**

- Semantics is not only SEO; it is also accessibility (screen readers) and readability for team collaboration
- For CSS compatibility you should be able to explain the combined meaning of prefixes + PostCSS + Browserslist
- Only `transform / opacity` class animations go through the compositor; `width / height / top / left` trigger Layout

**Produce or redraw from memory**

- Semantic tags — [reference section](../html&css/semantic-tag#day-9-semantic-tags)
- Browser compatibility pipeline — [reference section](../html&css/browser-compatibility#day-9-browser-compatibility-pipeline)
- Three CSS animation cost classes — [reference section](../html&css/animation#day-9-three-css-animation-cost-classes)
- CSS animation vs JS animation — [reference section](../html&css/animation#day-9-css-animation-vs-js-animation)
- HTML5 features cheat sheet — [reference section](../html&css/html5-feature#day-9-html5-features-cheat-sheet)
- Animations that trigger Layout vs Composite-only — [reference section](../html&css/animation#day-9-animations-that-trigger-layout-vs-composite-only)
- Fade in / fade out — [reference section](../html&css/animation#day-9-fade-in-fade-out)

**Answer aloud without reading a reference answer**

- 1. Why bother with semantics?
- 2. Why do some animations drop frames?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Three values of semantics (SEO / accessibility / maintainability) (1 minute)
2. Compatibility pipeline (PostCSS + Browserslist + Babel) (2 minutes)
3. Animation performance layers (Layout / Paint / Composite) + why frames drop (2 minutes)

Self-check after recording:

- Did you name the 3 core values of semantics?
- Did you say how PostCSS and Browserslist work together?
- Did you say `transform / opacity` go through the compositor and skip Layout?
- Did you mention the 16.67ms frame budget?

## Recap

The 3 points that most need follow-up today:

1. `<article>` vs `<section>` (`article` is independently citable; `section` is a thematic partition).
2. The memory cost of overusing `will-change`, and when to add it vs when not to.
3. Basic Web Animations API usage (`element.animate()`) compared with CSS animation.
