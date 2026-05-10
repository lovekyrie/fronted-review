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

<!-- Vitest 核心 API / 环境选择 / TS 支持 / watch 模式 -->

## 手写 / 流程图

```ts
import { describe, it, expect } from 'vitest'
describe('add', () => {
  it.each([[1, 2, 3], [4, 5, 9]])('%i + %i = %i', (a, b, r) => {
    expect(a + b).toBe(r)
  })
})
```

## 口述题

### 1. Vitest 相比 Jest 的优势？

> 回答模板：

### 2. 测试环境 `happy-dom` / `jsdom` 怎么选？

> 回答模板：

## 5 分钟录音顺序

1. Vitest 和 Vite 集成（1.5 分钟）
2. 核心 API（2 分钟）
3. 环境选择 + watch（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
