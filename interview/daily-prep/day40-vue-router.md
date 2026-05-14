# Day 40 Vue Router 原理 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 40 | Vue Router | [Vue Router](../framework/vue/router) |

## 今日目标

- 看完 `/framework/vue/router`
- 输出 hash / history / memory 三种模式的对比表
- 画一张 `push` 到 `<router-view>` 更新的完整链路图

## 阅读卡点

- hash 模式无需后端配合，但 URL 带 `#`；history 模式需要服务端兜底 `index.html`
- `<router-view>` 靠依赖注入拿到当前匹配，切换时触发它自己的响应式更新
- 导航守卫的执行顺序：beforeEach → beforeRouteLeave → beforeResolve → afterEach

## 速记卡 / 知识点

### 三种路由模式

| 模式 | URL | 原理 | 后端配合 |
|------|-----|------|----------|
| hash | `/#/about` | `hashchange` 事件 | 不需要 |
| history | `/about` | `popstate` + `pushState` | 需要兜底 index.html |
| memory | 无变化 | 内存存储 | 不需要 |

### 导航守卫完整顺序

```text
1. beforeRouteLeave（离开组件）
2. beforeEach（全局前置）
3. beforeRouteUpdate（复用组件，如 /user/1 → /user/2）
4. beforeEnter（路由独享）
5. 解析异步组件
6. beforeRouteEnter（进入组件，无 this）
7. beforeResolve（全局解析）
8. afterEach（全局后置）
9. DOM 更新
10. beforeRouteEnter 的 next(vm => {}) 回调
```

### router-view 更新机制

`currentRoute` 是响应式 ref → 路由切换时变化 → `<router-view>` 通过 inject 拿到匹配组件 → re-render。

### 动态路由 + 懒加载

```js
{ path: '/user/:id', component: () => import('./User.vue') }
// 通过 useRoute().params.id 获取参数
```

## 手写 / 流程图

### 最小 hash router

```js
class MiniRouter {
  constructor(routes) {
    this.routes = routes
    this.current = window.location.hash.slice(1) || '/'
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
  push(path) { window.location.hash = path }
  match() { return this.routes.find(r => r.path === this.current) }
}
```

### push 到 router-view 更新链路

```text
router.push('/about')
  → history.pushState / location.hash = '#/about'
  → 匹配路由表 → 找到 matched 组件
  → 更新 currentRoute（shallowRef）
  → router-view 检测到响应式变化
  → 渲染新组件
```

## 口述题

### 1. hash 和 history 模式区别？

回答模板：

> hash 模式用 URL 中 `#` 后面的部分作为路由路径，通过 `hashchange` 事件监听变化。优点是不需要后端配合，因为 `#` 后面的内容不会发到服务器。缺点是 URL 不美观，且 `#` 之前的部分变化会触发页面刷新。
>
> history 模式用 HTML5 的 `pushState / replaceState` 修改 URL，通过 `popstate` 监听浏览器前进后退。URL 干净无 `#`，但需要后端把所有路由都兜底到 `index.html`，否则直接访问 `/about` 会返回 404。
>
> 选型：大多数项目用 history 模式（配合 Nginx `try_files`），静态托管或不便改后端时用 hash 模式。

### 2. 导航守卫执行顺序讲一下？

回答模板：

> 完整顺序是：先在离开的组件里触发 `beforeRouteLeave`，然后全局 `beforeEach`，接着如果是复用组件（如参数变化）触发 `beforeRouteUpdate`，然后路由独享 `beforeEnter`，再解析异步组件，进入组件的 `beforeRouteEnter`（此时拿不到 this），全局 `beforeResolve`，最后全局 `afterEach`。DOM 更新后，`beforeRouteEnter` 的 `next(vm => {})` 回调才执行。
>
> 关键点：`beforeEach` 里必须调 `next()` 或 return true，否则导航会挂起。`afterEach` 没有 next，适合做埋点统计。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 三种模式原理 + 选型建议（1.5 分钟）
2. 导航守卫完整顺序（10 步走一遍）（2 分钟）
3. 懒加载 + 路由级代码分割 + router-view 响应式更新（1.5 分钟）

录完后自查：

- 是否说出 hash 不需要后端配合、history 需要兜底。
- 是否说出守卫顺序至少 7 步。
- 是否说出 `beforeRouteEnter` 无法访问 this。
- 是否说出路由懒加载就是动态 import。

## 今日复盘

今天最需要回补的 3 个点：

1. `scrollBehavior` 路由切换后的滚动位置恢复。
2. `addRoute / removeRoute` 动态路由在权限系统中的应用。
3. `<router-view v-slot>` 配合 `<Transition>` 和 `<KeepAlive>` 的写法。
