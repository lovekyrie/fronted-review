# Day 66 Vue component testing execution log

## Goals

- Finish Vue Test Utils + Vitest Vue component examples
- Write 1 component test: render, events, props, slot
- Produce a Vue component-testing strategy: test behavior, not implementation

## Read in order

1. [Testing strategy](../advanced/week7/testing-strategy)
2. [Vue 3](../framework/vue/vue3)

## Practice and self-check

**Checkpoints**

- Prefer `mount` over `shallowMount`, unless you need to isolate child components
- Assertions should circle **user-visible behavior**: `textContent / attributes / emits`
- `@testing-library/vue` gives an API closer to the user’s perspective

**Produce or redraw from memory**

- Vue Test Utils core API — [reference section](../advanced/week7/testing-strategy#day-66-vue-test-utils-core-api)
- Common mount options — [reference section](../advanced/week7/testing-strategy#day-66-common-mount-options)
- Assertion principle: test behavior, not implementation — [reference section](../advanced/week7/testing-strategy#day-66-assertion-principle-test-behavior-not-implementation)
- VTU vs Testing Library — [reference section](../advanced/week7/testing-strategy#day-66-vtu-vs-testing-library)
- Full Counter component test — [reference section](../advanced/week7/testing-strategy#day-66-full-counter-component-test)
- Props + slot test — [reference section](../advanced/week7/testing-strategy#day-66-props-slot-test)
- Form test — [reference section](../advanced/week7/testing-strategy#day-66-form-test)

**Answer aloud without reading a reference answer**

- 1. What should component tests cover, and what should they skip?
- 2. When do you use `shallowMount`?

**Recording drill**

Record in this order; do not reorganize on the spot:

1. Component-test goal (behavior, not implementation) + VTU vs Testing Library (1.5 min)
2. VTU core API (`mount`/`find`/`trigger`/`emitted`/`setValue`) (2 min)
3. Real examples (Counter + form) + when to use `shallowMount` (1.5 min)

After recording, self-check:

- Did you say “test behavior, not implementation”.
- Did you state the difference between `mount` and `shallowMount`.
- Can you talk through a complete component test case.
- Did you mention `wrapper.emitted()`.

## Recap

The 3 points that most need review today:

1. Testing components that use a Pinia store (`createTestingPinia`).
2. Testing components that use Vue Router (mock `useRouter` / `useRoute`).
3. Async component tests (timing of `flushPromises` / `nextTick`).
