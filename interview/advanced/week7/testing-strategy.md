### 测试策略

高级前端面试里的测试题，重点不是“会不会写 `expect`”，而是：

- 你如何划分测试层次
- 你如何判断哪些值得测
- 你如何防止测试体系拖慢交付

更好的回答方式是把测试看成质量策略的一部分，而不是工具题。

#### 1. 为什么需要测试分层

不同类型的问题，应该由不同层级的测试去发现。

如果所有问题都指望 E2E：

- 成本高
- 反馈慢
- 失败难定位

如果所有问题都只靠单测：

- 很多集成问题覆盖不到
- UI 交互和真实浏览器行为会缺失

所以更合理的思路是分层。

#### 2. 常见测试层次

##### 2.1 单元测试

目标：

- 验证纯函数、工具函数、状态转换逻辑
- 快速反馈
- 低成本覆盖边界条件

适合：

- 工具函数
- reducer
- 数据转换函数
- 自定义 Hook 中不依赖真实 DOM 的部分

##### 2.2 组件测试

目标：

- 验证组件在接近真实使用方式下的表现
- 关注渲染、交互、状态变化、可访问性

适合：

- 表单组件
- 列表组件
- 弹窗
- 数据展示组件

重点不是测内部实现，而是测用户能看到和操作到的结果。

##### 2.3 集成测试

目标：

- 验证多个模块协作是否正常
- 检查组件、状态、请求层组合后的行为

适合：

- 页面级交互
- 表单提交流程
- 路由切换后的联动逻辑

##### 2.4 E2E 测试

目标：

- 从用户视角验证关键业务流程
- 发现真实浏览器环境里的集成问题

适合：

- 登录
- 下单
- 搜索
- 支付前流程
- 权限跳转

E2E 不应该覆盖所有细枝末节，而应该覆盖最关键、最怕坏、跨层协作最复杂的主路径。

#### 3. 一个实用的测试金字塔

更稳的策略通常是：

- 大量单元测试
- 适量组件 / 集成测试
- 少量关键 E2E

这背后的原因不是教条，而是成本与反馈速度：

- 单测便宜且快
- 组件测试更接近真实使用
- E2E 最慢但最接近真实环境

#### 4. 什么值得测

不是所有代码都值得同样强度地测试。

更值得测的通常包括：

- 容易回归的逻辑
- 业务价值高的流程
- 状态组合复杂的模块
- 历史上出过事故的地方
- 外部依赖多、集成边界复杂的部分

不值得过度测试的通常包括：

- 纯静态展示且逻辑极少的页面
- 第三方库已经充分保证的内部行为
- 对实现细节绑定过深的断言

#### 5. 如何写“抗重构”的测试

好的测试应该更多关注行为，而不是实现细节。

错误方向：

- 测内部 state 变量
- 测私有方法是否被调用
- 测某个 hook 被调用几次

更稳的方向：

- 用户输入后页面如何变化
- 某个按钮是否可点击
- 错误提示是否出现
- 提交后是否发生正确请求

#### 6. Mock 的边界

Mock 是必要工具，但不能滥用。

##### 6.1 适合 Mock 的对象

- 网络请求
- 时间
- 浏览器 API
- 第三方 SDK

##### 6.2 不适合过度 Mock 的对象

- 你真正想验证的核心逻辑
- 组件之间的真实协作
- 关键用户流程

过度 Mock 的后果是测试“全绿”，真实系统一跑就坏。

#### 7. 覆盖率怎么看

覆盖率是参考指标，不是目标本身。

高覆盖率不等于高质量，因为：

- 断言可能很弱
- 关键分支可能没测到
- 只执行到了代码，不代表验证到了行为

更好的说法是：

- 用覆盖率发现明显未覆盖区域
- 不把覆盖率当唯一 KPI
- 更关注高价值逻辑是否被有效断言

#### 8. Flaky Test 怎么处理

不稳定测试是测试体系最伤团队信任的地方之一。

常见原因：

- 依赖时间
- 依赖网络
- 依赖异步时机
- 依赖全局共享状态
- 依赖脆弱选择器

常见治理方式：

- 等待真实可见状态，而不是盲等时间
- 隔离测试数据
- 减少共享环境依赖
- 稳定定位器
- 对异步行为做更明确同步

#### 9. 前端项目里的推荐工具组合

##### 9.1 单测 / 组件测试

适合用：

- Vitest
- Testing Library / Vue Test Utils

##### 9.2 E2E

适合用：

- Playwright

这类组合的优势是：

- 反馈快
- 与现代前端构建工具兼容好
- 覆盖从函数到浏览器流程的不同层次

#### 10. CI 里怎么跑测试

