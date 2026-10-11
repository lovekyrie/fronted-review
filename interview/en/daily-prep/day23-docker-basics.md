# Day 23 Docker Basics

## Goals

- Finish Docker Build Overview / Dockerfile Reference / Build Variables
- Read the repo-root `Dockerfile` and `.dockerignore`, and write an annotated version
- Be able to explain the 5 concepts: image / container / layer / volume / network

## Read in order

1. [Deployment](../advanced/week2/deployment)
2. [CI/CD](../advanced/week2/ci-cd)

## Practice and self-check

**Checkpoints**

- Each instruction usually creates a layer; combining instructions can shrink image size
- The order `COPY package*.json` → `RUN install` → `COPY .` maximizes cache hits
- Multi-stage builds: the build stage installs deps and compiles; the runtime stage keeps only artifacts

**Produce or redraw from memory**

- Knowledge notes — [reference section](../advanced/week2/deployment#day-23-knowledge-notes)
- Practice example — [reference section](../advanced/week2/deployment#day-23-practice-example)

**Answer aloud without reading a reference answer**

- 1. Why do frontend images usually use a multi-stage build?
- 2. How do you maximize Docker build cache hits?

**Recording drill**

1. Docker basics (1 minute)
2. Multi-stage builds (2 minutes)
3. Cache hits + slimming the image (2 minutes)

## Recap

1. Most likely follow-up: why not just run a Node image for frontend? A static site does not need Node at runtime; Nginx is lighter and matches the job better.
2. Current gap: image-tag strategy must be bound to rollback. Knowing only `latest` is not enough.
3. Next to add: combine Nginx config to explain how the container handles SPA routing, cache headers, and static compression after it starts.
