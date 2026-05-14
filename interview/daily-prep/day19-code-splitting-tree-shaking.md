# Day 19 代码分割 / Tree Shaking / 缓存 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 19 | 代码分割 / Tree Shaking | [构建工具](../advanced/week1/build-tools)、[按小时清单](../advanced/week1/hourly) |

## 今日目标

- 看完 webpack Code Splitting / Caching、Rollup tree shaking
- 输出 Tree Shaking 生效条件清单（ESM / sideEffects / 纯函数）
- 输出生产缓存策略答题稿：文件名 hash、HTTP 缓存头、CDN 层缓存

## 阅读卡点

- `sideEffects: false` 是一把双刃剑，错配置会导致 CSS 样式被 tree-shaken
- 动态 `import()` 默认拆 chunk，但要注意 magic comment 影响 chunk 名
- 长效缓存要解决“业务代码变更不影响 vendor hash”的问题

## 速记卡 / 知识点

### Tree Shaking 生效条件

1. **ESM 格式**：必须用 `import / export`，CJS 无法静态分析。
2. **`sideEffects` 配置**：`package.json` 中标记 `"sideEffects": false` 或指定文件列表。
3. **纯函数 / 无副作用**：打包工具通过 `/*#__PURE__*/` 注释判断。
4. **production mode**：开发模式通常不开启 tree shaking。

### 常见 Tree Shaking 失效场景

- 使用 CJS 格式的库（如 lodash 而非 lodash-es）。
- `sideEffects` 配置错误，CSS 文件被当作无副作用移除。
- 代码中有副作用（IIFE、全局变量赋值、`Object.defineProperty`）。
- `export default` 导出整个对象，打包工具无法判断哪些属性被使用。

### 代码分割三级策略

| 级别 | 策略 | 场景 |
|------|------|------|
| 路由级 | `React.lazy()` / Vue `defineAsyncComponent` | 按页面分割 |
| 组件级 | 动态 `import()` | 大组件/弹窗/编辑器 |
| Vendor 级 | `SplitChunksPlugin` / `manualChunks` | 第三方库分离 |

### 缓存三层联动

```text
浏览器缓存（Cache-Control + contenthash 文件名）
  ↕
CDN 缓存（边缘节点缓存静态资源，按 URL 精确匹配）
  ↕
网关/源站缓存（Nginx proxy_cache 或 S3）
```

## 手写 / 流程图

### 动态 import 三种写法

```js
// 1. 基础用法
const module = await import('./heavy.js')

// 2. webpack magic comment 指定 chunk 名
const Chart = () => import(/* webpackChunkName: "chart" */ './Chart.vue')

// 3. Vite 的 glob import
const modules = import.meta.glob('./modules/*.ts')
// 生成：{ './modules/a.ts': () => import('./modules/a.ts'), ... }
```

### Tree Shaking 验证

```js
// utils.js — ESM 导出
export function used() { return 'I survive' }
export function unused() { return 'I am dead code' }

// main.js
import { used } from './utils.js'
console.log(used())
// 生产构建后，unused 会被移除
```

## 口述题

### 1. Tree Shaking 生效的前置条件是什么？

回答模板：

> Tree Shaking 需要四个前提。第一，代码必须用 ESM 格式（`import / export`），因为 ESM 是静态结构，打包工具可以在编译时分析导入导出关系。CJS 是动态执行的，无法在编译时确定。
>
> 第二，`package.json` 要正确配置 `sideEffects`。标记 `false` 表示所有文件都没有副作用，打包工具可以放心移除未使用的导出。但注意 CSS 文件有副作用，要在 `sideEffects` 数组里声明。
>
> 第三，代码本身要是纯函数、无副作用。如果模块顶层有 IIFE 或全局赋值，打包工具不敢移除。第四，必须在 production mode 下构建。

### 2. 生产环境的缓存与版本策略应该怎么设计？

回答模板：

> 缓存策略分三层。浏览器层：HTML 设 `no-cache`（每次协商），JS/CSS 用强缓存 `max-age=31536000` + 文件名带 `contenthash`，内容变 hash 变 URL 变，自动绕过旧缓存。
>
> CDN 层：静态资源上 CDN，边缘节点按 URL 精确匹配缓存。部署新版本时不需要主动刷 CDN，因为新文件有新 hash，URL 不同。
>
> 构建层：SplitChunks 分离 vendor（变化少，长期缓存）和业务代码（变化快）。Runtime chunk 单独提取，避免业务代码变动导致 vendor hash 连带变化。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Tree Shaking 四个前提 + 失效场景（2 分钟）
2. 代码分割三级策略（路由/组件/vendor）（1.5 分钟）
3. 缓存三层联动（浏览器/CDN/源站）+ contenthash 版本化（1.5 分钟）

录完后自查：

- 是否说出 tree shaking 依赖 ESM 静态结构。
- 是否说出 `sideEffects` 配置 CSS 的坑。
- 是否说出 contenthash + vendor 分包 + runtime 分离。
- 是否说出 CDN 不需要主动刷新的原因。

## 今日复盘

今天最需要回补的 3 个点：

1. `/*#__PURE__*/` 注释的实际用法和工具链支持。
2. Rollup 和 webpack 在 tree shaking 细节上的差异。
3. 多页面应用的代码分割策略（共享 chunk 的提取时机）。
