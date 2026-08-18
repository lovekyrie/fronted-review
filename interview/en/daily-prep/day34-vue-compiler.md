# Day 34 Vue Template Compilation Session Log

## Quick navigation

| Today | Topic | Core files |
|------|------|----------|
| Day 34 | Template compilation | [Rendering mechanism](../advanced/week3/rendering-mechanism), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Finish the Vue Rendering Mechanism docs
- Draw a parse → transform → codegen flowchart
- Observe a template compiled into a render function in Vue SFC Playground

## Reading checkpoints

- `parse` outputs AST; `transform` marks the AST (`patchFlag`, `dynamicProps`)
- `codegen` generates a render string from the AST, including the choice of `_createVNode / _createBlock`
- Static nodes are hoisted outside the render function and created only once

## Cheat sheet / knowledge points

- Vue templates do not run directly. The compiler turns the template into a render function, and executing render produces vnodes.
- The main compilation pipeline can be split into three steps: `parse -> transform -> codegen`.
- `parse` turns the template string into an AST that describes tags, attributes, directives, interpolations, text, and so on.
- `transform` converts and marks the AST, for example identifying dynamic text, dynamic class/style, events, directives, and components.
- `codegen` turns the transformed AST into a render function string, which includes calls such as `openBlock`, `createElementBlock`, and `createVNode`.
- Static hoisting lifts vnodes that do not depend on reactive data outside render, creating them once and reducing repeated creation and comparison on updates.
- A patch flag is a compiler hint on a dynamic node telling the runtime which parts of that vnode can change, such as text, class, style, or props.
- Event caching keeps event handler references stable, reducing meaningless props changes from creating a new function on every render.
- The block tree collects dynamic children inside a stable structure. On update it prefers walking `dynamicChildren` instead of fully recursing the whole template tree.
- Day 34 only needs the main compilation chain; patch flag, block tree, and diff details are covered on Day 35–36.

### Common patch flag directions

| Type | Meaning | Example |
|------|------|------|
| TEXT | Dynamic text | `{{ title }}` |
| CLASS | Dynamic class | `:class="cls"` |
| STYLE | Dynamic style | `:style="style"` |
| PROPS | Specified props are dynamic | `:id="id"` |
| FULL_PROPS | Props are complex; full comparison is needed | `v-bind="obj"` |
| NEED_PATCH | Needs runtime handling | ref, directives, etc. |

## Hands-on / flowcharts

```text
template → parse → AST → transform(add patchFlag) → codegen → render function
```

```vue
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>static text</p>
    <button @click="onClick">{{ count }}</button>
  </div>
</template>
```

```js
// Simplified render shape; focus on dynamic flags and static nodes
const _hoisted_1 = createElementVNode('p', null, 'static text')

function render(_ctx, _cache) {
  return openBlock(), createElementBlock('div', { class: 'card' }, [
    createElementVNode('h3', null, toDisplayString(_ctx.title), 1),
    _hoisted_1,
    createElementVNode(
      'button',
      {
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick(...args)),
      },
      toDisplayString(_ctx.count),
      1,
    ),
  ])
}
```

```text
Component mount
  -> create render effect
  -> run render function
  -> render reads title/count
  -> track component render effect
  -> generate vnode
  -> patch to DOM

State change
  -> trigger render effect
  -> scheduler queueJob
  -> render again
  -> do fewer comparisons via patch flag / block tree
  -> patch DOM
```

## Oral questions

### 1. How does a template become a render function?

> Answer template: A Vue template is processed by the compiler first. The main pipeline is parse, transform, and codegen. parse turns the template string into an AST that describes tags, attributes, directives, text, and interpolations. transform walks the AST, identifies which nodes are static and which fields are dynamic, and adds runtime hints such as patch flag and dynamicProps; it also handles static hoisting and event caching. codegen finally turns the AST into a render function. At runtime the component runs the render function to get vnodes. Reading reactive data during render collects the component render effect, and later data changes trigger re-render and patch.

### 2. Why is Vue 3 render usually faster than Vue 2?

> Answer template: Vue 3’s advantage is not only a changed runtime diff; the compiler also gives the runtime more information. Template structure is relatively static, so the compiler can know in advance which nodes never change and which text, class, style, or props are dynamic. Static nodes can be hoisted outside render and reused; dynamic nodes can carry a patch flag; dynamic children inside a stable structure can enter the block tree. On update the runtime does not blindly recurse the whole vnode tree; it handles the dynamic parts according to compiler hints. Vue 2 also compiles templates, but Vue 3 is more systematic about block tree, patch flag, and static hoisting.

## 5-minute recording outline

1. Three compilation stages (2 minutes)
2. Role of patchFlag (1.5 minutes)
3. Preview of static hoisting + block tree (1.5 minutes)

## Today's review

1. Most likely follow-up: the render function reads reactive data when it runs, so template compilation and reactive dependency collection are not two isolated chains.
2. Current gap: patch flag and block tree can only be explained by role here; details continue on Day 35.
3. Next follow-up: connect to Day 35 and focus on how Patch Flag, static hoisting, and Block Tree reduce runtime diff cost.
