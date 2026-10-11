# Day 34 Vue Template Compilation

## Goals

- Finish the Vue Rendering Mechanism docs
- Draw a parse → transform → codegen flowchart
- Observe a template compiled into a render function in Vue SFC Playground

## Read in order

1. [Rendering mechanism](../advanced/week3/rendering-mechanism)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- `parse` outputs AST; `transform` marks the AST (`patchFlag`, `dynamicProps`)
- `codegen` generates a render string from the AST, including the choice of `_createVNode / _createBlock`
- Static nodes are hoisted outside the render function and created only once

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week3/rendering-mechanism#day-34-knowledge-notes)
- Common patch flag directions — [reference section](../advanced/week3/rendering-mechanism#day-34-common-patch-flag-directions)
- Practice example — [reference section](../advanced/week3/rendering-mechanism#day-34-practice-example)

**Answer aloud without reading a reference answer**

- 1. How does a template become a render function?
- 2. Why is Vue 3 render usually faster than Vue 2?

**Recording drill**

1. Three compilation stages (2 minutes)
2. Role of patchFlag (1.5 minutes)
3. Preview of static hoisting + block tree (1.5 minutes)

## Recap

1. Most likely follow-up: the render function reads reactive data when it runs, so template compilation and reactive dependency collection are not two isolated chains.
2. Current gap: patch flag and block tree can only be explained by role here; details continue on Day 35.
3. Next follow-up: connect to Day 35 and focus on how Patch Flag, static hoisting, and Block Tree reduce runtime diff cost.
