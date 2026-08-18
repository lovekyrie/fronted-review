# Day 26 Release and Rollback Strategy Execution Log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 26 | Release / rollback | [Deployment](../advanced/week2/deployment) |

## Today's goals

- Finish MDN HTTP Caching plus common canary / gradual-rollout schemes
- Produce a one-page *Release and Rollback Decision Table*: blue-green / rolling / gradual / canary
- Draw a "5-minute rollback on a production incident" flow

## Reading pitfalls

- Hashed static assets are what lets two versions exist at once, which is a prerequisite for blue-green
- Gradual rollout buckets by user / region / account. Do not randomize, or UX will be inconsistent
- Rollback should roll back **artifacts**, not **source**, so you do not hit compile differences again

## Cheat sheet / key points

### Release strategy matrix

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

## Handwritten / flow diagrams

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

## Oral questions

### 1. How do you choose among blue-green vs gradual vs canary?

> Answer template: I would start from business risk, traffic scale, and infra capability. Overwrite is simplest and fits low-risk projects, but an incident hits everyone. Blue-green keeps old and new environments and switches traffic for fast release and rollback; it fits systems that need high stability, at higher cost. Rolling fits multi-instance services, replacing in batches, but you must handle old/new compatibility. Gradual or canary fits high-traffic products: a small set of users or some tenants first, then expand. Frontend also needs special attention to static-asset versions, HTML cache, source maps, and metrics, or switching traffic is easy and locating problems is hard.

### 2. What pitfalls sit in the "last mile" of rollback?

> Answer template: Rollback most often gets stuck on details. First, there is no traceable artifact: you only know to revert source, not which image or which static-asset batch to switch back to. Second, old assets were deleted, so the hashed JS that old HTML references already 404s. Third, HTML, CDN, browser cache, or a service worker still caches the wrong version, so users stay broken after rollback. Fourth, config and artifacts mismatch: you rolled back JS, but runtime `config.js` is still the new env. Last, there is no post-deploy verification or monitoring, so you only see the script succeed and do not know whether users recovered.

## 5-minute recording outline

1. Four release strategies (2 minutes)
2. Rollback flow (2 minutes)
3. A real case: a rollback you or the team hit (1 minute)

## Today's review

1. Most likely follow-up: rollback is not `git revert`. It is switching back to the last verified, traceable, directly runnable artifact.
2. Current gap: prepare a real or simulated incident STAR case covering impact, decision, rollback, and review.
3. Next to add: connect post-rollback debugging with Day 27's blank-screen, cache, and asset-404 checklist.
