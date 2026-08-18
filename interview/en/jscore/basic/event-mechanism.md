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
