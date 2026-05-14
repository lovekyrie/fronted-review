# Day 23 Docker 基础 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 23 | Docker | [部署](../advanced/week2/deployment)、[CI/CD](../advanced/week2/ci-cd) |

## 今日目标

- 看完 Docker Build Overview / Dockerfile Reference / Build Variables
- 读懂仓库根目录的 `Dockerfile` 和 `.dockerignore`，写注释版
- 能讲清 image / container / layer / volume / network 5 个概念

## 阅读卡点

- 每条指令都会生成一个 layer，合并指令能减小镜像体积
- `COPY package*.json` → `RUN install` → `COPY .` 的顺序能最大化缓存命中
- 多阶段构建（multi-stage）：构建阶段装依赖编译，运行阶段只保留产物

## 速记卡 / 知识点

- `image` 是只读模板，`container` 是镜像运行后的实例；同一个镜像可以启动多个容器。
- `layer` 是镜像分层缓存的基础，每条 Dockerfile 指令通常生成一层；越靠前且越稳定的层越容易复用缓存。
- 前端静态站点通常不需要 Node runtime，Node 只负责构建，Nginx 负责运行时托管静态资源。
- 多阶段构建把“构建环境”和“运行环境”分开，最终镜像只保留 `dist` 和 Nginx，体积更小、攻击面更低。
- `.dockerignore` 的价值是减少 build context，避免把 `node_modules`、`.git`、本地缓存、日志传进镜像构建过程。
- Docker 构建缓存的关键顺序是：先复制 lockfile 和 package 文件安装依赖，再复制业务源码；源码变化时不会让依赖层失效。
- `ARG` 是构建时变量，`ENV` 会进入镜像运行时环境；两者都不适合承载会暴露到前端产物里的敏感信息。
- 镜像 tag 要能回溯版本，生产部署尽量使用 commit SHA 或版本号，不要只依赖 `latest`。

## 手写 / 流程图

```dockerfile
# 前端多阶段构建：Node 负责 build，Nginx 负责 serve
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```text
源码 + Dockerfile
  -> build context，受 .dockerignore 影响
  -> builder stage：安装依赖、执行构建、生成 dist
  -> runtime stage：复制 dist + nginx.conf
  -> image：打 tag，推送 registry
  -> container：服务器拉取镜像并运行
```

## 口述题

### 1. 为什么前端镜像通常用多阶段构建？

> 回答模板：前端项目最终交付的大多数时候是一组静态文件，Node 环境只在构建阶段需要，线上运行并不需要完整 Node、包管理器和源码。多阶段构建可以用 Node 镜像安装依赖并执行 build，然后只把 dist 复制到 Nginx 镜像里运行。这样最终镜像更小，启动更简单，攻击面也更低，还能避免生产环境临时安装依赖导致不可控。面试里我会强调职责拆分：builder 负责产物，runtime 负责稳定服务。

### 2. 如何最大化 Docker 构建缓存命中？

> 回答模板：核心是把变化少的步骤放前面，变化频繁的源码放后面。比如先 `COPY package.json` 和 lockfile，再 `pnpm install`，最后才 `COPY . .`。这样业务代码变更不会让依赖安装层失效。还要写好 `.dockerignore`，避免 `node_modules`、日志、测试产物、Git 元数据进入 build context。CI 里还可以配合 registry cache 或构建缓存，但前提仍然是 Dockerfile 层顺序合理。

## 5 分钟录音顺序

1. Docker 基础概念（1 分钟）
2. 多阶段构建（2 分钟）
3. 缓存命中 + 瘦身（2 分钟）

## 今日复盘

1. 最容易被追问：为什么前端不直接用 Node 镜像跑？静态站点运行时不需要 Node，Nginx 更轻、更符合职责。
2. 当前短板：镜像 tag 策略要和回滚绑定，不能只会说 `latest`。
3. 下一次补充：结合 Nginx 配置说明容器启动后如何处理 SPA 路由、缓存头和静态资源压缩。
