# Day 22 GitHub Actions

## 今日目标

- 看完 GitHub Actions 文档 + Workflow Syntax
- 基于仓库里 `.github/workflows/deploy.yml` 写一篇上线复盘（触发 → 构建 → 部署）
- 能讲清 `on / jobs / steps / secrets / matrix / cache` 6 个核心概念

## 按顺序阅读

1. [CI/CD](../advanced/week2/ci-cd)
2. [Git](../engineering/git)

## 实操与自测

**检查点**

- `on.push` 的分支过滤和 `paths` 过滤组合能大幅减少无效触发
- Job 默认并行，`needs` 用于串联；`if` 用于条件分支
- `actions/cache` 的 key 要包含 lockfile hash，否则会复用陈旧依赖

**先独立完成，再对照专题**

- 知识补充 — [参考章节](../advanced/week2/ci-cd#day-22-知识补充)
- 动手示例 — [参考章节](../advanced/week2/ci-cd#day-22-动手示例)

**脱稿口述题**

- 1. 一个完整的前端 CI 流程应该包含哪些阶段？
- 2. 如何让 CI 跑得更快？

**录音练习**

1. workflow 6 个核心概念（1.5 分钟）
2. 仓库现有 deploy.yml 复盘（2 分钟）
3. 缓存 + 并行 + 条件触发优化（1.5 分钟）

## 复盘

1. 最容易被追问：`actions/cache` 或 `setup-node cache` 的 key 不能只写固定字符串，要让 lockfile 变化时缓存自动失效。
2. 当前短板：要准备一个真实 workflow 复盘，能说出每个 job 为什么存在，以及失败时如何定位。
3. 下一次补充：把 CI/CD 和 Docker、Nginx、发布回滚串起来，避免只会讲 GitHub Actions 语法。
