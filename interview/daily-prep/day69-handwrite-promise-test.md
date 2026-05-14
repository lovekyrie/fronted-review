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

### 测试用例矩阵方法

```text
1. 列出 API 边界：resolve / reject / then / catch / finally / all / race / allSettled / any
2. 每个 API 拆正常 + 异常 + 边界：
   - 正常路径：基本功能正确
   - 异常路径：错误被正确捕获
   - 边界：空数组 / 空值 / 多次 resolve / then 链断裂
3. 交叉场景：then 链式 + reject 穿透 / all 中一个 reject
```

### Promise 必测用例

| API | 正常 | 异常 | 边界 |
|-----|------|------|------|
| `resolve/reject` | 基本值传递 | reject 后不执行 then | 多次 resolve 只生效一次 |
| `then` | 链式返回新值 | 回调抛错 → catch | 值穿透（then 无回调） |
| `catch` | 捕获 reject | 捕获 then 中的 throw | catch 后可继续 then |
| `finally` | 无论成功失败都执行 | finally 中抛错 | 不影响链式值 |
| `all` | 全部 resolve → 结果数组 | 任一 reject → 快速失败 | 空数组 → resolve([]) |
| `race` | 第一个 settle 决定结果 | 第一个 reject → reject | 空数组 → 永远 pending |
| `allSettled` | 全部结果（含 rejected） | - | 空数组 → resolve([]) |
| `any` | 第一个 resolve → resolve | 全 reject → AggregateError | 空数组 → reject |

### 常见漏测

- `then` 返回一个 Promise（而不是值）—— 必须递归解包。
- `resolve(thenable)` —— thenable 对象被采用。
- 异步 resolve —— executor 中异步 resolve，then 回调是否正确入队。

## 手写 / 流程图

### MyPromise 完整测试

```ts
import { describe, it, expect } from 'vitest'
import { MyPromise } from './my-promise'

describe('MyPromise', () => {
  // resolve 基本
  it('resolves with value', async () => {
    const p = new MyPromise((resolve) => resolve(42))
    await expect(p).resolves.toBe(42)
  })

  // reject 基本
  it('rejects with reason', async () => {
    const p = new MyPromise((_, reject) => reject('err'))
    await expect(p).rejects.toBe('err')
  })

  // then 链式
  it('chains then calls', async () => {
    const result = await new MyPromise((resolve) => resolve(1))
      .then(v => v + 1)
      .then(v => v * 2)
    expect(result).toBe(4)
  })

  // then 值穿透
  it('passes through when then has no callback', async () => {
    const result = await new MyPromise((resolve) => resolve(42))
      .then()
      .then(v => v)
    expect(result).toBe(42)
  })

  // catch 捕获
  it('catches rejected promise', async () => {
    const result = await new MyPromise((_, reject) => reject('err'))
      .catch(e => `caught: ${e}`)
    expect(result).toBe('caught: err')
  })

  // catch 后继续 then
  it('continues chain after catch', async () => {
    const result = await new MyPromise((_, reject) => reject('err'))
      .catch(() => 'recovered')
      .then(v => v + '!')
    expect(result).toBe('recovered!')
  })

  // 多次 resolve 只生效一次
  it('ignores multiple resolve calls', async () => {
    const p = new MyPromise((resolve) => {
      resolve(1)
      resolve(2)
    })
    await expect(p).resolves.toBe(1)
  })

  // then 回调抛错
  it('catches throw in then callback', async () => {
    const result = await new MyPromise((resolve) => resolve(1))
      .then(() => { throw new Error('boom') })
      .catch(e => e.message)
    expect(result).toBe('boom')
  })
})

describe('MyPromise.all', () => {
  it('resolves all', async () => {
    const result = await MyPromise.all([
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3),
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('rejects on first failure', async () => {
    await expect(
      MyPromise.all([
        MyPromise.resolve(1),
        MyPromise.reject('err'),
        MyPromise.resolve(3),
      ])
    ).rejects.toBe('err')
  })

  it('resolves empty array', async () => {
    await expect(MyPromise.all([])).resolves.toEqual([])
  })
})
```

## 口述题

### 1. 你给一个库写测试会怎么规划？

回答模板：

> 三步走。第一步，**列 API 边界**——把库的所有公开 API 列出来，每个 API 拆分正常路径、异常路径、边界。第二步，**画用例矩阵**——把 API × 场景 画成表格，每格就是一个测试用例。第三步，**按优先级实现**——先写正常路径保证基本功能，再写异常路径保证健壮性，最后写边界保证完备性。
>
> 比如测 Promise，我会列出 resolve/reject/then/catch/finally/all/race 等 API，每个 API 至少正常 + 异常 + 边界三个用例。用 `it.each` 参数化减少重复代码。

### 2. 测试里 async 流程怎么处理？

回答模板：

> 三种方式。第一，`async/await`——最推荐，直接 `await expect(asyncFn()).resolves.toBe(value)` 或 `await expect(asyncFn()).rejects.toThrow()`。第二，返回 Promise——`it` 的回调 return 一个 Promise，Vitest 会等它 resolve。第三，用 `vi.useFakeTimers` 控制异步时序——对于 setTimeout 或 setInterval 相关的异步逻辑。
>
> 常见陷阱是忘了 await——断言没执行完测试就过了，看起来通过但实际没验证。Vitest 有 `--no-false-positive` 实验性选项帮助检测这种情况。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 用例矩阵方法（API 边界 → 正常/异常/边界）（1.5 分钟）
2. Promise 测试关键用例（then 链 / 值穿透 / all reject）（2 分钟）
3. 覆盖率解读 + 常见漏测点（1.5 分钟）

录完后自查：

- 是否说出用例矩阵的三步走。
- 是否说出 then 值穿透和多次 resolve 的边界。
- 是否说出 async/await 在测试中的用法。
- 是否说出覆盖率是结果，用例矩阵才是过程。

## 今日复盘

今天最需要回补的 3 个点：

1. `then` 返回 Promise 时的递归解包测试。
2. EventEmitter 的 `once` 和 `off` 边界测试。
3. 如何用 Vitest 的 `--coverage` 定位漏测分支。
