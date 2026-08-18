# Day 25 Multi-env Variables and Build Mode Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 25 | env / mode | [Deployment](../advanced/week2/deployment), [CI/CD](../advanced/week2/ci-cd) |

## Today's goals

- Finish Vite Env and Mode, and Docker Build Variables
- Draw a chain diagram of env vars from `.env` → build artifacts → runtime
- Collect a diff list for the three environments dev / staging / prod (domains / APIs / feature flags)

## Reading pitfalls

- Vite only exposes variables that start with `VITE_` to the client, to prevent leaking secrets
- Build-time injection vs runtime injection: the former is baked into artifacts; the latter uses `window.__CONFIG__` / an API
- Docker `ARG` vs `ENV`: the former exists only at build time; the latter enters the runtime image

## Cheat sheet / key points

- Split env vars into three kinds first: local-dev vars, build-time vars, and runtime config. They take effect at different times.
- Vite loads the matching `.env` files by `mode`, and exposes variables that match the prefix rules on `import.meta.env`.
- Any variable that enters the frontend bundle is visible in the browser. Do not store secrets in `VITE_` variables.
- Build-time injection is simple and makes artifacts deterministic. The downside is that changing environment usually requires a rebuild.
- Runtime injection lets the same artifact deploy to multiple environments. Common approaches: an external `config.js`, server-side template injection, or replacing placeholders at startup.
- Docker `ARG` is only available during build; `ENV` stays in the image at runtime. Once it is written into frontend static files, users can still see it.
- For multi-env config, split "public config" from "sensitive config": public config goes to the frontend; secrets stay on the server, in CI secrets, or at the gateway.
- Common env-var incidents: wrong build mode, cached old HTML, hardcoded API domains in the frontend, staging vars flowing into production.

## Handwritten / flow diagrams

```text
Build-time injection:
.env.production
  -> Vite build --mode production
  -> import.meta.env.VITE_API_BASE is replaced into JS
  -> dist bakes in the config
  -> deploy to Nginx/CDN

Runtime injection:
The same dist
  -> generate /config.js when the container starts
  -> window.__APP_CONFIG__ = { apiBase: "..." }
  -> the app reads window.__APP_CONFIG__ at startup
  -> different environments reuse the same image
```

```ts
// Runtime config read sketch
type AppConfig = {
  apiBase: string
  env: 'dev' | 'staging' | 'prod'
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig
  }
}

export const appConfig: AppConfig = window.__APP_CONFIG__ ?? {
  apiBase: import.meta.env.VITE_API_BASE,
  env: import.meta.env.MODE as AppConfig['env'],
}
```

## Oral questions

### 1. How do you choose between build-time and runtime injection?

> Answer template: If you have few environments and a separate build per environment is acceptable, build-time injection is simplest. Vite replaces `import.meta.env` into artifacts at build time, so artifacts are tightly bound to an environment and debugging is direct. If you want the same image or dist reused across dev, staging, and prod, runtime injection fits better — for example generating `config.js` when the container starts, and reading `window.__APP_CONFIG__` at app startup. The trade-off is simplicity vs artifact reuse. Either way, secrets must not be injected into frontend-visible artifacts.

### 2. Why does Vite only expose variables with the `VITE_` prefix?

> Answer template: Frontend code finally runs in the browser, so build-time injected variables enter the JS bundle. Vite uses a `VITE_` prefix as an explicit allowlist, so database passwords, private tokens, and CI secrets on the machine are not accidentally baked into frontend artifacts. This design does not make `VITE_` variables safe; it requires developers to declare "this variable is allowed to reach the client". Real secrets belong on the server or in CI secrets, and are used indirectly through server APIs.

## 5-minute recording outline

1. Env-var chain (1.5 minutes)
2. Build-time vs runtime injection (2 minutes)
3. Secret boundaries (1.5 minutes)

## Today's review

1. Most likely follow-up: build-time variables are already baked into artifacts. Changing `ENV` at container runtime will not automatically change the JS in the browser.
2. Current gap: prepare a real `config.js` or placeholder-replacement scheme, and explain cache, type checking, and defaults.
3. Next to add: connect env vars with release rollback, so a rollback to an old version does not mismatch config files and static-asset versions.
