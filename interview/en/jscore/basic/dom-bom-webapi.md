# DOM / BOM / Web APIs in depth

## 1. Common DOM APIs

### Find and create nodes

- Query: `querySelector`, `querySelectorAll`, `getElementById`.
- Create: `createElement`, `createTextNode`, `DocumentFragment`.
- Insert: `append`, `prepend`, `before`, `replaceWith`.
- Remove: `remove`.

```js
const ul = document.querySelector('#list')
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li')
  li.textContent = `item-${i}`
  fragment.append(li)
}
ul.append(fragment) // batch insert to reduce reflow
```

## 2. Walking the DOM tree

- Up: `parentElement`, `closest`.
- Down: `children`, `firstElementChild`.
- Siblings: `previousElementSibling`, `nextElementSibling`.

Interview follow-up: how you would hand-write **DFS / BFS** over the tree.

## 3. BOM and History API

- Core BOM objects: `window`, `location`, `history`, `navigator`.
- `history.pushState` / `replaceState` are the base of SPA routing.
- `popstate` fires on browser back / forward.

```js
history.pushState({ from: 'home' }, '', '/profile')
window.addEventListener('popstate', (event) => {
  console.log('state changed:', event.state)
})
```

## 4. Interview checklist

- How to cut DOM cost: batch updates, virtual DOM, event delegation.
- Why SPA routes do not reload: `pushState` changes the URL without a full navigation.

## Daily practice reference

### Day 4: DOM tree vs render tree

```
DOM tree: HTML tags → node objects (Element / Text)
         ↓
Render tree: DOM nodes + CSS styles → layout calculation
         ↓
       paint → composite
```

Key point: the render tree only includes visible nodes. Nodes with `display: none` are not in the render tree.

### Day 4: Common BOM objects

| Object | Role |
|------|------|
| `window` | global object, browser window |
| `navigator` | browser info (userAgent, onLine) |
| `location` | URL info (href, pathname, hash) |
| `history` | browsing history (pushState, replaceState, go/back/forward) |
| `screen` | screen info (width, height) |

### Day 4: stopPropagation vs stopImmediatePropagation

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

### Day 4: Common Observer API matrix

| API | What it observes | Typical use |
|-----|---------|----------|
| `IntersectionObserver` | an element entering/leaving the viewport | image lazy-load, infinite scroll, ad impression |
| `MutationObserver` | DOM node changes (add/remove/update attributes/children) | watching dynamic content |
| `ResizeObserver` | element size changes | adaptive layout, chart resize |
| `PerformanceObserver` | performance metrics (LargestContentfulPaint, FirstInputDelay, etc.) | Web Vitals monitoring |

### Day 4: SPA routing: hash vs history

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
