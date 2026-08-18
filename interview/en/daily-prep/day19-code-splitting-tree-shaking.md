# Day 19 Code Splitting / Tree Shaking / Caching Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 19 | Code splitting / Tree Shaking | [Build Tools](../advanced/week1/build-tools), [Hourly Checklist](../advanced/week1/hourly) |

## Today's goals

- Finish webpack Code Splitting / Caching and Rollup tree shaking
- Produce a Tree Shaking prerequisites list (ESM / sideEffects / pure functions)
- Produce a production-cache answer script: filename hash, HTTP cache headers, CDN-layer cache

## Reading checkpoints

- `sideEffects: false` is a double-edged sword; a wrong config will tree-shake CSS away
- Dynamic `import()` splits a chunk by default; magic comments affect the chunk name
- Long-term cache must keep "app-code change does not change the vendor hash"

## Cheat sheet / knowledge points

### Tree Shaking prerequisites

1. **ESM format**: must use `import / export`; CJS cannot be statically analyzed.
2. **`sideEffects` config**: mark `"sideEffects": false` in `package.json`, or list files.
3. **Pure functions / no side effects**: bundlers use `/*#__PURE__*/` comments to decide.
4. **production mode**: development usually does not enable tree shaking.

### Common Tree Shaking failure cases

- Using a CJS library (e.g. lodash instead of lodash-es).
- Wrong `sideEffects` config, so CSS files are treated as side-effect-free and removed.
- Side effects in the code (IIFEs, global assignment, `Object.defineProperty`).
- `export default` of a whole object, so the bundler cannot tell which properties are used.

### Three levels of code splitting

| Level | Strategy | Scenario |
|------|------|------|
| Route-level | `React.lazy()` / Vue `defineAsyncComponent` | Split by page |
| Component-level | Dynamic `import()` | Heavy components / dialogs / editors |
| Vendor-level | `SplitChunksPlugin` / `manualChunks` | Peel third-party libs |

### Three cache layers working together

```text
Browser cache (Cache-Control + contenthash filenames)
  ↕
CDN cache (edge nodes cache static assets, exact URL match)
  ↕
Gateway / origin cache (Nginx proxy_cache or S3)
```

## Handwritten code / flowcharts

### Three styles of dynamic import

```js
// 1. Basic usage
const module = await import('./heavy.js')

// 2. webpack magic comment to name the chunk
const Chart = () => import(/* webpackChunkName: "chart" */ './Chart.vue')

// 3. Vite glob import
const modules = import.meta.glob('./modules/*.ts')
// produces: { './modules/a.ts': () => import('./modules/a.ts'), ... }
```

### Tree Shaking check

```js
// utils.js — ESM exports
export function used() { return 'I survive' }
export function unused() { return 'I am dead code' }

// main.js
import { used } from './utils.js'
console.log(used())
// After a production build, unused is removed
```

## Oral questions

### 1. What are the prerequisites for Tree Shaking to work?

Answer template:

> Tree Shaking needs four prerequisites. First, the code must be ESM (`import / export`), because ESM is a static structure and the bundler can analyze import/export at compile time. CJS is dynamically executed and cannot be determined at compile time.
>
> Second, `package.json` must configure `sideEffects` correctly. `false` means no file has side effects, so unused exports can be dropped. CSS files do have side effects; declare them in the `sideEffects` array.
>
> Third, the code itself should be pure, with no side effects. If the module top level has an IIFE or a global assignment, the bundler will not dare remove it. Fourth, you must build in production mode.

### 2. How should production cache and versioning be designed?

Answer template:

> Cache strategy has three layers. Browser: HTML uses `no-cache` (negotiate every time); JS/CSS use strong cache `max-age=31536000` plus `contenthash` in the filename. Content change → hash change → URL change, so the old cache is bypassed automatically.
>
> CDN: static assets on the CDN; edge nodes cache by exact URL. You do not need to purge the CDN on a new release, because new files have new hashes and different URLs.
>
> Build: SplitChunks peels vendor (changes rarely, long cache) from app code (changes often). Extract the runtime chunk so app-code changes do not drag the vendor hash along.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Four Tree Shaking prerequisites + failure cases (2 minutes)
2. Three-level code splitting (route / component / vendor) (1.5 minutes)
3. Three cache layers (browser / CDN / origin) + contenthash versioning (1.5 minutes)

Self-check after recording:

- Did you say tree shaking depends on ESM's static structure?
- Did you mention the `sideEffects` CSS pitfall?
- Did you mention contenthash + vendor split + runtime extraction?
- Did you explain why the CDN does not need an active purge?

## Today's review

The 3 points that most need follow-up today:

1. Real usage of `/*#__PURE__*/` and toolchain support.
2. Tree-shaking detail differences between Rollup and webpack.
3. Code-splitting strategy for multi-page apps (when to extract shared chunks).
