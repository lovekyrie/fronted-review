# Vite

> Related: [Webpack](./webpack.md) · [Build Tools Overview](./build-tools.md) · [webpack vs Vite](../../engineering/webpack-vs-vite.md)

Vite's key idea is not "never bundle". It is **splitting dev and production**: dev stays on native browser ESM as much as possible; build then hands off to Rollup/Rolldown for production optimization.

---

## 1. What problem Vite solves

It still has to turn TS/JSX/Vue SFC/CSS/assets into deployable artifacts, but Vite's design focus is:

- **Dev**: fast startup, fast HMR, fast problem location
- **Production**: small size, good caching, debuggable

```
dev: browser ESM on-demand request → esbuild instant compile → WebSocket HMR
prod: Rollup/Rolldown full bundle → minify / hash / split / source map
```

---

## 2. Why development is usually faster

### 2.1 Native browser ESM

- The browser requests a module; the dev server compiles and returns that module
- **No need** to bundle the whole app tree at startup
- Changing one file usually only updates the affected module boundary

### 2.2 Dependency Pre-Bundling

Vite is not zero preprocessing. For `node_modules` it uses **esbuild** to pre-bundle:

1. Turn CommonJS / UMD into a form that fits an ESM dev server
2. Merge fragmented deps (e.g. hundreds of tiny lodash-es files) to cut browser request count

Cache directory: `node_modules/.vite/deps/`

### 2.3 Dev Server flow

```text
browser requests /src/main.ts
  → Vite intercepts
  → third-party dep? redirect to /.vite/deps/xxx.js
  → source? esbuild compiles TS/JSX → return ESM
  → browser keeps importing child modules (on demand)
  → file change → WebSocket push → module-level HMR
```

---

## 3. Production build

`vite build` **is still bundling**. Default is Rollup (Vite 5+ gradually introduces Rolldown):

```js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: 'hidden', // or true / 'inline'; see below
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        },
      },
    },
  },
})
```

Takeaways:

- fast dev ≠ no bundling at build time
- production still needs splitting, minify, hash, source map
- complex splitting requires understanding Rollup `manualChunks` / dynamic import

---

## 4. Trade-offs vs webpack (brief)

| Dimension | Vite | webpack |
|------|------|---------|
| Dev startup | seconds, on-demand ESM | often bundles first; slow on large apps |
| HMR | module-level, weakly tied to app size | chunk-level, tied to bundle size |
| Production build | Rollup/Rolldown | webpack itself |
| Config and ecosystem | convention over config, ecosystem growing fast | most mature, strongest customization |

A better answer is not "who is more advanced", but: project complexity, legacy baggage, and how much the team customizes the build pipeline.

---

## 5. What Vite must care about in production

### 5.1 Code splitting

```js
const UserPage = () => import('./UserPage.vue')
```

Route-level dynamic import + `manualChunks` to split vendor.

### 5.2 tree-shaking

Rollup's tree-shaking is usually good, but still depends on:

- whether deps are ESM
- `sideEffects` declarations
- modules with too many side effects

### 5.3 Long-term caching

Rollup emits `[name]-[hash].js`. Combined with vendor splitting and a stable chunk strategy, the logic is similar to webpack.

### 5.4 Environment variables

- Only variables prefixed with `VITE_` are exposed to the client
- Anything that enters the bundle is not a secret; do not use it as a backend key

---

## 6. Production Source Map debugging (Vite)

### 6.1 Build config

```js
export default defineConfig({
  build: {
    // false | true | 'inline' | 'hidden'
    sourcemap: 'hidden',
  },
})
```

| Value | Behavior | Production advice |
|----|------|----------|
| `false` | do not emit | cannot remap stacks; not recommended |
| `true` | standalone `.map` + `sourceMappingURL` at end of JS | OK for test env |
| `'hidden'` | standalone `.map`, **no URL in JS** | **production recommended** |
| `'inline'` | map inlined into JS, large size | generally not for production |

Example artifacts:

```text
dist/
  assets/
    index-a3f8c2.js
    index-a3f8c2.js.map
    vendor-d91e0b.js
    vendor-d91e0b.js.map
```

