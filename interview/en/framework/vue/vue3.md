### Vue 3
Vue 3 is the latest major version of Vue.js and brings many new features and improvements.

#### 1. Composition API
Compared with Vue 2's Options API, the biggest advantage is that you can extract custom hooks: closely related logic can live together, with better TypeScript support.

##### 1.1 Basic usage
```javascript
// Using the Composition API
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    // Reactive data
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);

    // Methods
    function increment() {
      count.value++;
    }

    // Lifecycle hooks
    onMounted(() => {
      console.log('Component mounted');
    });

    return {
      count,
      doubleCount,
      increment
    };
  }
}
```

##### 1.2 Reactivity system
```javascript
// Using ref
const count = ref(0);
console.log(count.value); // Access the value
count.value++; // Mutate the value

// Using reactive
const state = reactive({
  count: 0,
  user: {
    name: 'John'
  }
});
console.log(state.count); // Access directly
state.count++; // Mutate directly

// Using computed
const doubleCount = computed(() => count.value * 2);

// Using watch
watch(count, (newValue, oldValue) => {
  console.log('Count changed:', newValue, oldValue);
});
```

#### 2. New features
Vue 3 also introduces built-in components and features that make complex UI structures and async logic easier to handle.

##### 2.1 Teleport
`Teleport` lets you "teleport" a component's DOM to a node outside the component tree (such as `body`).
**Use cases**: modals, toasts, popovers, and similar UI, to avoid parent `overflow: hidden` or `z-index` constraints.

```html
<!-- Teleport content to a specified location -->
<template>
  <teleport to="body">
    <div class="modal">
      <!-- Modal content -->
    </div>
  </teleport>
</template>
```

##### 2.2 Fragments
Vue 3 supports multi-root components. You no longer need a single wrapping root `div` under `<template>`.
**Benefit**: less meaningless DOM nesting and cleaner HTML.

```html
<!-- Multi-root component -->
<template>
  <header>Header</header>
  <main>Main content</main>
  <footer>Footer</footer>
</template>
```

##### 2.3 Suspense
`Suspense` is a new built-in component used to coordinate async dependencies.
**Use cases**: while waiting for async components or async data in the component tree, show a loading state (fallback content), then show the default content once loading finishes.

```html
<!-- Async component loading -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```


#### 3. Performance improvements
Vue 3 made extensive low-level performance optimizations and significantly improved runtime performance.

##### 3.1 Virtual DOM rewrite (Block Tree)
Vue 3 rewrote the diff algorithm. Through compile-time optimizations, Vue 3 can distinguish static nodes from dynamic nodes.
- **PatchFlag**: marks dynamic nodes (such as text, class, style); during diff, only these change points are compared.
- **Block Tree**: splits the template into blocks and only collects dynamic nodes. During diff, it walks the dynamic-node array and ignores static nodes, reducing diff complexity from O(TemplateSize) to O(DynamicNodes).

```javascript
// More efficient virtual DOM diff algorithm
const vnode = h('div', { id: 'app' }, [
  h('span', null, 'Hello'),
  h('span', null, 'World')
]);
```

##### 3.2 Static tree hoisting
The compiler detects static nodes, subtrees, and even static props, and hoists them out of the render function.
**Benefit**: static content is created once at app startup and reused on later updates, without recreating VNodes.

```html
<!-- Static content will be hoisted -->
<template>
  <div>
    <h1>Static Title</h1>
    <p>Static content</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

##### 3.3 Proxy-based reactivity
Vue 3 dropped `Object.defineProperty` in favor of ES6 `Proxy`.
**Advantages**:
- **Complete coverage**: native support for watching array index mutations, array length changes, and adding/deleting object properties.
- **Better performance**: no need to recursively walk the entire object at init time (Vue 2 recursively used defineProperty). Instead it proxies on demand (deep properties are proxied only when accessed), so initialization is noticeably faster.

```javascript
// Implement reactivity with Proxy
const state = reactive({
  count: 0,
  user: {
    name: 'John'
  }
});

// Deep reactivity
state.user.name = 'Jane';
```


#### 4. TypeScript support
Vue 3's source is fully rewritten in TypeScript and provides better TS support.

##### 4.1 Type definitions
Vue 3 provides `defineComponent`, so component internals (especially `setup`) get excellent type inference.
**Benefit**: precise property completion and type checking in the IDE, greatly reducing runtime errors.

```typescript
// Using TypeScript
import { defineComponent, ref } from 'vue';

interface User {
  id: number;
  name: string;
}

export default defineComponent({
  setup() {
    const user = ref<User>({
      id: 1,
      name: 'John'
    });

    return {
      user
    };
  }
});
```

##### 4.2 Type inference
Vue 3's APIs are designed with type inference in mind.
- **ref/reactive**: automatically infer the types of reactive data.
- **props/emits**: when declared in the Composition API, you can use TS generics or interfaces directly, without wrapping everything in PropType.

```typescript
// Automatic type inference
const count = ref(0); // Ref<number>
const user = ref({ name: 'John' }); // Ref<{ name: string }>
```


#### 5. Best practices
1. Use the Composition API
2. Use the reactivity system appropriately
3. Use TypeScript
4. Use the new features
5. Pay attention to performance
6. Use Suspense
7. Use Teleport
8. Use Fragments
9. Keep the code concise
10. Follow Vue 3 conventions

#### 6. Common interview questions
1. **Vue 3's main improvements**
   - Composition API
   - Performance
   - TypeScript support
   - New features (Teleport, Suspense, etc.)

2. **Advantages of the Composition API**
   - Better code organization
   - Better type inference
   - Better logic reuse
   - Better testability

3. **Vue 3's reactivity system**
   - Based on Proxy
   - Better performance
   - Better type support
   - More flexible APIs

#### 7. High-frequency gaps (often follow-up questions)

##### 7.1 How to choose between ref and reactive
- Prefer `ref` for primitives.
- For objects either works, but teams usually pick one style and stick to it.
- In templates, `ref` auto-unwraps; in JS logic you need `.value`.

##### 7.2 Difference between watch and watchEffect
- `watch`: explicitly specify the source, get `newValue/oldValue`, more controllable.
- `watchEffect`: auto-collects dependencies and runs immediately; good for quickly binding side effects.

```javascript
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);
  }
);
```

##### 7.3 Why you cannot use this in setup
When `setup` runs, the component instance is not created yet, so `this` is `undefined`.  
A good interview answer: the Composition API organizes logic via explicit imports and return values, and does not rely on `this`.

##### 7.4 Lifecycle mapping (Vue 2 -> Vue 3)
- `beforeCreate/created` -> `setup`
- `mounted` -> `onMounted`
- `beforeDestroy/destroyed` -> `onBeforeUnmount/onUnmounted`

##### 7.5 Common reactivity pitfalls
1. Destructuring a reactive object loses reactivity (use `toRefs`).
2. When replacing nested objects, watch reference changes and watch options.
3. Composables must clean up side effects (event listeners, timers).
