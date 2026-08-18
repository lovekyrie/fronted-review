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
