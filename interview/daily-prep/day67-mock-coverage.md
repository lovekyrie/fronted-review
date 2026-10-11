# Day 67 Mock / Spy / 覆盖率取舍

## 今日目标

- 看完 Vitest Mocking / Coverage
- 输出 mock 的三档：`vi.spyOn` / `vi.fn` / `vi.mock('module')`
- 写 1 个测试用例带 mock 时间、mock fetch、mock 模块

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)

## 实操与自测

**检查点**

- `vi.spyOn` 对现有方法打点，原行为保留；`vi.fn` 创建完全替身
- `vi.mock('module')` 提升到文件顶部，和 hoisting 行为配合用 `vi.hoisted`
- 覆盖率 ≠ 质量：**不测错误分支** / **不测边界** 的高覆盖没意义

**先独立完成，再对照专题**

- Mock 三档 — [参考章节](../advanced/week7/testing-strategy#day-67-mock-三档)
- vi.spyOn — [参考章节](../advanced/week7/testing-strategy#day-67-vi-spyon)
- vi.fn — [参考章节](../advanced/week7/testing-strategy#day-67-vi-fn)
- vi.mock（模块级） — [参考章节](../advanced/week7/testing-strategy#day-67-vi-mock-模块级)
- Mock 时间 — [参考章节](../advanced/week7/testing-strategy#day-67-mock-时间)
- 覆盖率四个指标 — [参考章节](../advanced/week7/testing-strategy#day-67-覆盖率四个指标)
- Flaky Test 常见原因 — [参考章节](../advanced/week7/testing-strategy#day-67-flaky-test-常见原因)
- Mock fetch + 异步测试 — [参考章节](../advanced/week7/testing-strategy#day-67-mock-fetch-异步测试)
- Mock 定时器测试 — [参考章节](../advanced/week7/testing-strategy#day-67-mock-定时器测试)

**脱稿口述题**

- 1. 什么时候用 spyOn，什么时候用 mock？
- 2. flaky test 怎么系统性处理？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Mock 三档（spyOn / fn / mock module）+ 各自适用场景（2 分钟）
2. Mock 时间 + Mock fetch 完整示例（1.5 分钟）
3. 覆盖率四指标 + flaky test 处理（1.5 分钟）

录完后自查：

- 是否说出三档的区别。
- 是否说出 vi.mock 会被提升到顶部。
- 是否说出 branch coverage 最重要。
- 是否说出 flaky test 的常见原因和修复思路。

## 复盘

今天最需要回补的 3 个点：

1. `vi.hoisted` 和 `vi.mock` 的配合（在 mock 工厂中使用外部变量）。
2. MSW（Mock Service Worker）在集成测试中替代 vi.mock 的优势。
3. 覆盖率报告的 CI 集成（增量覆盖率门槛 vs 全量覆盖率门槛）。
