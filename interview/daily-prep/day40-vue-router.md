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

<!-- 三种模式原理 / 守卫执行顺序 / 动态路由匹配 / 懒加载 -->

## 手写 / 流程图

```js
// 最小 hash router：listen popstate / hashchange → 查路由表 → 更新 activeRoute
```

## 口述题

### 1. hash 和 history 模式区别？

> 回答模板：

### 2. 导航守卫执行顺序讲一下？

> 回答模板：

## 5 分钟录音顺序

1. 三种模式（1.5 分钟）
2. 守卫顺序（2 分钟）
3. 懒加载 + 路由级代码分割（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
