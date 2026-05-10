# 基础打稳 14 天计划

这不是高级冲刺计划，而是正式进入高级前端准备前的**基础打稳阶段**。

目标只有一个：把后续所有高级主题依赖的底座压稳，避免你一开始就学工程化、框架原理、性能治理，却在基础题上频繁卡住。

默认每天投入 **2~3 小时**。  
如果你时间更紧，可以把“加分任务”挪到周末，但不要压缩口述和复盘。

## 这 14 天到底在补什么

这一阶段只补四块：

1. **JavaScript 核心**
2. **浏览器与网络基础**
3. **HTML / CSS 高频基础**
4. **算法与手写保温**

这 14 天结束后，你应该进入这样的状态：

- 基础问题能稳定讲 `3-5 分钟`
- 不再只会报关键词
- 后续进入高级主题时，不会因为底座不稳而断掉

## 使用规则（先看）

- 每天按 **输入 -> 输出 -> 演练 -> 自测** 四步走。
- 输出必须可见：至少留一份你自己的口述提纲、流程图或代码片段。
- 每晚 15 分钟复盘：今天最容易卡壳的 3 个点。
- 第 7、14 天做阶段模拟，但重点仍然是基础和表达稳定性。
- 口述训练请配合：`/daily-oral-sets-14`。

## 每日节奏模板（建议）

1. **50~60 分钟**：看文档并做结构化笔记。
2. **40~50 分钟**：手写代码 / 画流程图 / 写答题模板。
3. **30 分钟**：口述演练（录音 5~8 分钟）。
4. **10~15 分钟**：复盘薄弱点，补到明天第一项。

---

## Day 1：JS 数据类型、this、原型链

- **输入**：`/jscore/basic/data-type`、`/jscore/basic/this`、`/jscore/basic/prototype`
- **输出**：
  - 一页《JS 基础速记卡》（数据类型、this 绑定、原型链）
  - 手写 `call` / `bind` 的关键步骤（可直接复用你现有 handwrite）
- **演练题**：
  - `this` 绑定优先级是什么？
  - 原型链查找与 `new` 过程怎么讲？
- **自测标准**：5 分钟内讲清 `this`、原型链，不借助文档。

## Day 2：闭包、作用域、变量提升、ES6

- **输入**：`/jscore/basic/scope-closure`、`/jscore/basic/es6`
- **输出**：
  - 一页《闭包与作用域》提纲
  - 3 个闭包应用场景 + 2 个闭包风险场景
- **演练题**：
  - 闭包是什么？为什么能访问外层变量？
  - `let` / `const` / `var` 差别如何讲得像工程问题而不是背概念？
- **自测标准**：能把闭包讲到“定义 -> 应用 -> 泄漏风险”。

## Day 3：异步模型与事件循环

- **输入**：`/jscore/basic/event-loop`、`/jscore/basic/async-program`、`/jscore/advanced/promise`、`/jscore/advanced/async-await`
- **输出**：
  - 手写 Promise 核心（状态、then 链式）
  - 一张宏任务 / 微任务执行顺序图
- **演练题**：
  - 为什么 `await` 后面的代码像“同步”？
  - `Promise.all` 和 `allSettled` 场景差异？
- **自测标准**：能准确判断 3 道事件循环输出题。

## Day 4：DOM / BOM / Web API + 事件机制

- **输入**：`/jscore/basic/dom-bom-webapi`、`/jscore/basic/event-mechanism`、`/jscore/basic/other-web-apis`
- **输出**：
  - 事件委托 demo（`closest` + 动态节点）
  - `IntersectionObserver` + `sendBeacon` 的面试回答模板
- **演练题**：
  - SPA 为什么不刷新页面也能改 URL？
  - 事件捕获 / 冒泡如何结合业务解释？
- **自测标准**：能说出 3 个观察器 API 的适用边界。

## Day 5：内存管理与浏览器渲染基础

- **输入**：`/jscore/basic/memory-management`、`/network&broswer/broswer-render`
- **输出**：
  - 一份“内存泄漏排查流程图”（发现 -> 定位 -> 修复 -> 验证）
  - 渲染流程图（DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite）
- **演练题**：
  - 为什么 WeakMap 能减轻泄漏风险？
  - 为什么 `transform` 动画通常比 `top/left` 更稳？
- **自测标准**：能完整回答 1 个泄漏排查案例 + 1 个渲染性能题。

## Day 6：HTTP、缓存、跨域、存储

- **输入**：`/network&broswer/http-protocol`、`/network&broswer/cache-mechanism`、`/network&broswer/cross-origin`、`/network&broswer/broswer-storage`
- **输出**：
  - 一张“从输入 URL 到页面展示”的简版流程图
  - 一页《缓存答题模板》（强缓存 / 协商缓存 / 资源版本化）
