# Day 80 最终查漏补缺 + 80 天总结 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 80 | 最终复盘 | [高级前端索引](../advanced/senior-frontend-index)、[Week 8 路线图](../advanced/week8/roadmap)、[Week 8 题库](../advanced/week8/question-bank) |

## 今日目标

- 汇总 Day 1–79 的所有《N 题答题本》，形成一份《高级前端 100 题终极答题本》
- 产出《80 天总结报告》：已稳 / 需再巩固 / 完全不碰 三类
- 锁定未来 2 周的高频出场题（最常用 30 题）

## 阅读卡点

- 结束阶段不再学新知识，只做**表达流畅度**和**查漏补缺**
- 每个主题都要能回答：1 分钟版、3 分钟版、5 分钟版
- 最终清单按**被问概率 × 掌握度缺口**排序

## 速记卡 / 知识点

### 100 题答题本目录（按主题）

```text
JS 基础（15 题）：闭包 / 原型 / this / 事件循环 / Promise / 异步 / 类型转换 / ...
Vue（15 题）：响应式 / diff / 组件通信 / keep-alive / SSR / Pinia / Router / ...
React（12 题）：Fiber / hooks / 并发 / state 批处理 / memo / RSC / ...
TypeScript（10 题）：泛型 / 条件类型 / 映射类型 / 模板字面量 / 工具类型 / ...
工程化（12 题）：Vite / Webpack / Babel / ESLint / CI/CD / monorepo / ...
性能（10 题）：Web Vitals / 首屏优化 / 缓存策略 / 懒加载 / ...
安全（5 题）：XSS / CSRF / CSP / CORS / ...
测试（8 题）：分层策略 / Vitest / VTU / Playwright / Mock / ...
场景（8 题）：大文件上传 / 虚拟列表 / 权限 / 微前端 / 监控 / ...
软技能（5 题）：STAR / 自我介绍 / 离职原因 / 架构设计 / ...
```

### 3 档答题模板

| 档 | 时长 | 结构 |
|----|------|------|
| **1 分钟版** | 概念 + 核心结论 | "XX 是 YY，核心是 ZZ" |
| **3 分钟版** | 1 分钟版 + 原理 + 代码/示例 | 加一层 why + how |
| **5 分钟版** | 3 分钟版 + 对比 + 实战 + 踩坑 | 加工程落地和追问预案 |

### 高频 30 题（按被问概率排序）

```text
1.  闭包是什么？应用场景？
2.  事件循环 / 宏微任务输出题
3.  Promise 链式调用 + async/await 输出题
4.  Vue 3 响应式原理（Proxy + track/trigger）
5.  Vue 3 diff 算法（最长递增子序列）
6.  Vue 组件通信方式
7.  React hooks 为什么不能条件调用
8.  useEffect 陷阱（闭包过时 / cleanup）
9.  useMemo vs useCallback vs React.memo
10. React 并发模式（时间切片 / Suspense）
11. TypeScript 泛型约束
12. TS 条件类型 + infer
13. Vite 为什么快 / 和 Webpack 区别
14. Tree Shaking 原理
15. HTTP 缓存（强缓存 / 协商缓存）
16. 跨域解决方案
17. 首屏性能优化（LCP）
18. Web Vitals 三个核心指标
19. XSS 和 CSRF 防御
20. 前端测试分层策略
21. 大文件上传方案
22. 虚拟列表实现
23. 前端权限设计
24. 微前端方案对比
25. 前端错误监控
26. CSS BFC / 居中方案
27. 手写 Promise.all
28. 手写 debounce / throttle
29. 手写深拷贝
30. 项目 STAR（你做了什么 + 量化）
```

## 手写 / 流程图

### 备战地图：各主题状态灯

```text
🟢 已稳（能自信回答 + 追问 2 层）：
  JS 基础 / 闭包 / 原型 / 事件循环 / Promise
  Vue 响应式 / diff / 组件通信 / Pinia / Router
  Vite 原理 / Tree Shaking / Code Split
  HTTP 缓存 / 跨域
  手写题 P0（Promise.all / debounce / 深拷贝 / EventEmitter）

🟡 需再巩固（答得出但追问会卡）：
  React 并发 / RSC / Fiber 细节
  TS 高级类型（模板字面量 / 复杂映射）
  微前端沙箱细节 / MF 配置
  性能指标和优化的量化对应
  E2E 测试 Playwright 高级用法

🔴 主动放弃（不在面试里展开）：
  WebAssembly 细节
  Flutter / Dart 语言细节
  后端数据库优化
  算法竞赛题（中等以上 DP/图论）
```

### 最后一周冲刺计划

```text
Day -7：高频 30 题过一遍 1 分钟版
Day -6：高频 30 题过一遍 3 分钟版
Day -5：黄灯题目重点突击
Day -4：手写题限时练习（每题 5 分钟）
Day -3：模拟面 1（纯技术）
Day -2：模拟面 2（综合面）
Day -1：休息 + 过 1 分钟版 + 检查简历
```

## 口述题

### 最终自检 10 题（路线图验收题）

**1. 为什么 Vite 开发阶段通常比 webpack 更快 / 生产为什么不快？**

