# Day 67 Mock / Spy / 覆盖率取舍 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 67 | Mock / 覆盖率 | [测试策略](../advanced/week7/testing-strategy) |

## 今日目标

- 看完 Vitest Mocking / Coverage
- 输出 mock 的三档：`vi.spyOn` / `vi.fn` / `vi.mock('module')`
- 写 1 个测试用例带 mock 时间、mock fetch、mock 模块

## 阅读卡点

- `vi.spyOn` 对现有方法打点，原行为保留；`vi.fn` 创建完全替身
- `vi.mock('module')` 提升到文件顶部，和 hoisting 行为配合用 `vi.hoisted`
- 覆盖率 ≠ 质量：**不测错误分支** / **不测边界** 的高覆盖没意义

## 速记卡 / 知识点

### Mock 三档

| 档位 | API | 行为 | 适用 |
|------|-----|------|------|
| **Spy** | `vi.spyOn(obj, 'method')` | 监听调用，保留原实现 | 验证函数是否被调用 |
| **Stub** | `vi.fn()` | 创建空替身函数 | 回调参数、事件处理 |
| **Module Mock** | `vi.mock('module')` | 替换整个模块 | 第三方依赖、API 模块 |

### vi.spyOn

```ts
import * as api from './api'

const spy = vi.spyOn(api, 'fetchUser')
// 保留原实现，只监听
spy.mockResolvedValue({ id: 1, name: 'Alice' })
// 替换返回值

await api.fetchUser(1)
expect(spy).toHaveBeenCalledWith(1)

spy.mockRestore()  // 恢复原实现
```

### vi.fn

```ts
const onClick = vi.fn()
mount(Button, { props: { onClick } })
await wrapper.find('button').trigger('click')
expect(onClick).toHaveBeenCalledTimes(1)
```

### vi.mock（模块级）

```ts
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
  fetchPosts: vi.fn().mockResolvedValue([]),
}))
// 整个 './api' 模块被替换
// vi.mock 会被提升到文件顶部
```

### Mock 时间

```ts
vi.useFakeTimers()

setTimeout(() => console.log('done'), 1000)
vi.advanceTimersByTime(1000)  // 快进 1000ms

vi.useRealTimers()  // 恢复真实时间
```

### 覆盖率四个指标

| 指标 | 含义 | 重要性 |
|------|------|--------|
| **Branch** | 每个 if/else 分支都走到 | ⭐⭐⭐ 最重要 |
| **Function** | 每个函数都被调用 | ⭐⭐ |
| **Statement** | 每条语句都执行 | ⭐⭐ |
| **Line** | 每行都执行 | ⭐ 容易凑 |

### Flaky Test 常见原因

| 原因 | 症状 | 修复 |
|------|------|------|
| 时间依赖 | 有时超时有时通过 | `vi.useFakeTimers` |
| 顺序依赖 | 单独跑通，一起跑挂 | 每个 test 独立 setup |
| 异步竞态 | 偶发失败 | `await flushPromises` / 等待条件 |
| 随机数据 | 结果不确定 | seed 或固定测试数据 |
| 环境残留 | 全局状态污染 | `afterEach` 清理 |

## 手写 / 流程图

### Mock fetch + 异步测试

```ts
import { it, expect, vi } from 'vitest'
import { fetchUserName } from './user-service'

vi.mock('./api', () => ({
  fetchUser: vi.fn(),
}))

import { fetchUser } from './api'

it('returns user name', async () => {
  vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: 'Alice' })

  const name = await fetchUserName(1)
  expect(name).toBe('Alice')
  expect(fetchUser).toHaveBeenCalledWith(1)
})
```

### Mock 定时器测试

```ts
import { it, expect, vi } from 'vitest'

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

it('debounce calls fn after delay', () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = debounce(fn, 300)

  debounced('a')
  debounced('b')
  debounced('c')

  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(300)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith('c')

  vi.useRealTimers()
})
```

## 口述题

### 1. 什么时候用 spyOn，什么时候用 mock？

回答模板：

> `spyOn` 用于"监听但不改变"——你想知道一个函数是否被调用、参数是什么，但不想替换它的实现。比如监听 `console.error` 验证错误处理。如果需要替换返回值，可以链式调用 `mockReturnValue`。
>
> `vi.fn` / `vi.mock` 用于"完全替换"——你不想让真实逻辑执行。比如 mock 掉 API 请求避免真实网络调用，或者 mock 掉整个模块（`vi.mock('axios')`）。模块级 mock 会被提升到文件顶部，适合替换第三方依赖。
>
> 原则：能 spy 就 spy（保留原实现更安全），必须隔离外部依赖时才 mock。

### 2. flaky test 怎么系统性处理？

回答模板：

> 四步。第一，**识别**——CI 中标记 flaky test（连续跑 3 次，有时过有时挂）。第二，**分类**——看是时间依赖（用 fake timer 修）、顺序依赖（每个 test 独立 setup 修）、异步竞态（加 await / 轮询等待修）、还是环境残留（afterEach 清理修）。第三，**修复**——按分类对症下药。第四，**预防**——CI 加 retry 兜底（但不是根治）、每个 test 必须独立可重复、禁止依赖真实网络和时间。
>
> 最常见的原因是异步没等完——用 `flushPromises` 或 Testing Library 的 `waitFor` 确保 DOM 更新完再断言。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Mock 三档（spyOn / fn / mock module）+ 各自适用场景（2 分钟）
2. Mock 时间 + Mock fetch 完整示例（1.5 分钟）
3. 覆盖率四指标 + flaky test 处理（1.5 分钟）

录完后自查：

- 是否说出三档的区别。
- 是否说出 vi.mock 会被提升到顶部。
- 是否说出 branch coverage 最重要。
- 是否说出 flaky test 的常见原因和修复思路。

## 今日复盘

今天最需要回补的 3 个点：

1. `vi.hoisted` 和 `vi.mock` 的配合（在 mock 工厂中使用外部变量）。
2. MSW（Mock Service Worker）在集成测试中替代 vi.mock 的优势。
3. 覆盖率报告的 CI 集成（增量覆盖率门槛 vs 全量覆盖率门槛）。
