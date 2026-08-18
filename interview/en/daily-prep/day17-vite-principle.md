# Day 17 Vite Internals Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 17 | Vite | [Build Tools](../advanced/week1/build-tools), [Week 1 roadmap](../advanced/week1/roadmap), [webpack vs Vite](../engineering/webpack-vs-vite) |

## Today's goals

- Finish Vite Guide / Why Vite / Features / Dependency Pre-Bundling
- Draw a Vite dev server flowchart
- Write a Vite vs webpack comparison (first half: development)

## Reading checkpoints

- Vite does not bundle in development; it uses native browser ESM. That is the root cause of "fast cold start"
- Pre-bundling (esbuild) solves two things: CJS → ESM conversion + merging many files to cut requests
- HMR: Vite only invalidates affected modules; webpack must re-bundle the affected chunk

## Cheat sheet / knowledge points

### Vite development model

```text
1. Use native browser ESM; do not bundle source
2. Pre-bundle (esbuild): convert CJS deps to ESM + merge files to cut requests
3. Compile on demand: only compile the module the browser requests
4. HMR: push changes over WebSocket; only invalidate affected modules
```

### Dependency Pre-Bundling

Uses esbuild (written in Go, very fast) to solve two problems:
- **CJS → ESM**: most third-party packages are CJS; the browser cannot use them directly.
- **Merge requests**: lodash-es has hundreds of tiny files; pre-bundling merges them into one so the browser does not fire hundreds of requests.

Cache lives in `node_modules/.vite/`; it is not rebuilt if deps are unchanged.

### HMR comparison

| Dimension | Vite | webpack |
|------|------|---------|
| Update scope | Only invalidate affected modules | Re-bundle the affected chunk |
| Speed | Independent of project size (O(1)) | Grows with chunk size |
| Transport | WebSocket pushes update info | WebSocket pushes a new chunk |

### Production build

- Uses **Rollup**, not esbuild, because Rollup's code splitting, tree-shaking, CSS handling, and plugin ecosystem are more mature.
- Vite 5+ has experimental Rolldown (a Rust Rollup-compatible bundler).

### Vite vs webpack

| Dimension | Vite | webpack |
|------|------|---------|
| Dev startup | Seconds (no source bundle) | Minutes (full bundle) |
| Dev compile | On demand (when the browser requests) | Full bundle |
| HMR | Module-level, very fast | Chunk-level, slower |
| Production bundle | Rollup | webpack itself |
| Config complexity | Low (convention over configuration) | High (flexible but verbose) |
| Ecosystem | Growing fast | Most mature |

## Handwritten code / flowcharts

### Full Vite Dev Server flow

```text
browser requests /src/main.ts
  → Vite dev server intercepts the request
  → check whether it is a third-party dep
    → yes: redirect to /.vite/deps/xxx.js (pre-bundle output)
    → no: esbuild compiles TS/JSX on the fly → return ESM
  → browser runs ESM and finds import statements
  → keep requesting dependent modules (on-demand loading)
  → when source changes:
    → Vite notifies the browser over WebSocket
    → the browser only re-requests the changed module
    → module-level HMR takes effect
```

### Vite plugin API sketch

```js
// vite.config.ts
export default {
  plugins: [{
    name: 'my-plugin',
    transform(code, id) {
      // Like a Rollup plugin: transform module contents
      if (id.endsWith('.md')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
    configureServer(server) {
      // Dev-only: custom middleware
      server.middlewares.use('/api', (req, res) => {
        res.end('hello')
      })
    }
  }]
}
```

## Oral questions

### 1. Why is Vite usually faster than webpack in development?

Answer template:

> webpack has to bundle every module before the dev server can start; larger projects start slower. Vite's strategy is different: it uses native browser ESM, does not bundle source, and at startup only pre-bundles deps (esbuild, very fast). Source is compiled on demand when the browser requests it.
>
> So Vite cold-start time is largely independent of project size. HMR is also module-level: only the changed module is invalidated, so speed is also independent of project size. webpack HMR must re-bundle the affected chunk, which gets slower as the project grows.

### 2. Why does Vite's production build use Rollup instead of esbuild?

Answer template:

> esbuild compiles extremely fast, but some production features are still less mature: code-splitting strategy (merging dynamic-import chunks), CSS code splitting, HTML handling, and a rich plugin ecosystem. Rollup has been polished for years in those areas, and its tree-shaking is among the best.
>
> So Vite's design is: esbuild for speed in development, Rollup for quality in production. Once Rolldown (Rust, Rollup-compatible) matures, it may unify the compile toolchain for both.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Vite's design philosophy (no source bundle + native ESM + compile on demand) (1.5 minutes)
2. Pre-bundling (esbuild for CJS→ESM + merging requests) + module-level HMR (2 minutes)
3. Comparison with webpack (startup, HMR, production) + why production uses Rollup (1.5 minutes)

Self-check after recording:

- Did you say the root cause of Vite's fast cold start is not bundling source?
- Did you name the two problems pre-bundling solves?
- Did you contrast module-level HMR vs webpack's chunk-level HMR?
- Did you explain why production uses Rollup?

## Today's review

The 3 points that most need follow-up today:

1. Compatibility and differences between Vite plugin API and Rollup plugin API (Vite-only hooks such as `configureServer`).
2. When to use `optimizeDeps` (manually list deps that need pre-bundling).
3. Vite SSR support and how `vite-node` works.
