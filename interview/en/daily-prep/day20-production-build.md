# Day 20 Production Build Practice Session Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 20 | Production build | [Build Tools](../advanced/week1/build-tools), [Hourly Checklist](../advanced/week1/hourly) |

## Today's goals

- Finish Vite Build / Env and Mode, webpack Caching
- Review the repo's existing Vite config (`.vitepress` or another project) and add comments for what each option does
- Write a Vite vs webpack **production build** comparison table

## Reading checkpoints

- `mode` decides `process.env.NODE_ENV`, but Vite also has a `.env.[mode]` load order
- Be able to name which of the 7 source-map types production should use (`hidden-source-map` is the most common)
- Build artifacts must be judged on **size / request count / cache hit rate** together

## Cheat sheet / knowledge points

- The goal of a production build is not "it runs", but all of: controllable size, stable cache, debuggable, rollback-friendly.
- Vite's `mode` decides which `.env` files load; `NODE_ENV` decides whether deps and frameworks take the production branch. Related, not the same thing.
- Frontend env vars are baked into the browser bundle. Do not put secrets, private tokens, or database passwords there; only public base URLs, env labels, and feature flags.
- Start code splitting from route-level dynamic imports, heavy components, rare features, and large third-party deps; splitting too finely raises request-scheduling cost.
- Basic long-cache strategy: HTML is not strongly cached or is short-cached; JS/CSS/images with `contenthash` are long-cached; keep old assets for a while for rollback.
- Do not expose production source maps publicly. Common practice: generate them at build, publish to the monitoring platform or controlled storage, and on production only restore stacks via release/version mapping.
- Artifact analysis looks at three problems: is the first-screen chunk too large, are duplicate deps packed into multiple chunks, and did a rare dep land on the first-screen path.
- Minify only solves "the last layer of size". First screen is also driven by request priority, asset cache, JS parse/execute cost, and render blocking.

## Handwritten code / flowcharts

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

## Oral questions

### 1. How do you handle production source maps?

> Answer template: Production source maps let you map online errors back to original locations, but they risk exposing source structure and business logic. So I would not simply put `.map` files on a public CDN. A safer approach is generating source maps at build, uploading them with the release to an error-monitoring platform or controlled storage, and matching online errors with compressed line/column, filename, and release to the corresponding map. That keeps debugging possible while access is controlled. Strategy also differs by environment: on in development, optionally public on staging for debugging, and in production prefer `hidden` or delete public files after upload.

### 2. Which 3 dimensions would you start artifact optimization from?

> Answer template: I start with size, requests, and cache. Size: first-screen chunk, third-party deps, duplicate deps, and whether tree-shaking actually worked. Requests: whether you split by route and rare features, and whether over-splitting added scheduling cost. Cache: whether HTML and static assets have separate policies, whether static files have contenthash, and whether the vendor chunk is stable. Then verify with Lighthouse, a bundle analyzer, and online RUM — not just post-build file size.

## 5-minute recording order

1. env / mode model (1 minute)
2. Artifact splitting + chunk strategy (2 minutes)
3. source map + artifact analysis (2 minutes)

## Today's review

1. Most likely follow-up: Vite being fast in development does not mean production skips bundling. Production still faces Rollup splitting, hashing, minify, and source-map strategy.
2. Current gap: `manualChunks` cannot just mechanically split `vendor`; weigh first-screen path, dep size, cache stability, and request count.
3. Next follow-up: take a real project's artifacts, mark first-screen large chunks, duplicate deps, and deferrable modules with an analyzer.
