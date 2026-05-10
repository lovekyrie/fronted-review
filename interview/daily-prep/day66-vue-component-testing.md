# Day 66 Vue 组件测试 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 66 | Vue 组件测试 | [测试策略](../advanced/week7/testing-strategy)、[Vue 3](../framework/vue/vue3) |

## 今日目标

- 看完 Vue Test Utils + Vitest 的 Vue 组件示例
- 写 1 个组件测试：渲染、事件、props、slot
- 输出 Vue 组件测试策略：测行为不测实现

## 阅读卡点

- 优先用 `mount` 而不是 `shallowMount`，除非要隔离子组件
- 测试断言应围绕**用户可见行为**：`textContent / attributes / emits`
- 用 `@testing-library/vue` 能得到更接近用户视角的 API

## 速记卡 / 知识点

<!-- VTU API 清单 / 断言用户行为 / 与 Testing Library 的差异 -->

## 手写 / 流程图

```ts
import { mount } from '@vue/test-utils'
// 测试一个 counter 组件：click → count + 1 → emit('change')
```

## 口述题

### 1. 组件测试要测什么，不要测什么？

> 回答模板：

### 2. shallowMount 什么时候用？

> 回答模板：

## 5 分钟录音顺序

1. 组件测试目标（1.5 分钟）
2. VTU 基本 API（2 分钟）
3. 测试行为 vs 测试实现（1.5 分钟）

## 今日复盘

1. 
2. 
3. 
