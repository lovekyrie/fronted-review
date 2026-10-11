# Day 40 Vue Router 原理

## 今日目标

- 看完 `/framework/vue/router`
- 输出 hash / history / memory 三种模式的对比表
- 画一张 `push` 到 `<router-view>` 更新的完整链路图

## 按顺序阅读

1. [Vue Router](../framework/vue/router)

## 实操与自测

**检查点**

- hash 模式无需后端配合，但 URL 带 `#`；history 模式需要服务端兜底 `index.html`
- `<router-view>` 靠依赖注入拿到当前匹配，切换时触发它自己的响应式更新
- 导航守卫的执行顺序：beforeEach → beforeRouteLeave → beforeResolve → afterEach

**先独立完成，再对照专题**

- 三种路由模式 — [参考章节](../framework/vue/router#day-40-三种路由模式)
- 导航守卫完整顺序 — [参考章节](../framework/vue/router#day-40-导航守卫完整顺序)
- router-view 更新机制 — [参考章节](../framework/vue/router#day-40-router-view-更新机制)
- 动态路由 + 懒加载 — [参考章节](../framework/vue/router#day-40-动态路由-懒加载)
- 最小 hash router — [参考章节](../framework/vue/router#day-40-最小-hash-router)
- push 到 router-view 更新链路 — [参考章节](../framework/vue/router#day-40-push-到-router-view-更新链路)

**脱稿口述题**

- 1. hash 和 history 模式区别？
- 2. 导航守卫执行顺序讲一下？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 三种模式原理 + 选型建议（1.5 分钟）
2. 导航守卫完整顺序（10 步走一遍）（2 分钟）
3. 懒加载 + 路由级代码分割 + router-view 响应式更新（1.5 分钟）

录完后自查：

- 是否说出 hash 不需要后端配合、history 需要兜底。
- 是否说出守卫顺序至少 7 步。
- 是否说出 `beforeRouteEnter` 无法访问 this。
- 是否说出路由懒加载就是动态 import。

## 复盘

今天最需要回补的 3 个点：

1. `scrollBehavior` 路由切换后的滚动位置恢复。
2. `addRoute / removeRoute` 动态路由在权限系统中的应用。
3. `<router-view v-slot>` 配合 `<Transition>` 和 `<KeepAlive>` 的写法。
