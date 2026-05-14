# Day 25 多环境变量与构建模式 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 25 | env / mode | [部署](../advanced/week2/deployment)、[CI/CD](../advanced/week2/ci-cd) |

## 今日目标

- 看完 Vite Env and Mode、Docker Build Variables
- 画一张“环境变量从 .env → 构建产物 → 运行时”的链路图
- 整理 dev / staging / prod 三环境的差异清单（域名 / 接口 / 开关）

## 阅读卡点

- Vite 只暴露以 `VITE_` 开头的变量到客户端，防止敏感信息泄漏
- 构建时注入和运行时注入的区别：前者产物固化，后者靠 `window.__CONFIG__` / 接口
- Docker `ARG` vs `ENV`：前者只在构建时存在，后者进入运行时镜像

## 速记卡 / 知识点

- 环境变量要先区分三类：本地开发变量、构建时变量、运行时配置；它们生效时机不同。
- Vite 通过 `mode` 加载对应 `.env` 文件，并把符合前缀规则的变量暴露到 `import.meta.env`。
- 进入前端 bundle 的变量都是浏览器可见的，不能把 `VITE_` 变量当密钥存储。
- 构建时注入的优点是简单、产物确定；缺点是换环境通常要重新构建。
- 运行时注入的优点是同一份产物可部署到多个环境；常见方式是外部 `config.js`、服务端模板注入或启动时替换占位符。
- Docker `ARG` 只在 build 阶段可用，`ENV` 会保留在镜像运行时；但只要最后写进前端静态文件，用户仍然能看到。
- 多环境配置建议把“公开配置”和“敏感配置”分开：公开配置给前端，敏感配置只留在服务端、CI secret 或网关。
- 环境变量事故常见原因：构建模式用错、缓存了旧 HTML、前端写死接口域名、预发变量流入生产。

## 手写 / 流程图

```text
构建时注入：
.env.production
  -> Vite build --mode production
  -> import.meta.env.VITE_API_BASE 被替换进 JS
  -> dist 固化配置
  -> 部署到 Nginx/CDN

运行时注入：
同一份 dist
  -> 容器启动时生成 /config.js
  -> window.__APP_CONFIG__ = { apiBase: "..." }
  -> 应用启动时读取 window.__APP_CONFIG__
  -> 不同环境复用同一份镜像
```

```ts
// 运行时配置读取示意
type AppConfig = {
  apiBase: string
  env: 'dev' | 'staging' | 'prod'
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig
  }
}

export const appConfig: AppConfig = window.__APP_CONFIG__ ?? {
  apiBase: import.meta.env.VITE_API_BASE,
  env: import.meta.env.MODE as AppConfig['env'],
}
```

## 口述题

### 1. 构建时注入和运行时注入怎么选？

> 回答模板：如果项目环境少、每个环境单独构建可以接受，构建时注入最简单，Vite 在 build 时把 `import.meta.env` 替换进产物，产物和环境强绑定，排查也直接。但如果希望同一份镜像或 dist 在 dev、staging、prod 多环境复用，就更适合运行时注入，比如容器启动时生成 `config.js`，应用启动时读 `window.__APP_CONFIG__`。取舍点是简单性和产物复用。无论哪种方式，敏感信息都不能注入到前端可见产物。

### 2. 为什么 Vite 只暴露 `VITE_` 前缀的变量？

> 回答模板：因为前端代码最终运行在浏览器里，构建时注入的变量会进入 JS bundle。Vite 用 `VITE_` 前缀做显式白名单，避免机器环境里的数据库密码、私有 token、CI secret 被误打进前端产物。这个设计不是说 `VITE_` 变量安全，而是要求开发者明确声明“这个变量允许暴露给客户端”。真正的密钥应该放在服务端或 CI secret 里，由服务端接口间接使用。

## 5 分钟录音顺序

1. 环境变量链路（1.5 分钟）
2. 构建时 vs 运行时注入（2 分钟）
3. 敏感信息边界（1.5 分钟）

## 今日复盘

1. 最容易被追问：构建时变量已经固化进产物，不能在容器运行时靠改 `ENV` 自动改变浏览器里的 JS。
2. 当前短板：要准备一套 `config.js` 或占位符替换的真实方案，说明缓存、类型校验和默认值怎么处理。
3. 下一次补充：把环境变量和发布回滚连起来，避免回滚到旧版本时配置文件与静态资源版本不匹配。
