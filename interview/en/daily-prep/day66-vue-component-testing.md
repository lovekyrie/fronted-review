# Day 66 Vue component testing execution log

## Quick nav

| Today | Topic | Core files |
|------|------|----------|
| Day 66 | Vue component testing | [Testing strategy](../advanced/week7/testing-strategy), [Vue 3](../framework/vue/vue3) |

## Today's goals

- Finish Vue Test Utils + Vitest Vue component examples
- Write 1 component test: render, events, props, slot
- Produce a Vue component-testing strategy: test behavior, not implementation

## Reading notes

- Prefer `mount` over `shallowMount`, unless you need to isolate child components
- Assertions should circle **user-visible behavior**: `textContent / attributes / emits`
- `@testing-library/vue` gives an API closer to the user’s perspective

## Cheat sheet / knowledge

### Vue Test Utils core API

| API | Role |
|-----|------|
| `mount(Component, options)` | Full render (including children) |
| `shallowMount(Component, options)` | Shallow render (children become stubs) |
| `wrapper.find(selector)` | Find a DOM element |
| `wrapper.findComponent(Comp)` | Find a child component |
| `wrapper.text()` | Get text content |
| `wrapper.html()` | Get HTML |
| `wrapper.trigger('click')` | Trigger an event |
| `wrapper.setValue(value)` | Set an input value |
| `wrapper.emitted()` | Get emit records |
| `wrapper.props()` | Get props |
| `wrapper.setProps(props)` | Update props |

### Common mount options

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

### Assertion principle: test behavior, not implementation

| ✅ Test | ❌ Do not test |
|--------|---------|
| Rendered text / DOM structure | Internal `ref` / `reactive` values |
| UI changes after user interaction | Whether an internal method was called |
| Emitted events and payloads | How a computed is calculated |
| Render after props change | How many times a watcher fired |

### VTU vs Testing Library

| Dimension | VTU | @testing-library/vue |
|------|-----|----------------------|
| API style | Operate on the component instance | Query from the user’s view |
| Query style | CSS selector / component ref | getByRole / getByText |
| Fit | Need access to component internals | Pure user-behavior tests |

## Handwritten / flowcharts

### Full Counter component test

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

### Props + slot test

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

### Form test

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

## Oral questions

### 1. What should component tests cover, and what should they skip?

Answer template:

> Test **user-perceptible behavior**: rendered output (text, DOM structure), interaction (UI after a click), emitted events and payloads, render after props change. Do not test **internals**: do not assert `ref` values, how a computed is calculated, or whether an internal method was called.
>
> Reason: if you refactor internals (e.g. `ref` → `reactive`) but the outside behavior stays the same, tests should not fail. Asserting implementation details means “every refactor requires rewriting tests”, which raises maintenance cost.

### 2. When do you use `shallowMount`?

Answer template:

> Rarely. Default to `mount` (full render): it is closer to the real scene and covers child-component integration. Use `shallowMount` in only two cases: first, a child has side effects (requests, timers) you do not want to fire in the parent test. Second, the child is very expensive to render and slows the suite.
>
> Testing Library is more aggressive: it does not offer shallow rendering at all, on the idea that every test should fully render. My practice leans `mount`, and I only use `shallowMount` when isolation is truly needed.

## 5-minute recording order

Record in this order; do not reorganize on the spot:

1. Component-test goal (behavior, not implementation) + VTU vs Testing Library (1.5 min)
2. VTU core API (`mount`/`find`/`trigger`/`emitted`/`setValue`) (2 min)
3. Real examples (Counter + form) + when to use `shallowMount` (1.5 min)

After recording, self-check:

- Did you say “test behavior, not implementation”.
- Did you state the difference between `mount` and `shallowMount`.
- Can you talk through a complete component test case.
- Did you mention `wrapper.emitted()`.

## Today's recap

The 3 points that most need review today:

1. Testing components that use a Pinia store (`createTestingPinia`).
2. Testing components that use Vue Router (mock `useRouter` / `useRoute`).
3. Async component tests (timing of `flushPromises` / `nextTick`).
