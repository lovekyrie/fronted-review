# 14 天冲刺版面试路线图

这是一份“能执行、能复盘、能在面试里说出来”的冲刺计划。  
默认每天投入 **2~3 小时**，如果时间更紧可把“加分任务”移到周末。

## 使用规则（先看）

- 每天按 **输入 -> 输出 -> 演练 -> 自测** 四步走。
- 输出必须可见：至少留一份你自己的口述提纲或代码片段。
- 每晚 15 分钟复盘：今天最容易卡壳的 3 个点。
- 第 7、14 天做整套模拟面（技术 + 场景 + 项目 + HR）。
- 口述训练请配合：`/daily-oral-sets-14`。

## 每日节奏模板（建议）

1. **40 分钟**：看文档并做结构化笔记。
2. **40 分钟**：手写代码 / 画流程图 / 写答题模板。
3. **30 分钟**：口述演练（录音 5~8 分钟）。
4. **10 分钟**：复盘薄弱点，补到明天第一项。

---

## Day 1：JS 基础高频总复习

- **输入**：`/jscore/basic/data-type`、`/jscore/basic/this`、`/jscore/basic/prototype`、`/jscore/basic/es6`
- **输出**：
  - 一页《JS 基础速记卡》（数据类型、this 绑定、原型链、let/const）
  - 手写 `call` / `bind` 的关键步骤（可直接复用你现有 handwrite）
- **演练题**：
  - `this` 绑定优先级是什么？
  - 原型链查找与 `new` 过程怎么讲？
- **自测标准**：5 分钟内讲清 `this`、原型链、不借助文档。

## Day 2：异步模型与事件循环

- **输入**：`/jscore/basic/event-loop`、`/jscore/basic/async-program`、`/jscore/advanced/promise`、`/jscore/advanced/async-await`
- **输出**：
  - 手写 Promise 核心（状态、then 链式）
  - 一张宏任务/微任务执行顺序图
- **演练题**：
  - 为什么 `await` 后面的代码像“同步”？
  - `Promise.all` 和 `allSettled` 场景差异？
- **自测标准**：能准确判断 3 道事件循环输出题。

## Day 3：DOM/BOM/Web API + 事件机制

- **输入**：`/jscore/basic/dom-bom-webapi`、`/jscore/basic/event-mechanism`、`/jscore/basic/other-web-apis`
- **输出**：
  - 事件委托 demo（`closest` + 动态节点）
  - `IntersectionObserver` + `sendBeacon` 的面试回答模板
- **演练题**：
  - SPA 为什么不刷新页面也能改 URL？
  - 事件捕获/冒泡如何结合业务解释？
- **自测标准**：能说出 3 个观察器 API 的适用边界。

## Day 4：前端内存管理与性能基础

- **输入**：`/jscore/basic/memory-management`、`/network&broswer/performance-optimization`
- **输出**：
  - 一份“内存泄漏排查流程图”（发现 -> 定位 -> 修复 -> 验证）
  - 3 个真实泄漏场景与修复手段
- **演练题**：
  - 为什么 WeakMap 能减轻泄漏风险？
  - 如何用 DevTools 证明泄漏已修复？
- **自测标准**：能完整回答 1 个泄漏排查案例。

## Day 5：HTML/CSS 与移动端适配

- **输入**：`/html&css/layout`、`/html&css/box-model`、`/html&css/responsive-design`、`/advanced/css-advanced`、`/advanced/mobile-and-cross-platform`
- **输出**：
  - BFC 触发方式 + 应用场景总结
  - rem/vw/safe-area 选型对比表
- **演练题**：
  - 如何解决 1px 问题？
  - CSS Modules、CSS-in-JS、Tailwind 如何选？
- **自测标准**：10 分钟讲完 CSS 面试常问链路。

## Day 6：框架原理（Vue + React）

- **输入**：`/framework/vue/vue3`、`/framework/vue/reactivity`、`/framework/react/basics`、`/framework/react/hooks`、`/framework/react/virtual-dom`
- **输出**：
  - Vue 响应式与 React 渲染机制对比笔记
  - 手写一个常见 Hook（如 `useDebounce`）并解释依赖陷阱
- **演练题**：
  - 为什么 Hook 不能放在条件分支里？
  - Vue/React diff 思路差异？
- **自测标准**：框架问题能回答“原理 + 实战 + 坑点”。

## Day 7：第一轮模拟面（技术面）

- **输入**：回看 Day1~Day6 薄弱点
- **输出**：
  - 60 分钟模拟面记录（建议录音）
  - 10 个“卡壳问题清单”
