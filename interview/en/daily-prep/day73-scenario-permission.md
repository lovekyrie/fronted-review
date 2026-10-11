# Day 73 scenario: permission system — execution log

## Goals

- Finish `/en/scenarios/permission-system`
- Output the three-layer model: API / route / component (button)
- Prepare RBAC / ABAC interview answers

## Read in order

1. [Permission system](../scenarios/permission-system)

## Practice and self-check

**Checkpoints**

- Frontend permission is **UX fallback**, not a substitute for backend checks
- Route-level: guards + dynamic `addRoute`; filter menus too
- Button-level: directive / component / hook — pick what the team already knows

**Produce or redraw from memory**

- Three-layer model — [reference section](../scenarios/permission-system#day-73-three-layer-model)
- RBAC vs ABAC — [reference section](../scenarios/permission-system#day-73-rbac-vs-abac)
- Dynamic-route flow — [reference section](../scenarios/permission-system#day-73-dynamic-route-flow)
- Three button-level wrappers — [reference section](../scenarios/permission-system#day-73-three-button-level-wrappers)
- `v-auth` directive — [reference section](../scenarios/permission-system#day-73-v-auth-directive)
- Generate dynamic routes — [reference section](../scenarios/permission-system#day-73-generate-dynamic-routes)
- `useAuth` hook — [reference section](../scenarios/permission-system#day-73-useauth-hook)

**Answer aloud without reading a reference answer**

- 1. What can frontend permission actually cover?
- 2. Dynamic routes vs static routes?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Three-layer model (API / route / button) + frontend permission boundary (1.5 min)
2. Dynamic routes in practice (fetch permissions → filter → addRoute → re-navigate) (2 min)
3. Three button wrappers (directive / component / hook) + RBAC vs ABAC (1.5 min)

After recording, self-check:

- Did you say frontend permission is UX fallback and the backend is the real line.
- Did you say you must re-navigate after addRoute.
- Did you name the three button-level wrappers.
- Did you distinguish RBAC and ABAC.

## Recap

The 3 points that most need a follow-up today:

1. Route whitelist (pages that do not require login).
2. Role inheritance (admin automatically has editor permissions).
3. Live permission updates after a change (WebSocket / polling).
