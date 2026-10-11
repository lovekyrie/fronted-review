# Day 64 测试分层

## 今日目标

- 看完 Vitest / Playwright / 官方分层模型（单测 / 集成 / E2E / 视觉）
- 输出四层测试策略对比表：粒度、执行时长、维护成本、典型工具
- 输出“不应该测什么”的答题稿

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)
2. [自动化测试](../engineering/automated-testing)

## 实操与自测

**检查点**

- 测试金字塔：底层多、顶层少；E2E 不是越多越好
- 单测关注**纯函数与小单元**，不应该做过重的 mock
- 视觉回归（Percy / Chromatic）用于 UI 组件库

**先独立完成，再对照专题**

- 四层测试对比 — [参考章节](../advanced/week7/testing-strategy#day-64-四层测试对比)
- 测试金字塔 — [参考章节](../advanced/week7/testing-strategy#day-64-测试金字塔)
- 每层该测什么 — [参考章节](../advanced/week7/testing-strategy#day-64-每层该测什么)
- 覆盖率 ≠ 质量 — [参考章节](../advanced/week7/testing-strategy#day-64-覆盖率-质量)
- 测试策略决策树 — [参考章节](../advanced/week7/testing-strategy#day-64-测试策略决策树)

**脱稿口述题**

- 1. 测试分层怎么讲才像工程视角？
- 2. 什么代码不值得测？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 测试金字塔 + 四层职责（1.5 分钟）
2. 每层该测什么 / 不该测什么 + 工具选型（2 分钟）
3. 覆盖率误区 + ROI 思维（1.5 分钟）

录完后自查：

- 是否说出四层的粒度和典型工具。
- 是否说出"测行为不测实现"。
- 是否说出覆盖率是下限不是目标。
- 是否说出 E2E 只覆盖 P0 路径。

## 复盘

今天最需要回补的 3 个点：

1. Testing Trophy（Kent C. Dodds 的倒金字塔模型）和传统金字塔的区别。
2. Contract Testing（契约测试）在前后端分离项目中的价值。
3. 如何在 CI 中设置覆盖率门槛（增量覆盖率 vs 全量覆盖率）。
