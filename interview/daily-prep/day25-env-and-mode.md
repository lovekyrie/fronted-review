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

<!-- .env 加载顺序 / import.meta.env / 运行时配置方案 / ARG vs ENV -->

## 手写 / 流程图

```text
.env / .env.prod → Vite build → __MY_CONFIG__ 占位 → 部署时 sed 替换 → nginx serve
```

## 口述题

### 1. 构建时注入和运行时注入怎么选？

> 回答模板：

### 2. 为什么 Vite 只暴露 `VITE_` 前缀的变量？

> 回答模板：

## 5 分钟录音顺序

1. 环境变量链路（1.5 分钟）
2. 构建时 vs 运行时注入（2 分钟）
3. 敏感信息边界（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