- **演练题**：
  - 强缓存和协商缓存怎么搭配？
  - 预检请求什么时候触发？
- **自测标准**：网络题可以回答到 header / browser behavior 层面。

## Day 7：第一轮基础模拟

- **输入**：回看 Day1~Day6 薄弱点
- **输出**：
  - 60 分钟模拟面记录
  - 10 个“基础卡壳问题清单”
- **演练范围**：JS、浏览器、网络
- **自测标准**：能把卡壳问题分为“不会 / 会但不熟 / 表达差”三类。

---

## Day 8：HTML / CSS 高频布局

- **输入**：`/html&css/layout`、`/html&css/box-model`、`/html&css/responsive-design`、`/advanced/css-advanced`、`/advanced/mobile-and-cross-platform`
- **输出**：
  - BFC 触发方式 + 应用场景总结
  - rem / vw / safe-area 选型对比表
- **演练题**：
  - 如何解决 1px 问题？
  - CSS Modules、CSS-in-JS、Tailwind 如何选？
- **自测标准**：10 分钟讲完布局、盒模型、适配三条主线。

## Day 9：语义化、兼容性、动画与渲染表现

- **输入**：`/html&css/semantic-tag`、`/html&css/browser-compatibility`、`/html&css/animation`
- **输出**：
  - 一页《HTML/CSS 高频坑点》提纲
  - 动画属性与渲染成本对照表
- **演练题**：
  - 为什么要做语义化？
  - 为什么有些动画会掉帧？
- **自测标准**：CSS 问题不再只会答“Flex 和 Grid”。

## Day 10：算法保温 1

- **输入**：`/algorithm&data-structure/array-operation`、`/algorithm&data-structure/string-operation`、`/algorithm&data-structure/two-pointers`
- **输出**：
  - 数组 / 字符串高频题模板
  - 双指针适用场景总结
- **演练题**：
  - 什么场景优先想到双指针？
  - 数组去重、扁平化、滑窗类题怎么分类？
- **自测标准**：不追求刷题量，追求讲思路不乱。

## Day 11：手写保温 1

- **输入**：`/handwrite/call`、`/handwrite/bind`、`/handwrite/new`、`/handwrite/instanceof`
- **输出**：
  - 4 道手写题的“步骤模板”
  - 一页《手写题答题顺序》
- **演练题**：
  - `call` / `bind` / `new` 的本质分别是什么？
  - `instanceof` 的底层判断逻辑是什么？
- **自测标准**：手写题能先讲思路，再落代码。

## Day 12：手写保温 2 + Promise / 防抖节流

- **输入**：`/handwrite/debounce`、`/handwrite/throttle`、`/handwrite/promisify`、`/handwrite/event-emitter`
- **输出**：
  - 防抖 / 节流对比表
  - EventEmitter / promisify 的口述模板
- **演练题**：
  - 防抖和节流怎么结合场景选？
  - Promise 风格 API 转 async 风格怎么讲？
- **自测标准**：手写题和业务场景能连起来讲。

## Day 13：框架基础预热

- **输入**：`/framework/vue/vue3`、`/framework/react/basics`
- **输出**：
  - Vue / React 基础认知对比表
  - 组件化、状态、渲染的共性提纲
- **演练题**：
  - 为什么现代前端一定离不开组件化？
  - Vue 和 React 的共同问题域是什么？
- **自测标准**：为后续高级阶段做过渡，不要求这一天讲源码级细节。

## Day 14：第二轮基础模拟 + 进入高级前的切换点

- **输入**：全量复盘 + 薄弱点清单
- **输出**：
  - 90 分钟基础模拟面
  - 最终《基础阶段薄弱点清单》
  - 一份《进入高级阶段前我还差什么》
- **参考资料**：`/high-frequency-50`
- **演练结构**：
  - 45 分钟 JS / 浏览器 / 网络
  - 20 分钟 HTML / CSS
  - 15 分钟手写
  - 10 分钟框架基础认知
- **自测标准**：
  - 基础题不再大面积卡顿
  - 你已经能切换到高级阶段，而不是继续回补散乱基础

---

## 每天必做清单（打卡版）

- [ ] 今天至少完成 1 段口述录音（5 分钟以上）
- [ ] 今天至少写 1 段代码 / 流程图
- [ ] 今天至少整理 5 个高频问答
- [ ] 今天复盘 3 个不会或答不顺的问题

## 这 14 天结束后下一步做什么

完成这 14 天后，不建议继续在基础层横向扩张，而应该切到高级主线：

1. `advanced/week1` 构建链路
2. `advanced/week2` 部署与交付
3. `advanced/week3-4` 框架原理
4. `advanced/week5` TypeScript
5. `advanced/week6-8` 性能、安全、治理、架构与项目表达
