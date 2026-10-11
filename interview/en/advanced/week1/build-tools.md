# Build Tools Overview

In senior frontend interviews, "build tools" is not reciting config keys. You need to explain one pipeline:

```text
source → module resolution → code transform → dev server / production bundle → split & cache → deploy artifact → production debugging
```

Saying only "Vite is fast, webpack has lots of config" is not deep enough. Interviewers want to see what each tool solves, and how the mechanism affects DX and production behavior.

---

## Topic docs

| Doc | Content |
|------|------|
| [Webpack](./webpack.md) | Dependency graph, loader/plugin, split & cache, **webpack Source Map debugging** |
| [Vite](./vite.md) | ESM dev, pre-bundling, Rollup build, **Vite Source Map debugging** |
| [webpack vs Vite in depth](../../engineering/webpack-vs-vite.md) | Comparison table, HMR, Rolldown, interview template |

---

## 1. Why build tools are needed

Browsers can only execute part of frontend code directly. Real projects usually include:

- ESNext / TypeScript / JSX / Vue SFC
- CSS preprocessors
- images, fonts, and other static assets
- a large dependency graph

Build-tool job: turn these inputs into artifacts the browser and runtime can consume reliably.

Four layers of capability:

1. **Resolve module relationships** — entries, dependency graph, static import analysis
2. **Transform code** — Babel, TS, PostCSS, etc.
3. **Organize artifacts** — dev emphasizes feedback speed; prod emphasizes size and cache
4. **Optimize** — splitting, tree-shaking, minify, hash, source map

---

## 2. Module systems and tree-shaking

- **ESM**: `import` / `export`, static structure, good for tree-shaking
- **CommonJS**: `require()` can be called dynamically at runtime; static analysis is hard

Common reasons tree-shaking fails: CJS deps, too many side effects, incorrect `sideEffects` config.

---

## 3. Boundary between Babel and bundler

| Role | Duty |
|------|------|
| Babel | code → code (AST transform) |
| webpack / Vite | module graph → developable / deployable artifact |
| polyfill | fill in runtime APIs |

---

## 4. Dev vs production (core difference)

| | webpack dev | Vite dev |
|--|-------------|----------|
| Approach | bundle first, then serve | browser ESM on-demand request |
| Startup | often slow on large apps | usually seconds |
| HMR | chunk-level | module-level |

**Production**: both still bundle, minify, hash, and emit source maps — see each topic doc.

---

## 5. Shared production-build points

### Code splitting

```js
const Page = () => import('./Page.vue')
```

### Long-term caching

- filename `contenthash`
- separate vendor and runtime
- a small app change should not invalidate every hash

### Source Map (production debugging)

**Full flow (shared by webpack / Vite)**:

```text
1. Build: hidden source map (emit .map, do not expose URL in JS)
2. Deploy: Nginx serves only js/css/html; .map is not public
3. CI: upload .map to Sentry, bind the release version
4. Runtime: SDK reports stack (artifact file:line:col + release)
5. Platform: remap with .map to src/xxx.vue:line:col
6. Dev: checkout the matching tag, open the source file locally and fix
```

Config comparison:

| Tool | Production recommended |
|------|----------|
| webpack | `devtool: 'hidden-source-map'` |
| Vite | `build.sourcemap: 'hidden'` |

