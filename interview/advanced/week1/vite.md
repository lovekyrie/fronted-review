# Vite 构建工具

> 姊妹篇：[Webpack](./webpack.md) · [构建工具总览](./build-tools.md) · [webpack vs Vite 对比](../../engineering/webpack-vs-vite.md)

Vite 的关键不是「完全不打包」，而是 **开发态与生产态分治**：dev 尽量走浏览器原生 ESM，build 再交给 Rollup/Rolldown 做生产优化。

---

## 1. Vite 在解决什么问题

同样要把 TS/JSX/Vue SFC/CSS/资源变成可部署产物，但 Vite 的设计重点是：

- **开发态**：快启动、快 HMR、快定位问题
- **生产态**：小体积、好缓存、可排障

```
开发：浏览器 ESM 按需请求 → esbuild 即时编译 → WebSocket HMR
生产：Rollup/Rolldown 全量打包 → 压缩/hash/拆包/source map
```

---

## 2. 为什么开发阶段通常更快

### 2.1 浏览器原生 ESM

- 浏览器请求哪个模块，dev server 就编译并返回哪个
- **不必**启动时先把整棵应用树打成 bundle
- 改一个文件，通常只需更新受影响的模块边界

### 2.2 依赖预构建（Dependency Pre-Bundling）

Vite 并不是零预处理。对 `node_modules` 会用 **esbuild** 做 pre-bundling：

1. 把 CommonJS / UMD 转成更适合 ESM dev server 的形式
2. 合并零碎依赖（如 lodash-es 几百个小文件），减少浏览器请求数

缓存目录：`node_modules/.vite/deps/`

### 2.3 Dev Server 流程

```text
浏览器请求 /src/main.ts
  → Vite 拦截
  → 第三方依赖？重定向到 /.vite/deps/xxx.js
  → 源码？esbuild 编译 TS/JSX → 返回 ESM
  → 浏览器继续 import 子模块（按需）
  → 文件变更 → WebSocket 推送 → 模块级 HMR
```

---

## 3. 生产构建（build）

`vite build` **仍然是 bundling**，默认用 Rollup（Vite 5+ 逐步引入 Rolldown）：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: 'hidden', // 或 true / 'inline'，见下文
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        },
      },
    },
  },
})
```

要点：

- dev 快 ≠ build 不打包
- 生产同样要面对拆包、压缩、hash、source map
- 复杂拆包要理解 Rollup 的 `manualChunks` / 动态 import

---

## 4. 与 webpack 的取舍（简要）

| 维度 | Vite | webpack |
|------|------|---------|
| 开发启动 | 秒级，按需 ESM | 往往先打 bundle，大项目慢 |
| HMR | 模块级，与项目规模弱相关 | chunk 级，与 bundle 大小相关 |
| 生产构建 | Rollup/Rolldown | webpack 自身 |
| 配置与生态 | 约定优于配置，生态快速增长 | 最成熟，定制能力最强 |

更好的回答不是「谁更先进」，而是：项目复杂度、历史包袱、团队对构建链路的定制度。

---

## 5. 生产构建里 Vite 要关心的点

### 5.1 代码分割

```js
const UserPage = () => import('./UserPage.vue')
```

路由级动态 import + `manualChunks` 拆 vendor。

### 5.2 tree-shaking

Rollup 的 tree-shaking 通常较好，但仍受以下影响：

- 依赖是否为 ESM
- `sideEffects` 声明
- 副作用过多的模块

### 5.3 长缓存

Rollup 输出 `[name]-[hash].js`，配合 vendor 分包和稳定 chunk 策略，逻辑与 webpack 类似。

### 5.4 环境变量

- 只有 `VITE_` 前缀变量会暴露到客户端
- 进入 bundle 的都不是秘密，不能当后端密钥用

---

## 6. 线上 Source Map 排障（Vite）

### 6.1 构建配置

```js
export default defineConfig({
  build: {
    // false | true | 'inline' | 'hidden'
    sourcemap: 'hidden',
  },
})
```

| 值 | 行为 | 生产建议 |
|----|------|----------|
| `false` | 不生成 | 无法还原栈，不推荐 |
| `true` | 独立 `.map` + JS 末尾带 `sourceMappingURL` | 测试环境可以 |
| `'hidden'` | 独立 `.map`，**不在 JS 里写 URL** | **生产推荐** |
| `'inline'` | map 内联进 JS，体积大 | 一般不用于生产 |

构建产物示例：

```text
dist/
  assets/
    index-a3f8c2.js
    index-a3f8c2.js.map
    vendor-d91e0b.js
    vendor-d91e0b.js.map
