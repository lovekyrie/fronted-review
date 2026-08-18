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