- **演练范围**：JS、浏览器、框架、性能
- **自测标准**：把卡壳问题分为“不会/会但不熟/表达差”三类。

---

## Day 8：工程化深挖

- **输入**：`/engineering/build-tools`、`/engineering/webpack-vs-vite`、`/engineering/frontend-standardization`、`/engineering/CI-CD`
- **输出**：
  - Webpack 构建流程图（entry -> module -> chunk -> asset）
  - Loader vs Plugin 对比 + 简易实现思路
- **演练题**：
  - Vite 为什么快？
  - Tree-shaking 生效条件有哪些？
- **自测标准**：工程化题能答到“原理层”而非只说工具名。

## Day 9：测试体系与质量保障

- **输入**：`/engineering/automated-testing`
- **输出**：
  - 你项目里的测试分层方案（单测/集成/E2E）
  - 一段可执行测试用例（Vitest/Jest 任一）
- **演练题**：
  - 为什么覆盖率高不代表质量一定高？
  - E2E 用例该覆盖哪些关键链路？
- **自测标准**：能给出“质量策略 + 发布保障”闭环回答。

## Day 10：网络、缓存、安全

- **输入**：`/network&broswer/http-protocol`、`/network&broswer/cache-mechanism`、`/network&broswer/cross-origin`、`/network&broswer/web-safe`
- **输出**：
  - 从输入 URL 到页面展示流程图（简版）
  - 强缓存 vs 协商缓存答题模板
- **演练题**：
  - 预检请求（OPTIONS）什么时候触发？
  - XSS / CSRF 防护方案怎么讲？
- **自测标准**：网络安全题可讲到具体 header/策略级别。

## Day 11：性能指标化与监控体系

- **输入**：`/network&broswer/web-vitals`、`/network&broswer/error-monitoring`
- **输出**：
  - 一份前端监控 SDK 设计提纲（采集/上报/存储/可视化）
  - 一套错误捕获策略（onerror + unhandledrejection + 框架层）
- **演练题**：
  - LCP/CLS/INP 如何测、如何优化？
  - SourceMap 还原堆栈的核心链路？
- **自测标准**：能拿“指标前后对比”讲优化价值。

## Day 12：场景题与系统设计

- **输入**：`/scenarios/index`、`/scenarios/file-upload`、`/scenarios/massive-data-rendering`、`/scenarios/permission-system`、`/scenarios/system-design`
- **输出**：
  - 3 套标准化答题模板（大文件、权限体系、监控 SDK）
  - 每题 1 张架构图（手画也行）
- **演练题**：
  - 断点续传如何做？秒传如何防误判？
  - 组件库怎么设计版本与主题能力？
- **自测标准**：场景题回答不空泛，能说“主流程 + 异常 + 权衡”。

## Day 13：前沿方向补齐 + 项目复盘

- **输入**：`/advanced/ssr-ssg`、`/advanced/micro-frontend`、`/project-review`、`/hr-questions`
- **输出**：
  - 2 个 STAR 项目故事（技术难点、动作、量化结果）
  - 1 分钟自我介绍 + 3 分钟项目介绍版本
- **演练题**：
  - SSR 为什么能优化首屏和 SEO？
  - 微前端的收益与代价分别是什么？
- **自测标准**：项目表达从“做了什么”升级为“为什么这么做 + 数据结果”。

## Day 14：第二轮全真模拟面（技术 + HR）

- **输入**：全量复盘 + 薄弱点清单
- **输出**：
  - 90 分钟模拟面（建议请朋友/同学扮演面试官）
  - 最终《高频 50 题速记表》
- **参考资料**：`/high-frequency-50`
- **演练结构**：
  - 40 分钟技术基础
  - 25 分钟场景设计
  - 15 分钟项目深挖
  - 10 分钟 HR
- **自测标准**：回答节奏稳、结构清晰、能给量化结果。

---

## 每天必做清单（打卡版）

- [ ] 今天至少完成 1 段口述录音（5 分钟以上）
- [ ] 今天至少写 1 段代码/流程图
- [ ] 今天至少整理 5 个高频问答
- [ ] 今天复盘 3 个不会或答不顺的问题

## 面试前最后 24 小时

- 只看你自己的速记卡，不再大范围开新坑。
- 重点过一遍：`/high-frequency-50` 中你最容易卡壳的 20 题。
- 再快速过一遍：`/daily-oral-sets-14` 的 Day13、Day14。
- 重点复述：项目 STAR、场景题模板、性能指标优化案例。
- 睡眠优先，保证表达稳定性和临场反应。
