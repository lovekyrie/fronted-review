# Day 19 代码分割 / Tree Shaking / 缓存

## 今日目标

- 看完 webpack Code Splitting / Caching、Rollup tree shaking
- 输出 Tree Shaking 生效条件清单（ESM / sideEffects / 纯函数）
- 输出生产缓存策略答题稿：文件名 hash、HTTP 缓存头、CDN 层缓存

## 按顺序阅读

1. [构建工具](../advanced/week1/build-tools)
2. [按小时清单](../advanced/week1/hourly)

## 实操与自测

**检查点**

- `sideEffects: false` 是一把双刃剑，错配置会导致 CSS 样式被 tree-shaken
- 动态 `import()` 默认拆 chunk，但要注意 magic comment 影响 chunk 名
- 长效缓存要解决“业务代码变更不影响 vendor hash”的问题

**先独立完成，再对照专题**

- Tree Shaking 生效条件 — [参考章节](../advanced/week1/build-tools#day-19-tree-shaking-生效条件)
- 常见 Tree Shaking 失效场景 — [参考章节](../advanced/week1/build-tools#day-19-常见-tree-shaking-失效场景)
- 代码分割三级策略 — [参考章节](../advanced/week1/build-tools#day-19-代码分割三级策略)
- 缓存三层联动 — [参考章节](../advanced/week1/build-tools#day-19-缓存三层联动)
- 动态 import 三种写法 — [参考章节](../advanced/week1/build-tools#day-19-动态-import-三种写法)
- Tree Shaking 验证 — [参考章节](../advanced/week1/build-tools#day-19-tree-shaking-验证)

**脱稿口述题**

- 1. Tree Shaking 生效的前置条件是什么？
- 2. 生产环境的缓存与版本策略应该怎么设计？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Tree Shaking 四个前提 + 失效场景（2 分钟）
2. 代码分割三级策略（路由/组件/vendor）（1.5 分钟）
3. 缓存三层联动（浏览器/CDN/源站）+ contenthash 版本化（1.5 分钟）

录完后自查：

- 是否说出 tree shaking 依赖 ESM 静态结构。
- 是否说出 `sideEffects` 配置 CSS 的坑。
- 是否说出 contenthash + vendor 分包 + runtime 分离。
- 是否说出 CDN 不需要主动刷新的原因。

## 复盘

今天最需要回补的 3 个点：

1. `/*#__PURE__*/` 注释的实际用法和工具链支持。
2. Rollup 和 webpack 在 tree shaking 细节上的差异。
3. 多页面应用的代码分割策略（共享 chunk 的提取时机）。
