# Day 16 Babel: AST / preset / plugin Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 16 | Babel | [Build Tools](../advanced/week1/build-tools), [webpack vs Vite](../engineering/webpack-vs-vite) |

## Today's goals

- Finish the Babel config docs and Babel Parser
- Produce a Babel three-phase flowchart: parse → transform → generate
- Walk a real preset-env transform case as AST reading

## Reading checkpoints

- `preset-env` + `core-js` together only cover **syntax downleveling** and **polyfill injection**; the two jobs are different
- Babel does not bundle; it only does **per-file syntax rewriting**
- `@babel/runtime` and `@babel/plugin-transform-runtime` solve duplicated helper injection

## Cheat sheet / knowledge points

### Babel's three phases

```text
1. Parse: source → AST (@babel/parser)
2. Transform: walk the AST, match nodes with the visitor pattern and mutate them (@babel/traverse + plugins)
3. Generate: AST → new code + source map (@babel/generator)
```

### Core AST nodes

| Node type | Example |
|----------|------|
| `Program` | Top-level program |
| `VariableDeclaration` | `const x = 1` |
| `FunctionDeclaration` | `function foo() {}` |
| `ArrowFunctionExpression` | `() => {}` |
| `CallExpression` | `foo()` |
| `MemberExpression` | `obj.prop` |
| `Identifier` | `x`, `foo` |

You can inspect them live on [AST Explorer](https://astexplorer.net/).

### preset vs plugin

- **plugin**: a single transform rule (e.g. `@babel/plugin-transform-arrow-functions`).
- **preset**: a set of plugins (e.g. `@babel/preset-env` includes all ES6+ downlevel plugins).
- Order: plugins run before presets; plugins left-to-right; presets right-to-left.

### Three key preset-env options

```json
{
  "presets": [["@babel/preset-env", {
    "targets": "> 0.5%, last 2 versions, not dead",
    "useBuiltIns": "usage",
    "corejs": 3
  }]]
}
```

| Option | Role |
|------|------|
| `targets` | Target browsers; only downlevel syntax they do not support |
| `useBuiltIns: "usage"` | Inject polyfills automatically based on actual usage |
| `useBuiltIns: "entry"` | Inject a full polyfill set at the entry |
| `corejs: 3` | Specify the core-js version |

### preset-env vs core-js responsibilities

- **preset-env**: **syntax downleveling** (arrow functions → function, optional chaining → conditionals, etc.).
- **core-js**: **API polyfills** (Promise, Array.from, Object.assign, and other runtime APIs).
- They complement each other: preset-env decides what to downlevel; core-js provides missing API implementations.

### @babel/plugin-transform-runtime

Problem: Babel injects helpers (e.g. `_classCallCheck`) during transform; every file gets a copy, which duplicates code.

Fix: import shared helpers from `@babel/runtime` instead of inlining them.

## Handwritten code / flowcharts

### Full Babel pipeline

```text
source: const fn = () => 1
         │
         ▼  @babel/parser
  AST: ArrowFunctionExpression
         │
         ▼  plugin-transform-arrow-functions (visitor)
  AST: FunctionExpression (change node type + bind this)
         │
         ▼  @babel/generator
new code: var fn = function() { return 1; }
```

### Minimal Babel plugin example

```js
// Replace console.log with an empty statement
module.exports = function () {
  return {
    visitor: {
      CallExpression(path) {
        const callee = path.get('callee')
        if (callee.isMemberExpression() &&
            callee.get('object').isIdentifier({ name: 'console' }) &&
            callee.get('property').isIdentifier({ name: 'log' })) {
          path.remove()
        }
      }
    }
  }
}
```

## Oral questions

### 1. What does `preset-env` actually do, and how does it relate to `core-js`?

Answer template:

> `preset-env` is a Babel preset set. From the `targets` browsers, it picks the transform plugins you need and only downlevels syntax the target environment lacks. It owns **syntax-level** downleveling: arrows to `function`, optional chaining to conditionals, and so on.
>
> `core-js` owns **API-level** polyfills: runtime APIs such as `Promise`, `Array.from`, `Object.assign`. With `useBuiltIns: "usage"`, preset-env analyzes which APIs the code uses and injects the matching core-js modules on demand.
>
> Short version: preset-env owns syntax, core-js owns APIs; they complement each other.

### 2. Why use `@babel/plugin-transform-runtime`?

Answer template:

> When Babel transforms code it injects helpers, such as `_classCallCheck` and `_extends`. By default each file inlines a copy. Hundreds of files mean the same helpers are bundled hundreds of times, growing the bundle.
>
> `transform-runtime` points those helper references at the shared `@babel/runtime` package so every file shares one copy. It can also sandbox polyfills (no global pollution), which fits library authors.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Babel's three phases (parse → transform → generate) + the AST idea (1.5 minutes)
2. Three key preset-env options + the split with core-js (2 minutes)
3. The problem transform-runtime solves + the Babel vs bundler boundary (1.5 minutes)

Self-check after recording:

- Did you say Babel only rewrites syntax per file and does not bundle?
- Did you say preset-env owns syntax and core-js owns APIs?
- Did you mention on-demand injection with `useBuiltIns: "usage"`?
- Did you say transform-runtime solves duplicated helpers?

## Today's review

The 3 points that most need follow-up today:

1. Hands-on AST Explorer so you can quickly locate node types.
2. Plugin vs preset execution order (plugins left-to-right, presets right-to-left).
3. Bundle-size difference and when to use `useBuiltIns: "entry"` vs `"usage"`.
