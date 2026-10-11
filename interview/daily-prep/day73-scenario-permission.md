# Day 73 场景题：权限体系

## 今日目标

- 看完 `/scenarios/permission-system`
- 输出权限三层模型：接口级 / 路由级 / 组件级（按钮级）
- 准备 RBAC / ABAC 的面试答题

## 按顺序阅读

1. [权限系统](../scenarios/permission-system)

## 实操与自测

**检查点**

- 前端权限只是**体验兜底**，不能取代后端校验
- 路由级用路由守卫 + 动态注入 `addRoute`；菜单数据也要过滤
- 按钮级常用指令 / 组件 / Hook 三种封装，选团队最熟的

**先独立完成，再对照专题**

- 权限三层模型 — [参考章节](../scenarios/permission-system#day-73-权限三层模型)
- RBAC vs ABAC — [参考章节](../scenarios/permission-system#day-73-rbac-vs-abac)
- 动态路由流程 — [参考章节](../scenarios/permission-system#day-73-动态路由流程)
- 三种按钮级封装 — [参考章节](../scenarios/permission-system#day-73-三种按钮级封装)
- v-auth 指令 — [参考章节](../scenarios/permission-system#day-73-v-auth-指令)
- 动态路由生成 — [参考章节](../scenarios/permission-system#day-73-动态路由生成)
- useAuth Hook — [参考章节](../scenarios/permission-system#day-73-useauth-hook)

**脱稿口述题**

- 1. 前端权限能做到什么边界？
- 2. 动态路由和静态路由怎么选？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 权限三层模型（接口 / 路由 / 按钮）+ 前端权限的边界（1.5 分钟）
2. 动态路由落地（获取权限 → 过滤路由 → addRoute → 重新导航）（2 分钟）
3. 按钮级三种封装（指令 / 组件 / hook）+ RBAC vs ABAC（1.5 分钟）

录完后自查：

- 是否说出前端权限只是体验兜底，后端才是根本。
- 是否说出 addRoute 后要重新导航。
- 是否说出三种按钮级封装方式。
- 是否说出 RBAC 和 ABAC 的区别。

## 复盘

今天最需要回补的 3 个点：

1. 路由白名单（不需要登录就能访问的页面）的处理。
2. 角色继承（admin 自动拥有 editor 的权限）的实现。
3. 权限变更后的实时更新（WebSocket 通知 / 定时轮询）。