```

Vite 基于 Rollup 生成 map，结构与 webpack 类似：`sources`、`mappings`、可选 `sourcesContent`。

### 6.2 部署到 Nginx

与 webpack 相同原则：

```text
公网 Nginx serve：html + js + css + 图片
不公开 serve：*.js.map（或仅内网 / 监控平台）
```

示例 Nginx（仅静态资源，**不**映射 `.map`）：

```nginx
server {
  root /var/www/dist;
  location / {
    try_files $uri $uri/ /index.html;
  }
  # 可选：显式拒绝 .map，防止误上传
  location ~* \.map$ {
    return 404;
  }
}
```

### 6.3 线上报错 → 定位源码的完整流程

#### 统一链路（与 webpack 相同，工具差异只在构建配置）

```text
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  CI 构建     │ → │ 生成 js + map │ → │ 部署 js 到   │ → │ 用户访问触发  │
│ vite build  │    │ sourcemap:   │    │ Nginx       │    │ 运行时错误    │
│             │    │ hidden       │    │ (不含 .map)  │    │              │
└─────────────┘    └──────────────┘    └─────────────┘    └──────┬───────┘
                                                                  │
                    ┌──────────────┐    ┌─────────────┐           │
                    │ 监控平台展示  │ ← │ 用 map 反解  │ ←─────────┘
                    │ 源码位置      │    │ 栈帧        │   SDK 上报 stack
                    └──────────────┘    └─────────────┘
                           ↑
                    CI 上传 .map 到 Sentry
                    绑定 release / dist
```

#### 步骤拆解

**① 构建**

```bash
VITE_APP_VERSION=1.2.0 vite build
# 产出 dist/assets/*.js + *.js.map
```

**② 部署**

- 把 `dist/` 里除 `.map` 外的文件同步到 Nginx（或 `.map` 放内网路径）
- 前端 SDK 初始化时带上 **release 版本**，与 CI 上传 map 的版本一致

**③ 运行时**

用户浏览器执行 `index-a3f8c2.js`，报错栈指向产物行列。

**④ 上报**

Sentry 等 SDK 发送：

```json
{
  "release": "1.2.0",
  "exception": {
    "stacktrace": "at o (index-a3f8c2.js:1:8234)"
  }
}
```

**⑤ 平台反解**

Sentry 用已上传的 `index-a3f8c2.js.map`，把 `1:8234` 映射到 `src/components/User.vue:42:5`。

**⑥ 你本地验证**

```bash
git checkout v1.2.0   # 与 release 对齐的 commit
# 打开 src/components/User.vue:42
```

#### Vite 特有注意点

- **路径前缀**：`build.base` 影响资源 URL，需与 Nginx 子路径部署一致
- **Vue SFC**：map 会映射到 `.vue` 文件 + 具体 block（template/script/style）
- **多入口**：每个入口 chunk 各有一份 map，上传要覆盖整个 `dist/assets`
- **Rolldown 迁移**：map 格式仍兼容，但插件生态变化时需验证 map 是否完整

### 6.4 不用监控平台时的手动流程

1. 从日志拿到 `index-a3f8c2.js:1:8234` 和部署版本号  
2. 从 CI 制品库取同版本的 `index-a3f8c2.js.map`  
3. `npx source-map-cli resolve ...` 或 Chrome DevTools「Add source map」手动关联  
4. 回到对应 git tag 看源码  

---

## 7. 高频面试题

**Q：Vite 为什么 dev 快？**  
原生 ESM 按需编译 + esbuild 预构建依赖，避免启动时全量 bundle。

**Q：Vite 生产还用不用打包？**  
用，`vite build` 走 Rollup/Rolldown 全量打包优化。

**Q：预构建解决什么？**  
CJS→ESM + 合并小文件减少请求，不是和「快」矛盾而是让 ESM 路径更稳。

**Q：生产 source map 怎么配？**  
`build.sourcemap: 'hidden'`，map 上传监控平台，Nginx 不公开 `.map`。

---

## 8. 回答模板

1. Vite = 开发态 ESM + 预构建，生产态 Rollup 打包  
2. 优势：现代默认体验、HMR 快  
3. 复杂定制仍要懂 Rollup 拆包与插件  
4. 线上排障：hidden map + release 对齐 + Sentry 上传，与 webpack 流程一致
