# Day 68 Playwright E2E 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 68 | Playwright | [测试策略](../advanced/week7/testing-strategy)、[自动化测试](../engineering/automated-testing) |

## 今日目标

- 看完 Playwright Writing Tests 文档
- 写 1 个 E2E 样例：登录 / 跳转 / 断言关键元素
- 输出 E2E 策略：核心路径 + 灰度数据 + CI 并行

## 阅读卡点

- 选择器优先级：`getByRole > getByLabel > getByText > locator('css')`，更贴近用户
- 默认 retry + auto-wait，不要手动 sleep
- E2E 在 CI 里用 `workers` 并行，但要避免共享状态

## 速记卡 / 知识点

### Locator 选择器优先级

| 优先级 | 方法 | 示例 | 原因 |
|--------|------|------|------|
| 1 | `getByRole` | `getByRole('button', { name: '提交' })` | 语义化，贴近用户 |
| 2 | `getByLabel` | `getByLabel('用户名')` | 表单最自然 |
| 3 | `getByText` | `getByText('欢迎回来')` | 可见文本 |
| 4 | `getByTestId` | `getByTestId('submit-btn')` | 兜底方案 |
| 5 | `locator('css')` | `locator('.btn-primary')` | 最后手段 |

### 常用 expect 断言

```ts
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle('首页')
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(locator).toHaveCount(3)
await expect(locator).toBeDisabled()
await expect(locator).toHaveAttribute('href', '/about')
```

### Playwright 核心特性

| 特性 | 说明 |
|------|------|
| **Auto-wait** | 操作前自动等待元素可见 + 可交互 |
| **Retry** | 断言默认 retry 直到超时 |
| **Trace Viewer** | 记录每步截图 + 网络 + DOM，调试利器 |
| **多浏览器** | Chromium / Firefox / WebKit |
| **并行** | `workers` 控制并发数 |
| **Codegen** | `npx playwright codegen` 录制生成代码 |

### E2E 策略原则

```text
✅ 覆盖：核心业务路径（登录/注册/下单/支付/退出）
✅ 覆盖：P0 回归（新版本必须通过的冒烟测试）
❌ 不覆盖：每个 UI 细节（用组件测试代替）
❌ 不覆盖：所有排列组合（用参数化单测代替）
```

## 手写 / 流程图

### 完整 E2E 示例：登录流程

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

### Page Object Model

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

### CI 配置

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

## 口述题

### 1. E2E 应该覆盖哪些场景？

回答模板：

> 只覆盖 **核心业务路径**——用户最常走的、出 bug 影响最大的路径。比如电商的登录 → 搜索 → 加购 → 下单 → 支付。这些是 P0 路径，每次发版必须通过。
>
> 不覆盖 UI 细节和所有排列组合——那些留给组件测试和单元测试。E2E 的 ROI 在"少而精"：10-20 个关键测试比 200 个脆弱测试有价值得多。我的经验是 E2E 测试数量控制在组件测试的 1/10 左右。

### 2. E2E 最常见的"慢 + 脆"问题怎么治？

回答模板：

> "慢"的治法：第一，CI 里用 `workers` 并行跑（4-8 个 worker）。第二，每个测试独立，不依赖前一个测试的状态，可以乱序执行。第三，用 API 直接设置前置状态（比如用 API 创建用户），而不是通过 UI 操作。
>
> "脆"的治法：第一，用语义化 locator（`getByRole` / `getByLabel`）而不是 CSS selector，UI 改样式不会挂。第二，利用 Playwright 内置的 auto-wait 和 retry，不要手动 `sleep`。第三，测试数据隔离——每个测试用独立的测试账号，不共享状态。第四，失败时用 Trace Viewer 定位原因（截图 + 网络 + DOM 快照）。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. E2E 在分层中的定位 + 覆盖范围（1 分钟）
2. Locator 选择器优先级 + auto-wait + 不要 sleep（2 分钟）
3. CI 并行 + Trace Viewer 调试 + Page Object 模式（2 分钟）

录完后自查：

- 是否说出 getByRole 优先于 CSS selector。
- 是否说出 auto-wait 和 retry 机制。
- 是否说出 E2E 只覆盖 P0 核心路径。
- 是否说出 Trace Viewer 的调试价值。

## 今日复盘

今天最需要回补的 3 个点：

1. Playwright `test.use({ storageState })` 跳过登录流程的技巧。
2. Playwright Component Testing（实验性）和 Vitest 组件测试的对比。
3. 视觉回归测试（`toHaveScreenshot`）的使用场景和阈值设置。
