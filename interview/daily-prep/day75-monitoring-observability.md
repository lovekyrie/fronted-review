# Day 75 监控 / 错误追踪 / 可观测性

## 今日目标

- 看完 `/network&broswer/error-monitoring`、`/observability-system`
- 输出前端可观测性三柱：日志 / 指标 / 链路（Logs / Metrics / Traces）
- 画一张错误上报链路图：捕获 → 聚合 → 上报 → 消费

## 按顺序阅读

1. [错误监控](../network&broswer/error-monitoring)
2. [可观测性](../network&broswer/observability-system)

## 实操与自测

**检查点**

- 前端错误来源：JS error、Promise rejection、资源加载失败、接口错误、白屏
- 上报时机要用 `sendBeacon` / `fetch keepalive`，避免卸载时丢失
- 日志要带 release 版本和 sourcemap，否则线上堆栈无意义

**先独立完成，再对照专题**

- 可观测性三柱 — [参考章节](../network&broswer/observability-system#day-75-可观测性三柱)
- 前端错误分类 — [参考章节](../network&broswer/error-monitoring#day-75-前端错误分类)
- 错误上报设计 — [参考章节](../network&broswer/error-monitoring#day-75-错误上报设计)
- 上报时机 — [参考章节](../network&broswer/error-monitoring#day-75-上报时机)
- SourceMap 还原 — [参考章节](../network&broswer/error-monitoring#day-75-sourcemap-还原)
- 错误采集链路 — [参考章节](../network&broswer/error-monitoring#day-75-错误采集链路)
- 简易错误 SDK — [参考章节](../network&broswer/error-monitoring#day-75-简易错误-sdk)

**脱稿口述题**

- 1. 前端可观测性你会怎么分层？
- 2. 白屏怎么监控？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 可观测性三柱（Logs / Metrics / Traces）（1.5 分钟）
2. 错误采集链路（捕获 → 格式化 → 聚合 → 上报 → SourceMap 还原）（2 分钟）
3. 性能指标采集 + 白屏监控 + 告警策略（1.5 分钟）

录完后自查：

- 是否说出错误的 5 种来源和捕获方式。
- 是否说出 sendBeacon 的优势。
- 是否说出 SourceMap 还原的流程。
- 是否说出白屏监控的方案。

## 复盘

今天最需要回补的 3 个点：

1. 采样策略的设计（P0 错误 100% 上报，P1 按 10% 采样）。
2. 用户行为回放（rrweb）的原理和应用。
3. 前端 APM（Application Performance Monitoring）与后端 APM 的串联。
