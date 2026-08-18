# Advanced CSS: BFC, CSS Modules, CSS-in-JS, Tailwind

## 1. BFC (block formatting context)

### How you trigger it

- `overflow: hidden/auto/scroll`
- `display: flow-root`
- `position: absolute/fixed`
- `float` other than `none`

### What it does

- Contain floats.
- Stop margin collapse.
- An independent layout context, less interference from outside.

## 2. CSS Modules vs CSS-in-JS vs Tailwind

### CSS Modules

- Class names isolated at compile time. Low mental cost; fits mid-to-large apps.

### CSS-in-JS (e.g. styled-components)

- Styles live with the component; strong for dynamic styles.
- Watch runtime cost and SSR setup.

### Tailwind CSS

- Utility classes: fast to write, consistent look.
- The team needs a convention so class strings don’t become unreadable.

## 3. How to answer

Don’t compare syntax. Talk team size, reuse, performance, and maintenance cost.