测试策略要和交付链路配合，而不是单独存在。

一个更合理的 CI 思路通常是：

1. PR 阶段跑 lint、单测、组件测试、构建校验
2. 主干阶段增加关键 E2E 或冒烟测试
3. 发布后观察错误监控和关键指标

这样做的原因：

- 快反馈放前面
- 高成本验证放后面
- 不让整个团队被最慢测试拖住

#### 11. 如果这个仓库继续补测试，优先补什么

当前仓库更适合先补两类内容：

1. 手写实现的单元测试
2. 文档站或关键交互的最小冒烟测试

优先级最高的候选：

- `hand-write/promise`
- `hand-write/simulate/eventEmitter.js`
- 一些工具函数和状态转换逻辑

#### 12. 高频面试题

##### 12.1 单测、组件测试、E2E 怎么分工

单测负责小逻辑和边界，组件测试负责交互和渲染行为，E2E 负责关键业务路径和真实浏览器集成问题。

##### 12.2 为什么高覆盖率不等于高质量

因为覆盖率只能说明代码被执行过，不代表关键行为被正确验证，也不代表断言足够强。

##### 12.3 为什么测试要分层

因为不同层测试的反馈速度、成本和定位能力不同。把所有问题都压给某一层，都会导致质量体系失衡。

##### 12.4 什么是好的前端测试

能稳定发现高价值问题、反馈快、对重构友好、对实现细节耦合低、在团队里可维护。

#### 13. 面试回答建议

如果被问测试策略，不要只说“我们用 Vitest 和 Playwright”。更稳的结构是：

1. 先说为什么需要测试分层
2. 再说每层测什么、不测什么
3. 再说 mock、覆盖率、flaky 的取舍
4. 最后补 CI 如何承接测试策略

这样答案会从“会写测试”升级成“会设计质量保障体系”。

## 每日练习参考

### Day 64：四层测试对比

| 层 | 粒度 | 执行时长 | 维护成本 | 典型工具 |
|----|------|----------|----------|----------|
| **单元测试** | 函数 / 类 / hook | 毫秒级 | 低 | Vitest / Jest |
| **组件测试** | 单个组件 | 秒级 | 中 | VTU / Testing Library |
| **集成测试** | 多组件 + API | 秒级 | 中高 | Vitest + MSW |
| **E2E 测试** | 完整页面流程 | 分钟级 | 高 | Playwright / Cypress |

补充层：**视觉回归**（Percy / Chromatic）—— 用截图对比检测 UI 变化。

### Day 64：测试金字塔

```text
        /\
       / E2E \        ← 少量关键路径
      /--------\
     / 集成测试  \     ← 关键页面交互
    /------------\
   / 组件测试      \   ← 复杂组件
  /----------------\
 /  单元测试         \  ← 大量纯函数 / 工具
/____________________\
```

### Day 64：每层该测什么

| 层 | 测什么 | 不测什么 |
|----|--------|----------|
| 单测 | 纯函数、工具函数、自定义 hook | 不 mock 过重、不测 DOM |
| 组件 | 渲染结果、用户交互、props/emit | 不测内部状态、不测样式细节 |
| 集成 | 页面级流程、API 联调 | 不覆盖每个分支 |
| E2E | 核心业务路径（登录/下单/支付） | 不覆盖所有排列组合 |

### Day 64：覆盖率 ≠ 质量

- 高覆盖不代表高质量：只测 happy path 也能 100% 行覆盖。
- 关注 **branch coverage**（分支覆盖）比 line coverage 更有意义。
- 覆盖率是下限指标，不是目标：80% 是通常的合理线。

### Day 64：测试策略决策树

```text
新功能上线，要写什么测试？
  ├─ 有纯函数 / 工具？→ 单元测试（优先）
  ├─ 有复杂组件（表单/表格/弹窗）？→ 组件测试
  ├─ 有多组件联动 + API？→ 集成测试（MSW mock API）
  └─ 是核心业务路径？→ E2E 测试（Playwright）

维护预算有限？
  → 砍 E2E（维护成本高、flaky）
  → 保单测 + 组件测试（ROI 最高）
```

### Day 65：Vitest 核心 API 速查

| API | 作用 |
|-----|------|
| `describe(name, fn)` | 测试组 |
| `it(name, fn)` / `test(name, fn)` | 单个测试 |
| `expect(value)` | 断言入口 |
| `beforeEach / afterEach` | 每个测试前后钩子 |
| `beforeAll / afterAll` | 整组前后钩子 |
| `it.each(table)(name, fn)` | 参数化测试 |
| `it.skip / it.only / it.todo` | 跳过 / 聚焦 / 待办 |

### Day 65：常用断言