> Vite 开发用原生 ESM，浏览器按需请求模块，不需要打包。启动只启动 dev server，不预构建业务代码。HMR 只更新变化的模块。生产用 Rollup 打包——因为 HTTP/2 + ESM 在大量小文件时性能不如合并后的 bundle，且需要 Tree Shaking 和代码压缩。

**2. 生产环境的缓存与版本策略应该怎么设计？**

> HTML 不缓存（`no-cache`），每次请求拿最新。JS/CSS/图片用内容 hash 做文件名（`app.a1b2c3.js`），配合 `Cache-Control: max-age=31536000` 强缓存一年。发版只改 hash，旧文件自动失效。CDN 层加 `s-maxage`。

**3. Vue 3 响应式为什么选 Proxy？**

> Object.defineProperty 无法拦截新增属性和数组索引赋值。Proxy 在对象级别拦截，天然支持新增/删除属性、数组变化、Map/Set。代码更简洁，性能更好（不需要递归定义）。代价是不支持 IE。

**4. Vue 3 diff 为什么用最长递增子序列？**

> 目标是最小化 DOM 移动操作。找到新序列中相对位置不变的最大子集（LIS），这些节点不需要移动。只移动不在 LIS 中的节点。时间复杂度 O(n log n)。

**5. React 的 effect 为什么会带来常见陷阱？**

> effect 的回调在渲染后异步执行，闭包捕获的是当次渲染的 state 快照。如果依赖数组漏了变量，回调里拿到的是旧值（闭包过时）。解法：依赖数组完整、用 ref 保存最新值、用函数式更新。

**6. React 并发不是多线程，那它"并发"在哪？**

> 并发体现在"可中断渲染"。React 把 render 阶段拆成小单元（Fiber），每个单元完成后检查是否有更高优先级任务。如果有，暂停当前渲染先处理紧急任务。宏观看像"同时"处理多个更新，但微观是单线程时间切片。

**7. TypeScript 高级类型怎样服务于真实组件设计？**

> 泛型让组件 props 类型可推导（如 `Select<T>`），条件类型做 API 返回值的类型收窄，映射类型做表单字段和验证规则的类型同步。目标是让使用者获得完整的类型推导和自动补全，减少运行时错误。

**8. 前端性能指标如何与具体优化动作对应？**

> LCP 对应首屏最大内容渲染 → 优化关键资源（preload 大图、Code Split、SSR）。INP 对应交互延迟 → 减少主线程阻塞（Web Worker、拆分长任务）。CLS 对应布局偏移 → 给图片设宽高、预留广告位。

**9. 为什么高覆盖率不等于高质量？**

> 覆盖率只衡量"代码是否被执行"，不衡量"断言是否有意义"。100% 行覆盖率可能全是 happy path——没测错误分支、边界条件。有效测试 = 正确的测试矩阵（正常 + 异常 + 边界）+ 有意义的断言。

**10. 一个真实项目从开发到上线的完整链路是什么？**

> 本地开发（Vite dev + HMR）→ 提交 PR → CI 自动运行（lint + type check + 单测 + E2E）→ Code Review → 合并 → 构建（Vite build）→ 部署到预发 → 预发验证（E2E 冒烟）→ 灰度发布 → 全量发布 → 线上监控（web-vitals + 错误上报 + 告警）。

## 10 分钟录音顺序（最终汇演）

1. Vue 专题：响应式 + diff + 组件通信 + keep-alive（2 分钟）
2. React 专题：hooks 规则 + 并发 + useEffect 陷阱（1.5 分钟）
3. 工程化 + 部署：Vite 原理 + Tree Shaking + CI/CD + 缓存策略（2 分钟）
4. 性能 + 安全 + 监控：Web Vitals + 首屏优化 + XSS/CSRF + 错误上报（2 分钟）
5. 测试 + TypeScript：分层策略 + Vitest + 泛型 + 条件类型（1.5 分钟）
6. 项目故事：核心项目 1 分钟 STAR + "最难的是什么"（1 分钟）

## 80 天总结

已稳（绿灯）：

- JS 基础全系列（闭包 / 原型 / 事件循环 / Promise / this）
- Vue 3 全链路（响应式 / diff / 组件 / Router / Pinia / SSR）
- 工程化核心（Vite / Tree Shaking / Code Split / CI/CD）
- HTTP 缓存 + 跨域 + 安全（XSS / CSRF / CSP）
- 手写题 P0 系列
- 项目 STAR 表达

需再巩固（黄灯）：

- React 并发细节（Fiber 调度、Lane 模型）
- TS 复杂类型体操（4 层以上嵌套的条件类型）
- 微前端沙箱实现细节
- Playwright 高级用法（network mock / visual regression）
- 性能优化的量化故事（需要准备更真实的数据）

主动放弃（红灯，不打算在面试里展开）：

- WebAssembly / Rust in WASM
- Flutter / Dart
- 后端数据库优化 / K8s 运维
- 高难度算法（DP / 图论）

近 2 周的高频出场题（30 题清单）：

- 见上方"高频 30 题"列表，按顺序每天过 10 题的 1 分钟版 → 3 分钟版 → 5 分钟版
