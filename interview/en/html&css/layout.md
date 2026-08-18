### CSS Layout
CSS provides several layout methods. Flex and Grid are the most common modern options.

#### 1. Flex Layout
##### 1.1 Basic Concepts
```css
.container {
  display: flex;
  /* or */
  display: inline-flex;
}
```

##### 1.2 Container Properties
```css
.container {
  /* main axis direction */
  flex-direction: row; /* default */
  flex-direction: row-reverse;
  flex-direction: column;
  flex-direction: column-reverse;

  /* wrap or not */
  flex-wrap: nowrap; /* default */
  flex-wrap: wrap;
  flex-wrap: wrap-reverse;

  /* main-axis alignment */
  justify-content: flex-start; /* default */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;

  /* cross-axis alignment */
  align-items: stretch; /* default */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline;

  /* multi-line alignment */
  align-content: stretch; /* default */
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
}
```

##### 1.3 Item Properties
```css
.item {
  /* order */
  order: 0; /* default */

  /* grow factor */
  flex-grow: 0; /* default */

  /* shrink factor */
  flex-shrink: 1; /* default */

  /* base size */
  flex-basis: auto; /* default */

  /* shorthand */
  flex: 0 1 auto; /* default */
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */

  /* individual alignment */
  align-self: auto; /* default */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
```

#### 2. Grid Layout
##### 2.1 Basic Concepts
```css
.container {
  display: grid;
  /* or */
  display: inline-grid;
}
```

##### 2.2 Container Properties
```css
.container {
  /* define columns */
  grid-template-columns: 100px 100px 100px;
  grid-template-columns: repeat(3, 100px);
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-columns: minmax(100px, 1fr);

  /* define rows */
  grid-template-rows: 100px 100px 100px;
  grid-template-rows: repeat(3, 100px);
  grid-template-rows: 1fr 2fr 1fr;

  /* define areas */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";

  /* column gap */
  column-gap: 20px;

  /* row gap */
  row-gap: 20px;

  /* shorthand */
  gap: 20px;
  gap: 20px 30px;

  /* alignment */
  justify-items: stretch; /* default */
  justify-items: start;
  justify-items: end;
  justify-items: center;

  align-items: stretch; /* default */
  align-items: start;
  align-items: end;
  align-items: center;

  /* whole-container alignment */
  justify-content: start;
  justify-content: end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;

  align-content: start;
  align-content: end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: space-evenly;
}
```

##### 2.3 Item Properties
```css
.item {
  /* position */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;

  /* shorthand */
  grid-column: 1 / 3;
  grid-row: 1 / 3;

  /* area */
  grid-area: header;

  /* alignment */
  justify-self: stretch; /* default */
  justify-self: start;
  justify-self: end;
  justify-self: center;

  align-self: stretch; /* default */
  align-self: start;
  align-self: end;
  align-self: center;
}
```

#### 3. Layout Applications
##### 3.1 Flex Layout Applications
```css
/* horizontal centering */
.container {
  display: flex;
  justify-content: center;
}

/* vertical centering */
.container {
  display: flex;
  align-items: center;
}

/* center both axes */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* equal-width layout */
.container {
  display: flex;
}
.item {
  flex: 1;
}

/* responsive navigation */
.nav {
  display: flex;
  flex-wrap: wrap;
}
.nav-item {
  flex: 1 1 200px;
}
```

