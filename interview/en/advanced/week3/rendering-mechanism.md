### Vue 3 Rendering Internals

In senior frontend interviews, Vue’s rendering mechanism cannot stop at “when data changes, generate a virtual DOM, then diff and update the real DOM.” That only covers part of the runtime.

A more complete Vue 3 answer puts **compile-time optimization** and **runtime updates** on the same pipeline:

`template -> compiler -> render function -> vnode -> block tree -> patch flags -> scheduler -> patch -> DOM`

That pipeline explains most follow-ups: why Vue 3 updates do not need a full-tree diff, what `patch flag` is for, why static hoisting reduces creation cost, what problem `block tree` solves, and why the DOM is not updated synchronously the moment reactivity fires.

#### 1. Vue’s render pipeline

The template in a Vue SFC does not run as-is. It is first compiled into a render function.

The whole flow can be split into three stages:

1. compile: `template` is compiled into a `render function`
2. render: running the `render function` produces a vnode tree
3. update: after reactive data changes, the component render effect runs again, produces a new vnode, then patches it onto the DOM

```text
template
  -> compiler
  -> render function
  -> vnode
  -> patch
  -> DOM
```

If you only talk about “virtual DOM diff,” you miss Vue 3’s key advantage: **the compiler already knows which parts of the template are dynamic, so the runtime can do far less guessing.**

#### 2. From template to render function

A template:

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>static text</p>
    <button @click="onClick">{{ count }}</button>
  </div>
</template>
```

After compilation it becomes a render function roughly like this:

```js
function render(_ctx, _cache) {
  return openBlock(), createElementBlock('div', { class: 'card' }, [
    createElementVNode('h3', null, toDisplayString(_ctx.title), 1),
    createElementVNode('p', null, 'static text'),
    createElementVNode('button', {
      onClick: _ctx.onClick,
    }, toDisplayString(_ctx.count), 9),
  ])
}
```

You are not expected to memorize the generated code. You should take away these facts:

- templates become JavaScript functions
- running the render function reads reactive data
- reading reactive data triggers dependency collection
- the compiler marks dynamic nodes
- runtime patch can use those marks to do less comparison

#### 3. What a vnode is

A vnode is a JavaScript description of real DOM.

A vnode looks roughly like this:

```js
const vnode = {
  type: 'div',
  props: {
    class: 'card',
  },
  children: [
    {
      type: 'span',
      children: 'hello',
    },
  ],
}
```

When Vue updates the DOM, it does not operate on template strings. It:

1. generates a new vnode for this render
2. compares it with the previous vnode
3. finds what needs to change
4. calls host-platform APIs to update the real DOM

The value of a vnode is not “faster than DOM.” More accurately, a vnode is a cross-platform, comparable, cacheable, schedulable description of UI.

#### 4. Component updates are render effects

On mount, Vue creates a render effect for the component.

A simplified model:

```js
effect(
  () => {
    const vnode = render()
    patch(prevVNode, vnode)
  },
  {
    scheduler: queueJob,
  },
)
```

Reactive data is read while the render function runs:

```vue
<template>
  <div>{{ count }}</div>
</template>
```

Reading `count` here collects the current component’s render effect. When `count` changes, that effect is triggered, but the component update usually does not run synchronously. It enters the scheduler queue.

This connects to the pipeline in the Week 3 reactivity notes:

```text
trigger
  -> component render effect
  -> scheduler queue
  -> render function
  -> new vnode
  -> patch
```

So Vue updates are not “reactivity mutating the DOM directly.” Reactivity triggers a component re-render, then patch updates the DOM.

#### 5. Scheduler and batching

If you change state several times in a row:

```js
count.value++
count.value++
count.value++
```

Vue does not immediately patch the DOM each time. It queues the component update and flushes the batch in the same microtask.

That avoids rendering meaningless intermediate states.

```js
count.value++

await nextTick()
// Read the DOM here to see the updated result
```

In an interview you can say: **reactive triggers happen synchronously, but component DOM updates usually go through the scheduler as a batch. `nextTick` waits for that batch of update jobs to finish.**

#### 6. Why Vue 3 emphasizes compile-time optimization

React’s runtime only sees the element tree after JSX runs, so it is hard to know ahead of time which parts are definitely static and which are definitely dynamic.

Vue templates have a stronger static structure. The compiler can analyze in advance:

- which nodes never change
- which text will change
- which props will change
- which event handlers can be cached
- which dynamic nodes need to enter the update path

So Vue 3’s core optimization idea is: **provide as much information as possible at compile time, and let the runtime do the least work using those hints.**

#### 7. Static hoisting

Fully static nodes in a template can be hoisted outside the render function.

```vue
<template>
  <div>
    <h1>Title</h1>
    <p>{{ message }}</p>
  </div>
