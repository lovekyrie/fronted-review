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

<!-- 常用 locator / expect API / trace viewer 调试 / CI 集成 -->

## 手写 / 流程图

```ts
import { test, expect } from '@playwright/test'
test('login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('账号').fill('demo')
  await page.getByLabel('密码').fill('demo')
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page).toHaveURL('/dashboard')
})
```

## 口述题

### 1. E2E 应该覆盖哪些场景？

> 回答模板：

### 2. E2E 最常见的“慢 + 脆”问题怎么治？

> 回答模板：

## 5 分钟录音顺序

1. E2E 定位（1 分钟）
2. Locator 策略 + auto-wait（2 分钟）
3. CI 并行 + trace viewer（2 分钟）

## 今日复盘

1. 
2. 
3. 
