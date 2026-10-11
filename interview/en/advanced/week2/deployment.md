### Deployment

This piece is a Week 2 supplement. The point is not to repeat CI/CD definitions, but to unpack “how frontend artifacts actually go live” on its own.

If CI/CD is more about the whole automation pipeline, deployment is more about these questions:

- what is the delivery unit
- what is the target environment
- how the deploy process stays stable
- how you verify after go-live
- how you roll back when something goes wrong

#### 1. What is frontend deployment actually deploying

Frontend delivery units commonly come in three kinds:

1. a static asset directory
2. a Docker image
3. a platform-hosted build artifact

This repo currently uses the second: image-based delivery:

- the build stage generates a VitePress static site
- an Nginx image hosts the build output
- GitHub Actions pushes it to GHCR
- the server pulls the image and starts a container

This is more stable than “pack locally then upload files by hand”, because the artifact and the runtime are delivered together.

#### 2. The real deploy chain in this repo

Core files:

- `.github/workflows/deploy.yml`
- `Dockerfile`
- `nginx.conf`

The chain can be split into:

1. push to main
2. GitHub Actions builds the image
3. push to GHCR
4. the server pulls the image over SSH
5. stop the old container and start the new one

#### 3. The value of a Docker two-stage build

The current Dockerfile uses a two-stage build:

```dockerfile
FROM node:20-alpine AS builder
...
RUN pnpm run docs:build

FROM nginx:alpine
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html
```

The value of doing it this way:

- the builder stage is only responsible for building
- the runtime stage only keeps what is needed to run
- the final image is smaller
- the runtime is cleaner

Interviewers often follow up: why not just run the frontend in a Node image? For a static site, you do not need a Node runtime at all. Nginx is lighter and a better fit for the job.

#### 4. Nginx’s job in frontend deployment

In this repo, Nginx mainly handles:

- static file serving
- gzip compression
- docs route fallback
- cache header control

Typical config:

```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

This kind of fallback fits docs routing and frontend routing. Otherwise, hitting a deep path directly may just return 404 from the server.

#### 5. How to choose a deploy strategy

Common frontend deploy strategies:

- overwrite deploy
- blue-green deploy
- rolling deploy
- canary / gradual rollout

This repo is closer to simple overwrite container deploy: stop the old container, start the new one.

Upsides:

- simple and direct
- low cost
- fits personal projects and small teams

Downsides:

- there may be a brief blip during the switch
- no fine-grained traffic switching
- rollback depends on whether image management is solid

#### 6. Verification after a frontend deploy

Many pipelines treat “the container is up” as deploy complete. That is not enough.

A more solid verification ladder should include:

1. whether the container started successfully
2. whether the home page returns 200
3. whether static assets are reachable
4. whether key routes work
5. whether error monitoring shows a spike

Frontend post-deploy verification should at least add a smoke check. Otherwise it only means “the deploy script finished”, not “go-live succeeded”.

#### 7. Why rollback matters

Frontend go-live failures usually have a large blast radius, because once static assets break, all users may be affected.

So rollback capability at least has to answer:

- which version is running in production
- what the last stable version was
- whether you can switch back quickly

This repo tags images with `sha`, but the actual deploy script uses `latest`, which weakens precise rollback. A more solid approach is to deploy the image that corresponds to the commit SHA.

#### 8. Common senior interview follow-ups

##### 8.1 Why frontend is a good fit for containerized deploy

Because it unifies the build environment, runtime, and artifact version, reducing “different machines, different behavior”.

##### 8.2 What is the difference between deployment and CI/CD

Deployment is more about “how to get artifacts onto the target environment and keep them running stably”. CI/CD is more about “the whole automation chain from code change to artifact delivery”.

##### 8.3 Why you still need verification after deploy

Because a successful script does not mean users can actually use the product. Missing assets, route errors, cache inconsistency, and wrong API domains can all make a “successfully deployed” version unusable.

##### 8.4 Why rollback must be designed before go-live

Because when a real incident happens, designing rollback on the spot is usually too late. Version identifiers, image management, asset mapping, and monitoring/alerting all have to be prepared in advance.

#### 9. Interview answer suggestions

If you are asked about deployment, you can answer in this order:

1. first state what the delivery unit is
2. then walk the roles in this deploy chain: build, image, Nginx, server
3. then cover post-go-live verification and rollback
4. finally add the strengths and limits of the current approach

That answer is more complete than “I can deploy with Docker and Nginx”.

## Daily practice reference

### Day 23: Knowledge notes

- An `image` is a read-only template; a `container` is a running instance of that image. One image can start many containers.
- A `layer` is the basis of image-layer caching. Each Dockerfile instruction usually creates one layer; earlier, more stable layers reuse cache more easily.
- A frontend static site usually does not need a Node runtime. Node is only for the build; Nginx serves static files at runtime.
- Multi-stage builds split the "build environment" from the "runtime environment". The final image keeps only `dist` and Nginx, so it is smaller and has a smaller attack surface.
- The value of `.dockerignore` is shrinking the build context, so `node_modules`, `.git`, local caches, and logs are not sent into the image build.
- The key Docker cache order is: copy lockfile and package files and install deps first, then copy app source. Source changes then do not invalidate the dep layer.
- `ARG` is a build-time variable; `ENV` enters the image runtime. Neither should carry secrets that will be baked into frontend artifacts.
- Image tags must be traceable. Production deploys should use a commit SHA or version, not only `latest`.

### Day 23: Practice example

```dockerfile
# Frontend multi-stage build: Node does the build, Nginx serves
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```text
Source + Dockerfile
  -> build context, affected by .dockerignore
  -> builder stage: install deps, run the build, emit dist
  -> runtime stage: copy dist + nginx.conf
  -> image: tag it, push to a registry
  -> container: the server pulls the image and runs it
```