</template>
```

`<h1>Title</h1>` does not depend on any reactive data. Recreating that vnode on every component update is wasted work.

The compiler can hoist it:

```js
const hoisted = createElementVNode('h1', null, 'Title')

function render(_ctx) {
  return createElementVNode('div', null, [
    hoisted,
    createElementVNode('p', null, _ctx.message),
  ])
}
```

The value of static hoisting:

- less repeated vnode creation on updates
- static nodes can be skipped during patch
- the more static nodes there are, the larger the gain

Do not only say “static hoisting improves performance.” Explain that it reduces **repeated creation and repeated comparison**.

#### 8. Patch flag

A `patch flag` is an update hint the compiler attaches to a dynamic node.

For example:

```vue
<div :class="className">{{ title }}</div>
```

The compiler knows:

- the text `title` is dynamic
- `class` is dynamic
- the rest of the structure is stable

Generated code carries a mark like this:

```js
createElementVNode(
  'div',
  { class: _ctx.className },
  toDisplayString(_ctx.title),
  3,
)
```

The number can be read as a bitwise flag that tells the runtime which parts of this node are dynamic.

Common kinds include:

- dynamic text
- dynamic class
- dynamic style
- dynamic props
- dynamic events
- dynamic children

With `patch flag`, the runtime does not have to fully compare every prop and child. It can inspect only the marked parts.

That is one of the key differences between Vue 3 and a traditional virtual DOM diff: **Vue 3’s diff is not blind runtime guessing; it runs with compiler hints.**

#### 9. Block tree

`patch flag` answers “which parts of a single node can change.” `block tree` answers “which dynamic nodes should we look at first during an update.”

In a stable structure, most nodes are static. Only a few dynamic nodes actually change.

```vue
<template>
  <section>
    <h1>Profile</h1>
    <p>{{ name }}</p>
    <p>{{ age }}</p>
    <footer>static footer</footer>
  </section>
</template>
```

A traditional diff walks the whole tree recursively. Vue 3 collects dynamic children inside a block:

```text
block(section)
  dynamicChildren:
    - p(name)
    - p(age)
```

On update it can walk `dynamicChildren` directly and skip the stable static structure.

So the core value of a block tree is: **narrow the update path from the whole template tree down to a list of dynamic nodes.**

#### 10. Event caching

Events in a template:

```vue
<button @click="handleClick">Submit</button>
```

If every render created a new event-handler identity, the runtime might think the event prop changed.

The Vue compiler can cache event handlers so the identity stays stable:

```js
onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick(...args))
```

Event caching is not about making clicks faster. It is about avoiding unnecessary props changes during updates.

#### 11. `v-once` and `v-memo`

##### 11.1 `v-once`

`v-once` means this subtree is rendered once and skipped on later updates.

```vue
<div v-once>
  {{ title }}
</div>
```

Use it for content that truly will not change. Using it on state that will change leaves the UI stale.

##### 11.2 `v-memo`

`v-memo` can skip subtree updates based on a dependency array.

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id === activeId]">
  {{ item.name }}
</div>
```

When the memo dependencies have not changed, Vue can reuse the previous subtree.

`v-memo` is more suitable for localized updates in large lists. It should not be the default. In a senior interview you can say: **Vue 3 already has compile-time optimizations; manual memo belongs at a clear performance bottleneck.**

#### 12. The basic patch process

The goal of patch is to update an old vnode into a new vnode.

A rough split:

1. if the old and new node types differ, unmount the old node and mount the new one
2. if they are the same element, update props, then update children
3. if it is a component, update props and decide whether to re-render the component
4. if it is a text node, update the text
5. if it is a Fragment, handle the child list

```text
patch(oldVNode, newVNode)
  -> type changed ? replace
  -> element ? patchElement
  -> component ? patchComponent
  -> text ? patchText
  -> fragment ? patchChildren
```

The real implementation is more involved, but the interview point is not memorizing function names. Understand that patch dispatches by vnode type and tries to reuse existing DOM and component instances.

#### 13. List diff and key

List updates are the part of diff that gets followed up most often.