```ts
expect(1 + 1).toBe(2)                    // 严格相等
expect({ a: 1 }).toEqual({ a: 1 })       // 深度相等
expect([1, 2, 3]).toContain(2)            // 包含
expect(fn).toHaveBeenCalledWith('arg')    // 函数被调用
expect(fn).toThrow(/error/)              // 抛错
expect(value).toBeTruthy()               // 真值
expect(value).toBeNull()                 // null
```

### Day 65：环境选择

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

### Day 65：Vitest 与 Vite 集成优势

- 共享 `vite.config.ts`（alias、plugins、TS 配置）。
- 原生 ESM + 按需编译，启动极快。
- Watch 模式只重跑受影响的测试。
- 内置 TypeScript 支持，不需要 babel。
- 兼容 Jest API（迁移成本低）。

### Day 65：完整测试示例

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

### Day 65：异步测试

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

### Day 66：Vue Test Utils 核心 API

| API | 作用 |
|-----|------|
| `mount(Component, options)` | 完整渲染（含子组件） |
| `shallowMount(Component, options)` | 浅渲染（子组件变 stub） |
| `wrapper.find(selector)` | 查找 DOM 元素 |
| `wrapper.findComponent(Comp)` | 查找子组件 |
| `wrapper.text()` | 获取文本内容 |
| `wrapper.html()` | 获取 HTML |
| `wrapper.trigger('click')` | 触发事件 |
| `wrapper.setValue(value)` | 设置 input 值 |
| `wrapper.emitted()` | 获取 emit 记录 |
| `wrapper.props()` | 获取 props |
| `wrapper.setProps(props)` | 更新 props |

### Day 66：mount options 常用字段

```ts
mount(MyComponent, {
  props: { title: 'Hello' },
  slots: { default: '<span>slot content</span>' },
  global: {
    plugins: [pinia, router],
    stubs: { ChildComponent: true },
    mocks: { $t: (key: string) => key },
    provide: { theme: 'dark' },
  },
})
```

### Day 66：断言原则：测行为不测实现

| ✅ 测 | ❌ 不测 |
|--------|---------|
| 渲染的文本 / DOM 结构 | 内部 ref / reactive 的值 |
| 用户交互后的 UI 变化 | 组件内部方法是否被调用 |
| emit 的事件和参数 | computed 的计算过程 |
| props 变化后的渲染 | watcher 的触发次数 |

### Day 66：VTU vs Testing Library

| 维度 | VTU | @testing-library/vue |
|------|-----|----------------------|
| API 风格 | 组件实例操作 | 用户视角查询 |
| 查询方式 | CSS selector / 组件引用 | getByRole / getByText |
| 适合 | 需要访问组件内部 | 纯用户行为测试 |

### Day 66：Counter 组件完整测试

```vue
<!-- Counter.vue -->
<template>
  <div>
    <span class="count">{{ count }}</span>
    <button @click="increment">+1</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
const emit = defineEmits(['change'])
function increment() {
  count.value++
  emit('change', count.value)
}
</script>
```

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('emits change event', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([1])
  })
})
```

### Day 66：Props + Slot 测试

```ts
it('renders with props and slot', () => {
  const wrapper = mount(Card, {
    props: { title: 'Hello' },
    slots: { default: '<p>body</p>' },
  })
  expect(wrapper.text()).toContain('Hello')
  expect(wrapper.html()).toContain('<p>body</p>')
})
```

### Day 66：表单测试

```ts
it('submits form data', async () => {
  const wrapper = mount(LoginForm)
  await wrapper.find('input[name="email"]').setValue('a@b.com')
  await wrapper.find('input[name="password"]').setValue('123456')
  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('submit')![0][0]).toEqual({
    email: 'a@b.com',
    password: '123456',
  })
})
```

### Day 67：Mock 三档

| 档位 | API | 行为 | 适用 |
|------|-----|------|------|
| **Spy** | `vi.spyOn(obj, 'method')` | 监听调用，保留原实现 | 验证函数是否被调用 |
| **Stub** | `vi.fn()` | 创建空替身函数 | 回调参数、事件处理 |
| **Module Mock** | `vi.mock('module')` | 替换整个模块 | 第三方依赖、API 模块 |

### Day 67：vi.spyOn

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

### Day 67：vi.fn

```ts
const onClick = vi.fn()
mount(Button, { props: { onClick } })
await wrapper.find('button').trigger('click')
expect(onClick).toHaveBeenCalledTimes(1)
```

### Day 67：vi.mock（模块级）

```ts
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1 }),
  fetchPosts: vi.fn().mockResolvedValue([]),
}))
// 整个 './api' 模块被替换
// vi.mock 会被提升到文件顶部
```

### Day 67：Mock 时间

```ts
vi.useFakeTimers()