Vite emits maps via Rollup. Structure is similar to webpack: `sources`, `mappings`, optional `sourcesContent`.

### 6.2 Deploying with Nginx

Same principle as webpack:

```text
Public Nginx serves: html + js + css + images
Do not publicly serve: *.js.map (or intranet / monitoring only)
```

Example Nginx (static assets only, **do not** map `.map`):

```nginx
server {
  root /var/www/dist;
  location / {
    try_files $uri $uri/ /index.html;
  }
  # optional: explicitly reject .map in case they were uploaded by mistake
  location ~* \.map$ {
    return 404;
  }
}
```

### 6.3 Production error → locate source: full flow

#### Unified pipeline (same as webpack; tools differ only in build config)

```text
┌──────────────┐    ┌───────────────┐    ┌──────────────┐    ┌───────────────┐
│  CI build    │ → │ emit js + map │ → │ deploy JS to │ → │ user visit    │
│ vite build   │    │ sourcemap:    │    │ Nginx        │    │ triggers      │
│              │    │ hidden        │    │ (no .map)    │    │ runtime error │
└──────────────┘    └───────────────┘    └──────────────┘    └───────┬───────┘
                                                                     │
                     ┌───────────────┐    ┌──────────────┐           │
                     │ monitoring UI │ ← │ remap stack  │ ←─────────┘
                     │ shows source  │    │ frames       │   SDK reports stack
                     └───────────────┘    └──────────────┘
                            ↑
                     CI uploads .map to Sentry
                     bind release / dist
```

#### Step by step

**① Build**

```bash
VITE_APP_VERSION=1.2.0 vite build
# emits dist/assets/*.js + *.js.map
```

**② Deploy**

- Sync everything in `dist/` except `.map` to Nginx (or put `.map` on an intranet path)
- Initialize the frontend SDK with a **release version** that matches the version used when CI uploaded maps

**③ Runtime**

The user's browser runs `index-a3f8c2.js`; the stack points to artifact line/column.

**④ Report**

Sentry (or similar) SDK sends:

```json
{
  "release": "1.2.0",
  "exception": {
    "stacktrace": "at o (index-a3f8c2.js:1:8234)"
  }
}
```

**⑤ Platform remaps**

Sentry uses the uploaded `index-a3f8c2.js.map` to map `1:8234` to `src/components/User.vue:42:5`.

**⑥ Verify locally**

```bash
git checkout v1.2.0   # commit aligned with the release
# open src/components/User.vue:42
```

#### Vite-specific notes

- **Path prefix**: `build.base` affects asset URLs; it must match Nginx subpath deploys
- **Vue SFC**: maps resolve to the `.vue` file plus a specific block (template/script/style)
- **Multi-entry**: each entry chunk has its own map; uploads must cover all of `dist/assets`
- **Rolldown migration**: map format stays compatible, but when the plugin ecosystem changes, verify maps are still complete

### 6.4 Manual flow without a monitoring platform

1. From logs, get `index-a3f8c2.js:1:8234` and the deployed version  
2. Fetch the same version's `index-a3f8c2.js.map` from the CI artifact store  
3. `npx source-map-cli resolve ...` or Chrome DevTools "Add source map" to attach it by hand  
4. Go back to the matching git tag and read the source  

---

## 7. High-frequency interview questions

**Q: Why is Vite's dev fast?**  
Native ESM on-demand compile + esbuild pre-bundling of deps, so there is no full bundle at startup.

**Q: Does Vite still bundle for production?**  
Yes. `vite build` goes through Rollup/Rolldown for a full production bundle.

**Q: What does pre-bundling solve?**  
CJS→ESM + merging tiny files to cut requests. It is not at odds with "fast"; it makes the ESM path more stable.

**Q: How to configure production source maps?**  
`build.sourcemap: 'hidden'`, upload maps to the monitoring platform, and do not publicly serve `.map` from Nginx.

---

## 8. Answer template

1. Vite = ESM + pre-bundling in dev, Rollup bundle in production  
2. Strengths: modern default DX, fast HMR  
3. Complex customization still requires Rollup splitting and plugins  
4. Production debugging: hidden map + release alignment + Sentry upload, same flow as webpack
