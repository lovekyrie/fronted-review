# Day 75 监控 / 错误追踪 / 可观测性 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 75 | 监控 / 可观测性 | [错误监控](../network&broswer/error-monitoring)、[可观测性](../network&broswer/observability-system) |

## 今日目标

- 看完 `/network&broswer/error-monitoring`、`/observability-system`
- 输出前端可观测性三柱：日志 / 指标 / 链路（Logs / Metrics / Traces）
- 画一张错误上报链路图：捕获 → 聚合 → 上报 → 消费

## 阅读卡点

- 前端错误来源：JS error、Promise rejection、资源加载失败、接口错误、白屏
- 上报时机要用 `sendBeacon` / `fetch keepalive`，避免卸载时丢失
- 日志要带 release 版本和 sourcemap，否则线上堆栈无意义

## 速记卡 / 知识点

<!-- 错误分类 / 采集 SDK 设计 / 采样策略 / 埋点与指标 / 分布式 trace id -->

## 手写 / 流程图

```text
window.onerror / unhandledrejection / PerformanceObserver
→ 聚合 SDK → sendBeacon → 日志服务 → 告警
```

## 口述题

### 1. 前端可观测性你会怎么分层？

> 回答模板：

### 2. 白屏怎么监控？

> 回答模板：

## 5 分钟录音顺序

1. 三柱模型（1.5 分钟）
2. 错误采集链路（2 分钟）
3. 性能 + 业务指标（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