##### 3.2 Grid Layout Applications
```css
/* grid layout */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* page layout */
.page {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* card layout */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 4. Best Practices
1. Choose the right layout method
2. Use shorthand properties for efficiency
3. Consider responsive design
4. Use CSS variables to manage sizes
5. Watch browser compatibility
6. Debug with DevTools
7. Follow BEM naming
8. Keep the code clean
9. Consider performance
10. Do code reviews

#### 5. Common Interview Questions
1. **Differences between Flex and Grid**
   - Flex is one-dimensional
   - Grid is two-dimensional
   - Flex fits linear layouts
   - Grid fits complex grids

2. **Flex layout use cases**
   - Navigation bars
   - Card layouts
   - Centering
   - Equal-width layouts

3. **Grid layout use cases**
   - Overall page layout
   - Complex grid systems
   - Responsive layouts
   - Irregular layouts 

#### 6. High-Frequency Follow-ups (Layout)

##### 6.1 What `flex: 1` actually means
`flex: 1` is equivalent to `flex: 1 1 0%`: it can grow, can shrink, and the base size is 0.  
A common follow-up: why might `width` not take effect? Because `flex-basis` participates in size calculation.

##### 6.2 The classic `min-width: 0` pitfall
In a flex container, items default to `min-width: auto`, so long text can overflow the container.  
Fix: set `min-width: 0` on the item (often with `overflow: hidden`).

##### 6.3 Grid `auto-fit` vs `auto-fill`
- `auto-fit`: "collapses" empty tracks so existing columns stretch to fill the space.
- `auto-fill`: keeps empty tracks as placeholders.

##### 6.4 How to answer Holy Grail / Double Flying Wings in a modern way
Prefer: today we usually implement them with Flex or Grid; only consider float for legacy projects.  
Bonus: explain why the old approaches needed middle-column-first rendering and fixed-width side columns.

##### 6.5 Layout performance tips
1. Reduce deep nesting and complex selectors.
2. Prefer `transform/opacity` for frequently changing animations.
3. For layout thrashing, first check "read/write interleaving" and synchronous measurement (e.g. frequently reading `offsetHeight`).

---

#### 7. BFC (Block Formatting Context) in Depth

##### 7.1 What is a BFC
A BFC is an independent region in the Web rendering engine. Block-level boxes are laid out only inside the BFC.

**Conditions that create a BFC (common):**
```css
/* common ways to trigger it */
overflow: auto;        /* or hidden, scroll */
display: flow-root;    /* creates a BFC only, no side effects */
position: absolute/fixed;
float: left/right;
```

##### 7.2 BFC characteristics (must-know in interviews)
1. **Prevent margin collapse**: Adjacent block-level boxes in the same BFC have collapsing margins.
2. **Contain floats**: A BFC can contain floated elements (clear floats).
3. **Not overlapped by floats**: A BFC area is not covered by floated elements.

```html
<!-- margin collapse example -->
<div style=”margin-bottom: 20px;”></div>  <!-- same BFC, margins collapse -->
<div style=”margin-top: 30px;”></div>
<!-- the actual gap between the two divs is 30px, not 50px -->

<!-- use BFC to prevent collapse -->
<div style=”margin-bottom: 20px; overflow: hidden;”></div>
<div style=”margin-top: 30px; overflow: hidden;”></div>
<!-- the actual gap is 50px -->
```

##### 7.3 Deep rules of margin collapse

**Cases that do not collapse:**
1. There is a parent that creates a BFC.
2. The child has `display: inline-block`.
3. The parent has `column-count` (multi-column layout).
4. An element's height is 0 (does not collapse).

```css
/* parent creates a BFC */
.parent {
  overflow: hidden;  /* child's margin does not collapse with the parent */
}
```

> **High-frequency follow-up**: Why don't child margins collapse inside a flex container? — Because a flex container creates a new BFC (more precisely, flex items use a flex formatting context, which differs from block formatting).

##### 7.4 History of Holy Grail / Double Flying Wings (bonus)
- Core challenge of the old approach: render the middle column first + three columns with fixed widths.
- Solution: negative margins plus margin/padding to simulate the middle column's position.
- **Modern approach**: implement with Flex or Grid directly; no need for floats + negative margins.

---

#### 8. ICB and Containing Block (in depth)

##### 8.1 Initial Containing Block (ICB)
- The containing block of the root element is called the ICB.
- For the root element (`<html>`), the ICB equals the size of the initial viewport.
- Positioning of all descendants is relative to their containing block.

##### 8.2 How the containing block is calculated
```css
/* basis for element size */
div {
  /* percentage width/height is based on the containing block's width/height */
  width: 50%;  /* relative to the nearest containing block */

  /* offset basis for absolute positioning */
  position: absolute;
  top: 20%;   /* relative to the nearest containing block */
}
```

> **Interview follow-up**: For a `position: absolute` element, what is its containing block? — The nearest ancestor with `position: relative/absolute/fixed`. If none exists, it is the ICB (initial containing block).
