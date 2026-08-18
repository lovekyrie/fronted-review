# Day 23 Docker Basics Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 23 | Docker | [Deployment](../advanced/week2/deployment), [CI/CD](../advanced/week2/ci-cd) |

## Today's goals

- Finish Docker Build Overview / Dockerfile Reference / Build Variables
- Read the repo-root `Dockerfile` and `.dockerignore`, and write an annotated version
- Be able to explain the 5 concepts: image / container / layer / volume / network

## Reading pitfalls

- Each instruction usually creates a layer; combining instructions can shrink image size
- The order `COPY package*.json` → `RUN install` → `COPY .` maximizes cache hits
- Multi-stage builds: the build stage installs deps and compiles; the runtime stage keeps only artifacts

## Cheat sheet / key points

- An `image` is a read-only template; a `container` is a running instance of that image. One image can start many containers.
- A `layer` is the basis of image-layer caching. Each Dockerfile instruction usually creates one layer; earlier, more stable layers reuse cache more easily.
- A frontend static site usually does not need a Node runtime. Node is only for the build; Nginx serves static files at runtime.
- Multi-stage builds split the "build environment" from the "runtime environment". The final image keeps only `dist` and Nginx, so it is smaller and has a smaller attack surface.
- The value of `.dockerignore` is shrinking the build context, so `node_modules`, `.git`, local caches, and logs are not sent into the image build.
- The key Docker cache order is: copy lockfile and package files and install deps first, then copy app source. Source changes then do not invalidate the dep layer.
- `ARG` is a build-time variable; `ENV` enters the image runtime. Neither should carry secrets that will be baked into frontend artifacts.
- Image tags must be traceable. Production deploys should use a commit SHA or version, not only `latest`.

## Handwritten / flow diagrams

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

## Oral questions

### 1. Why do frontend images usually use a multi-stage build?

> Answer template: What a frontend project finally ships is usually a set of static files. The Node environment is only needed at build time; production does not need a full Node, a package manager, or source. A multi-stage build can install deps and run build in a Node image, then copy only dist into an Nginx image to run. The final image is smaller, startup is simpler, the attack surface is lower, and you avoid installing deps on the fly in production. In interviews I would stress the split of duties: the builder owns artifacts, the runtime owns a stable service.

### 2. How do you maximize Docker build cache hits?

> Answer template: Put steps that change less first, and frequently changing source last. For example, `COPY package.json` and the lockfile first, then `pnpm install`, and only then `COPY . .`. App-code changes then do not invalidate the install layer. Also write a good `.dockerignore` so `node_modules`, logs, test artifacts, and Git metadata stay out of the build context. CI can also use a registry cache or build cache, but the Dockerfile layer order still has to be right.

## 5-minute recording outline

1. Docker basics (1 minute)
2. Multi-stage builds (2 minutes)
3. Cache hits + slimming the image (2 minutes)

## Today's review

1. Most likely follow-up: why not just run a Node image for frontend? A static site does not need Node at runtime; Nginx is lighter and matches the job better.
2. Current gap: image-tag strategy must be bound to rollback. Knowing only `latest` is not enough.
3. Next to add: combine Nginx config to explain how the container handles SPA routing, cache headers, and static compression after it starts.
