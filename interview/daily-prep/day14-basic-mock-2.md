# Day 14 基础第二次模拟面 + 切换点 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 14 | 基础模拟面 2 | [14 天冲刺](../sprint-14-days)、[高频 50 题](../high-frequency-50)、[每日口述 14 套](../daily-oral-sets-14) |

## 今日目标

- 全量复盘 Day 1–13 薄弱点
- 做 90 分钟综合模拟：45 min JS/浏览器/网络 + 20 min HTML/CSS + 15 min 手写 + 10 min 框架认知
- 输出《基础阶段薄弱点清单》和《进入高级阶段前我还差什么》

## 阅读卡点

- 第二次模拟的重点不是“更多题”，是“把 Day 7 的卡壳清单都过关”
- 判断是否进入高级阶段的标准：**基础题不再大面积卡顿**，而不是“全部背熟”
- 参考题库：`/high-frequency-50`

## 速记卡 / 知识点

### 基础阶段薄弱点清单模板

| 分类 | 核心考点 | 自评 | 薄弱细节 |
|------|----------|------|----------|
| JS 核心 | this / 原型链 / 闭包 / 事件循环 / Promise | | |
| 浏览器 | 渲染流水线 / GC / 存储 / 合成层 | | |
| 网络 | HTTP 版本 / 缓存 / CORS / TCP/TLS | | |
| HTML&CSS | BFC / Flex / 适配 / 动画性能 | | |
| 手写 | call/bind/new / 防抖节流 / Promise / EventEmitter | | |
| 框架认知 | Vue/React 更新机制 / 组件化 / 状态管理 | | |

自评标准：✅ 流畅 / ⚠️ 偶尔卡顿 / ❌ 需要重学

### 综合模拟题清单（90 分钟）

**JS/浏览器/网络（45 分钟）**：
1. 事件循环输出题（给代码判顺序）
2. 闭包 + for 循环经典题
3. this 指向综合题
4. 强缓存 vs 协商缓存
5. CORS 预检触发条件
6. V8 GC 新生代/老生代

**HTML/CSS（20 分钟）**：
7. 三栏布局实现
8. BFC 触发条件和应用
9. 1px 问题解法
10. 移动端适配方案

**手写（15 分钟）**：
11. 手写 `bind`（含 new 兼容）
12. 手写防抖（含 cancel）

**框架认知（10 分钟）**：
13. Vue 响应式原理一句话
14. React 更新流程一句话
15. 组件化的核心价值

## 手写 / 流程图

### 模拟面手写参考

```js
// 综合题：实现一个带取消的请求函数
function createCancelableRequest(url) {
  const controller = new AbortController()
  const promise = fetch(url, { signal: controller.signal })
    .then(res => res.json())

  return {
    promise,
    cancel: () => controller.abort()
  }
}

// 综合题：数组转树
function arrayToTree(items, parentId = null) {
  return items
    .filter(item => item.parentId === parentId)
    .map(item => ({ ...item, children: arrayToTree(items, item.id) }))
}
```

## 口述题

### 1. 模拟题 A：事件循环 + 微任务输出

> 回答回顾参考：先找同步代码，按顺序执行。遇 `Promise` 构造器内的代码是同步的，`then` 回调入微任务队列。遇 `setTimeout` 入宏任务队列。同步执行完后，清空微任务队列，再取宏任务。按此顺序逐步列出输出。

### 2. 模拟题 B：从输入 URL 到页面展示

> 回答回顾参考：DNS 解析 → TCP 三次握手 → TLS 握手 → HTTP 请求 → 服务器响应 → 浏览器解析 HTML/CSS → 构建 DOM + CSSOM → Render Tree → Layout → Paint → Composite。每一步可以展开讲优化点（如 DNS 预解析、HTTP/2、强缓存、异步加载 JS、合成层等）。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 三大核心机制（事件循环 / 原型链 / 渲染流水线）快速走一遍（3 分钟）
2. 用一个实际项目串起"HTTP 请求 + 缓存命中 + 页面渲染 + 性能优化"完整链路（2 分钟）

录完后自查：

- 是否能在 30 秒内清晰描述事件循环。
- 是否能说出原型链查找的终止条件（null）。
- 是否能完整说出从 URL 到页面展示的步骤。
- 是否能在项目场景中自然地串联知识点。

## 今日复盘

《进入高级阶段前我还差什么》：

1. 工程化知识欠缺点：模块系统（ESM/CJS 差异）、构建工具原理（Vite/Webpack 核心流程）。
2. 框架原理欠缺点：Vue 响应式源码（Proxy + effect）、React fiber 调度。
3. 表达结构化欠缺点：答题时容易发散，需要练习"定义 → 原理 → 场景 → 边界"四段式。

基础阶段结业自评（流畅 / 卡顿 / 答错 比例）：

- 目标：流畅 ≥ 60%，卡顿 ≤ 30%，答错 ≤ 10%
- 实际：___% / ___% / ___%
