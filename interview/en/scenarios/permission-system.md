# Permission system: routes, buttons, SSO, and QR login

## 1. Permission model

Split permission into three layers:

- **Identity**: logged in or not, token still valid.
- **Role**: admin, operator, guest, etc.
- **Resource**: page, button, and API-level permission.

> Stress in interviews: frontend permission is UX. The real security boundary is backend auth.

## 2. Route guards

### Flow

1. A before-each guard checks login state.
2. No login → login page with a redirect-back URL.
3. Logged in but no page permission → 403.
4. On first entry, fetch permissions and build the accessible routes.

```ts
router.beforeEach(async (to) => {
  if (!hasToken() && to.meta.requiresAuth) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
  if (!permissionStore.ready) await permissionStore.bootstrap()
  if (to.meta.permission && !permissionStore.has(to.meta.permission)) return '/403'
})
```

## 3. Button-level permission

- Wrap the check in a directive / component so pages do not copy-paste it.
- Two styles: **hide** (not visible) vs **disable** (visible but not clickable).
- Critical actions still go through backend API permission. Frontend only reduces mistakes.

## 4. SSO

### Goal

Log in once; several systems share the session.

### Typical design

- A central IdP (CAS / OAuth2 / OIDC).
- The app redirects to the IdP; after success it comes back with a code / token.
- The frontend mostly handles redirect and token storage.

## 5. QR login

1. The PC asks for a QR code and gets a `sceneId`.
2. The phone scans and confirms; the server binds `sceneId` to the user.
3. The PC polls or listens on WebSocket for status.
4. On confirm, credentials are issued and the PC finishes login.

### Security

- Short TTL (e.g. 60s).
- One-shot: invalidate after use.
- Show device info on confirm so people do not approve by accident.

## Daily practice reference

### Day 73: Three-layer model

| Layer | Control point | Frontend | Backend fallback |
|----|--------|----------|----------|
| **API** | API requests | Request interceptor attaches token | Auth middleware (required) |
| **Route** | Page access | Route guards + dynamic routes | API returns 403 |
| **Button** | Action permission | Directive / component / hook | API returns 403 |

### Day 73: RBAC vs ABAC

| Model | Idea | Fits |
|------|------|------|
| **RBAC** | User → role → permission | Most admin systems |
| **ABAC** | Dynamic check on attributes (user / resource / env) | Complex domains (healthcare / finance) |

### Day 73: Dynamic-route flow

```text
1. User logs in → get token
2. Fetch user info → roles / permissions
3. Filter the route table by permissions → user routes
4. router.addRoute(dynamicRoutes) injects them
5. Filter menus the same way (menus and routes share one data source)
```

### Day 73: Three button-level wrappers

| Approach | Pros | Cons |
|------|------|------|
| **Directive `v-auth`** | Declarative, terse | Cannot branch logic |
| **Component `AuthButton`** | Wrap any content via slot | Extra nesting |
| **Hook `useAuth`** | Flexible, any logic | You must branch yourself |

### Day 73: `v-auth` directive

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

### Day 73: Generate dynamic routes

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

### Day 73: `useAuth` hook

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
