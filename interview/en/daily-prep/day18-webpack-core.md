# Day 18 webpack Core Concepts Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 18 | webpack | [Build Tools](../advanced/week1/build-tools), [webpack vs Vite](../engineering/webpack-vs-vite) |

## Today's goals

- Finish webpack Concepts / Code Splitting / Caching
- Draw a webpack build pipeline (entry → loader → module graph → chunk → asset)
- Write a minimal webpack config that actually runs

## Reading checkpoints

- loaders transform **a single file**; plugins act on the **whole build lifecycle**
- Be able to contrast `SplitChunksPlugin` defaults vs manual config
- Long-term cache hinges on `contenthash` + a separate runtime + stable module ids

## Cheat sheet / knowledge points

### webpack's 5 core concepts

| Concept | Role |
|------|------|
| **Entry** | Build entry files; dependency-graph resolution starts here |
| **Output** | Output path and filenames |
| **Loader** | Handle non-JS files (CSS, images, TS, etc.); transform **a single file** |
| **Plugin** | Act on the **whole build lifecycle**: packing optimizations, asset management, env injection, etc. |
| **Mode** | `development` / `production`; matching optimizations turn on automatically |

### Loader execution order

- Runs **right-to-left, bottom-to-top**.
- `use: ['style-loader', 'css-loader', 'sass-loader']`: sass → css → style.
- A loader is essentially a function: `(source) => transformedSource`.

### Plugin lifecycle

Plugins register callbacks (tap) on `compiler.hooks` and `compilation.hooks`:

```text
init → compile → make (build the module graph) → seal (optimize) → emit (write files) → done
```

Common plugins: `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `DefinePlugin`, `BundleAnalyzerPlugin`.

### Chunk types

| Type | Source |
|------|------|
| Entry chunk | One per entry |
| Async chunk | Produced by dynamic `import()` |
| Runtime chunk | webpack runtime (module-loading machinery) |
| Vendor chunk | Third-party libs split by `SplitChunksPlugin` |

### SplitChunksPlugin defaults

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000,      // only split if at least 20KB
    maxAsyncRequests: 30, // cap on parallel requests
    cacheGroups: {
      vendors: { test: /node_modules/, priority: -10 },
      default: { minChunks: 2, priority: -20, reuseExistingChunk: true }
    }
  }
}
```

### Long-term cache strategy

```text
1. Filenames use contenthash: unchanged content → unchanged hash
2. Split the runtime chunk: avoid vendor hash changing when app code changes
3. Stable module ids: moduleIds: 'deterministic'
4. Vendor in its own chunk: third-party libs change less often
```

## Handwritten code / flowcharts

### webpack build pipeline

```text
entry (src/index.js)
  → recursively resolve import / require → build Module Graph
  → each module runs through the Loader chain
  → Module Graph → optimize → SplitChunks into Chunks
  → each Chunk → Template → Asset (JS/CSS files)
  → emit to dist/
```

### Minimal webpack config

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single'
  }
}
```

## Oral questions

### 1. What is the essential difference between a loader and a plugin?

Answer template:

> A loader does **per-file content transform**. It is a function that takes a source string and returns a transformed string. `babel-loader` turns ES6+ into ES5; `css-loader` turns CSS into a JS module. Order is right-to-left.
>
> A plugin acts on the **whole build lifecycle**. It registers callbacks on `compiler.hooks` and can intervene at compile, optimize, emit, and other stages. `HtmlWebpackPlugin` generates HTML at emit; `MiniCssExtractPlugin` extracts CSS into its own file.
>
> Short version: loaders transform at file level; plugins extend at build level.

### 2. How do you design a chunk strategy that caches well long-term?

Answer template:

> Long-term cache is about "if the file content does not change, the hash does not change, so the browser can keep using the cache". Four steps:
>
> First, put `contenthash` in the filename so the hash changes only when content changes. Second, split webpack runtime into its own chunk (`runtimeChunk: 'single'`) so app-code changes do not drag the vendor chunk hash along. Third, use `moduleIds: 'deterministic'` so module ids stay stable. Fourth, use `SplitChunksPlugin` to peel third-party libs into a vendor chunk, because `node_modules` change far less often than app code.
>
> End result: first visit loads everything; later only changed app chunks need to be downloaded again.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Five core concepts (Entry / Output / Loader / Plugin / Mode) (2 minutes)
2. Code splitting (SplitChunks) + four-step long-term cache (2 minutes)
3. Loader order (right-to-left) + Plugin lifecycle hooks (1 minute)

Self-check after recording:

- Did you say loaders transform at file level and plugins extend at build level?
- Did you say loaders run right-to-left?
- Did you mention contenthash + runtimeChunk + deterministic moduleIds?
- Did you mention SplitChunksPlugin's cacheGroups?

## Today's review

The 3 points that most need follow-up today:

1. webpack Module Federation in micro-frontends.
2. When `resolve.alias` vs `externals` apply.
3. How webpack 5 persistent cache (`cache: { type: 'filesystem' }`) works.
