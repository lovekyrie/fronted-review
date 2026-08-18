# Day 39 Hand-writing mini-vue Renderer Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 39 | mini-vue renderer | [Rendering mechanism](../advanced/week3/rendering-mechanism), [Vue diff](../framework/vue/dom-diff) |

## Today's goals

- Add a minimal renderer to the mini-vue project: support `h / mount / patch / unmount`
- Implement three vnode types: element + text + fragment
- For children diff, first implement only **head-to-head + tail-to-tail + brute-force compare**; LIS is not required

## Reading checkpoints

- vnode shape: `{ type, props, children, el, key }`
- `patchProps` must handle four kinds: `class / style / on* / plain attr`
- A component vnode calls render to get child vnodes, then mounts them

## Cheat sheet / knowledge points

### VNode shape

```js
{
  type: 'div' | Component | Fragment | Text,
  props: { class, style, onClick, ... } | null,
  children: string | VNode[] | null,
  el: HTMLElement | null,  // corresponding real DOM
  key: string | number | null
}
```

### patch dispatch logic

```text
patch(n1, n2, container):
  if (n1 && n1.type !== n2.type) → unmount(n1); n1 = null
  switch (n2.type):
    string    → processElement(n1, n2, container)
    Text      → processText(n1, n2, container)
    Fragment  → processFragment(n1, n2, container)
    Component → processComponent(n1, n2, container)
```

### Four kinds of patchProps

| Type | Handling |
|------|----------|
| `class` | `el.className = value` |
| `style` | walk the object and set `el.style[key]` |
| `on*` events | `el.addEventListener / removeEventListener` |
| Plain attributes | `el.setAttribute / removeAttribute` |

## Hands-on / flowcharts

### Minimal renderer implementation

```js
function h(type, props, children) {
  return { type, props, children, el: null, key: props?.key ?? null }
}

function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type))
  // props
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
      } else {
        el.setAttribute(key, vnode.props[key])
      }
    }
  }
  // children
  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => mount(child, el))
  }
  container.appendChild(el)
}

function patch(n1, n2) {
  if (n1.type !== n2.type) {
    const parent = n1.el.parentNode
    unmount(n1)
    mount(n2, parent)
    return
  }
  const el = (n2.el = n1.el)
  // patch props
  const oldProps = n1.props || {}
  const newProps = n2.props || {}
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      el.setAttribute(key, newProps[key])
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) el.removeAttribute(key)
  }
  // patch children (simplified: string vs array)
  const oldCh = n1.children
  const newCh = n2.children
  if (typeof newCh === 'string') {
    if (newCh !== oldCh) el.textContent = newCh
  } else if (Array.isArray(newCh)) {
    if (typeof oldCh === 'string') {
      el.textContent = ''
      newCh.forEach(child => mount(child, el))
    } else {
      // simplified diff: compare one by one, delete extras, mount missing
      const commonLen = Math.min(oldCh.length, newCh.length)
      for (let i = 0; i < commonLen; i++) patch(oldCh[i], newCh[i])
      if (newCh.length > oldCh.length) {
        newCh.slice(commonLen).forEach(child => mount(child, el))
      } else {
        oldCh.slice(commonLen).forEach(child => unmount(child))
      }
    }
  }
}

function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el)
}
```

### createApp sketch

```js
function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector)
      let prevVNode = null
      // combine with reactivity effect
      effect(() => {
        const vnode = rootComponent.render()
        if (!prevVNode) mount(vnode, container)
        else patch(prevVNode, vnode)
        prevVNode = vnode
      })
    }
  }
}
```

## Oral questions

### 1. What is the main difference between mount and patch?

Answer template:

> mount is **first render**: turn a VNode into real DOM and insert it into the container. It creates the element, sets attributes, handles events, and recursively mounts children. patch is **update render**: compare old and new VNodes and do minimal DOM work.
>
> The key difference is that patch reuses the old DOM node (`n2.el = n1.el`) and only updates changed props and children, avoiding a full rebuild. If old and new VNode types differ, unmount the old one first, then mount the new one.

### 2. If you built a renderer from scratch, how would you split it?

Answer template:

> I would split it into four layers. Layer 1 is VNode creation (`h`), defining `{ type, props, children, el, key }`. Layer 2 is platform API abstraction (`createElement / setAttribute / appendChild / removeChild`), so the renderer can be cross-platform. Layer 3 is core render logic: mount, patch, unmount; patch dispatches by type for element / text / fragment / component. Layer 4 is children diff: start with simple one-by-one compare, then upgrade to head/tail + LIS.
>
> The connection to reactivity is `effect`: the component render function is wrapped in an effect, so data changes automatically re-render and trigger patch.

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. VNode shape + h function (1 minute)
2. mount flow (createElement → props → children → appendChild) (2 minutes)
3. patch flow (reuse el → diff props → diff children) + connection to reactivity (2 minutes)

Self-check after recording:

- Did you name the core VNode fields?
- Did you say mount creates DOM and patch reuses DOM?
- Did you mention the four kinds of patchProps?
- Did you say effect connects render and reactivity?

## Today's review

Three points to fill in today:

1. Event handling optimization: invoker pattern (do not remove/add; only swap the handler reference).
2. Fragment implementation: use an `anchor` comment node to locate when there is no root node.
3. Component VNode handling: call render to get child VNodes, then go through the element flow.
