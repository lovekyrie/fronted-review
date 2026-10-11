# Day 65 Vitest 基础

## 今日目标

- 看完 Vitest Features
- 在仓库新建 `vitest.config.ts`，跑通一组最小测试
- 输出 Vitest 速查页：`describe / it / expect / beforeEach / vi.mock / test.each`

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)
2. [自动化测试](../engineering/automated-testing)

## 实操与自测

**检查点**

- Vitest 与 Vite 配置共享，不用额外 babel/tsconfig 配合
- 环境切换：`happy-dom` / `jsdom` / `node`，前端组件测试用 `happy-dom` 更轻
- `test.each` 能大幅减少重复写法

**先独立完成，再对照专题**

- Vitest 核心 API 速查 — [参考章节](../advanced/week7/testing-strategy#day-65-vitest-核心-api-速查)
- 常用断言 — [参考章节](../advanced/week7/testing-strategy#day-65-常用断言)
- 环境选择 — [参考章节](../advanced/week7/testing-strategy#day-65-环境选择)
- Vitest 与 Vite 集成优势 — [参考章节](../advanced/week7/testing-strategy#day-65-vitest-与-vite-集成优势)
- 完整测试示例 — [参考章节](../advanced/week7/testing-strategy#day-65-完整测试示例)
- 异步测试 — [参考章节](../advanced/week7/testing-strategy#day-65-异步测试)

**脱稿口述题**

- 1. Vitest 相比 Jest 的优势？
- 2. 测试环境 `happy-dom` / `jsdom` 怎么选？

**录音练习**

按这个顺序录，不要临场重新组织：

1. Vitest 和 Vite 集成优势 + vs Jest（1.5 分钟）
2. 核心 API（describe/it/expect/beforeEach/it.each）（2 分钟）
3. 环境选择（node/happy-dom/jsdom）+ watch 模式（1.5 分钟）

录完后自查：

- 是否说出 Vitest 共享 Vite 配置。
- 是否说出 it.each 参数化测试。
- 是否说出 happy-dom 比 jsdom 快。
- 是否说出 API 兼容 Jest。

## 复盘

今天最需要回补的 3 个点：

1. `vi.hoisted` 的使用场景（在 `vi.mock` 中使用变量时需要 hoisting）。
2. Vitest Workspace 在 monorepo 中的配置。
3. Vitest Browser Mode 的现状和适用场景。
