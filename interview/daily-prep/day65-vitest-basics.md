# Day 65 Vitest 基础 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 65 | Vitest 基础 | [测试策略](../advanced/week7/testing-strategy)、[自动化测试](../engineering/automated-testing) |

## 今日目标

- 看完 Vitest Features
- 在仓库新建 `vitest.config.ts`，跑通一组最小测试
- 输出 Vitest 速查页：`describe / it / expect / beforeEach / vi.mock / test.each`

## 阅读卡点

- Vitest 与 Vite 配置共享，不用额外 babel/tsconfig 配合
- 环境切换：`happy-dom` / `jsdom` / `node`，前端组件测试用 `happy-dom` 更轻
- `test.each` 能大幅减少重复写法

## 速记卡 / 知识点

### Vitest 核心 API 速查

| API | 作用 |
|-----|------|
| `describe(name, fn)` | 测试组 |
| `it(name, fn)` / `test(name, fn)` | 单个测试 |
| `expect(value)` | 断言入口 |
| `beforeEach / afterEach` | 每个测试前后钩子 |
| `beforeAll / afterAll` | 整组前后钩子 |
| `it.each(table)(name, fn)` | 参数化测试 |
| `it.skip / it.only / it.todo` | 跳过 / 聚焦 / 待办 |

### 常用断言

```ts
expect(1 + 1).toBe(2)                    // 严格相等
expect({ a: 1 }).toEqual({ a: 1 })       // 深度相等
expect([1, 2, 3]).toContain(2)            // 包含
expect(fn).toHaveBeenCalledWith('arg')    // 函数被调用
expect(fn).toThrow(/error/)              // 抛错
expect(value).toBeTruthy()               // 真值
expect(value).toBeNull()                 // null
```

### 环境选择

| 环境 | 特点 | 适用 |
|------|------|------|
| `node` | 无 DOM API | 纯函数 / 工具 / API |
| `happy-dom` | 轻量 DOM 模拟，快 | Vue/React 组件测试 |
| `jsdom` | 完整 DOM 模拟，慢 | 需要完整浏览器 API |

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',  // 默认环境
  },
})

// 单文件覆盖
// @vitest-environment jsdom
```

### Vitest 与 Vite 集成优势

- 共享 `vite.config.ts`（alias、plugins、TS 配置）。
- 原生 ESM + 按需编译，启动极快。
- Watch 模式只重跑受影响的测试。
- 内置 TypeScript 支持，不需要 babel。
- 兼容 Jest API（迁移成本低）。

## 手写 / 流程图

### 完整测试示例

```ts
import { describe, it, expect, beforeEach } from 'vitest'

// 被测函数
function formatPrice(cents: number): string {
  return `¥${(cents / 100).toFixed(2)}`
}

describe('formatPrice', () => {
  // 参数化测试
  it.each([
    [0, '¥0.00'],
    [100, '¥1.00'],
    [999, '¥9.99'],
    [12345, '¥123.45'],
  ])('formatPrice(%i) = %s', (input, expected) => {
    expect(formatPrice(input)).toBe(expected)
  })

  // 边界情况
  it('handles negative values', () => {
    expect(formatPrice(-100)).toBe('¥-1.00')
  })
})
```

### 异步测试

```ts
import { it, expect, vi } from 'vitest'

it('fetches user data', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'Alice' }),
  })
  vi.stubGlobal('fetch', mockFetch)

  const res = await fetch('/api/user')
  const data = await res.json()

  expect(data.name).toBe('Alice')
  expect(mockFetch).toHaveBeenCalledWith('/api/user')

  vi.unstubAllGlobals()
})
```

## 口述题

### 1. Vitest 相比 Jest 的优势？

回答模板：

> 三个核心优势。第一，和 Vite 配置共享——alias、plugins、TS 支持都复用 `vite.config.ts`，不用单独配 babel/tsconfig，零配置开箱即用。第二，原生 ESM + 按需编译，启动速度和 watch 模式的重跑速度都比 Jest 快很多。第三，API 兼容 Jest（describe/it/expect/vi.mock），迁移成本很低。
>
> 额外优势：内置 Coverage（c8/v8）、内置 UI 面板、支持 Workspace（monorepo）、支持浏览器模式（实验性）。

### 2. 测试环境 `happy-dom` / `jsdom` 怎么选？

回答模板：

> 默认用 `happy-dom`——它是轻量级 DOM 模拟，速度比 jsdom 快 2-3 倍，覆盖了 90% 的常见 DOM API，Vue/React 组件测试够用了。只有当你遇到 happy-dom 不支持的浏览器 API（比如 `IntersectionObserver`、`Canvas`、`getComputedStyle` 的复杂行为）时，才切到 `jsdom`。
>
> 纯函数测试直接用 `node` 环境，最快。可以在 `vitest.config.ts` 设全局默认，单个文件用注释覆盖。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. Vitest 和 Vite 集成优势 + vs Jest（1.5 分钟）
2. 核心 API（describe/it/expect/beforeEach/it.each）（2 分钟）
3. 环境选择（node/happy-dom/jsdom）+ watch 模式（1.5 分钟）

录完后自查：

- 是否说出 Vitest 共享 Vite 配置。
- 是否说出 it.each 参数化测试。
- 是否说出 happy-dom 比 jsdom 快。
- 是否说出 API 兼容 Jest。

## 今日复盘

今天最需要回补的 3 个点：

1. `vi.hoisted` 的使用场景（在 `vi.mock` 中使用变量时需要 hoisting）。
2. Vitest Workspace 在 monorepo 中的配置。
3. Vitest Browser Mode 的现状和适用场景。
