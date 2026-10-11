# 构建工具总览

高级前端面试里的「构建工具」不是背配置项，而是讲清一条链路：

```text
源码 → 模块解析 → 代码转换 → 开发服务 / 生产打包 → 拆包缓存 → 部署产物 → 线上排障
```

如果只能说「Vite 快、webpack 配置多」，深度不够。面试官想看的是：各自解决什么问题，机制如何影响开发体验和线上表现。

---

## 专题文档

| 文档 | 内容 |
|------|------|
| [Webpack](./webpack.md) | 依赖图、loader/plugin、拆包缓存、**webpack Source Map 排障** |
| [Vite](./vite.md) | ESM dev、预构建、Rollup build、**Vite Source Map 排障** |
| [webpack vs Vite 深入对比](../../engineering/webpack-vs-vite.md) | 对照表、HMR、Rolldown、面试模板 |

---

## 1. 为什么需要构建工具

浏览器只能直接执行一部分前端代码，真实项目通常包含：

- ESNext / TypeScript / JSX / Vue SFC
- CSS 预处理器
- 图片、字体等静态资源
- 大型依赖图

构建工具职责：把这些输入转换成浏览器和运行环境能稳定消费的产物。

四层能力：

1. **解析模块关系** — 入口、依赖图、静态 import 分析
2. **代码转换** — Babel、TS、PostCSS 等
3. **组织产物** — dev 强调反馈速度，prod 强调体积和缓存
4. **优化** — 拆包、tree-shaking、压缩、hash、source map

---

## 2. 模块系统与 tree-shaking

- **ESM**：`import` / `export`，静态结构，利于 tree-shaking
- **CommonJS**：`require()` 可运行时动态调用，静态分析困难

tree-shaking 失效常见原因：CJS 依赖、副作用过多、`sideEffects` 配置不当。

---

## 3. Babel 与 bundler 的边界

| 角色 | 职责 |
|------|------|
| Babel | 代码 → 代码（AST 变换） |
| webpack / Vite | 模块图 → 可开发/可部署产物 |
| polyfill | 补运行时 API |

---

## 4. 开发态 vs 生产态（核心差异）

| | webpack dev | Vite dev |
|--|-------------|----------|
| 思路 | 先 bundling 再 serve | 浏览器 ESM 按需请求 |
| 启动 | 大项目往往慢 | 通常秒级 |
| HMR | chunk 级 | 模块级 |

**生产态**：两者都要打包、压缩、hash、source map — 详见各专题文档。

---

## 5. 生产构建共通要点

### 代码分割

```js
const Page = () => import('./Page.vue')
```

### 长缓存

- 文件名 `contenthash`
- vendor 与 runtime 分离
- 业务小改动不导致全量 hash 失效

### Source Map（线上排障）

**完整流程（webpack / Vite 通用）**：

```text
1. 构建：hidden source map（生成 .map，不在 JS 里暴露 URL）
2. 部署：Nginx 只 serve js/css/html，.map 不公开
3. CI：把 .map 上传到 Sentry，绑定 release 版本
4. 运行时：SDK 上报 stack（产物文件:行:列 + release）
5. 平台：用 .map 反解到 src/xxx.vue:行:列
6. 开发：checkout 对应 tag，本地打开源文件修复
```

配置对照：

| 工具 | 生产推荐 |
|------|----------|
| webpack | `devtool: 'hidden-source-map'` |
| Vite | `build.sourcemap: 'hidden'` |

