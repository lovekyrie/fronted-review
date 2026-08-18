# Webpack vs Vite in depth

## 1. Core differences

| Dimension | Webpack | Vite |
|------|---------|------|
| **Architecture** | Bundle first (pack, then serve) | ESM (browser requests source files) |
| **Dev startup** | Full bundle (slow) | On-demand compile (fast) |
| **HMR** | WebSocket + HMR runtime (coarse) | ESM + WebSocket (module-precise) |
| **Production** | Webpack (JS bundle) | Rollup / Rolldown (better tree-shaking) |
| **Config** | webpack.config.js | vite.config.ts |

---

## 2. Webpack build pipeline

1. Read config and entry.
2. Recursively build the dependency graph from the entry (scope eval).
3. Loaders transform non-JS assets (file-loader / url-loader / babel-loader).
4. Plugins run on lifecycle hooks (compile / compilation / seal).
5. Emit chunks / assets.

**Loader vs plugin:**
- **Loader**: per-module transformer (turn file A into a JS module string).
- **Plugin**: lifecycle extension (enhance compile / done / emit).

```js
// Loader
module.exports = function simpleLoader(source) {
  return source.replace('__BUILD_TIME__', JSON.stringify(Date.now()))
}

// Plugin
class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('BuildTimePlugin', (stats) => {
      console.log('build done in ms:', stats.endTime - stats.startTime)
    })
  }
}
```

---

## 3. Tree shaking

- Relies on ES Module **static analysis** (`import` at top level, not inside `if`).
- Mark unused exports (`usedExports: true`), then Terser drops dead code in minify.
- Needs ESM output plus no side effects, or a correct `sideEffects` field.

```json
// package.json
{
  "sideEffects": ["./src/styles.css", "*.module.css"]
}
```

> **Follow-up**: why no tree shaking for CommonJS? `require()` is runtime-evaluated and can sit in a condition, so static analysis is unreliable.

---

## 4. Why Vite is fast

### Dev
1. **Browser ESM**: the browser requests source files; no full bundle first.
2. **Dep pre-bundling**: `esbuild` turns CommonJS in `node_modules` into ESM and merges tiny modules to cut request count.
3. **On-demand compile**: only the requested module and its deps, not the whole app.

```bash
# Pre-bundle output
ls node_modules/.vite/deps/
```

### Production
- Pack with **Rollup** (or **Rolldown** from Vite 3+, written in Rust).
- Rollup’s output is cleaner and better for libraries; Webpack’s is more app-oriented.

---

## 5. HMR compared

### Webpack HMR
```
Dev Server
  ↓ WebSocket
  ↓ client HMR runtime (injected)
  ↓ file change → notify runtime
  ↓ runtime fetches the new module over WebSocket
  → new module hash → check() → hot() update
  → on failure, page reload
```

**Issue**: every affected module is replaced, even if you only changed one component template.

### Vite HMR
```
File change
  → Vite server gets a WebSocket notice
  → find affected modules via the module graph
  → send an “update” message only (module id + new source)
  → browser replaces the ESM module cache
  → no extra file fetch (already in memory)
```

**Win**: precise replace. Only the changed module updates; other module state stays.

---

## 6. Vite 5 + Rolldown

### What Rolldown is
- Rollup rewritten in Rust. Goal: **same Rollup API, 10–100× faster**.
- Vite 3+ started moving production builds from Rollup to Rolldown.
- Still evolving; some plugins may not work.

### Migration notes
```bash
# Vite 5
- Rollup 4 by default
- Dropped Node 14/16
- Better Rollup plugin compatibility
```

> **Follow-up**: why not esbuild for everything? Large-app support is still weaker; tree shaking and code splitting lag Rollup / Rolldown.

---

## 7. Bundle strategy (code splitting)

### Three split styles
```js
// 1. Entry split
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
}

// 2. Dynamic import (preferred)
const module = await import('./heavy.js')

// 3. SplitChunksPlugin
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### Preloading
```js
// Preload the next route
<link rel="modulepreload" href="/routes/dashboard.js">

// Preload a critical asset
<link rel="preload" href="critical.css" as="style">
```

---

## 8. Interview answer template

1. **DX**: startup (Vite ~1s vs Webpack ~30s), then HMR precision.
2. **Internals**: Webpack is bundle-first; Vite is ESM-native plus pre-bundle.
3. **Production**: Rollup / Rolldown tree-shake better; Webpack’s ecosystem is broader.
4. **When to pick**: new / small / Vue 3 apps → Vite; large legacy / heavy custom → Webpack.

> **Bonus**: mention esbuild dep pre-bundling, and that Rolldown is becoming Vite’s production core.
