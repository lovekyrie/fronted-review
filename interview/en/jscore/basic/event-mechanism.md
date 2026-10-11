# Events in depth: capture, bubble, delegation, custom events

## 1. Event flow

A browser event has three phases:

1. Capture (Window → the target).
2. Target (the node that was hit).
3. Bubble (target → ancestors).

```js
parent.addEventListener('click', () => console.log('capture'), true)
child.addEventListener('click', () => console.log('bubble'))
```

## 2. Event delegation

Bind once on a parent. Child events bubble up and are handled there.

```js
list.addEventListener('click', (e) => {
  const target = e.target.closest('[data-id]')
  if (!target) return
  console.log('click item:', target.dataset.id)
})
```

**How `closest` walks**: it starts at the node itself and goes up. Both cases work:

| Click target | `e.target` | `closest('[data-id]')` |
|---------|------------|---------------------------|
| Inner `<span>` | `<span>` | nearest ancestor `<li>` with `data-id` |
| The `<li>` itself | `<li>` | the `<li>` (it already matches) |

**So any click inside the item still resolves to the list-item boundary.**

### Why delegate

- Fewer listeners, less memory.
- Nodes added later work automatically; no rebinding.

## 3. Stopping the event

- `stopPropagation`: stop bubbling (does not cancel the default action).
- `preventDefault`: cancel the default action (e.g. an `<a>` navigation).

## 4. CustomEvent

Useful for component communication. Pass data in `detail`.

```js
const event = new CustomEvent('user:login', {
  detail: { userId: 'u001' }
})
window.dispatchEvent(event)
```

## 5. Easy interview traps

- `stopImmediatePropagation` also blocks later listeners on the **same** node.
- In delegation, `e.target` is often an inner child; `closest` is the usual fix.

## Daily practice reference

### Day 4: Three phases of the event flow

Event propagation in the DOM has three phases:

```text
1. Capture: from window down to the target node
2. Target: the event reaches the target node
3. Bubble: from the target node up to window
```

**Most events are handled in the bubbling phase by default**, unless the third argument of `addEventListener` is `true`.

### Day 4: Event Delegation

Attach the listener to a parent and use bubbling to handle child events in one place.

**Benefits**:
- Fewer listeners (especially for dynamic lists)
- Newly added children need no extra binding

**Caveats**:
- Not every event bubbles (`focus`, `blur`, `load`, `error` do not; use `focusin`/`focusout`)
- Delegation fits simple click/input events, not events that need a precise mouse position

### Day 4: Event-delegation demo: clicks on dynamic nodes matched with closest

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

### Day 4: Three-phase event-flow diagram

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