setTimeout(() => console.log('done'), 1000)
vi.advanceTimersByTime(1000)  // 快进 1000ms

vi.useRealTimers()  // 恢复真实时间
```

### Day 67：覆盖率四个指标

| 指标 | 含义 | 重要性 |
|------|------|--------|
| **Branch** | 每个 if/else 分支都走到 | ⭐⭐⭐ 最重要 |
| **Function** | 每个函数都被调用 | ⭐⭐ |
| **Statement** | 每条语句都执行 | ⭐⭐ |
| **Line** | 每行都执行 | ⭐ 容易凑 |

### Day 67：Flaky Test 常见原因

| 原因 | 症状 | 修复 |
|------|------|------|
| 时间依赖 | 有时超时有时通过 | `vi.useFakeTimers` |
| 顺序依赖 | 单独跑通，一起跑挂 | 每个 test 独立 setup |
| 异步竞态 | 偶发失败 | `await flushPromises` / 等待条件 |
| 随机数据 | 结果不确定 | seed 或固定测试数据 |
| 环境残留 | 全局状态污染 | `afterEach` 清理 |

### Day 67：Mock fetch + 异步测试

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

### Day 67：Mock 定时器测试

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

### Day 68：Locator 选择器优先级

| 优先级 | 方法 | 示例 | 原因 |
|--------|------|------|------|
| 1 | `getByRole` | `getByRole('button', { name: '提交' })` | 语义化，贴近用户 |
| 2 | `getByLabel` | `getByLabel('用户名')` | 表单最自然 |
| 3 | `getByText` | `getByText('欢迎回来')` | 可见文本 |
| 4 | `getByTestId` | `getByTestId('submit-btn')` | 兜底方案 |
| 5 | `locator('css')` | `locator('.btn-primary')` | 最后手段 |

### Day 68：常用 expect 断言

```ts
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('首页')
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(locator).toHaveCount(3)
await expect(locator).toBeDisabled()
await expect(locator).toHaveAttribute('href', '/about')
```

### Day 68：Playwright 核心特性

| 特性 | 说明 |
|------|------|
| **Auto-wait** | 操作前自动等待元素可见 + 可交互 |
| **Retry** | 断言默认 retry 直到超时 |
| **Trace Viewer** | 记录每步截图 + 网络 + DOM，调试利器 |
| **多浏览器** | Chromium / Firefox / WebKit |
| **并行** | `workers` 控制并发数 |
| **Codegen** | `npx playwright codegen` 录制生成代码 |

### Day 68：E2E 策略原则

```text
✅ 覆盖：核心业务路径（登录/注册/下单/支付/退出）
✅ 覆盖：P0 回归（新版本必须通过的冒烟测试）
❌ 不覆盖：每个 UI 细节（用组件测试代替）
❌ 不覆盖：所有排列组合（用参数化单测代替）
```

### Day 68：完整 E2E 示例：登录流程

```ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('账号').fill('admin@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByRole('button', { name: '登录' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('欢迎回来')).toBeVisible()
  })

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('账号').fill('wrong@example.com')
    await page.getByLabel('密码').fill('wrong')
    await page.getByRole('button', { name: '登录' }).click()

    await expect(page.getByText('账号或密码错误')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})
```

### Day 68：Page Object Model

```ts
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('账号').fill(email)
    await this.page.getByLabel('密码').fill(password)
    await this.page.getByRole('button', { name: '登录' }).click()
  }
}

// tests/login.spec.ts
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('admin@example.com', 'password123')
  await expect(page).toHaveURL('/dashboard')
})
```

### Day 68：CI 配置

```yaml
# .github/workflows/e2e.yml
- name: Run E2E
  run: npx playwright test --workers=4 --reporter=html
- name: Upload trace
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-traces
    path: test-results/
```

### Day 69：测试用例矩阵方法

```text
1. 列出 API 边界：resolve / reject / then / catch / finally / all / race / allSettled / any
2. 每个 API 拆正常 + 异常 + 边界：
   - 正常路径：基本功能正确
   - 异常路径：错误被正确捕获
   - 边界：空数组 / 空值 / 多次 resolve / then 链断裂
3. 交叉场景：then 链式 + reject 穿透 / all 中一个 reject
```

### Day 69：Promise 必测用例

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

### Day 69：常见漏测

- `then` 返回一个 Promise（而不是值）—— 必须递归解包。
- `resolve(thenable)` —— thenable 对象被采用。
- 异步 resolve —— executor 中异步 resolve，then 回调是否正确入队。

### Day 69：MyPromise 完整测试

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
