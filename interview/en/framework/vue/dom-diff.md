# Vue DOM Diff Algorithm

## 1. What is DOM Diff

DOM Diff is the core algorithm of Virtual DOM. It compares the old and new virtual DOM trees, then applies the differences to the real DOM. Vue's DOM Diff algorithm uses a two-ended comparison strategy and four pointers (newStart, newEnd, oldStart, oldEnd) to speed up the comparison.

## 2. Core ideas

Vue's DOM Diff algorithm is built around these core ideas:

1. **Same-level comparison**: only compare nodes at the same level; never compare across levels
2. **Two-ended comparison**: use four pointers (newStart, newEnd, oldStart, oldEnd) to compare from both ends
3. **In-place reuse**: reuse existing DOM nodes whenever possible to reduce DOM operations

## 3. Comparison process

### 3.1 The four pointers
- newStart: the start of the new children array
- newEnd: the end of the new children array
- oldStart: the start of the old children array
- oldEnd: the end of the old children array

### 3.2 Comparison steps

1. **Head-and-tail comparison**:
   - Compare newStart with oldStart
   - Compare newEnd with oldEnd
   - Compare newStart with oldEnd
   - Compare newEnd with oldStart

2. **Look for reuse**:
   - If none of the head-and-tail comparisons match, look in the old nodes for a node that matches newStart
   - If found, move that node to the oldStart position
   - If not found, create a new node

3. **Move the pointers**:
   - When a matching node is found, move the corresponding pointer forward or backward
   - When newStart > newEnd or oldStart > oldEnd, the comparison ends

## 4. Sample implementation

```javascript
function updateChildren(parentElm, oldCh, newCh) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVnode(oldStartVnode, newStartVnode)) {
      // Compare newStart with oldStart
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // Compare newEnd with oldEnd
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Compare newEnd with oldStart
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Compare newStart with oldEnd
      patchVnode(oldEndVnode, newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // Look for reuse
      let idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (idxInOld === -1) {
        // Create a new node
        createElm(newStartVnode, parentElm, oldStartVnode.elm)
      } else {
        // Move the node
        let vnodeToMove = oldCh[idxInOld]
        patchVnode(vnodeToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  
  // Handle remaining nodes
  if (oldStartIdx > oldEndIdx) {
    // Add new nodes
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      createElm(newCh[i], parentElm, oldCh[oldEndIdx].elm)
    }
  } else if (newStartIdx > newEndIdx) {
    // Remove old nodes
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      parentElm.removeChild(oldCh[i].elm)
    }
  }
}
```

## 5. Optimization strategies

1. **The role of key**:
   - Helps Vue identify a node's uniqueness
   - Improves node reuse
   - Avoids unnecessary DOM operations

2. **Static node marking**:
   - Mark static nodes so they are not compared repeatedly
   - Improves diff efficiency

3. **Async updates**:
   - Put DOM updates into the microtask queue
   - Batch updates to reduce reflow and repaint

## 6. Performance considerations

1. **Time complexity**:
   - Best case: O(n)
   - Worst case: O(n²)

2. **Space complexity**:
   - O(1); only a few pointer variables are needed

3. **Optimization tips**:
   - Use key appropriately
   - Avoid frequent updates
   - Use v-show instead of v-if (when toggling frequently)
   - Cache components with keep-alive

## 7. Comparison with other frameworks

1. **React**:
   - Uses one-ended comparison
   - Relies on an extra key
   - May produce more DOM operations

2. **Vue**:
   - Uses two-ended comparison
   - More efficient node reuse
   - Fewer DOM operations

## 8. Summary

Vue's DOM Diff algorithm uses two-ended comparison to stay correct while improving performance. Combined with reasonable optimizations and best practices, it can take full advantage of the algorithm and improve app performance.
