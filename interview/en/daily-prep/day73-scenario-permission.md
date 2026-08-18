# Day 73 scenario: permission system — execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 73 | Permission system | [Permission system](../scenarios/permission-system) |

## Today's goals

- Finish `/en/scenarios/permission-system`
- Output the three-layer model: API / route / component (button)
- Prepare RBAC / ABAC interview answers

## Reading checkpoints

- Frontend permission is **UX fallback**, not a substitute for backend checks
- Route-level: guards + dynamic `addRoute`; filter menus too
- Button-level: directive / component / hook — pick what the team already knows

## Cheat sheet / knowledge

### Three-layer model

| Layer | Control point | Frontend | Backend fallback |
|----|--------|----------|----------|
| **API** | API requests | Request interceptor attaches token | Auth middleware (required) |
| **Route** | Page access | Route guards + dynamic routes | API returns 403 |
| **Button** | Action permission | Directive / component / hook | API returns 403 |

### RBAC vs ABAC

| Model | Idea | Fits |
|------|------|------|
| **RBAC** | User → role → permission | Most admin systems |
| **ABAC** | Dynamic check on attributes (user / resource / env) | Complex domains (healthcare / finance) |

### Dynamic-route flow

```text
1. User logs in → get token
2. Fetch user info → roles / permissions
3. Filter the route table by permissions → user routes
4. router.addRoute(dynamicRoutes) injects them
5. Filter menus the same way (menus and routes share one data source)
```

### Three button-level wrappers

| Approach | Pros | Cons |
|------|------|------|
| **Directive `v-auth`** | Declarative, terse | Cannot branch logic |
| **Component `AuthButton`** | Wrap any content via slot | Extra nesting |
| **Hook `useAuth`** | Flexible, any logic | You must branch yourself |

## Handwritten / flow

### `v-auth` directive

```ts
// directives/auth.ts
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const vAuth: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const required = Array.isArray(binding.value) ? binding.value : [binding.value]
    const hasAuth = required.some(p => userStore.permissions.includes(p))

    if (!hasAuth) {
      el.parentNode?.removeChild(el)
    }
  },
}

// usage
// <button v-auth="'user:delete'">Delete user</button>
// <button v-auth="['order:edit', 'order:admin']">Edit order</button>
```

### Generate dynamic routes

```ts
// router/dynamic.ts
import type { RouteRecordRaw } from 'vue-router'

const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/views/Admin.vue'),
    meta: { permissions: ['admin'] },
  },
  {
    path: '/order',
    component: () => import('@/views/Order.vue'),
    meta: { permissions: ['order:view'] },
  },
]

export function generateRoutes(userPermissions: string[]): RouteRecordRaw[] {
  return asyncRoutes.filter(route => {
    const required = route.meta?.permissions as string[] | undefined
    return !required || required.some(p => userPermissions.includes(p))
  })
}

// call from a route guard
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (!userStore.routes.length) {
    const dynamicRoutes = generateRoutes(userStore.permissions)
    dynamicRoutes.forEach(route => router.addRoute(route))
    userStore.routes = dynamicRoutes
    return to.fullPath  // re-navigate
  }
})
```

### `useAuth` hook

```ts
export function useAuth() {
  const userStore = useUserStore()
  const hasPermission = (perm: string | string[]) => {
    const perms = Array.isArray(perm) ? perm : [perm]
    return perms.some(p => userStore.permissions.includes(p))
  }
  return { hasPermission }
}

// usage
const { hasPermission } = useAuth()
if (hasPermission('order:delete')) { /* run delete */ }
```

## Spoken questions

### 1. What can frontend permission actually cover?

Answer template:

> Frontend permission is **UX fallback**, not a security boundary. It hides pages the user should not see, hides/disables buttons they should not click, and filters menus by role. Users can still fire requests from the console, so **backend auth is the real line** — every API must check token + permission.
>
> The value is UX: do not show actions they cannot perform, fewer “you have no permission” 403s. Land it in three layers: API (interceptor + token), route (guards + dynamic routes), button (directive / component / hook).

### 2. Dynamic routes vs static routes?

Answer template:

> Depends on complexity. Simple admin (few roles, fixed pages): **static routes + permission meta + guard filtering** — simple to maintain. Complex admin (many roles, configurable menus): **dynamic routes** — backend returns permissions, frontend builds routes and `addRoute`s them.
>
> Watch-outs: after `addRoute` you must re-navigate (`return to.fullPath`) or you 404. On refresh, the guard must fetch permissions again and inject routes. Menus and routes should share one data source so they do not drift.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Three-layer model (API / route / button) + frontend permission boundary (1.5 min)
2. Dynamic routes in practice (fetch permissions → filter → addRoute → re-navigate) (2 min)
3. Three button wrappers (directive / component / hook) + RBAC vs ABAC (1.5 min)

After recording, self-check:

- Did you say frontend permission is UX fallback and the backend is the real line.
- Did you say you must re-navigate after addRoute.
- Did you name the three button-level wrappers.
- Did you distinguish RBAC and ABAC.

## Today's recap

The 3 points that most need a follow-up today:

1. Route whitelist (pages that do not require login).
2. Role inheritance (admin automatically has editor permissions).
3. Live permission updates after a change (WebSocket / polling).
