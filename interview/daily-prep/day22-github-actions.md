# Day 22 GitHub Actions 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 22 | GitHub Actions | [CI/CD](../advanced/week2/ci-cd)、[Git](../engineering/git) |

## 今日目标

- 看完 GitHub Actions 文档 + Workflow Syntax
- 基于仓库里 `.github/workflows/deploy.yml` 写一篇上线复盘（触发 → 构建 → 部署）
- 能讲清 `on / jobs / steps / secrets / matrix / cache` 6 个核心概念

## 阅读卡点

- `on.push` 的分支过滤和 `paths` 过滤组合能大幅减少无效触发
- Job 默认并行，`needs` 用于串联；`if` 用于条件分支
- `actions/cache` 的 key 要包含 lockfile hash，否则会复用陈旧依赖

## 速记卡 / 知识点

<!-- workflow 结构 / runner / secrets / artifacts / environment -->

## 手写 / 流程图

```yaml
# 最小 CI：lint → test → build → deploy，用 needs 串联
```

## 口述题

### 1. 一个完整的前端 CI 流程应该包含哪些阶段？

> 回答模板：

### 2. 如何让 CI 跑得更快？

> 回答模板：

## 5 分钟录音顺序

1. workflow 6 个核心概念（1.5 分钟）
2. 仓库现有 deploy.yml 复盘（2 分钟）
3. 缓存 + 并行 + 条件触发优化（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