细节、Nginx 示例、手动还原命令见 [webpack.md §6](./webpack.md#6-线上-source-map-排障webpack) 与 [vite.md §6](./vite.md#6-线上-source-map-排障vite)。

---

## 6. 高频面试题（速查）

1. **Vite dev 为什么快？** — ESM 按需 + esbuild 预构建，非启动全量 bundle  
2. **tree-shaking 为何依赖 ESM？** — 需静态分析 import/export  
3. **Babel vs bundler？** — 转码 vs 组织模块产物  
4. **动态 import 为何拆包？** — 提供异步边界，依赖图可切 chunk  
5. **为何抽 runtime chunk？** — 避免小改动导致缓存大面积失效  
6. **生产 source map 策略？** — hidden + 上传监控，不公开 .map  

---

## 7. 回答模板

1. 先说构建工具解决什么问题（四层能力）  
2. 分 dev / build 讲机制差异（webpack bundling vs Vite ESM）  
3. 再说生产优化：拆包、缓存、tree-shaking  
4. 结合项目讲一次线上排障：hidden map + Sentry + release 对齐  

这样比「列配置项」更像高级前端。

## 每日练习参考

### Day 16：Babel 三阶段

```text
1. Parse（解析）：源代码 → AST（@babel/parser）
2. Transform（转换）：遍历 AST，用 visitor 模式匹配节点并修改（@babel/traverse + plugins）
3. Generate（生成）：AST → 新代码 + source map（@babel/generator）
```

### Day 16：AST 核心节点

| 节点类型 | 示例 |
|----------|------|
| `Program` | 顶层程序 |
| `VariableDeclaration` | `const x = 1` |
| `FunctionDeclaration` | `function foo() {}` |
| `ArrowFunctionExpression` | `() => {}` |
| `CallExpression` | `foo()` |
| `MemberExpression` | `obj.prop` |
| `Identifier` | `x`, `foo` |

可在 [AST Explorer](https://astexplorer.net/) 实时查看。

### Day 16：preset vs plugin

- **plugin**：单个转换规则（如 `@babel/plugin-transform-arrow-functions`）。
- **preset**：一组 plugin 的集合（如 `@babel/preset-env` 包含所有 ES6+ 降级插件）。
- 执行顺序：plugin 先于 preset；plugin 从左到右；preset 从右到左。

### Day 16：preset-env 的三个关键配置

```json
{
  "presets": [["@babel/preset-env", {
    "targets": "> 0.5%, last 2 versions, not dead",
    "useBuiltIns": "usage",
    "corejs": 3
  }]]
}
```

| 配置 | 作用 |
|------|------|
| `targets` | 指定目标浏览器，只降级目标不支持的语法 |
| `useBuiltIns: "usage"` | 按实际使用自动注入 polyfill |
| `useBuiltIns: "entry"` | 在入口全量注入 polyfill |
| `corejs: 3` | 指定 core-js 版本 |

### Day 16：preset-env vs core-js 职责

- **preset-env**：负责**语法降级**（箭头函数 → function、可选链 → 条件判断等）。
- **core-js**：负责**API polyfill**（Promise、Array.from、Object.assign 等运行时 API）。
- 两者互补：preset-env 决定要降级什么，core-js 提供缺失的 API 实现。

### Day 16：@babel/plugin-transform-runtime

解决的问题：Babel 转换时会注入辅助函数（如 `_classCallCheck`），每个文件都注入一份，导致重复代码。

方案：引用 `@babel/runtime` 中的共享辅助函数，避免重复。

### Day 16：Babel 完整流程

```text
源代码: const fn = () => 1
         │
         ▼  @babel/parser
  AST: ArrowFunctionExpression
         │
         ▼  plugin-transform-arrow-functions (visitor)
  AST: FunctionExpression (修改节点类型 + 绑定 this)
         │
         ▼  @babel/generator
新代码: var fn = function() { return 1; }
```

### Day 16：简单 Babel 插件示例

```js
// 把 console.log 替换为空语句
module.exports = function () {
  return {
    visitor: {
      CallExpression(path) {
        const callee = path.get('callee')
        if (callee.isMemberExpression() &&
            callee.get('object').isIdentifier({ name: 'console' }) &&
            callee.get('property').isIdentifier({ name: 'log' })) {
          path.remove()
        }
      }
    }
  }
}
```

### Day 19：Tree Shaking 生效条件

1. **ESM 格式**：必须用 `import / export`，CJS 无法静态分析。
2. **`sideEffects` 配置**：`package.json` 中标记 `"sideEffects": false` 或指定文件列表。
3. **纯函数 / 无副作用**：打包工具通过 `/*#__PURE__*/` 注释判断。
4. **production mode**：开发模式通常不开启 tree shaking。

### Day 19：常见 Tree Shaking 失效场景

- 使用 CJS 格式的库（如 lodash 而非 lodash-es）。
- `sideEffects` 配置错误，CSS 文件被当作无副作用移除。
- 代码中有副作用（IIFE、全局变量赋值、`Object.defineProperty`）。
- `export default` 导出整个对象，打包工具无法判断哪些属性被使用。

### Day 19：代码分割三级策略

| 级别 | 策略 | 场景 |
|------|------|------|
| 路由级 | `React.lazy()` / Vue `defineAsyncComponent` | 按页面分割 |
| 组件级 | 动态 `import()` | 大组件/弹窗/编辑器 |
| Vendor 级 | `SplitChunksPlugin` / `manualChunks` | 第三方库分离 |

### Day 19：缓存三层联动

```text
浏览器缓存（Cache-Control + contenthash 文件名）
  ↕
CDN 缓存（边缘节点缓存静态资源，按 URL 精确匹配）
  ↕
网关/源站缓存（Nginx proxy_cache 或 S3）
```

### Day 19：动态 import 三种写法

```js
// 1. 基础用法
const module = await import('./heavy.js')

// 2. webpack magic comment 指定 chunk 名
const Chart = () => import(/* webpackChunkName: "chart" */ './Chart.vue')

// 3. Vite 的 glob import
const modules = import.meta.glob('./modules/*.ts')
// 生成：{ './modules/a.ts': () => import('./modules/a.ts'), ... }
```

### Day 19：Tree Shaking 验证

```js
// utils.js — ESM 导出
export function used() { return 'I survive' }
export function unused() { return 'I am dead code' }

// main.js
import { used } from './utils.js'
console.log(used())
// 生产构建后，unused 会被移除
```

### Day 20：知识补充

- 生产构建的目标不是“能跑”，而是同时满足：体积可控、缓存稳定、可排障、可回滚。
- Vite 的 `mode` 决定加载哪组 `.env` 文件，`NODE_ENV` 决定依赖和框架是否进入生产分支；两者相关但不是一回事。
- 前端环境变量会被打进浏览器产物，不能放 secret、私有 token、数据库密码；只适合放公开 base URL、环境标识、特性开关。
- 代码分割优先从路由级动态导入、重型组件、低频功能、第三方大依赖入手；拆包太细会增加请求调度成本。
- 长缓存的基本策略是：HTML 不强缓存或短缓存，带 `contenthash` 的 JS/CSS/图片长缓存，旧资源保留一段时间用于回滚。
- 生产 source map 不建议直接公开暴露；常见做法是构建时生成，发布到监控平台或受控存储，线上只通过 release/version 映射还原堆栈。
- 产物分析要看三类问题：首屏 chunk 是否过大、重复依赖是否被打进多个 chunk、低频依赖是否进入首屏路径。
- 压缩只能解决“最后一层体积”，真正影响首屏的还有请求优先级、资源缓存、JS 解析执行成本和渲染阻塞。

### Day 20：动手示例

```ts
// 典型生产构建 vite.config.ts 关键点：sourcemap、chunk、输出命名
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: mode !== 'production' ? true : 'hidden',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue'
            return 'vendor'
          }
        },
      },
    },
  },
}))
```

```text
源码
  -> env/mode 注入
  -> TS/Babel/Vue SFC 转换
  -> 依赖图分析
  -> tree-shaking
  -> code splitting
  -> minify + hash + sourcemap
  -> dist 产物
  -> CDN/Nginx 发布
```
