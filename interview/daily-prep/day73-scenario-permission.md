# Day 73 场景题：权限体系 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 73 | 权限体系 | [权限系统](../scenarios/permission-system) |

## 今日目标

- 看完 `/scenarios/permission-system`
- 输出权限三层模型：接口级 / 路由级 / 组件级（按钮级）
- 准备 RBAC / ABAC 的面试答题

## 阅读卡点

- 前端权限只是**体验兜底**，不能取代后端校验
- 路由级用路由守卫 + 动态注入 `addRoute`；菜单数据也要过滤
- 按钮级常用指令 / 组件 / Hook 三种封装，选团队最熟的

## 速记卡 / 知识点

### 权限三层模型

| 层 | 控制点 | 前端实现 | 后端保底 |
|----|--------|----------|----------|
| **接口级** | API 请求 | 请求拦截器带 token | 鉴权中间件（必须有） |
| **路由级** | 页面访问 | 路由守卫 + 动态路由 | 接口返回 403 |
| **按钮级** | 操作权限 | 指令 / 组件 / hook | 接口返回 403 |

### RBAC vs ABAC

| 模型 | 原理 | 适用 |
|------|------|------|
| **RBAC** | 用户 → 角色 → 权限 | 大多数后台系统 |
| **ABAC** | 基于属性（用户/资源/环境）动态判断 | 复杂场景（医疗/金融） |

### 动态路由流程

```text
1. 用户登录 → 获取 token
2. 请求用户信息 → 返回 roles / permissions
3. 根据 permissions 过滤路由表 → 生成用户路由
4. router.addRoute(dynamicRoutes) 注入路由
5. 菜单也同步过滤（菜单和路由用同一份数据源）
```

### 三种按钮级封装

| 方式 | 优点 | 缺点 |
|------|------|------|
| **指令 v-auth** | 声明式，简洁 | 无法控制逻辑分支 |
| **组件 AuthButton** | 可以 slot 包裹任意内容 | 多一层嵌套 |
| **Hook useAuth** | 灵活，可用于任何逻辑 | 需要手动判断 |

## 手写 / 流程图

### v-auth 指令

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

### 动态路由生成

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

### useAuth Hook

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

## 口述题

### 1. 前端权限能做到什么边界？

回答模板：

> 前端权限只是**体验层兜底**，不是安全防线。作用是：不该看的页面不显示、不该点的按钮隐藏/禁用、菜单按角色过滤。但用户可以通过控制台直接发请求，所以**后端鉴权才是根本**——每个 API 必须校验 token + 权限。
>
> 前端做权限的价值是用户体验：不让用户看到他没有权限操作的东西，减少"你没有权限"的 403 挫败感。落地分三层：接口级（拦截器带 token）、路由级（守卫 + 动态路由）、按钮级（指令 / 组件 / hook）。

### 2. 动态路由和静态路由怎么选？

回答模板：

> 看系统复杂度。简单后台（角色少、页面固定）用**静态路由 + meta 标权限 + 路由守卫过滤**就够了——简单好维护。复杂后台（角色多、菜单可配置）用**动态路由**——后端返回权限列表，前端生成路由并 `addRoute` 注入。
>
> 动态路由的注意点：`addRoute` 后要重新导航（`return to.fullPath`），否则会 404。刷新时要在路由守卫里重新拉权限并注入路由。菜单和路由最好用同一份数据源，避免两边不一致。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 权限三层模型（接口 / 路由 / 按钮）+ 前端权限的边界（1.5 分钟）
2. 动态路由落地（获取权限 → 过滤路由 → addRoute → 重新导航）（2 分钟）
3. 按钮级三种封装（指令 / 组件 / hook）+ RBAC vs ABAC（1.5 分钟）

录完后自查：

- 是否说出前端权限只是体验兜底，后端才是根本。
- 是否说出 addRoute 后要重新导航。
- 是否说出三种按钮级封装方式。
- 是否说出 RBAC 和 ABAC 的区别。

## 今日复盘

今天最需要回补的 3 个点：

1. 路由白名单（不需要登录就能访问的页面）的处理。
2. 角色继承（admin 自动拥有 editor 的权限）的实现。
3. 权限变更后的实时更新（WebSocket 通知 / 定时轮询）。
