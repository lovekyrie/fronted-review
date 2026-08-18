# Day 35 Patch Flag / Static Hoisting / Block Tree Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 35 | Patch Flag / Block Tree | [Rendering mechanism](../advanced/week3/rendering-mechanism), [Vue diff](../framework/vue/dom-diff) |

## Today's goals

- Go deep into Patch Flag enums (TEXT / CLASS / STYLE / PROPS / FULL_PROPS / HYDRATE_EVENTS / STABLE_FRAGMENT…)
- Draw a Block Tree structure diagram and contrast it with traditional VDOM Diff
- Produce a Vue 3 compiler-optimization answer script

## Reading checkpoints

- A Block is a “dynamic node container”; diff only walks `block.dynamicChildren`, not the whole tree
- Patch Flag decides which fast path `patch` takes, avoiding a full props diff
- `v-if / v-for` create a new block and cut off collection, changing the range of dynamic nodes collected

## Cheat sheet / knowledge points

### Patch Flag enums

| Flag | Value | Meaning |
|------|-----|------|
| `TEXT` | 1 | Children are dynamic text |
| `CLASS` | 2 | Dynamic class binding |
| `STYLE` | 4 | Dynamic style binding |
| `PROPS` | 8 | Dynamic non-class/style attributes |
| `FULL_PROPS` | 16 | Props with dynamic keys; full diff is required |
| `HYDRATE_EVENTS` | 32 | Events that need hydrate |
| `STABLE_FRAGMENT` | 64 | Fragment whose child order does not change |
| `KEYED_FRAGMENT` | 128 | Fragment whose children have keys |
| `UNKEYED_FRAGMENT` | 256 | Fragment whose children have no keys |
| `NEED_PATCH` | 512 | Only non-props patch is needed (ref / hooks) |
| `HOISTED` | -1 | Statically hoisted node; never diffed |
| `BAIL` | -2 | Exit optimized mode and take a full diff |

Role: the compiler marks at compile time which nodes are dynamic and which properties are dynamic. At runtime `patch` takes a **fast path** from the flag and skips unchanged parts.

### Block Tree

- **Block**: a "dynamic node container" that collects all descendant dynamic nodes into the `dynamicChildren` array.
- **Traditional diff**: recursively walk the whole vnode tree and compare node by node.
- **Block diff**: only walk `block.dynamicChildren`, a flattened array, O(number of dynamic nodes) rather than O(total nodes).

Block cut-off points: `v-if` / `v-for` / `<Component>` create a new Block because they can change subtree structure.

### Static Hoisting

```js
// Before compile
<div>
  <span>static text</span>
  <span>{{ dynamic }}</span>
</div>

// After compile (pseudocode)
const _hoisted_1 = createVNode('span', null, 'static text', -1 /* HOISTED */)
function render() {
  return createBlock('div', null, [
    _hoisted_1,  // reuse; not part of diff
    createVNode('span', null, ctx.dynamic, 1 /* TEXT */)
  ])
}
```

Benefit: static nodes are created once. Later re-renders reuse the same reference, saving memory and skipping diff.

## Hands-on / flowcharts

### Traditional VDOM diff vs Block Tree diff

```text
Traditional diff:
  div (compare)
  ├── span "static" (compare → no change)
  ├── span "static" (compare → no change)
  └── span {{ msg }} (compare → TEXT changed → update)
  compare 4 nodes in total

Block Tree diff:
  div [Block]
  └── dynamicChildren: [ span {{ msg }} (PatchFlag: TEXT) ]
  compare only 1 node, and know that only textContent needs updating
```

### Patch Flag fast paths

```text
patch(n1, n2):
  if (patchFlag & TEXT)   → only update el.textContent
  if (patchFlag & CLASS)  → only update el.className
  if (patchFlag & STYLE)  → only update el.style
  if (patchFlag & PROPS)  → only diff properties in the dynamicProps list
  if (patchFlag === HOISTED) → skip, no diff
```

## Oral questions

### 1. How does Patch Flag speed up diff specifically?

Answer template:

> Patch Flag is a compile-time mark Vue 3’s compiler puts on dynamic nodes, telling the runtime "which parts of this node are dynamic". For example, `TEXT` means only text content will change, and `CLASS` means only class will change.
>
> After the runtime `patch` function gets this flag, it takes the matching fast path: `TEXT` only updates `textContent`, `CLASS` only updates `className`, with no need to fully compare every property. That drops each node’s diff cost from O(number of props) to O(1).
>
> Combined with Block Tree, overall diff changes from "walk the whole tree × full property comparison" to "walk only dynamic nodes × precise property updates". That is the core reason Vue 3 diff is much faster than Vue 2.

### 2. What is the difference between Block Tree and traditional VDOM?

Answer template:

> Traditional VDOM (such as React and Vue 2) must recursively walk the whole virtual DOM tree and compare every node layer by layer. Even if 90% of the template is static, diff still walks all of it.
>
> Vue 3’s Block Tree identifies dynamic nodes at compile time and collects them into the Block’s `dynamicChildren` array. Runtime diff only walks this flattened array and skips all static nodes. Diff complexity drops from O(total template nodes) to O(dynamic nodes).
>
> Note that `v-if` and `v-for` create a new Block because they change subtree structure, so dynamicChildren cannot be collected across structural changes.

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. Patch Flag motivation and enums (TEXT/CLASS/STYLE/PROPS) + fast-path principle (1 minute)
2. Block Tree structure + contrast with traditional diff + v-if/v-for cut-off (2 minutes)
3. Static hoisting principle + HOISTED flag + real benefits (2 minutes)

Self-check after recording:

- Did you say Patch Flag is marked at compile time and used at runtime?
- Did you say a Block collects dynamicChildren for flattened diff?
- Did you say v-if / v-for create a new Block?
- Did you say static hoisting skips diff and reuses references?

## Today's review

Three points to fill in today:

1. `BAIL` flag (-2) exit-optimization cases: hand-written render functions, non-compiled templates.
2. Relationship between `v-once` and static hoisting: `v-once` marks the whole subtree as static.
3. How `cacheHandlers` (event handler caching) works with Patch Flag.
