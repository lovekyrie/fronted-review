### Modules

Modularization is more than splitting files. It solves three problems:

- **Scope isolation**: avoid polluting the global namespace
- **Dependency management**: make who-depends-on-whom explicit
- **Composition and reuse**: let a large app split into maintainable units

The point in senior interviews is not to recite AMD/CMD definitions, but whether you understand:

- why modern engineering is built around ESM
- how the module system relates to build tools
- why tree-shaking, code splitting, and circular deps all hang on the module model

#### 1. Common module systems

##### 1.1 CommonJS

The traditional Node.js module system. Core idea: load at runtime.

```js
// math.js
const add = (a, b) => a + b

module.exports = {
  add,
}

// main.js
const math = require('./math')
console.log(math.add(1, 2))
```

Traits:

- Synchronous loading
- Exports a value object
- Better fit for the server and the early Node ecosystem
- Weaker static analysis than ESM

##### 1.2 AMD / CMD

Historical solutions from when browsers had no native modules. Today it is enough to know they existed and what they solved.

- AMD emphasizes front-declared deps and async loading
- CMD emphasizes nearby deps (require where used)

Modern frontend interviews rarely dig into them, but you should know the background: **the browser needed modules too, it just had no native ESM yet.**

##### 1.3 ES Modules

The mainstream module system in modern frontend engineering.

```js
// math.js
export const add = (a, b) => a + b

// main.js
import { add } from './math.js'
console.log(add(1, 2))
```

ESM's key value is not prettier syntax. It is:

- dependencies are declared statically
- build tools can analyze and optimize more easily
- browsers and Node are converging on this semantics

#### 2. Core differences: ESM vs CommonJS

##### 2.1 Static vs runtime

ESM:

- `import` / `export` are module boundaries at the syntax level
- the dependency graph is known at build time

CommonJS:

- `require()` is a function call
- it can sit in conditions, branches, and runtime paths

That is why tree-shaking is friendlier to ESM.

##### 2.2 How values are bound

ESM exports are **live bindings**. The importer holds a reference to the exported binding.

CommonJS is closer to "export an object snapshot, then `require()` gets that object".

This directly affects how you reason about circular dependencies.

##### 2.3 Load timing

- CommonJS leans synchronous, a natural fit for Node's local filesystem
- ESM is designed for static analysis and an async loading model

#### 3. Why module systems and build tools are tightly coupled

Build tools do not work in a vacuum. They must sit on module semantics.

For example, a bundler has to answer:

- which files are entries
- which code is actually referenced
- which deps can be split into async chunks
- which exports are never used

The clearer and more static the module system, the easier these questions are to answer at build time.

#### 4. Why tree-shaking depends on ESM

The essence of tree-shaking: **remove unused exports from the final artifact.**

To do that, the bundler must know in advance:

- what a module exports
- what other modules use
- whether an import might only be decided at runtime

ESM fits this because:

- import/export is static syntax
- import paths are usually known at compile time
- you do not need to execute the module to know its deps

Caveat: **using ESM does not mean tree-shaking will work.**

Common reasons it fails:

- a dependency is still CommonJS
- the module has obvious side effects
- `sideEffects` is marked incorrectly
- the import style is hard to optimize

#### 5. Why dynamic `import()` matters

Dynamic `import()` is not just syntactic sugar. It gives the bundler a natural async boundary.

```js
button.addEventListener('click', async () => {
  const { openDialog } = await import('./dialog.js')
  openDialog()
})
```

This usually means:

- that code does not have to enter the first-screen main bundle
- it can be downloaded on demand at runtime
- the bundler can emit an independent chunk from it

So dynamic `import()` is tightly coupled with code splitting.

#### 6. Why circular dependencies are hard

Circular deps are not merely "bad code". You need to understand module initialization order.

For example:

- A references B
- B also references A

Under CommonJS, a common issue is getting an "unfinished export object".

ESM has stricter semantics, but if you read a binding during module init before it is finished, you still hit a pitfall.

A better interview answer:

- first: circular deps are an initialization-timing problem
- then: how different module systems behave
- finally: how to avoid them in engineering: split responsibilities, extract a shared layer, reduce top-level side effects

#### 7. Babel, bundler, and the module system

These three are often mixed up. They are not the same layer.

##### 7.1 Module system

Defines how code is imported and exported, e.g. ESM and CommonJS.

##### 7.2 Babel

Responsible for code transform, e.g.:

- downleveling new syntax
- JSX transform
- AST-level plugins

It is not a full bundler by itself.

##### 7.3 bundler

Starts from entries, organizes the whole dependency graph, and emits a runnable artifact — e.g. webpack, Rollup, Vite's build phase.

A common senior-interview mistake is calling "Babel compiling the project" "Babel bundling the project". That is a category error.

#### 8. How to use modules in a real project

##### 8.1 Prefer ESM

Modern frontend projects should default to ESM. It is the foundation for build optimization, static analysis, and ecosystem alignment.

This repo's root [package.json](/Users/duanyupeng/project/study/fronted-review/package.json) already has:

```json
{
  "type": "module"
}
```

That means `.js` files in this project are treated as ESM by default.

##### 8.2 Keep module boundaries clear

More important than "many files" is "clear dependency direction":

- UI components should not depend upward on page layers
- `utils` should not sneakily depend on business state
- top-level modules should avoid implicit side effects

##### 8.3 Control module side effects

If a module runs a lot of logic as soon as it is imported, you get:

- weaker tree-shaking
- harder tests
- circular deps that are harder to debug

##### 8.4 Use dynamic import well

Dynamic import fits:

- route-level pages
- large editors and chart libraries
- infrequently used features

Do not overuse it down to fragments so small that network overhead outweighs the gain.

#### 9. High-frequency interview questions

##### 9.1 Core difference between CommonJS and ESM

CommonJS leans on runtime loading; `require()` can run dynamically. ESM import/export is a static declaration, which is better for build-time analysis and optimization.

##### 9.2 Why tree-shaking depends more on ESM

A bundler can safely drop unused code only when dependency boundaries are known at compile time. ESM's static structure is a natural fit.

##### 9.3 Why dynamic `import()` helps splitting

It creates an async boundary. The bundler can cut that subgraph out and load it on demand at runtime.

##### 9.4 Why circular deps are hard to debug

The issue is not only "who depends on whom", but "who initializes first and who reads the other's export first". It is a module init timing problem.

##### 9.5 How Babel relates to the module system

Babel can transform module syntax and other syntax, but it is not the module system itself. The module system defines import/export semantics; Babel is a transform tool.

#### 10. Interview answer tips

When asked about modularization, do not only recite names along a historical timeline. A more stable order:

1. first: what modularization solves
2. then: mechanism differences between ESM and CommonJS
3. then: why that affects tree-shaking, code splitting, and circular deps
4. finally: module boundary design in real engineering

That upgrades the answer from "knows the terms" to "understands the engineering meaning".
