# Day 26 Release and Rollback Strategy

## Goals

- Finish MDN HTTP Caching plus common canary / gradual-rollout schemes
- Produce a one-page *Release and Rollback Decision Table*: blue-green / rolling / gradual / canary
- Draw a "5-minute rollback on a production incident" flow

## Read in order

1. [Deployment](../advanced/week2/deployment)

## Practice and self-check

**Checkpoints**

- Hashed static assets are what lets two versions exist at once, which is a prerequisite for blue-green
- Gradual rollout buckets by user / region / account. Do not randomize, or UX will be inconsistent
- Rollback should roll back **artifacts**, not **source**, so you do not hit compile differences again

**Produce or redraw from memory**

- Release strategy matrix — [reference section](../advanced/week2/deployment#day-26-release-strategy-matrix)
- Supplementary notes — [reference section](../advanced/week2/deployment#day-26-supplementary-notes)

**Answer aloud without reading a reference answer**

- 1. How do you choose among blue-green vs gradual vs canary?
- 2. What pitfalls sit in the "last mile" of rollback?

**Recording drill**

1. Four release strategies (2 minutes)
2. Rollback flow (2 minutes)
3. A real case: a rollback you or the team hit (1 minute)

## Recap

1. Most likely follow-up: rollback is not `git revert`. It is switching back to the last verified, traceable, directly runnable artifact.
2. Current gap: prepare a real or simulated incident STAR case covering impact, decision, rollback, and review.
3. Next to add: connect post-rollback debugging with Day 27's blank-screen, cache, and asset-404 checklist.
