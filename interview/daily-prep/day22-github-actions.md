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

- `on` 决定何时触发 workflow，常见有 `push`、`pull_request`、`workflow_dispatch`，要配合 `branches` 和 `paths` 减少无效执行。
- `jobs` 默认并行执行；需要顺序依赖时用 `needs`，需要条件控制时用 `if`。
- `steps` 是一个 job 内部的顺序执行单元，可以使用第三方 action，也可以直接执行 shell 命令。
- `runner` 是执行环境，GitHub-hosted runner 省维护，自建 runner 适合内网部署、缓存大依赖或特殊环境。
- `secrets` 用于保存敏感信息，但前端构建时注入到 bundle 的变量仍然会暴露给浏览器，不能把 secret 当客户端密钥。
- `artifacts` 用来在 job 之间或构建后保存产物，例如 dist、测试报告、覆盖率报告。
- `environment` 可以给生产/预发加审批、环境变量和保护规则，是发布治理的一部分。
- CI 的价值不只是自动执行命令，而是把 lint、test、typecheck、build、部署验证变成稳定质量门禁。

## 手写 / 流程图

```yaml
name: frontend-ci

on:
  pull_request:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
```

```text
PR -> lint/test/typecheck/build -> 产物/报告
main push -> 构建制品 -> 部署预发/生产 -> smoke test -> 失败回滚或阻断
```

## 口述题

### 1. 一个完整的前端 CI 流程应该包含哪些阶段？

> 回答模板：完整前端 CI 不是只跑 build。PR 阶段至少要安装依赖、跑 lint、类型检查、单测和构建校验，目的是在合并前拦住低级错误。主干阶段可以在通过质量门禁后生成可追溯产物，比如 dist 或 Docker 镜像，再上传 artifact 或 registry。进入 CD 时还要有环境变量、secrets、审批、部署后 smoke test 和回滚入口。高级一点的回答要强调：CI 负责验证变更是否可靠，CD 负责把一个可追溯版本稳定交付出去。

### 2. 如何让 CI 跑得更快？

> 回答模板：我会先定位慢在哪里，再分别优化。依赖安装慢就用包管理器缓存，cache key 必须包含 lockfile hash；任务互不依赖就拆成多个 job 并行，必须串联的再用 `needs`；触发太多就用 branches、paths 和 PR 规则减少无效运行；测试慢就按单测、组件测试、E2E 分层，PR 只跑关键集合，夜间或主干跑完整集合；构建慢再看 source map、压缩、类型检查和插件耗时。不要为了快直接跳过质量门禁。

## 5 分钟录音顺序

1. workflow 6 个核心概念（1.5 分钟）
2. 仓库现有 deploy.yml 复盘（2 分钟）
3. 缓存 + 并行 + 条件触发优化（1.5 分钟）

## 今日复盘

1. 最容易被追问：`actions/cache` 或 `setup-node cache` 的 key 不能只写固定字符串，要让 lockfile 变化时缓存自动失效。
2. 当前短板：要准备一个真实 workflow 复盘，能说出每个 job 为什么存在，以及失败时如何定位。
3. 下一次补充：把 CI/CD 和 Docker、Nginx、发布回滚串起来，避免只会讲 GitHub Actions 语法。
