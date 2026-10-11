# Day 66 Vue 组件测试

## 今日目标

- 看完 Vue Test Utils + Vitest 的 Vue 组件示例
- 写 1 个组件测试：渲染、事件、props、slot
- 输出 Vue 组件测试策略：测行为不测实现

## 按顺序阅读

1. [测试策略](../advanced/week7/testing-strategy)
2. [Vue 3](../framework/vue/vue3)

## 实操与自测

**检查点**

- 优先用 `mount` 而不是 `shallowMount`，除非要隔离子组件
- 测试断言应围绕**用户可见行为**：`textContent / attributes / emits`
- 用 `@testing-library/vue` 能得到更接近用户视角的 API

**先独立完成，再对照专题**

- Vue Test Utils 核心 API — [参考章节](../advanced/week7/testing-strategy#day-66-vue-test-utils-核心-api)
- mount options 常用字段 — [参考章节](../advanced/week7/testing-strategy#day-66-mount-options-常用字段)
- 断言原则：测行为不测实现 — [参考章节](../advanced/week7/testing-strategy#day-66-断言原则-测行为不测实现)
- VTU vs Testing Library — [参考章节](../advanced/week7/testing-strategy#day-66-vtu-vs-testing-library)
- Counter 组件完整测试 — [参考章节](../advanced/week7/testing-strategy#day-66-counter-组件完整测试)
- Props + Slot 测试 — [参考章节](../advanced/week7/testing-strategy#day-66-props-slot-测试)
- 表单测试 — [参考章节](../advanced/week7/testing-strategy#day-66-表单测试)

**脱稿口述题**

- 1. 组件测试要测什么，不要测什么？
- 2. shallowMount 什么时候用？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 组件测试目标（测行为不测实现）+ VTU vs Testing Library（1.5 分钟）
2. VTU 核心 API（mount/find/trigger/emitted/setValue）（2 分钟）
3. 实际示例（Counter + 表单）+ shallowMount 使用场景（1.5 分钟）

录完后自查：

- 是否说出"测行为不测实现"。
- 是否说出 mount 和 shallowMount 的区别。
- 是否能口述一个完整的组件测试用例。
- 是否说出 `wrapper.emitted()` 的用法。

## 复盘

今天最需要回补的 3 个点：

1. 测试带 Pinia store 的组件（`createTestingPinia` 的用法）。
2. 测试带 Vue Router 的组件（mock `useRouter` / `useRoute`）。
3. 异步组件测试（`flushPromises` / `nextTick` 的时机）。