Details, Nginx examples, and manual remap commands: [webpack.md §6](./webpack.md#6-production-source-map-debugging-webpack) and [vite.md §6](./vite.md#6-production-source-map-debugging-vite).

---

## 6. High-frequency interview questions (cheat sheet)

1. **Why is Vite dev fast?** — ESM on demand + esbuild pre-bundling, not a full bundle at startup  
2. **Why does tree-shaking depend on ESM?** — needs static analysis of import/export  
3. **Babel vs bundler?** — transpile vs organize module artifacts  
4. **Why does dynamic import split?** — provides an async boundary; the graph can be cut into a chunk  
5. **Why extract a runtime chunk?** — avoid a small change invalidating cache at large scale  
6. **Production source map strategy?** — hidden + upload to monitoring; do not publicly serve .map  

---

## 7. Answer template

1. First: what problem build tools solve (four layers)  
2. Then: mechanism differences for dev / build (webpack bundling vs Vite ESM)  
3. Then: production optimization: splitting, cache, tree-shaking  
4. Tie it to a project: one production debug story — hidden map + Sentry + release alignment  

That sounds more like senior frontend than "listing config keys".

## Daily practice reference

### Day 16: Babel's three phases

```text
1. Parse: source → AST (@babel/parser)
2. Transform: walk the AST, match nodes with the visitor pattern and mutate them (@babel/traverse + plugins)
3. Generate: AST → new code + source map (@babel/generator)
```

### Day 16: Core AST nodes

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

### Day 16: preset vs plugin

- **plugin**: a single transform rule (e.g. `@babel/plugin-transform-arrow-functions`).
- **preset**: a set of plugins (e.g. `@babel/preset-env` includes all ES6+ downlevel plugins).
- Order: plugins run before presets; plugins left-to-right; presets right-to-left.

### Day 16: Three key preset-env options

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

### Day 16: preset-env vs core-js responsibilities

- **preset-env**: **syntax downleveling** (arrow functions → function, optional chaining → conditionals, etc.).
- **core-js**: **API polyfills** (Promise, Array.from, Object.assign, and other runtime APIs).
- They complement each other: preset-env decides what to downlevel; core-js provides missing API implementations.

### Day 16: @babel/plugin-transform-runtime

Problem: Babel injects helpers (e.g. `_classCallCheck`) during transform; every file gets a copy, which duplicates code.

Fix: import shared helpers from `@babel/runtime` instead of inlining them.

### Day 16: Full Babel pipeline

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

### Day 16: Minimal Babel plugin example

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

### Day 19: Tree Shaking prerequisites

1. **ESM format**: must use `import / export`; CJS cannot be statically analyzed.
2. **`sideEffects` config**: mark `"sideEffects": false` in `package.json`, or list files.
3. **Pure functions / no side effects**: bundlers use `/*#__PURE__*/` comments to decide.
4. **production mode**: development usually does not enable tree shaking.

### Day 19: Common Tree Shaking failure cases

- Using a CJS library (e.g. lodash instead of lodash-es).
- Wrong `sideEffects` config, so CSS files are treated as side-effect-free and removed.
- Side effects in the code (IIFEs, global assignment, `Object.defineProperty`).
- `export default` of a whole object, so the bundler cannot tell which properties are used.

### Day 19: Three levels of code splitting

| Level | Strategy | Scenario |
|------|------|------|
| Route-level | `React.lazy()` / Vue `defineAsyncComponent` | Split by page |
| Component-level | Dynamic `import()` | Heavy components / dialogs / editors |
| Vendor-level | `SplitChunksPlugin` / `manualChunks` | Peel third-party libs |

### Day 19: Three cache layers working together

```text
Browser cache (Cache-Control + contenthash filenames)
  ↕
CDN cache (edge nodes cache static assets, exact URL match)
  ↕
Gateway / origin cache (Nginx proxy_cache or S3)
```

### Day 19: Three styles of dynamic import

```js
// 1. Basic usage
const module = await import('./heavy.js')

// 2. webpack magic comment to name the chunk
const Chart = () => import(/* webpackChunkName: "chart" */ './Chart.vue')

// 3. Vite glob import
const modules = import.meta.glob('./modules/*.ts')
// produces: { './modules/a.ts': () => import('./modules/a.ts'), ... }
```

### Day 19: Tree Shaking check

```js
// utils.js — ESM exports
export function used() { return 'I survive' }
export function unused() { return 'I am dead code' }

// main.js
import { used } from './utils.js'
console.log(used())
// After a production build, unused is removed
```

### Day 20: Knowledge notes

- The goal of a production build is not "it runs", but all of: controllable size, stable cache, debuggable, rollback-friendly.
- Vite's `mode` decides which `.env` files load; `NODE_ENV` decides whether deps and frameworks take the production branch. Related, not the same thing.
- Frontend env vars are baked into the browser bundle. Do not put secrets, private tokens, or database passwords there; only public base URLs, env labels, and feature flags.
- Start code splitting from route-level dynamic imports, heavy components, rare features, and large third-party deps; splitting too finely raises request-scheduling cost.
- Basic long-cache strategy: HTML is not strongly cached or is short-cached; JS/CSS/images with `contenthash` are long-cached; keep old assets for a while for rollback.
- Do not expose production source maps publicly. Common practice: generate them at build, publish to the monitoring platform or controlled storage, and on production only restore stacks via release/version mapping.
- Artifact analysis looks at three problems: is the first-screen chunk too large, are duplicate deps packed into multiple chunks, and did a rare dep land on the first-screen path.
- Minify only solves "the last layer of size". First screen is also driven by request priority, asset cache, JS parse/execute cost, and render blocking.

### Day 20: Practice example

```ts
// Typical production vite.config.ts: sourcemap, chunks, output naming
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode !== 'production' ? true : 'hidden',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue'
            return 'vendor'
          }
        },
      },
    },
  },
}))
```

```text
source
  -> env/mode injection
  -> TS/Babel/Vue SFC transform
  -> dependency-graph analysis
  -> tree-shaking
  -> code splitting
  -> minify + hash + sourcemap
  -> dist artifacts
  -> CDN/Nginx publish
```
