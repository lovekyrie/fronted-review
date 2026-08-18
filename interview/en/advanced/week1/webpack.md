# Webpack

> Related: [Vite](./vite.md) · [Build Tools Overview](./build-tools.md) · [webpack vs Vite](../../engineering/webpack-vs-vite.md)

In senior interviews, webpack is not about reciting config keys. You need to explain this pipeline clearly: **build a dependency graph from the entry → transform with loaders/plugins → organize chunks → deploy artifacts**, and why it fits complex production builds.

---

## 1. What problem Webpack solves

The browser cannot run all of a real project's source as-is. Webpack's job is to turn mixed inputs into artifacts the browser can consume reliably:

```
source (JS/TS/JSX/CSS/assets)
  → module resolution (dependency graph)
  → code transform (loader)
  → build optimization (plugin / optimization)
  → emit chunks + static assets
```

Think of it as four layers:

1. **Resolve module relationships**: recursively collect deps from entry
2. **Transform code**: Babel, TS, CSS, etc. plug in via loaders
3. **Organize artifacts**: dev server or production bundle
4. **Optimize**: splitting, tree-shaking, minify, hash, source map

---

## 2. Core abstractions

```js
// webpack.config.js
export default {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: 'dist',
  },
  devtool: 'hidden-source-map', // see Source Map section below
}
```

| Concept | Role |
|------|------|
| **entry** | Build starting point; can be multiple |
| **dependency graph** | Module graph collected recursively from entries |
| **loader** | Per-file "translator"; turns non-JS or to-be-transpiled assets into modules |
| **plugin** | Hooks the whole build lifecycle (compile → seal → emit) |
| **chunk** | Grouping unit of output files (entry / async / runtime / vendor) |

### loader vs plugin

- **loader**: runs in the **single-module** transform stage  
  Examples: `babel-loader`, `css-loader`, `vue-loader`
- **plugin**: runs across the **entire build pipeline**  
  Examples: `HtmlWebpackPlugin`, `DefinePlugin`, `SplitChunksPlugin`

Loader order: **right to left, bottom to top**.

```js
use: ['style-loader', 'css-loader', 'sass-loader']
// actual: sass → css → style
```

### Plugin lifecycle (sketch)

```text
init → compile → make (build module graph) → seal (optimize / split chunks) → emit (write to disk) → done
```

---

## 3. Dev vs production

webpack **uses a bundling model for both dev and build**:

- **dev server**: HMR on top of the bundle + WebSocket; cold start and incremental feedback are usually slower on large apps
- **production**: full bundle, with strong control over chunk strategy, caching, and minification

This is the root of the UX gap vs Vite: webpack typically organizes a bundle even in development; Vite stays on ESM on demand during development.

---

## 4. Why it fits complex production builds

- Fine-grained chunk splitting (`SplitChunksPlugin`, `runtimeChunk`)
- Most mature plugin ecosystem; strong compatibility with legacy projects
- Fine control over "how the dependency graph becomes final files"

Cost: complex config, steep learning curve, high full-bundle cost in development.

### Long-term caching (common interview topic)

```js
export default {
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: 'single', // extract runtime so small changes do not cascade-invalidate vendor hashes
    splitChunks: { chunks: 'all' },
    moduleIds: 'deterministic',
  },
}
```

### Dynamic import and splitting

```js
const UserPage = () => import('./UserPage.vue')
```

`import()` is an async boundary. The bundler cuts that subgraph into an independent async chunk and loads it when visited.

---

## 5. Boundary with Babel

- **Babel**: turn one piece of code into another (AST transform)
- **webpack**: organize a set of modules into a developable / deployable artifact
- **polyfill**: fill in missing runtime APIs (e.g. `core-js`)

They often appear together, with different jobs.

---

## 6. Production Source Map debugging (Webpack)

### 6.1 First: why the stack looks like gibberish

After a production build, the browser runs **minified, concatenated, renamed** JS. Errors look like:

```text
TypeError: Cannot read properties of undefined (reading 'id')
    at a (main.a3f8c2.js:2:18407)
    at n (main.a3f8c2.js:2:921)
```

`main.a3f8c2.js:2:18407` is an **artifact** line/column, not a source location. A Source Map is the lookup table between "artifact position ↔ source position".

### 6.2 Build time: how webpack emits maps

```js
export default {
  mode: 'production',
  devtool: 'hidden-source-map', // recommended: emit .map but do not write sourceMappingURL at the end of JS
  output: {
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[file].map', // optional: custom .map path
  },
}
```

Common `devtool` choices:

| Value | Emit .map | URL at end of JS | Use |
|----|-----------|---------------|------|
| `source-map` | ✅ | ✅ public | Not recommended in production (source easy to expose) |
| `hidden-source-map` | ✅ | ❌ | **Production recommended**: maps go to the monitoring platform, not auto-fetched by the browser |
| `nosources-source-map` | ✅ (no sourcesContent) | ✅ | Mapping only, no source text |
| `eval-cheap-module-source-map` | inline eval | — | Fast for dev, not for production |

Example artifacts after build:

```text
dist/
  assets/
    main.a3f8c2.js
    main.a3f8c2.js.map    ← lookup table
    vendor.d91e0b.js
    vendor.d91e0b.js.map
```

`.map` is JSON. Core fields:

- `sources`: original file paths (e.g. `webpack://./src/pages/User.vue`)
- `sourcesContent`: optional, inlined source text
- `mappings`: VLQ-encoded position map

### 6.3 Deploying with Nginx: what to publish, what not to

**Typical safe setup**:

```text
Public Nginx (user-accessible)        Intranet / monitoring only
─────────────────────────────        ─────────────────────────
index.html                           *.js.map (or never upload to the public web)
main.[hash].js
vendor.[hash].js
```

Nginx should only serve **html / js / css / static assets** from `dist`. **Do not put `.map` in the public directory**, or DevTools / scanners may reconstruct source structure.

With `hidden-source-map`, the JS file **does not** end with `//# sourceMappingURL=...`, so the browser will not request `.map` by default.

### 6.4 Production error → locate source: full flow

#### Flow A: Sentry / in-house monitoring (production recommended)

```text
① User browser runs main.a3f8c2.js; a line throws
② Frontend SDK catches it, reports stack + release version
   { message, stack: "at a (main.a3f8c2.js:2:18407)", release: "1.2.0" }
③ At CI build: webpack emits hidden-source-map
④ CI uploads .map to Sentry (sentry-cli sourcemaps upload)
   bind release / dist path
⑤ Sentry uses the .map to turn  main.a3f8c2.js:2:18407
   into src/views/User.vue:42:5
⑥ You see source snippet, author, and commit in the Sentry UI
```

CI upload example (conceptual):

```bash
# build
npm run build

# upload source maps to Sentry (needs auth token + release)
npx @sentry/cli sourcemaps upload \
  --org your-org \
  --project your-project \
  --release "1.2.0" \
  ./dist/assets
```

Key point: **the map and JS hashes must come from the same build**, or line/column will not match.

#### Flow B: remap locally by hand (emergency)

1. Copy the stack from monitoring: `main.a3f8c2.js:2:18407`
2. Find `main.a3f8c2.js.map` from **the same build** (CI artifact archive)
3. Parse with a tool:

```bash
# source-map library, or sentry-cli / source-map-explorer
npx source-map-cli resolve dist/assets/main.a3f8c2.js.map 2 18407
```

4. Get `src/xxx.vue:line:col`, then checkout the matching commit locally

#### Flow C: DevTools debugging (test env only)

In test, you can use `devtool: 'source-map'` and have Nginx serve both `.js` and `.js.map`:

```text
Browser error → DevTools Sources panel
→ auto-load .map → show original .vue/.ts files
→ set breakpoints, see the full call stack
```

**Do not do this in production**, to avoid leaking source.

### 6.5 Webpack-specific notes

- **Multiple chunks**: each JS may have its own `.map`; uploads must cover every map under `dist`
- **publicPath**: `output.publicPath` affects the `sources` path prefix in maps; it must match the deploy path
- **CssSourceMap**: CSS has its own maps; style errors need `MiniCssExtractPlugin` (etc.) to enable them

---

## 7. High-frequency interview questions

**Q: Difference between loader and plugin?**  
Loader transforms a single module; plugin hooks the whole build lifecycle.

**Q: Why extract runtimeChunk in production?**  
Runtime holds the module-loading map. Mixing it with app code causes widespread cache invalidation.

**Q: Why does tree-shaking depend on ESM?**  
It needs static analysis of import/export. CJS `require()` can be called dynamically at runtime, so it is hard to prune statically.

**Q: hidden-source-map vs source-map?**  
Both emit a full map; the former does not expose a URL at the end of the bundle, which fits private storage on a monitoring platform.

---

## 8. Answer template

1. webpack builds a dependency graph from entry; loaders transform modules; plugins extend the lifecycle  
2. Production strengths: splitting, cache hashes, mature ecosystem  
3. Weakness: high bundling cost in development  
4. Production debugging: `hidden-source-map` + CI upload maps to Sentry, align versions via release
