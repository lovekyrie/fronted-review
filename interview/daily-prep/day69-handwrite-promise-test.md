# Day 69 为 handwrite/promise 补测试 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 69 | handwrite 补测试 | [测试策略](../advanced/week7/testing-strategy)、[promisify](../handwrite/promisify) |

## 今日目标

- 看仓库 `hand-write/promise` 或 `hand-write/simulate/eventEmitter.js`
- 为其中一个实现补 Vitest 单测：正常路径 + 异常路径 + 边界
- 输出 “testing 一个库的 3 步走”：看 API 边界 → 列用例矩阵 → 补测试

## 阅读卡点

- 对 Promise 要测：`then / catch / finally / resolve / reject / all / race / allSettled / any`
- 对 EventEmitter 要测：`on / off / emit / once / 参数传递 / 异常隔离`
- 面试里经常问：“你测覆盖率多少？” 要能说明**覆盖率只是结果，用例矩阵才是过程**

## 速记卡 / 知识点

<!-- 测试用例矩阵 / 异常路径的常见漏测 / 覆盖率报告解读 -->

## 手写 / 流程图

```ts
describe('MyPromise', () => {
  it('resolve 后 then 能拿到值', async () => { /* ... */ })
  it('reject 后 catch 能拿到错误', async () => { /* ... */ })
  it('then 支持链式值穿透', async () => { /* ... */ })
})
```

## 口述题

### 1. 你给一个库写测试会怎么规划？

> 回答模板：

### 2. 测试里 async 流程怎么处理？

> 回答模板：

## 5 分钟录音顺序

1. 用例矩阵方法（1.5 分钟）
2. 异常 + 边界用例（2 分钟）
3. 覆盖率解读（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
