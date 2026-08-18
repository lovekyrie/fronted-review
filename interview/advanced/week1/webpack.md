# Webpack 构建工具

> 姊妹篇：[Vite](./vite.md) · [构建工具总览](./build-tools.md) · [webpack vs Vite 对比](../../engineering/webpack-vs-vite.md)

高级面试里讲 webpack，不是背配置项，而是讲清：**从入口建立依赖图 → loader/plugin 转换 → chunk 组织 → 部署产物** 这条链路，以及它为什么适合复杂生产构建。

---

## 1. Webpack 在解决什么问题

浏览器不能直接跑真实项目里的全部代码。webpack 的职责是把多种输入组织成浏览器可稳定消费的产物：

```
源码 (JS/TS/JSX/CSS/资源)
  → 模块解析（依赖图）
  → 代码转换（loader）
  → 构建优化（plugin / optimization）
  → 输出 chunk + 静态资源
```

可以拆成四层理解：

1. **解析模块关系**：从 entry 递归收集依赖
2. **代码转换**：Babel、TS、CSS 等通过 loader 接入
3. **组织产物**：dev server 或 production bundle
4. **优化**：拆包、tree-shaking、压缩、hash、source map

---

## 2. 核心抽象

```js
// webpack.config.js
export default {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: 'dist',
  },
  devtool: 'hidden-source-map', // 见下文 Source Map 章节
}
```

| 概念 | 作用 |
|------|------|
| **entry** | 构建起点，可多个 |
| **dependency graph** | 从入口递归得到的模块依赖图 |
| **loader** | 单文件「翻译器」，把非 JS 或需转译的资源变成模块 |
| **plugin** | 介入整个构建生命周期（compile → seal → emit） |
| **chunk** | 输出文件的分组单位（entry / async / runtime / vendor） |

### loader vs plugin

- **loader**：作用在**单个模块**转换阶段  
  例：`babel-loader`、`css-loader`、`vue-loader`
- **plugin**：作用在**整个构建流程**  
  例：`HtmlWebpackPlugin`、`DefinePlugin`、`SplitChunksPlugin`

Loader 执行顺序：**从右到左、从下到上**。

```js
use: ['style-loader', 'css-loader', 'sass-loader']
// 实际：sass → css → style
```

### Plugin 生命周期（简图）

```text
初始化 → compile → make（构建模块图）→ seal（优化/拆 chunk）→ emit（写盘）→ done
```

---

## 3. 开发态 vs 生产态

webpack **dev 和 build 都是 bundling 思路**：

- **dev server**：基于打包结果 + WebSocket 做 HMR，大项目冷启动和增量反馈通常较慢
- **production**：全量打包，对 chunk 策略、缓存、压缩控制力很强

这也是它和 Vite 体验差异的根源：webpack 开发阶段往往要先组织 bundle，Vite 开发阶段尽量按需走 ESM。

---

## 4. 为什么适合复杂生产构建

- chunk 拆分策略可细配（`SplitChunksPlugin`、`runtimeChunk`）
- 插件生态最成熟，历史项目兼容性强
- 对「依赖图如何变成最终文件」控制粒度细

代价：配置复杂、学习曲线陡、开发态全量打包成本高。

### 长效缓存（面试常问）

```js
export default {
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: 'single', // runtime 单独抽离，避免小改动导致 vendor hash 连锁失效
    splitChunks: { chunks: 'all' },
    moduleIds: 'deterministic',
  },
}
```

### 动态 import 与拆包

```js
const UserPage = () => import('./UserPage.vue')
```

`import()` 提供异步边界，构建器会把这段依赖切成独立 async chunk，访问到时再加载。

---

## 5. 与 Babel 的边界

- **Babel**：把一段代码变成另一段代码（AST 变换）
- **webpack**：把一组模块组织成可开发/可部署的产物
- **polyfill**：补运行时缺失能力（如 `core-js`）

三者常一起出现，职责不同。

---

## 6. 线上 Source Map 排障（Webpack）

### 6.1 先理解：报错栈里为什么是乱码

生产构建后，浏览器执行的是 **压缩、合并、改名** 后的 JS。报错类似：

```text
TypeError: Cannot read properties of undefined (reading 'id')
    at a (main.a3f8c2.js:2:18407)
    at n (main.a3f8c2.js:2:921)
```

这里的 `main.a3f8c2.js:2:18407` 是**产物文件**的行列号，不是源码位置。Source Map 就是「产物位置 ↔ 源码位置」的对照表。

### 6.2 构建阶段：webpack 如何生成 map

```js
export default {
  mode: 'production',
  devtool: 'hidden-source-map', // 推荐：生成 .map 但不在 JS 末尾写 sourceMappingURL
  output: {
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[file].map', // 可选，自定义 .map 路径
  },
}
```

常见 `devtool` 选型：

