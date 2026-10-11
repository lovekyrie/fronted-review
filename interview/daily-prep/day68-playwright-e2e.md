# Day 68 Playwright E2E

## 今日目标

- 看完 Playwright Writing Tests 文档
- 写 1 个 E2E 样例：登录 / 跳转 / 断言关键元素
- 输出 E2E 策略：核心路径 + 灰度数据 + CI 并行

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)
2. [自动化测试](../engineering/automated-testing)

## 实操与自测

**检查点**

- 选择器优先级：`getByRole > getByLabel > getByText > locator('css')`，更贴近用户
- 默认 retry + auto-wait，不要手动 sleep
- E2E 在 CI 里用 `workers` 并行，但要避免共享状态

**先独立完成，再对照专题**

- Locator 选择器优先级 — [参考章节](../advanced/week7/testing-strategy#day-68-locator-选择器优先级)
- 常用 expect 断言 — [参考章节](../advanced/week7/testing-strategy#day-68-常用-expect-断言)
- Playwright 核心特性 — [参考章节](../advanced/week7/testing-strategy#day-68-playwright-核心特性)
- E2E 策略原则 — [参考章节](../advanced/week7/testing-strategy#day-68-e2e-策略原则)
- 完整 E2E 示例：登录流程 — [参考章节](../advanced/week7/testing-strategy#day-68-完整-e2e-示例-登录流程)
- Page Object Model — [参考章节](../advanced/week7/testing-strategy#day-68-page-object-model)
- CI 配置 — [参考章节](../advanced/week7/testing-strategy#day-68-ci-配置)

**脱稿口述题**

- 1. E2E 应该覆盖哪些场景？
- 2. E2E 最常见的"慢 + 脆"问题怎么治？

**录音练习**

按这个顺序录，不要临场重新组织：

1. E2E 在分层中的定位 + 覆盖范围（1 分钟）
2. Locator 选择器优先级 + auto-wait + 不要 sleep（2 分钟）
3. CI 并行 + Trace Viewer 调试 + Page Object 模式（2 分钟）

录完后自查：

- 是否说出 getByRole 优先于 CSS selector。
- 是否说出 auto-wait 和 retry 机制。
- 是否说出 E2E 只覆盖 P0 核心路径。
- 是否说出 Trace Viewer 的调试价值。

## 复盘

今天最需要回补的 3 个点：

1. Playwright `test.use({ storageState })` 跳过登录流程的技巧。
2. Playwright Component Testing（实验性）和 Vitest 组件测试的对比。
3. 视觉回归测试（`toHaveScreenshot`）的使用场景和阈值设置。
