# Day 23 Docker 基础

## 今日目标

- 看完 Docker Build Overview / Dockerfile Reference / Build Variables
- 读懂仓库根目录的 `Dockerfile` 和 `.dockerignore`，写注释版
- 能讲清 image / container / layer / volume / network 5 个概念

## 按顺序阅读

1. [部署](../advanced/week2/deployment)
2. [CI/CD](../advanced/week2/ci-cd)

## 实操与自测

**检查点**

- 每条指令都会生成一个 layer，合并指令能减小镜像体积
- `COPY package*.json` → `RUN install` → `COPY .` 的顺序能最大化缓存命中
- 多阶段构建（multi-stage）：构建阶段装依赖编译，运行阶段只保留产物

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week2/deployment#day-23-知识补充)
- 动手示例 — [参考章节](../advanced/week2/deployment#day-23-动手示例)

**脱稿口述题**

- 1. 为什么前端镜像通常用多阶段构建？
- 2. 如何最大化 Docker 构建缓存命中？

**录音练习**

1. Docker 基础概念（1 分钟）
2. 多阶段构建（2 分钟）
3. 缓存命中 + 瘦身（2 分钟）

## 复盘

1. 最容易被追问：为什么前端不直接用 Node 镜像跑？静态站点运行时不需要 Node，Nginx 更轻、更符合职责。
2. 当前短板：镜像 tag 策略要和回滚绑定，不能只会说 `latest`。
3. 下一次补充：结合 Nginx 配置说明容器启动后如何处理 SPA 路由、缓存头和静态资源压缩。
