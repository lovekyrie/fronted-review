### CI/CD

Many answers to CI/CD stop at the eight words “automated build, automated deploy”. That is not enough for a senior frontend interview. A better way to answer is: **put CI/CD inside a real delivery chain and explain it clearly.**

For frontend, that chain is usually:

`commit code -> trigger workflow -> install deps / quality checks -> build artifacts -> build image -> push registry -> deploy to server -> verify and roll back`

If you can walk this chain smoothly, then explain the risks and trade-offs of each step with a real project, the answer will sound much more senior than a “concept explanation”.

#### 1. What problems do CI and CD each solve

##### 1.1 CI: Continuous Integration

The point of CI is not “automatically running commands” itself, but **finding problems introduced by a change as early as possible**.

Common goals:

- Run checks before code is merged
- Unify dependency install and build environments
- Surface lint, test, and build failures early
- Keep the main branch as stable as possible

For frontend projects, the most common CI actions are:

- Install dependencies
- Type check
- lint
- Unit tests / component tests
- Build verification

##### 1.2 CD: Continuous Delivery / Continuous Deployment

The core of CD is to get “artifacts that passed checks” to the target environment in a stable way.

There are usually two meanings:

- **Continuous Delivery**: artifacts are prepared automatically, but going live can still require a human confirmation
- **Continuous Deployment**: after checks pass, it goes live automatically

In interviews it is worth adding: many teams say CI/CD out loud, but the real process may only have “auto deploy”, with no complete “continuous integration quality gates”.

#### 2. The full CI/CD chain in a frontend project

You can split it into 6 steps.

##### 2.1 Trigger the workflow

Usually triggered by:

- `push`
- `pull_request`
- tag release
- manual trigger

The design focus here is not “whether you can write YAML”, but: **which actions should happen at the PR stage, and which should happen on the main branch.**

##### 2.2 Quality checks

This is the core of CI.

Common quality gates:

- `eslint`
- `typescript`
- unit tests
- build tests
- E2E or smoke tests

Without this layer, later “auto deploy” is closer to “automatically shipping bugs to production”.

##### 2.3 Build artifacts

Frontend build artifacts are usually:

- static files
- Docker images
- source maps

For a pure static site, what you deploy may just be a `dist`. With containerized delivery, the more stable delivery unit is usually the image.

##### 2.4 Push artifacts

Common targets:

- Docker Registry
- object storage
- static hosting platforms
- artifact repositories

The point of this step is to keep “what was built locally” and “what actually runs in production” as consistent as possible.

##### 2.5 Deploy

Common deploy methods:

- rsync static files straight to the server
- pull a new image in a container and restart
- Kubernetes rolling update
- platform-hosted auto publish

On frontend roles, containerized deploys are increasingly common, because they freeze the runtime environment together with the app.

##### 2.6 Verify and roll back

Senior interviews often follow up here.

If deploy fails or the new version has issues, you need to answer:

- how you discover it
- how you roll back
- how you reduce the impact of a rollback

A deploy chain without rollback, monitoring, and alerting is incomplete.

#### 3. The real deploy chain in this repo

This repo already has a real pipeline that can still be strengthened. The core files are:

- `.github/workflows/deploy.yml`
- `Dockerfile`
- `nginx.conf`

You can split this chain into the following steps.

##### 3.1 GitHub Actions trigger

The current workflow triggers on push to `main` and `master`:

```yaml
on:
  push:
    branches:
      - main
      - master
```

That means the current strategy leans toward “main-branch auto publish”, closer to continuous deployment.

##### 3.2 Build and push the image

The first stage `build-and-push` does this:

1. checkout the code
2. log in to GHCR
3. generate image tags
4. build and push the image

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
```

The key point here is not “which action you used”, but: **the delivery unit is not scattered static files, but a repeatably pullable image.**

##### 3.3 What the Dockerfile is doing

The current `Dockerfile` uses a two-stage build:

```dockerfile
FROM node:20-alpine AS builder
...
RUN pnpm run docs:build

FROM nginx:alpine
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html
```

Benefits of this design:

- build environment and runtime environment are separated
- the final image is smaller
- the runtime image does not need Node, pnpm, or other build dependencies

For frontend projects, this is a very typical and reasonable containerization approach.

##### 3.4 What Nginx is doing

`nginx.conf` mainly handles:

- static asset hosting
- gzip compression
- route fallback
- static asset caching

```nginx
location / {
    try_files $uri $uri.html $uri/ /index.html;
}
```

The meaning of this config: if the current path does not hit a static asset directly, fall back to `index.html`, so frontend routes or docs routes still work.

##### 3.5 Remote deploy

The second stage `deploy` SSHs into the server and:

1. logs in to the image registry
2. `docker pull` the latest image
3. stops the old container
4. removes the old container
5. runs the new container

```yaml
docker pull ghcr.io/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest
docker stop ${{ env.CONTAINER_NAME }} || true
docker rm ${{ env.CONTAINER_NAME }} || true
docker run -d \
  --name ${{ env.CONTAINER_NAME }} \
  --restart always \
  -p 8082:80 \
  ghcr.io/${{ github.repository_owner }}/${{ env.IMAGE_NAME }}:latest
