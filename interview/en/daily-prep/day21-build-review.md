# Day 21 Build Topic Follow-up Review Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 21 | Build review | [Week 1 roadmap](../advanced/week1/roadmap), [Build tools](../advanced/week1/build-tools), [Modules](../advanced/week1/modules) |

## Today's goals

- Collect all outputs from Day 15–20 into a *Build Pipeline 15-Question Answer Book*
- Do a 30-minute self follow-up: for every answer, ask "why", and do not stop at one layer
- Record an 8-minute audio: walk ESM → dev server → bundle → chunk → cache in one go

## Reading pitfalls

- The follow-up most likely to break you in interviews after "why is Vite fast" is: then why is production not equally fast?
- When "Tree Shaking" is pushed all the way down, they are testing your combined understanding of **static analysis + sideEffects + pure functions**
- Build questions easily get pulled into **cache invalidation debugging** or **production performance issues**

## Cheat sheet / key points

### Build Pipeline 15-Question Answer Book

1. **ESM vs CommonJS**: ESM is a syntax-level static module system, which helps tree-shaking; CommonJS loads at runtime, with stronger compatibility but weaker static analysis.
2. **What Babel does**: Babel does AST-level syntax transforms; it does not own a full dependency-graph bundle. Polyfills cover missing runtime APIs.
3. **Loader vs Plugin**: A loader transforms a single module's contents; a plugin hooks the build lifecycle to add global capabilities.
4. **Why Vite is fast in development**: Dev mode is based on native browser ESM and on-demand loading, so startup does not need a full bundle first.
5. **Why Vite production is not necessarily faster**: Production still has to build the full dependency graph, then split, minify, hash, and emit sourcemaps. The bottleneck is no longer just the dev server.
6. **What dependency pre-bundling solves**: Convert CommonJS/UMD to ESM and merge fragmented deps, so the dev server makes fewer tiny requests.
7. **webpack's core model**: Build a dependency graph from the entry, then emit deployable artifacts through loaders, plugins, and chunks.
8. **When tree-shaking works**: ESM static structure, no side effects or a correct `sideEffects` mark, and dead-code elimination in the minify stage.
9. **Why dynamic import can split code**: It provides an async boundary, so the bundler can cut that subgraph into its own chunk.
10. **Purpose of code splitting**: Cut first-screen download and parse cost, and defer rarely used code — not to make the chunk count look pretty.
11. **Long-cache strategy**: Short-cache or no strong cache for HTML; long-cache hashed static assets; keep old assets so rollback still works.
12. **Value of a runtime chunk**: Extract module-mapping runtime so a small business change does not cascade into hash changes on large chunks.
13. **Source map strategy**: Generate them in production but do not expose them publicly; bind them to a release and upload them to monitoring so stacks can be restored.
14. **How to debug a slow build**: Separate install, typecheck, transform, plugins, minify, sourcemap, and I/O upload stages.
15. **How to debug cache misses**: Check HTML caching, asset hashes, CDN purge, whether old assets were kept, the service worker, and Nginx headers.

## Handwritten / flow diagrams

```text
Source entry
  -> Module resolution: ESM / CJS / alias / extensions
  -> Code transform: TS / JSX / Vue SFC / CSS / assets
  -> Dev:
       Vite dev server -> native ESM on-demand load -> HMR
     Production:
       dependency graph -> tree-shaking -> code splitting -> minify -> hash -> source map
  -> dist artifacts:
       index.html + assets/*.hash.js + assets/*.hash.css
  -> Release:
       upload to CDN/Nginx -> set cache headers -> bind release -> monitor sourcemap
  -> User visit:
       HTML fetches the latest asset references -> static assets hit long cache
```

## Oral questions

### 1. The full chain: ESM → dev server → bundle → chunk → cache

> Answer template: I would start from the module system. Source code expresses static dependencies with ESM, and the bundler first understands the entry and the dependency graph. In development, Vite uses native browser ESM: the dev server transforms a module on request and returns it, and HMR only updates the affected module boundary; webpack's dev server is more about assembling a bundle first and then serving it. In production, both Vite and webpack turn the graph into deployable artifacts: tree-shaking, dynamic-import splitting, minify, contenthash, and source maps. At release time, HTML references the latest hashed assets; HTML itself is short-cached, while JS/CSS are long-cached. That is how you get first-screen performance, cache hits, and controllable rollback at the same time.

### 2. Randomly pick 3 build follow-ups (choose your weakest)

> Answer template:
>
> 1. **Why is Vite production not necessarily faster than webpack?** Because the production goal is not returning modules on demand; it is fully analyzing the graph and emitting optimized artifacts. Time is spent on transform, minify, splitting, sourcemaps, and the plugin chain.
> 2. **Why does tree-shaking fail?** Common causes: the dep is CommonJS, the module has side effects, `sideEffects` is marked incorrectly, the import pulls the whole package in, or the minify stage does not drop dead code correctly.
> 3. **How do you debug a low cache hit rate?** First check whether HTML is strongly cached, then whether static assets use contenthash, whether vendor/runtime stay stable, whether CDN purge went wrong, and whether old assets were deleted too early.

## 8-minute recording outline

1. Module-system evolution (1 minute)
2. Babel vs bundler responsibilities (1.5 minutes)
3. Vite vs webpack (2 minutes)
4. Code splitting + tree shaking (1.5 minutes)
5. Caching strategy (2 minutes)

## Today's review

The 3 questions most likely to break you:

1. You can explain why Vite is fast in development, but you often omit "dependency pre-bundling" and "production still bundles".
2. Tree-shaking often stops at "ESM static analysis"; you still need side effects, import style, and minify deletion.
3. Caching answers often stop at hashing, and miss the linkage among HTML, CDN, keeping old assets, and rollback.

3 new "why" questions this week:

1. Why does a runtime chunk affect long-cache stability?
2. Why must source maps be bound to a release, instead of keeping only the latest map?
3. Why is finer code splitting not always better?