### Day 24: Knowledge notes

- Common Nginx jobs in frontend deploys: static file serving, SPA route fallback, cache headers, gzip/brotli, reverse proxy, and simple security headers.
- A history-router refresh 404 happens because the browser requests `/user/1` directly, and the server has no such real file. You need a fallback to `index.html`.
- `try_files $uri $uri/ /index.html;` means: look for a real file, then a directory, then hand it to the frontend router.
- Cache HTML and hashed static assets differently: `index.html` must update promptly; `assets/*.hash.js` can be long-cached.
- Common `location` priority: exact `=`, prefix match, regex match. You do not have to recite every rule in interviews, but you should know that blocks can override each other.
- A trailing `/` on `proxy_pass` changes how the forwarded path is joined. This is a high-frequency API reverse-proxy pitfall.
- gzip is good for text assets such as HTML, CSS, JS, and JSON. Already-compressed images and video gain little.
- Frontend cache debugging must look at response headers, filename hashes, CDN cache, browser cache, and the service worker together.

### Day 24: Practice example

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location = /index.html {
        add_header Cache-Control "no-cache";
        try_files /index.html =404;
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```text
User visits /dashboard
  -> Nginx looks for the real file /dashboard
  -> File does not exist
  -> try_files falls back to /index.html
  -> Browser loads JS
  -> Frontend Router takes over /dashboard
```

### Day 25: Knowledge notes

- Split env vars into three kinds first: local-dev vars, build-time vars, and runtime config. They take effect at different times.
- Vite loads the matching `.env` files by `mode`, and exposes variables that match the prefix rules on `import.meta.env`.
- Any variable that enters the frontend bundle is visible in the browser. Do not store secrets in `VITE_` variables.
- Build-time injection is simple and makes artifacts deterministic. The downside is that changing environment usually requires a rebuild.
- Runtime injection lets the same artifact deploy to multiple environments. Common approaches: an external `config.js`, server-side template injection, or replacing placeholders at startup.
- Docker `ARG` is only available during build; `ENV` stays in the image at runtime. Once it is written into frontend static files, users can still see it.
- For multi-env config, split "public config" from "sensitive config": public config goes to the frontend; secrets stay on the server, in CI secrets, or at the gateway.
- Common env-var incidents: wrong build mode, cached old HTML, hardcoded API domains in the frontend, staging vars flowing into production.

### Day 25: Practice example

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

### Day 26: Release strategy matrix

| Strategy | Core approach | Best for | Main risks |
|------|----------|----------|----------|
| Overwrite release | Replace the old version directly | Personal projects, small-team low-risk systems | Incidents hit all users; rollback depends on versioning |
| Blue-green | Keep old and new environments, then switch traffic | High stability needs, fast cutover | Higher resource cost; data/state must stay compatible |
| Rolling | Replace instances in batches | Multi-instance services, container platforms | Old and new coexist briefly; APIs and assets must be compatible |
| Gradual / canary | A small set of users gets the new version first | High-traffic products, controlled-risk releases | Buckets must be stable; monitoring and rollback must be fine-grained |

- Rollback should roll back a "verified artifact", not temporarily revert source and rebuild. Otherwise deps, environment, or build params can introduce new diffs.
- Frontend static rollback needs versioning: HTML, hashed assets, image tags, source maps, and release IDs must line up.
- After assets are hashed, multiple versions can coexist. Old HTML can still load old JS. That is critical for blue-green, gradual rollout, and rollback.
- Gradual buckets must be stable, e.g. by user ID, tenant, region, or account hash. Random buckets make users bounce between new and old versions.
- Define rollback triggers in advance: blank-screen rate up, JS error rate up, core API failures, asset 404s, conversion or core business metrics going wrong.
- A release is not done when the script finishes. At least verify after deploy: container status, homepage 200, key assets, key routes, monitoring metrics.
- `latest` is fine for humans to look at, not for precise rollback. Production deploys should record commit SHA, image tag, build number, and release time.
- After rollback, still watch caches: users may still hold old HTML, an old service worker, or a CDN edge cache.

### Day 26: Supplementary notes

```text
5-minute production-incident rollback:

Monitoring alert / user report
  -> Confirm scope: all users / gradual / one region / one browser
  -> Grade it: blank screen, core path down, abnormal error rate
  -> Decide: if a fix will take too long, roll back immediately
  -> Execute: switch back to the last stable image tag / static-asset version
  -> Verify: homepage, key routes, core APIs, error rate
  -> Observe: cache hits, CDN, users still on the old version
  -> Record: impact, root cause, fix actions, prevention items
```

```bash
# Container-deploy rollback sketch: switch back to the last stable image tag
docker pull registry.example.com/frontend:2026-05-previous-sha
docker stop frontend || true
docker rm frontend || true
docker run -d \
  --name frontend \
  --restart always \
  -p 8080:80 \
  registry.example.com/frontend:2026-05-previous-sha
```

### Day 27: Post-release troubleshooting checklist

| Issue | Typical symptoms | Fast diagnosis | Common fix |
|------|----------|----------|----------|
| Blank screen | Empty page, console errors | DevTools Console, monitored error stacks | Rollback, fix JS exceptions, add compatibility |
| JS asset 404 | `app.hash.js` fails to load | Network status codes | Restore old assets, fix publish path/CDN |
| Missing CSS | No styles or broken layout | Network CSS, MIME type | Fix asset paths, Nginx type config |
| API failure | Page stuck loading, empty data | Network 4xx/5xx, API domain | Fix the API, gateway, or env vars |
| CORS error | Console CORS errors | Preflight OPTIONS and response headers | Add CORS config or a proxy |
| Cache mix-up | Some users mix new and old | `index.html` response headers and asset hashes | Fix cache headers, purge CDN, keep old assets |
| Wrong env vars | Requests go to the wrong domain | Check build artifacts and runtime config | Redeploy correct config or roll back |
| gzip/CDN issues | Slow loads, compression not applied | `content-encoding`, CDN origin fetch | Fix Nginx/CDN config |
| Certificate issues | HTTPS fails | Browser security panel, cert chain | Renew the cert, fix domain binding |
| Users on old version | Still broken after rollback | Service worker, browser cache | Clear SW, adjust cache strategy |

- Blank-screen first split into three: JS runtime errors, core assets failing to load, and API/config errors that keep the app from starting.
- For asset 404s, check whether "new HTML references a hashed file that was not uploaded" or "old HTML references an old hashed file that was deleted".
- If users still see the old page, first check whether `index.html` is strongly cached, then CDN, service worker, and browser cache.
- Split API failures into network failure, CORS failure, auth failure, and business 5xx. Do not lump them as "the API is down".
- Env-var mistakes usually show up as the wrong request domain, the wrong flag state, or staging config flowing into production.
- Stop the bleeding before the root cause: if a core path is down, roll back or switch traffic first, then find the full cause in the review.

### Day 27: Supplementary notes

```text
User report / monitoring alert
  -> Reproduce: env, account, browser, region, version
  -> Classify:
       JS: Console, error monitoring, source map
       Assets: Network, 404, MIME, CDN
       Network: API status, CORS, auth, gateway
       Cache: index.html, hash, CDN, service worker
       Config: env, config.js, domain, flags
  -> Judge impact: all users / gradual / one tenant / one browser
  -> Action: fix config / purge CDN / roll back / hot fix
  -> Verify: critical path + metrics recovered
```
