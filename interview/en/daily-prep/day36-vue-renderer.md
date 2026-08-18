# Day 36 Vue Renderer and Diff Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 36 | Renderer + diff | [Rendering mechanism](../advanced/week3/rendering-mechanism), [Vue diff](../framework/vue/dom-diff) |

## Today's goals

- Read the core `patch / patchElement / patchChildren` fragments in `runtime-core/src/renderer.ts`
- Draw a three-path flowchart of mount / patch / unmount
- Produce a Vue 3 diff algorithm script (two-ended comparison + longest increasing subsequence)

## Reading checkpoints

- Vue 3 diff core is **two-ended comparison + LIS for the disordered middle**, reducing real DOM moves
- `processElement / processComponent / processFragment` dispatch by vnode type
- Fragment needs an extra `anchor` to locate the insertion point

## Cheat sheet / knowledge points

### Renderer entry architecture

```text
patch(n1, n2, container)
  → branch on n2.type:
    string     → processElement
    Component  → processComponent
    Fragment   → processFragment
    Text       → processText
```

- `n1 === null` → mount (first mount)
- `n1 !== null` → patch (update comparison)
- `n1` exists but `n2 === null` → unmount (unmount)

### patchElement flow

```text
patchElement(n1, n2):
  1. patchProps(el, oldProps, newProps, patchFlag)
  2. patchChildren(n1, n2, el, patchFlag)
  3. n2.el = n1.el  // reuse the DOM node
```

### Three stages of children diff (Vue 3)

```text
Stage 1: compare from the head — i starts at 0; same key+type → patch directly
Stage 2: compare from the tail — e1/e2 start at the end; same key+type → patch directly
Stage 3: handle the disordered middle
  → build keyToNewIndex Map
  → walk old nodes, look up new positions in the Map
  → use longest increasing subsequence (LIS) to find nodes that do not need to move
  → remaining nodes are moved or newly mounted
```

### Longest increasing subsequence (LIS)

- Role: find the **largest set of nodes that do not need to move** in the disordered section; only the rest need DOM moves.
- Algorithm: greedy + binary search, O(n log n).
- Benefit: minimize DOM moves. React does not use LIS; Vue 3 is better here.

### Role of key

- key is the unique identity of a vnode, used to **quickly match old and new nodes** during diff.
- Without key → match by index, which can scramble component state and cause unnecessary DOM work.
- With key → look up the matching node precisely via the `keyToNewIndex` Map.

## Hands-on / flowcharts

### Full children diff flowchart

```text
old: [a, b, c, d, e, f]    new: [a, d, b, g, f]

Stage 1 head-to-head: a === a → patch ✓, i = 1
Stage 2 tail-to-tail: f === f → patch ✓, e1 = 4, e2 = 3

Disordered middle:
  old: [b, c, d, e]  new: [d, b, g]
  
  keyToNewIndex: { d→0, b→1, g→2 }
  walk old nodes:
    b → new index 1
    c → missing → unmount
    d → new index 0
    e → missing → unmount
  
  newIndexToOldIndex: [3, 1, 0]  (d was at 3, b was at 1, g is new)
  LIS([3, 1]) = [1] → the node at index 1 (b) stays
  
  reverse walk: g(mount) → b(stay) → d(move)
```

### LIS algorithm core

```js
function getSequence(arr) {
  const result = [0]
  const p = arr.slice()
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === 0) continue // skip newly added nodes
    const last = arr[result[result.length - 1]]
    if (arr[i] > last) {
      p[i] = result[result.length - 1]
      result.push(i)
    } else {
      // binary search replace
      let lo = 0, hi = result.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (arr[result[mid]] < arr[i]) lo = mid + 1
        else hi = mid
      }
      if (arr[i] < arr[result[lo]]) {
        if (lo > 0) p[i] = result[lo - 1]
        result[lo] = i
      }
    }
  }
  // backtrack
  let len = result.length, idx = result[len - 1]
  while (len-- > 0) { result[len] = idx; idx = p[idx] }
  return result
}
```

## Oral questions

### 1. Why does Vue 3 diff use longest increasing subsequence?

Answer template:

> When handling the disordered section of children diff, we need to move old nodes into the new order. If every node is moved brute-force, DOM operations are maximized. LIS finds the **largest subset whose relative order is already correct**; those nodes stay, and only the rest move.
>
> For example, old order `[b, c, d]` becoming `[d, b, c]`: LIS is `[b, c]` (increasing subsequence). Only `d` needs to move to the front; `b` and `c` stay. DOM moves drop from 3 to 1. Complexity is O(n log n). This is one optimization of Vue 3 compared with Vue 2 two-ended diff.

### 2. What does `key` do in diff?

Answer template:

> `key` is a vnode’s identity. Diff decides whether two nodes "are the same" by `key + type` being equal.
>
> Without a key, diff can only match by index. If list order changes, component A’s DOM may be reused for component B, scrambling state (stale input values, broken transitions, and so on).
>
> With a key, Vue finds the old/new correspondence via the `keyToNewIndex` Map and can reuse, move, and delete correctly. So `v-for` must have a key, and the key should not be index (when order changes, index also changes, which is equivalent to having no key).

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. Renderer architecture (patch entry dispatches by type → element / component / fragment) (1.5 minutes)
2. Three stages of children diff (head → tail → disordered + LIS) (2 minutes)
3. LIS benefit + role of key + cost of missing key (1.5 minutes)

Self-check after recording:

- Did you say children diff has three stages?
- Did you say LIS finds the "largest set that does not need to move"?
- Did you say key + type identifies the same node?
- Did you say missing key can scramble state?

## Today's review

Three points to fill in today:

1. Fragment `anchor` positioning (how to find the insert point when there is no real root node).
2. Branching of mount vs update inside `processComponent`.
3. Concrete differences between Vue 2 two-ended diff and Vue 3 fast diff + LIS.
