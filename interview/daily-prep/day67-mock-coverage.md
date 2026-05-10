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

<!-- mock 三档 / mock 时间 / flaky test 诊断 / 覆盖率指标 (branch / function / statement / line) -->

## 手写 / 流程图

```ts
vi.useFakeTimers()
vi.spyOn(api, 'fetchUser').mockResolvedValue({ id: 1 })
```

## 口述题

### 1. 什么时候用 spyOn，什么时候用 mock？

> 回答模板：

### 2. flaky test 怎么系统性处理？

> 回答模板：

## 5 分钟录音顺序

1. mock 三档（2 分钟）
2. 时间 / fetch / 模块 mock（1.5 分钟）
3. 覆盖率与质量误区（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