```vue
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

`key` gives sibling nodes a stable identity so Vue can decide:

- which nodes can be reused
- which nodes need to be added
- which nodes need to be removed
- which nodes need to be moved

If you use index as the key, inserting, deleting, or sorting the list can misalign node identity, and component state or DOM state may be reused incorrectly.

#### 14. How keyed children are updated

Vue’s keyed-list handling can be simplified into these steps:

1. sync identical nodes from the head
2. sync identical nodes from the tail
3. handle the remaining all-new case
4. handle the remaining all-delete case
5. build a key-to-new-index map for the unknown-order range
6. find reusable nodes
7. compute the longest increasing subsequence to reduce moves

For example:

```text
old: A B C D E
new: A C B D F
```

Head and tail can match a portion quickly. The disordered middle is then handled with the key map and the longest increasing subsequence.

The longest increasing subsequence is not about finding “the nodes that changed least.” It finds a set of nodes whose **relative order is already correct and that do not need to move**.

#### 15. Component update boundaries

When a parent updates, children do not all have to run again.

Vue uses props, slots, patch flags, and similar information to decide whether a child needs to update.

```vue
<Child :count="count" />
<StaticChild />
```

If `StaticChild` has no dynamic input that depends on the parent’s change, it should not be updated for no reason.

Watch out, though: if the parent passes an object or function that is newly created on every render, the update range can still grow.

```vue
<Child :options="{ size: 'large' }" />
```

This creates a new object every time. In more complex cases, move the stable object off the render path, or use a computed property to control when the identity changes.

#### 16. SSR hydration

In SSR, the server first generates HTML. The browser then hydrates: it associates existing DOM with the client vnode.

```text
server render
  -> HTML
  -> browser receives DOM
  -> client vnode
  -> hydrate existing DOM
```

Hydration’s goal is not to recreate DOM. It is to reuse the server’s existing DOM, bind events, and set up component instances plus reactive update relationships.

A common problem is a mismatch between server and client output, for example:

- using `window` directly
- rendering that depends on the current time
- random numbers that produce different content
- user-specific data that differs between server and client

In a senior interview you can add: **a fast SSR first paint does not mean there is no client cost; hydration itself is runtime work.**

#### 17. Vue vs React rendering optimization

Vue and React both describe UI with vnode / element trees, and both map state changes onto DOM updates.

The optimization strategies differ:

- Vue: the template compiler can analyze static vs dynamic parts ahead of time, and help the runtime with patch flags, static hoisting, and the block tree
- React: more toward runtime scheduling and component-level memo, relying on developers to use `memo`, `useMemo`, and `useCallback` to control some extra renders

Do not simply say “Vue is faster” or “React is more flexible.” A better line is:

**Vue trades template constraints for more compile-time information. React trades JavaScript expressiveness for a more flexible runtime model.**

#### 18. Common senior follow-ups

##### 18.1 Why Vue 3 still needs a virtual DOM

Because a vnode is not only for diff. It also provides a cross-platform description, component abstraction, scheduled updates, SSR hydration, and more. Vue 3 uses compile-time optimization to cut the runtime cost of virtual DOM, not to abandon virtual DOM entirely.

##### 18.2 What problem does patch flag solve

It tells the runtime which parts of a vnode are dynamic. Patch then does not have to fully compare every attribute and child; it can update the marked parts directly.

##### 18.3 What problem does block tree solve

It collects the dynamic nodes inside a stable structure. On update it prefers walking that dynamic-node list instead of recursively walking the full template tree.

##### 18.4 Why static hoisting works

A static vnode does not depend on reactive data. It can be created once outside the render function and reused on later updates, reducing repeated creation and comparison.

##### 18.5 Are Vue DOM updates synchronous

Reactive triggers are synchronous, but component updates usually enter the scheduler queue and flush as a batch in a microtask. Use `nextTick` when you need to read the DOM after it has been updated.

##### 18.6 Why you should not casually use index as key

Key identifies sibling-node identity. When a list is inserted into, deleted from, or sorted, index cannot stably represent a business item, so DOM or component instances may be reused incorrectly.

##### 18.7 What is the longest increasing subsequence used for in diff

It finds a set of nodes in a disordered list whose relative order is already correct. Those nodes do not need to move, which reduces DOM moves.

##### 18.8 What is hard about SSR hydration

The server HTML and the client vnode must match as closely as possible. Any state, time, random number, or browser API that exists only on the client can cause a hydration mismatch.

#### 19. Interview answer template

If the interviewer asks about “Vue 3 rendering internals,” answer in this order:

1. Vue templates are first compiled into a render function; running render produces a vnode
2. On mount, Vue creates a render effect; reading reactive data during render completes dependency collection
3. Reactive data changes trigger the component render effect, but component updates go through the scheduler as a batch
4. On update, the render function runs again to get a new vnode, then patch updates the real DOM
5. Vue 3’s advantage is not only virtual DOM diff; the compiler marks dynamic parts ahead of time
6. Static hoisting reduces repeated creation and comparison of static vnodes
7. Patch flags tell the runtime which attributes or text are dynamic
8. The block tree collects dynamic nodes so updates can skip large static structures
9. List diff depends on stable keys, and uses the longest increasing subsequence to reduce DOM moves
10. SSR hydration reuses server DOM, but requires the server and client render results to match

That answer connects Vue 3 reactivity, scheduling, compile-time optimization, and DOM patch into one complete pipeline.
