# Day 74 微前端 + 移动端跨端

## 今日目标

- 看完 `/advanced/micro-frontend`、`/advanced/mobile-and-cross-platform`
- 输出微前端方案对比表：qiankun / Module Federation / Web Components / iframe
- 输出跨端三条线：Hybrid (WebView) / RN / Flutter / 小程序

## 按顺序阅读

1. [微前端](../advanced/micro-frontend)
2. [移动端跨端](../advanced/mobile-and-cross-platform)

## 实操与自测

**检查点**

- 微前端要解决：子应用隔离、通信、样式隔离、资源共享、登录态
- MF 是构建期共享依赖，qiankun 是运行期沙箱；各有生态和心智成本
- 跨端要看**业务形态**：重交互 → 原生；重展示 → H5 / 小程序

**先独立完成，再对照专题**

- 微前端四种方案对比 — [参考章节](../advanced/micro-frontend#day-74-微前端四种方案对比)
- 微前端核心问题 — [参考章节](../advanced/micro-frontend#day-74-微前端核心问题)
- 跨端三条线 — [参考章节](../advanced/mobile-and-cross-platform#day-74-跨端三条线)
- 微前端架构图 — [参考章节](../advanced/micro-frontend#day-74-微前端架构图)
- 子应用生命周期 — [参考章节](../advanced/micro-frontend#day-74-子应用生命周期)

**脱稿口述题**

- 1. 你为什么选 qiankun / MF？
- 2. H5 和小程序怎么共用逻辑？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 微前端核心问题（JS 沙箱 / CSS 隔离 / 通信 / 路由）（1.5 分钟）
2. 四种方案对比 + 选型建议（2 分钟）
3. 跨端三条线 + H5/小程序共用策略（1.5 分钟）

录完后自查：

- 是否说出 qiankun 和 MF 的核心区别（运行时 vs 构建时）。
- 是否说出 JS 沙箱和 CSS 隔离的实现。
- 是否说出跨端框架的局限性。
- 是否说出根据业务形态选方案。

## 复盘

今天最需要回补的 3 个点：

1. qiankun 的 Proxy 沙箱具体原理（快照沙箱 vs Proxy 沙箱的区别）。
2. Module Federation 在 Vite 中的使用（vite-plugin-federation）。
3. Taro 3 和 uni-app 的架构差异。
