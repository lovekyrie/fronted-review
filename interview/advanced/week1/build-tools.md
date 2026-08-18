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
