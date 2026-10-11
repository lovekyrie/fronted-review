# Day 28 Deploy Topic Follow-up Review

## Goals

- Collect Day 22–27 into a *Deployment Delivery 15-Question Answer Book*
- Do a 30-minute self follow-up: ask 3 layers of "why" on each question
- Record an 8-minute audio: walk the full chain from push → go-live → rollback in one go

## Read in order

1. [Week 2 roadmap](../advanced/week2/roadmap)
2. [CI/CD](../advanced/week2/ci-cd)
3. [Deployment](../advanced/week2/deployment)

## Practice and self-check

**Checkpoints**

- In interviews, "deploy questions" get pulled to the **ops boundary**. Decide in advance where frontend work ends and where SRE takes over
- You will often be asked: "What production incident have you shipped? How did you handle it?" Prepare 1 real STAR case

**Produce or redraw from memory**

- Deployment Delivery 15-Question Answer Book

**Answer aloud without reading a reference answer**

- 1. How does your team run from push to go-live?
- 2. 3 self-picked follow-ups

**Mock format and scoring**

### Deployment Delivery 15-Question Answer Book

1. **CI vs CD**: CI is the quality gate. CD delivers artifacts that passed checks to the target environment in a stable way.
2. **Why auto-deploy is not the same as CI/CD**: Without lint, tests, build verification, post-deploy verification, and rollback, it is only automatically running a release action.
3. **What frontend delivery units exist**: a static-asset directory, a Docker image, a platform-hosted artifact. Images are better for env consistency and versioned rollback.
4. **GitHub Actions core concepts**: `on` controls triggers, `jobs` organize work, `steps` run in order, `secrets/artifacts/environment` support release governance.
5. **How to speed up CI**: cache deps, parallel jobs, fewer useless triggers, layered tests, locate build time — without skipping critical gates.
6. **Why frontend uses multi-stage Docker builds**: Node does the build, Nginx serves, so the final image is smaller and cleaner.
7. **How to design Docker cache**: copy package and lockfile and install deps first, then copy source, plus `.dockerignore` to control context.
8. **Nginx's job in frontend deploys**: static serving, SPA fallback, cache headers, gzip, reverse proxy, and simple security headers.
9. **How to fix an SPA refresh 404**: Nginx `try_files` falls back to `index.html`, but APIs and real static assets must not fall back by mistake.
10. **How to cache HTML vs static assets**: short-cache or `no-cache` for HTML; long-cache hashed static assets and keep old versions.
11. **Build-time vs runtime injection**: build-time vars are baked into artifacts; runtime config lets the same artifact deploy to multiple environments.
12. **Why frontend vars cannot hold secrets**: once they enter the browser bundle or a config file, users can see them. Secrets stay on the server or in CI secrets.
13. **How to choose a release strategy**: overwrite for low risk, blue-green for high stability, rolling for multiple instances, gradual/canary for high traffic.
14. **Why rollback rolls back artifacts**: artifacts are verified, traceable, and directly runnable. A temporary rebuild introduces new uncertainty.
15. **How to debug a production blank screen**: classify by JS errors, asset loading, API/network, cache, and env config; stop the bleeding first, then find the cause.

```text
Developer commits code
  -> PR: lint / typecheck / test / build
  -> merge main: trigger the release workflow
  -> Build: install deps, emit dist, emit source maps
  -> Image: Docker multi-stage build, tag with commit SHA
  -> Push: registry / artifact
  -> Deploy: server pulls the image, stops the old container, starts the new one
  -> Nginx: static assets, SPA fallback, gzip, cache headers
  -> Browser: fetch index.html, load hashed JS/CSS
  -> Verify: homepage, key routes, core APIs, error rate
  -> Monitor: release, source maps, Web Vitals, business metrics
  -> Incident: pause gradual rollout / switch back to the last image / purge CDN / review
```

**Recording drill**

1. CI stage (1.5 minutes)
2. Build artifacts + image (1.5 minutes)
3. Deploy + Nginx (1.5 minutes)
4. Gradual rollout + rollback (2 minutes)
5. A troubleshooting case (1.5 minutes)

## Recap

The 3 questions most likely to break you:

1. You can only say "GitHub Actions auto-deploys", but not the boundary between CI quality gates and CD delivery verification.
2. You can only say "Docker + Nginx", but not how multi-stage builds, image tags, cache headers, and rollback relate.
3. You can only say "roll back when something breaks", but not rollback triggers, version tracking, keeping old assets, and verification actions.

3 new "why" questions this week:

1. Why does `latest` weaken precise rollback?
2. Why must `index.html` not be long-term strongly cached like hashed JS?
3. Why should source maps enter the release chain, instead of staying only on your machine?
