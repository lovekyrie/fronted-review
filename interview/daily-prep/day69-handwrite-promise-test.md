# Day 69 为 handwrite/promise 补测试

## 今日目标

- 看仓库 `hand-write/promise` 或 `hand-write/simulate/eventEmitter.js`
- 为其中一个实现补 Vitest 单测：正常路径 + 异常路径 + 边界
- 输出 “testing 一个库的 3 步走”：看 API 边界 → 列用例矩阵 → 补测试

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)
2. [promisify](../handwrite/promisify)
3. [手写 Promise](../handwrite/promise)

## 实操与自测

**检查点**

- 对 Promise 要测：`then / catch / finally / resolve / reject / all / race / allSettled / any`
- 对 EventEmitter 要测：`on / off / emit / once / 参数传递 / 异常隔离`
- 面试里经常问：“你测覆盖率多少？” 要能说明**覆盖率只是结果，用例矩阵才是过程**

**先独立完成，再对照专题**

- 测试用例矩阵方法 — [参考章节](../advanced/week7/testing-strategy#day-69-测试用例矩阵方法)
- Promise 必测用例 — [参考章节](../advanced/week7/testing-strategy#day-69-promise-必测用例)
- 常见漏测 — [参考章节](../advanced/week7/testing-strategy#day-69-常见漏测)
- MyPromise 完整测试 — [参考章节](../advanced/week7/testing-strategy#day-69-mypromise-完整测试)

**脱稿口述题**

- 1. 你给一个库写测试会怎么规划？
- 2. 测试里 async 流程怎么处理？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 用例矩阵方法（API 边界 → 正常/异常/边界）（1.5 分钟）
2. Promise 测试关键用例（then 链 / 值穿透 / all reject）（2 分钟）
3. 覆盖率解读 + 常见漏测点（1.5 分钟）

录完后自查：

- 是否说出用例矩阵的三步走。
- 是否说出 then 值穿透和多次 resolve 的边界。
- 是否说出 async/await 在测试中的用法。
- 是否说出覆盖率是结果，用例矩阵才是过程。

## 复盘

今天最需要回补的 3 个点：

1. `then` 返回 Promise 时的递归解包测试。
2. EventEmitter 的 `once` 和 `off` 边界测试。
3. 如何用 Vitest 的 `--coverage` 定位漏测分支。
