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

### Vue Test Utils 核心 API

| API | 作用 |
|-----|------|
| `mount(Component, options)` | 完整渲染（含子组件） |
| `shallowMount(Component, options)` | 浅渲染（子组件变 stub） |
| `wrapper.find(selector)` | 查找 DOM 元素 |
| `wrapper.findComponent(Comp)` | 查找子组件 |
| `wrapper.text()` | 获取文本内容 |
| `wrapper.html()` | 获取 HTML |
| `wrapper.trigger('click')` | 触发事件 |
| `wrapper.setValue(value)` | 设置 input 值 |
| `wrapper.emitted()` | 获取 emit 记录 |
| `wrapper.props()` | 获取 props |
| `wrapper.setProps(props)` | 更新 props |

### mount options 常用字段

```ts
mount(MyComponent, {
  props: { title: 'Hello' },
  slots: { default: '<span>slot content</span>' },
  global: {
    plugins: [pinia, router],
    stubs: { ChildComponent: true },
    mocks: { $t: (key: string) => key },
    provide: { theme: 'dark' },
  },
})
```

### 断言原则：测行为不测实现

| ✅ 测 | ❌ 不测 |
|--------|---------|
| 渲染的文本 / DOM 结构 | 内部 ref / reactive 的值 |
| 用户交互后的 UI 变化 | 组件内部方法是否被调用 |
| emit 的事件和参数 | computed 的计算过程 |
| props 变化后的渲染 | watcher 的触发次数 |

### VTU vs Testing Library

| 维度 | VTU | @testing-library/vue |
|------|-----|----------------------|
| API 风格 | 组件实例操作 | 用户视角查询 |
| 查询方式 | CSS selector / 组件引用 | getByRole / getByText |
| 适合 | 需要访问组件内部 | 纯用户行为测试 |

## 手写 / 流程图

### Counter 组件完整测试

```vue
<!-- Counter.vue -->
<template>
  <div>
    <span class="count">{{ count }}</span>
    <button @click="increment">+1</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
const emit = defineEmits(['change'])
function increment() {
  count.value++
  emit('change', count.value)
}
</script>
```

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('increments on click', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('emits change event', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')![0]).toEqual([1])
  })
})
```

### Props + Slot 测试

```ts
it('renders with props and slot', () => {
  const wrapper = mount(Card, {
    props: { title: 'Hello' },
    slots: { default: '<p>body</p>' },
  })
  expect(wrapper.text()).toContain('Hello')
  expect(wrapper.html()).toContain('<p>body</p>')
})
```

### 表单测试

```ts
it('submits form data', async () => {
  const wrapper = mount(LoginForm)
  await wrapper.find('input[name="email"]').setValue('a@b.com')
  await wrapper.find('input[name="password"]').setValue('123456')
  await wrapper.find('form').trigger('submit')

  expect(wrapper.emitted('submit')![0][0]).toEqual({
    email: 'a@b.com',
    password: '123456',
  })
})
```

## 口述题

### 1. 组件测试要测什么，不要测什么？

回答模板：

> 测**用户能感知的行为**：渲染结果（文本、DOM 结构）、交互响应（点击后 UI 变化）、emit 的事件和参数、props 变化后的渲染。不测**内部实现**：不断言 ref 的值、不断言 computed 的计算过程、不断言内部方法是否被调用。
>
> 原因是：如果你重构了组件内部实现（比如把 ref 换成 reactive），但外部行为不变，测试不应该挂。测实现细节会导致"重构就要改测试"，增加维护成本。

### 2. shallowMount 什么时候用？

回答模板：

> 很少用。默认用 `mount`（完整渲染），因为它更接近真实场景，能覆盖子组件的集成行为。只在两种场景用 `shallowMount`：第一，子组件有副作用（比如发请求、启动定时器），你不想在父组件测试中触发。第二，子组件渲染非常重，影响测试速度。
>
> Testing Library 的哲学更激进：完全不提供 shallow 渲染，认为所有测试都应该完整渲染。我的实践是偏向 mount，只在确实需要隔离时用 shallowMount。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 组件测试目标（测行为不测实现）+ VTU vs Testing Library（1.5 分钟）
2. VTU 核心 API（mount/find/trigger/emitted/setValue）（2 分钟）
3. 实际示例（Counter + 表单）+ shallowMount 使用场景（1.5 分钟）

录完后自查：

- 是否说出"测行为不测实现"。
- 是否说出 mount 和 shallowMount 的区别。
- 是否能口述一个完整的组件测试用例。
- 是否说出 `wrapper.emitted()` 的用法。

## 今日复盘

今天最需要回补的 3 个点：

1. 测试带 Pinia store 的组件（`createTestingPinia` 的用法）。
2. 测试带 Vue Router 的组件（mock `useRouter` / `useRoute`）。
3. 异步组件测试（`flushPromises` / `nextTick` 的时机）。