```

This is a very common “small-team, deploy straight to a server” setup. The upsides are that it is simple, cheap, and the chain is easy to follow.

#### 4. Strengths of the current pipeline

##### 4.1 Artifact consistency is reasonably good

Local, CI, and production all deliver around the same image, instead of “build locally, then manually run it again on the server”.

##### 4.2 The runtime is pinned

After containerization, production runtime is more stable. You are less likely to hit “it works on my machine, the server is different”.

##### 4.3 The go-live chain is clear

From push, to image build, to the server pulling and deploying, the chain is explicit and the debugging boundaries are relatively clear.

#### 5. What this pipeline still lacks

This is the part of a senior interview that most often separates people. It is not only “how we do it now”, but “you know what is still missing”.

##### 5.1 No real CI quality gates

The current workflow is mainly build and deploy. It does not clearly run before deploy:

- lint
- unit tests
- pre-build verification

That means it is closer to an “auto-publish pipeline”, not a complete CI/CD.

A more reasonable structure would be:

1. `lint`
2. `test`
3. `build`
4. `build-and-push`
5. `deploy`

Only if the earlier steps all pass should later ones be allowed to continue.

##### 5.2 Rollback is fairly primitive

The current deploy uses the `latest` image. It also tags with `sha`, but the deploy script actually pulls `latest`. That causes two problems:

- rollback is not precise enough
- it is hard to pinpoint “which commit’s image is actually running in production”

A more solid approach:

- deploy with the commit SHA tag
- record the current version
- keep the last few stable versions
- roll back by switching straight to the previous image

##### 5.3 No post-deploy verification

After the deploy action finishes, there is no obvious health check or smoke test.

A more solid approach includes:

- hitting the home page after deploy and checking the status code
- verifying that key assets are reachable
- aborting and alerting on failure

##### 5.4 No source map and monitoring closed loop

Frontend production debugging depends on:

- error monitoring
- source map upload
- version mapping

Otherwise, after a user error you only see minified stacks, and locating the issue becomes very inefficient.

##### 5.5 No environment layering

Senior teams usually do not keep only a production concept. They also distinguish:

- development
- testing
- staging / pre-production
- production

That is how “verify first, then go live” becomes a stable process.

#### 6. Key design points for frontend CI/CD

##### 6.1 Do not leak secrets into the frontend bundle

CI/CD uses many env vars and secrets, but you must distinguish:

- **workflow secrets**: for GitHub Actions, Docker, SSH, and deploy scripts
- **frontend build variables**: they end up in the browser bundle and must not be treated as secrets

This is a place many frontend engineers mix up.

##### 6.2 Build artifacts must be traceable

Traceability at least includes:

- which commit the current production version corresponds to
- which image tag it corresponds to
- which source map it corresponds to

Otherwise production debugging is very reactive.

##### 6.3 Deploy scripts should be idempotent

Idempotent means repeating the same deploy action should not make the state messier and messier.

For example in the current script:

```bash
docker stop ${{ env.CONTAINER_NAME }} || true
docker rm ${{ env.CONTAINER_NAME }} || true
```

That is a typical idempotent idea. Even if the target container does not exist, the script will not fail immediately.

##### 6.4 Monitoring and alerting are not optional

A real delivery closed loop is not “the script finished”, but “users can use it, and if something goes wrong it can be discovered in time”.

#### 7. High-frequency interview questions

##### 7.1 What is the difference between CI and CD

CI focuses on quality checks and fast feedback after code is integrated. CD focuses on how artifacts that passed checks are delivered stably to the target environment. The former is more about quality gates; the latter is more about landing delivery.

##### 7.2 Why containerize frontend deploys

Because it pins build and runtime environments, improves delivery consistency, and makes versioning, deploy, and rollback easier via images.

##### 7.3 Why auto deploy is not the same as complete CI/CD

Because without lint, tests, build verification, health checks, and a rollback strategy, it is only “automating the publish action”, not a complete quality closed loop.

##### 7.4 Why frontend deploys should care about rollback

Even though frontend releases are static assets or containers and look simple, shipping a wrong version affects all users. Without versioned artifacts and a fast rollback path, go-live risk is high.

##### 7.5 Why source maps relate to CI/CD

Because source maps are not only a local debugging tool; they affect locating production errors. The ideal chain is: generate at build time, upload at publish time, and let the monitoring platform match them by version.

#### 8. Interview answer suggestions

If you are asked about CI/CD, do not answer by definition only. A more solid structure is:

1. First say what problems CI and CD each solve
2. Then walk a real frontend delivery chain
3. Then explain how your project currently does it
4. Finally add what this chain still lacks, and how you would change it

That upgrades the answer from “knows the terms” to “can own a real delivery process”.
