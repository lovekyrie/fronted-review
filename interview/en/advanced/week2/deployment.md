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
