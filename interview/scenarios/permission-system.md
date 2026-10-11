# 权限管理体系：路由、按钮、SSO 与扫码登录

## 一、权限模型

推荐把权限拆成三层：

- **用户身份**：是否登录、token 是否有效。
- **角色权限**：管理员、运营、访客等角色。
- **资源权限**：页面、按钮、接口操作级别权限。

> 面试中要强调：前端权限用于体验控制，真正安全边界在后端鉴权。

## 二、前端路由鉴权

### 基本流程

1. 路由前置守卫判断是否有登录态。
2. 无登录态 -> 跳登录页并带上回跳地址。
3. 有登录态但无页面权限 -> 跳 403。
4. 首次进入可动态拉取权限并生成可访问路由。

```ts
router.beforeEach(async (to) => {
  if (!hasToken() && to.meta.requiresAuth) {
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`
  }
  if (!permissionStore.ready) await permissionStore.bootstrap()
  if (to.meta.permission && !permissionStore.has(to.meta.permission)) return '/403'
})
```

## 三、按钮级权限控制

- 通过指令/组件封装权限判断，避免每个页面写重复逻辑。
- 按钮控制分两种：**隐藏**（看不到）和 **禁用**（看得到不可点）。
- 对关键操作必须以后端接口权限为准（前端只能减少误操作）。

## 四、单点登录（SSO）原理

### 核心目标

一次登录，多系统共享登录态。

### 常见实现

- 统一认证中心（CAS / OAuth2 / OIDC）。
- 子系统跳认证中心，认证成功后带 code/token 回跳。
- 前端通常只处理重定向与 token 存储更新。

## 五、扫码登录原理

1. PC 端请求生成二维码，拿到 `sceneId`。
2. 移动端扫码后确认登录，服务端绑定 `sceneId` 与用户身份。
3. PC 端通过轮询或 WebSocket 监听状态变化。
4. 确认成功后下发登录凭证，PC 完成登录。

### 安全要点

- 二维码短时效（如 60 秒）。
- 一次性使用，使用后立即失效。
- 登录确认要有设备信息提示，防止误授权。

## 每日练习参考

### Day 73：权限三层模型

| 层 | 控制点 | 前端实现 | 后端保底 |
|----|--------|----------|----------|
| **接口级** | API 请求 | 请求拦截器带 token | 鉴权中间件（必须有） |
| **路由级** | 页面访问 | 路由守卫 + 动态路由 | 接口返回 403 |
| **按钮级** | 操作权限 | 指令 / 组件 / hook | 接口返回 403 |

### Day 73：RBAC vs ABAC

| 模型 | 原理 | 适用 |
|------|------|------|
| **RBAC** | 用户 → 角色 → 权限 | 大多数后台系统 |
| **ABAC** | 基于属性（用户/资源/环境）动态判断 | 复杂场景（医疗/金融） |

### Day 73：动态路由流程

```text
1. 用户登录 → 获取 token
2. 请求用户信息 → 返回 roles / permissions
3. 根据 permissions 过滤路由表 → 生成用户路由
4. router.addRoute(dynamicRoutes) 注入路由
5. 菜单也同步过滤（菜单和路由用同一份数据源）
```

### Day 73：三种按钮级封装

| 方式 | 优点 | 缺点 |
|------|------|------|
| **指令 v-auth** | 声明式，简洁 | 无法控制逻辑分支 |
| **组件 AuthButton** | 可以 slot 包裹任意内容 | 多一层嵌套 |
| **Hook useAuth** | 灵活，可用于任何逻辑 | 需要手动判断 |

### Day 73：v-auth 指令

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

// 使用
// <button v-auth="'user:delete'">删除用户</button>
// <button v-auth="['order:edit', 'order:admin']">编辑订单</button>
```

### Day 73：动态路由生成

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

// 在路由守卫中调用
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (!userStore.routes.length) {
    const dynamicRoutes = generateRoutes(userStore.permissions)
    dynamicRoutes.forEach(route => router.addRoute(route))
    userStore.routes = dynamicRoutes
    return to.fullPath  // 重新导航
  }
})
```

### Day 73：useAuth Hook

```ts
export function useAuth() {
  const userStore = useUserStore()
  const hasPermission = (perm: string | string[]) => {
    const perms = Array.isArray(perm) ? perm : [perm]
    return perms.some(p => userStore.permissions.includes(p))
  }
  return { hasPermission }
}

// 使用
const { hasPermission } = useAuth()
if (hasPermission('order:delete')) { /* 执行删除 */ }
```
