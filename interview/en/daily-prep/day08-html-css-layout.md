# Day 8 HTML/CSS High-Frequency Layout

## Goals

- Finish `/en/html&css/layout`, `/en/box-model`, `/en/responsive-design`, `/en/advanced/css-advanced`, `/en/advanced/mobile-and-cross-platform`
- Summarize BFC trigger conditions + use cases
- Produce a rem / vw / safe-area selection comparison table

## Read in order

1. [Layout](../html&css/layout)
2. [Box Model](../html&css/box-model)
3. [Responsive Design](../html&css/responsive-design)
4. [CSS Advanced](../advanced/css-advanced)

## Practice and self-check

**Checkpoints**

- Box model `content-box` vs `border-box`: whether computed width includes padding/border
- BFC is not only triggered by `overflow: hidden`; also `display: flow-root`, floats, positioning, etc.
- The 1px problem on mobile is essentially physical pixels vs CSS pixels when dpr > 1

**Produce or redraw from memory**

- Box model — [reference section](../html&css/box-model#day-8-box-model)
- BFC (Block Formatting Context) — [reference section](../html&css/layout#day-8-bfc-block-formatting-context)
- Flex layout — [reference section](../html&css/layout#day-8-flex-layout)
- Grid layout — [reference section](../html&css/layout#day-8-grid-layout)
- Mobile adaptation options — [reference section](../html&css/responsive-design#day-8-mobile-adaptation-options)
- The 1px problem — [reference section](../html&css/responsive-design#day-8-the-1px-problem)
- Three-column layout comparison — [reference section](../html&css/layout#day-8-three-column-layout-comparison)
- Horizontal and vertical centering (4 ways) — [reference section](../html&css/layout#day-8-horizontal-and-vertical-centering-4-ways)

**Answer aloud without reading a reference answer**

- 1. How do you solve the 1px problem?
- 2. How do you choose CSS Modules / CSS-in-JS / Tailwind?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Box model (content-box vs border-box) + BFC triggers and uses (1.5 minutes)
2. Flex core + Grid basics + three-column layout (2 minutes)
3. Mobile adaptation + 1px fixes (1.5 minutes)

Self-check after recording:

- Did you name at least 3 BFC triggers?
- Did you expand `flex: 1`?
- Did you say the 1px problem is essentially dpr?
- Did you name at least 2 centering approaches?

## Recap

The 3 points that most need follow-up today:

1. Concrete syntax and fit of `grid-template-areas` named regions.
2. Real iOS setup for `safe-area-inset-*` (`viewport-fit=cover` + `env()`).
3. How `flex-shrink` is computed (overflow space distributed by shrink ratio).
