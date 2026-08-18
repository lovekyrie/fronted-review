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
