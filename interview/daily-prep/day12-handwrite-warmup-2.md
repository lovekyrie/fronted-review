# Day 12 手写保温 2（防抖/节流 / Promise / EventEmitter / promisify） 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 12 | 手写 2（防抖节流/EventEmitter/promisify） | [debounce](../handwrite/debounce)、[throttle](../handwrite/throttle)、[event-emitter](../handwrite/event-emitter)、[promisify](../handwrite/promisify) |

## 今日目标

- 看完 `/handwrite/debounce`、`throttle`、`promisify`、`event-emitter`
- 输出防抖 / 节流对比表（触发时机、leading/trailing 选项、取消语义）
- 输出 EventEmitter / promisify 口述模板

## 阅读卡点

- 防抖 = 等一会儿只执行最后一次；节流 = 固定频率
- 常见追问：`leading: true, trailing: true` 同时开启的边界、`cancel` 方法怎么实现
- EventEmitter 的 `once` 用包装函数 + 删除来实现
- `promisify` 针对 error-first 回调，注意 `this` 绑定

## 速记卡 / 知识点

<!-- 防抖节流时序图 / EventEmitter 最小 API / promisify 3 步 -->

## 手写 / 流程图

```js
function debounce(fn, delay, { leading, trailing } = {}) { /* ... */ }
function throttle(fn, delay) { /* ... */ }
class EventEmitter { /* on / off / emit / once */ }
function promisify(fn) { /* error-first callback → Promise */ }
```

## 口述题

### 1. 防抖和节流怎么结合场景选？

> 回答模板：

### 2. Promise 风格 API 转 async 风格怎么讲？

> 回答模板：

## 5 分钟录音顺序

1. 防抖节流原理（2 分钟）
2. EventEmitter 4 个 API（1.5 分钟）
3. promisify 的实现要点（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
