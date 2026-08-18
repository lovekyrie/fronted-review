# Complex interaction: drag-and-drop sort and rich-text selection

## 1. Drag-and-drop sort

### Approach

1. On pointer down, record start position and item index.
2. While moving, compute the index the item should insert at.
3. Update data only when the index changes, to skip useless reshuffles.
4. On pointer up, persist and tell the backend.

### Hard parts

- Drag inside a scroll container: include the container’s scroll offset.
- Placeholder node: keeps list height from jumping.
- Large lists: update only what changed; pair with a virtual list.

## 2. Rich text: selection and caret

### Concepts

- `Selection`: the user’s current selection (may span nodes).
- `Range`: the start / end boundaries of that selection.

### Typical ops

- Save selection: cache the `Range` before a toolbar action.
- Restore selection: after bold / insert-link, put the caret back.
- Sanitize: whitelist tags when pasting.

```ts
const selection = window.getSelection()
if (selection && selection.rangeCount > 0) {
  const range = selection.getRangeAt(0).cloneRange()
  // cache the range, restore it after the toolbar action
}
```

## 3. What to say in interviews

- Consistency first (visual feedback, undo/redo, edges).
- Then perf (minimal DOM updates, batching).
- Then reliability (persist, recover, input safety).
