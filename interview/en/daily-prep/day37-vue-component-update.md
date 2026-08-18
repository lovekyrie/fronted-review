# Day 37 Vue Component Updates and Scheduling Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 37 | Component update | [Rendering mechanism](../advanced/week3/rendering-mechanism), [Lifecycle](../framework/vue/lifecycles), [Component communication](../framework/vue/components-communication) |

## Today's goals

- Read the source chain of `setupRenderEffect` / `updateComponent`
- Draw a decision flowchart of “props change → parent re-render → child updates / is skipped”
- Understand the short-circuit checks in `shouldUpdateComponent`

## Reading checkpoints

- Each component instance has a `ReactiveEffect`; when it changes, `effect.run` triggers re-render
- `shouldUpdateComponent` compares props / slots / dirs to decide whether to really update
- `v-memo` / `defineProps + withDefaults` can further cut updates

## Cheat sheet / knowledge points

### Component update trigger chain

```text
Reactive data changes
  → dep.trigger()
  → the current component’s ReactiveEffect is marked dirty
  → scheduler queues the update (queueJob)
  → batch-run after nextTick
  → effect.run() → call component render to produce a new VNode
  → patch(oldVNode, newVNode) → recurse the subtree
```

### setupRenderEffect

Each component instance has a `ReactiveEffect`, created in `setupRenderEffect`:

```js
const effect = new ReactiveEffect(
  () => componentUpdateFn,  // render + patch
  () => queueJob(update)    // scheduler: do not run immediately; queue and wait for nextTick
)
```

### shouldUpdateComponent

When the parent re-renders, a child component VNode calls `shouldUpdateComponent(n1, n2)` to decide:

```text
Shallow-compare props
  → props unchanged → skip child update
  → props changed → trigger child update
Extra checks: whether slots / emits / dirs changed
```

### Component vs element update

| Dimension | Element update | Component update |
|------|----------|----------|
| Trigger | patchElement | processComponent → updateComponent |
| Core | patchProps + patchChildren | shouldUpdateComponent → re-render → patch subtree |
| Optimization | Patch Flag fast path | shallow props compare + v-memo |

### Performance techniques

- **`v-memo`**: conditionally cache a subtree; skip the whole subtree re-render when deps are unchanged.
- **`shallowRef / shallowReactive`**: only track the first layer, reducing deep dependency collection.
- **`markRaw`**: mark an object so it is not wrapped by reactive (large objects, third-party instances).
- **`defineProps` destructure**: Vue 3.3+ keeps reactivity automatically; `toRefs` is no longer required.
- **Split components**: extract frequently updating parts into independent components to shrink the update range.

## Hands-on / flowcharts

### Full update flow

```text
state.count++ (Proxy set)
  → trigger(target, 'count')
  → dep.effects includes component A’s effect
  → scheduler: queueJob(updateA)
  → sync code finishes
  → nextTick flush queue
  → updateA(): 
      const newTree = render()
      patch(prevTree, newTree, container)
        → patchElement: update own DOM
        → encounter child <Child>:
            shouldUpdateComponent(oldChild, newChild)?
              → props unchanged → skip
              → props changed → child.update() → child re-render
```

### Props change decision

```text
shouldUpdateComponent(n1, n2):
  1. has dynamicSlots → true
  2. new node has children (slots) → compare slots
  3. compare props:
     - oldProps === newProps → false
     - different count → true
     - walk newProps, different value → true
  4. all the same → false (skip update)
```

## Oral questions

### 1. Does a child always update when the parent updates?

Answer template:

> Not necessarily. When the parent re-renders it produces a new child component VNode, but Vue calls `shouldUpdateComponent` for a shallow compare. If the child’s props, slots, and emits are unchanged, the child update is skipped and the old subtree is reused.
>
> This differs from React. React re-renders children by default when the parent re-renders; you need `React.memo` to skip. Vue has a reactivity system plus compile-time optimizations, so it has some "auto skip" by default.
>
> But if the parent passes a new object reference every render (such as `{ ...props }`), the shallow compare thinks it changed and the child still updates. So do not create temporary objects as props in the template.

### 2. How do you avoid unnecessary component updates?

Answer template:

> Five techniques. First, `v-memo` can conditionally cache a whole subtree and skip re-render when deps are unchanged; it fits expensive items in a list. Second, avoid passing temporary objects or inline functions to children, which breaks the shallow compare. Third, `shallowRef / shallowReactive` reduce deep tracking, which fits large objects or performance-sensitive data. Fourth, `markRaw` marks objects that do not need reactivity (such as an echarts instance). Fifth, split components: extract frequently changing parts into independent components to shrink the re-render range.
>
> Essentially, Vue’s optimization idea is "shrink the update range + reduce diff work", which differs from React’s "reduce re-render count".

## 5-minute recording outline

Record in this order; do not restructure on the fly:

1. Component update trigger chain (data change → trigger → scheduler → nextTick → render → patch) (2 minutes)
2. shouldUpdateComponent decision logic (shallow props compare + slots) (1.5 minutes)
3. Five optimization techniques (v-memo / shallowRef / markRaw / split components / avoid temporary objects) (1.5 minutes)

Self-check after recording:

- Did you say every component has a ReactiveEffect?
- Did you say the scheduler uses queueJob for batched async updates?
- Did you say shouldUpdateComponent shallow-compares props?
- Did you say how this differs from React on "auto skip"?

## Today's review

Three points to fill in today:

1. `queueJob` dedupe (the same job is not queued twice) and flush timing.
2. How `v-memo` is implemented (isMemoSame compares the deps array).
3. How `KeepAlive` affects component updates (activated / deactivated instead of mount / unmount).
