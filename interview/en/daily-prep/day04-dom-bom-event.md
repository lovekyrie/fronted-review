# Day 4 DOM / BOM / Web API + Event Mechanism Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 4 | DOM / BOM / events | [DOM/BOM/Web API](../jscore/basic/dom-bom-webapi), [Event Mechanism](../jscore/basic/event-mechanism), [Other Web APIs](../jscore/basic/other-web-apis) |

## Today's goals

- Finish `/en/jscore/basic/dom-bom-webapi`, `/en/jscore/basic/event-mechanism`, `/en/jscore/basic/other-web-apis`
- Build an event-delegation demo (`closest` + dynamic nodes)
- Prepare answer templates for `IntersectionObserver` + `sendBeacon`

## Reading checkpoints

- The three event phases: capture / target / bubble, and the difference between `stopPropagation` and `stopImmediatePropagation`
- SPA URL changes without a page refresh: `history.pushState` + `popstate`, and the trade-offs of the hash approach
- Boundaries of common observer APIs: Intersection, Mutation, Resize, Performance

## Cheat sheet / knowledge points

### DOM tree vs render tree

```
DOM tree: HTML tags → node objects (Element / Text)
         ↓
Render tree: DOM nodes + CSS styles → layout calculation
         ↓
       paint → composite
```

Key point: the render tree only includes visible nodes. Nodes with `display: none` are not in the render tree.

### Common BOM objects

| Object | Role |
|------|------|
| `window` | global object, browser window |
| `navigator` | browser info (userAgent, onLine) |
| `location` | URL info (href, pathname, hash) |
| `history` | browsing history (pushState, replaceState, go/back/forward) |
| `screen` | screen info (width, height) |

### Three phases of the event flow

Event propagation in the DOM has three phases:

```text
1. Capture: from window down to the target node
2. Target: the event reaches the target node
3. Bubble: from the target node up to window
```

**Most events are handled in the bubbling phase by default**, unless the third argument of `addEventListener` is `true`.

### stopPropagation vs stopImmediatePropagation

| Method | Effect |
|------|------|
| `stopPropagation()` | stop the event from propagating to the next node, but other listeners of the same type on the current node still run |
| `stopImmediatePropagation()` | stop further propagation **and** stop other listeners of the same type on the current node |

```js
// stopPropagation example
el.addEventListener('click', handlerA)
el.addEventListener('click', handlerB)  // still runs

// stopImmediatePropagation example
el.addEventListener('click', handlerA)
el.addEventListener('click', handlerB)  // will not run
```

### Event Delegation

Attach the listener to a parent and use bubbling to handle child events in one place.

**Benefits**:
- Fewer listeners (especially for dynamic lists)
- Newly added children need no extra binding

**Caveats**:
- Not every event bubbles (`focus`, `blur`, `load`, `error` do not; use `focusin`/`focusout`)
- Delegation fits simple click/input events, not events that need a precise mouse position

### Common Observer API matrix

| API | What it observes | Typical use |
|-----|---------|----------|
| `IntersectionObserver` | an element entering/leaving the viewport | image lazy-load, infinite scroll, ad impression |
| `MutationObserver` | DOM node changes (add/remove/update attributes/children) | watching dynamic content |
| `ResizeObserver` | element size changes | adaptive layout, chart resize |
| `PerformanceObserver` | performance metrics (LargestContentfulPaint, FirstInputDelay, etc.) | Web Vitals monitoring |

### SPA routing: hash vs history

| Approach | Mechanism | Pros | Cons |
|------|------|------|------|
| **hash** | `location.hash` changes do not refresh the page | good compatibility, no backend config | ugly URLs, weak SEO |
| **history** | `history.pushState` + `popstate` | clean URLs, better SEO | needs backend support; refresh 404 needs a fallback |

```js
// hash approach
window.addEventListener('hashchange', () => {
  const path = location.hash.slice(1)
  render(path)
})

// history approach
window.addEventListener('popstate', () => {
  render(location.pathname)
})

// history.pushState does not fire popstate; only browser back/forward does
```

### sendBeacon

Used to send data reliably on page unload, without the request being cancelled because the page closed:

```js
// send data on unload without blocking page close
navigator.sendBeacon('/analytics', JSON.stringify({ event: 'pageview' }))
```

Typical uses: analytics beacons, leave-rate stats.

## Handwritten notes / flowcharts

### Event-delegation demo: clicks on dynamic nodes matched with closest

```html
<ul id="list">
  <!-- generated dynamically -->
</ul>
```

```js
// Event delegation: attach the listener to ul, bind once
const list = document.getElementById('list')

list.addEventListener('click', (e) => {
  // closest walks up to the nearest ancestor matching the selector
  const item = e.target.closest('[data-id]')
  if (!item) return

  const id = item.dataset.id
  console.log('clicked item:', id)

  // business logic: edit, delete, navigate, etc.
  handleItemClick(id)
})

// Dynamically add a new node; no extra binding needed
const newItem = document.createElement('li')
newItem.dataset.id = '100'
newItem.textContent = 'New node'
list.appendChild(newItem)
// clicks on the new node are handled by the same delegation
```

### Three-phase event-flow diagram

```text
window
  ↓ capture
document
  ↓ capture
body
  ↓ capture
<div id="outer">
  ↓ capture
<div id="inner">    ←── target
  ↑ bubble
</div>
  ↑ bubble
</div>
  ↑ bubble
body
  ↑ bubble
document
  ↑ bubble
window
```

## Oral questions

### 1. Why can an SPA change the URL without refreshing the page?

Answer template:

> The core of changing the URL without a refresh is the browser History API. A traditional page requests new HTML from the server on every navigation, but an SPA renders content with JavaScript and does not refresh the page itself.
>
> History API provides two key methods: `pushState` and `replaceState`. They can change the browser URL and history stack **without triggering a page refresh**. Combined with the `popstate` event for back/forward, the SPA can render the matching content when the URL changes.
>
> The hash approach is the other option: `location.hash` changes do not refresh the page, but the URL contains `#`, which is less pretty and weaker for SEO. With backend support, history is the better choice.

### 2. How do you explain capture / bubbling in a business context?

Answer template:

> The three phases are capture → target → bubble. Most real product code uses bubbling, because it matches the “inside-out” intuition — click a button, handle the button first, then let the outer container do shared handling.
>
> Event delegation is the classic bubbling example: a list of 100 items does not need 100 listeners. Bind one on the outer container and use `e.target` to see which item was clicked. Newly added items are handled automatically.
>
> Capture is used less often, but sometimes you need it: for example a component with an inner input, where the outside should intercept first and then let the input respond — handle that in the capture phase.
>
> Two more important differences: `stopPropagation` only stops outward propagation, while other same-type listeners on the current node still run; `stopImmediatePropagation` is stronger and also stops those other listeners on the current node.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. DOM / BOM basics (1 minute)
2. Three event-flow phases + delegation in practice (2 minutes)
3. When to use IntersectionObserver / MutationObserver / sendBeacon (2 minutes)

Self-check after recording:

- Did you say the order capture → target → bubble?
- Did you say the difference between `stopPropagation` and `stopImmediatePropagation`?
- Did you say when event delegation fits (dynamic lists, fewer listeners)?
- Did you say the trade-offs between hash and history routing?

## Today's review

The 3 points that most need follow-up today:

1. `focus`/`blur` do not bubble; in interviews you should be able to say use `focusin`/`focusout` instead.
2. `IntersectionObserver` threshold config and what `rootMargin` does.
3. `history.pushState` does not fire `popstate`; list clearly which actions do.