| 值 | 生成 .map | JS 末尾带 URL | 适用 |
|----|-----------|---------------|------|
| `source-map` | ✅ | ✅ 公开 | 不推荐生产（源码易暴露） |
| `hidden-source-map` | ✅ | ❌ | **生产推荐**：map 给监控平台，不自动被浏览器拉 |
| `nosources-source-map` | ✅（无 sourcesContent） | ✅ | 只有映射关系，不含源码正文 |
| `eval-cheap-module-source-map` | 内联 eval | — | 开发快，不适合生产 |

构建完成后产物示例：

```text
dist/
  assets/
    main.a3f8c2.js
    main.a3f8c2.js.map    ← 对照表
    vendor.d91e0b.js
    vendor.d91e0b.js.map
```

`.map` 是 JSON，核心字段：

- `sources`：原始文件路径（如 `webpack://./src/pages/User.vue`）
- `sourcesContent`：可选，内嵌源码正文
- `mappings`：VLQ 编码的位置映射

### 6.3 部署到 Nginx：什么该上、什么不该公开

**典型安全做法**：

```text
Nginx 对外（用户可访问）          仅内网 / 监控平台可访问
─────────────────────────        ─────────────────────────
index.html                       *.js.map（或不上传公网）
main.[hash].js
vendor.[hash].js
```

Nginx 只 serve `dist` 里的 **html / js / css / 静态资源**，**不要把 `.map` 放到公网目录**，否则 DevTools 或扫描工具可能还原源码结构。

若使用 `hidden-source-map`，JS 文件末尾**没有** `//# sourceMappingURL=...`，浏览器默认不会去请求 `.map`。

### 6.4 线上报错 → 定位源码的完整流程

#### 流程 A：接入 Sentry / 自建监控（生产推荐）

```text
① 用户浏览器执行 main.a3f8c2.js，某行抛错
② 前端 SDK 捕获异常，上报 stack + release 版本号
   { message, stack: "at a (main.a3f8c2.js:2:18407)", release: "1.2.0" }
③ CI 构建时：webpack 生成 hidden-source-map
④ CI 把 .map 上传到 Sentry（sentry-cli sourcemaps upload）
   关联 release / dist 路径
⑤ Sentry 用 .map 把  main.a3f8c2.js:2:18407
   还原为 src/views/User.vue:42:5
⑥ 你在 Sentry 界面直接看到源码片段、作者、commit
```

CI 上传示例（概念）：

```bash
# 构建
npm run build

# 上传 source map 到 Sentry（需 auth token + release）
npx @sentry/cli sourcemaps upload \
  --org your-org \
  --project your-project \
  --release "1.2.0" \
  ./dist/assets
```

要点：**map 和 JS 的 hash 必须同一轮构建**，否则行列对不上。

#### 流程 B：本地用 map 手动还原（应急）

1. 从监控平台复制 stack：`main.a3f8c2.js:2:18407`
2. 找到**同一次构建**的 `main.a3f8c2.js.map`（CI 产物归档 / 制品库）
3. 用工具解析：

```bash
# source-map 库 或 sentry-cli / source-map-explorer
npx source-map-cli resolve dist/assets/main.a3f8c2.js.map 2 18407
```

4. 得到 `src/xxx.vue:行:列`，回到本地 checkout 对应 commit 查看

#### 流程 C：DevTools 直接调试（仅测试环境）

测试环境可用 `devtool: 'source-map'`，Nginx 同时 serve `.js` 和 `.js.map`：

```text
浏览器报错 → DevTools Sources 面板
→ 自动加载 .map → 显示原始 .vue/.ts 文件
→ 可打断点、看完整调用栈
```

**生产环境一般不这样做**，避免源码泄露。

### 6.5 webpack 特有注意点

- **多 chunk**：每个 JS 可能有独立 `.map`，上传时要覆盖 `dist` 下全部 map
- **publicPath**：`output.publicPath` 影响 map 里 `sources` 的路径前缀，需与部署路径一致
- **CssSourceMap**：CSS 也有独立 map，样式报错需 `MiniCssExtractPlugin` 等配合开启

---

## 7. 高频面试题

**Q：loader 和 plugin 区别？**  
loader 转单个模块；plugin 钩住整个构建生命周期。

**Q：为什么生产要 runtimeChunk？**  
runtime 存模块加载映射，和业务代码混一起会导致缓存大面积失效。

**Q：tree-shaking 为什么依赖 ESM？**  
需要静态分析 import/export；CJS 的 `require()` 可运行时动态调用，难以静态裁剪。

**Q：hidden-source-map 和 source-map 区别？**  
都生成完整 map；前者不在 bundle 末尾暴露 URL，适合配合监控平台私密存储。

---

## 8. 回答模板

1. webpack 从 entry 建依赖图，loader 做模块转换，plugin 做生命周期扩展  
2. 生产强项：拆包、缓存 hash、生态成熟  
3. 弱项：开发态 bundling 成本高  
4. 线上排障：`hidden-source-map` + CI 上传 map 到 Sentry，用 release 对齐版本
