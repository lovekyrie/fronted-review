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

<!-- Dockerfile 常用指令 / 多阶段构建 / .dockerignore 作用 / 镜像瘦身手法 -->

## 手写 / 流程图

```dockerfile
# 前端多阶段构建：node alpine 构建 → nginx alpine 运行
```

## 口述题

### 1. 为什么前端镜像通常用多阶段构建？

> 回答模板：

### 2. 如何最大化 Docker 构建缓存命中？

> 回答模板：

## 5 分钟录音顺序

1. Docker 基础概念（1 分钟）
2. 多阶段构建（2 分钟）
3. 缓存命中 + 瘦身（2 分钟）

## 今日复盘

1. 
2. 
3. 
