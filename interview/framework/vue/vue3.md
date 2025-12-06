### Vue 3
Vue 3是Vue.js的最新主要版本，带来了许多新特性和改进。

#### 1. 组合式API
相较于Vue2的options API，最大的优点就是可以自定义封装hooks，就是逻辑性关联较强的代码可以整合在一块，然后更好的支持ts

##### 1.1 基本使用
```javascript
// 使用组合式API
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    // 响应式数据
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);

    // 方法
    function increment() {
      count.value++;
    }

    // 生命周期钩子
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

##### 1.2 响应式系统
```javascript
// 使用ref
const count = ref(0);
console.log(count.value); // 访问值
count.value++; // 修改值

// 使用reactive
const state = reactive({
  count: 0,
  user: {
    name: 'John'
  }
});
console.log(state.count); // 直接访问
state.count++; // 直接修改

// 使用computed
const doubleCount = computed(() => count.value * 2);

// 使用watch
watch(count, (newValue, oldValue) => {
  console.log('Count changed:', newValue, oldValue);
});
```

#### 2. 新特性
Vue3 还引入了一些内置组件和特性，方便开发者处理更复杂的UI结构和异步逻辑。

##### 2.1 Teleport
`Teleport` 允许将组件的 DOM 结构“传送”到组件树之外的节点（如 `body`）。
**场景**：模态框 (Modal)、通知 (Toast)、弹窗等，避免父组件 `overflow: hidden` 或 `z-index` 限制。

```html
<!-- 将内容传送到指定位置 -->
<template>
  <teleport to="body">
    <div class="modal">
      <!-- 模态框内容 -->
    </div>
  </teleport>
</template>
```

##### 2.2 Fragments
Vue3 支持多根节点组件，不再强制要求 `<template>` 下必须有一个根 `div` 包裹。
**好处**：减少无意义的 DOM 嵌套，HTML 结构更干净。

```html
<!-- 多根节点组件 -->
<template>
  <header>Header</header>
  <main>Main content</main>
  <footer>Footer</footer>
</template>
```

##### 2.3 Suspense
`Suspense` 是一对新的内置组件，用于协调对异步依赖的处理。
**场景**：在组件树中等待异步组件或异步数据加载时，显示加载状态（fallback 内容），待加载完成后显示默认内容。

```html
<!-- 异步组件加载 -->
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


#### 3. 性能改进
Vue3 在底层做了大量的性能优化，使得运行时性能大幅提升。

##### 3.1 虚拟DOM重写 (Block Tree)
Vue3 重写了 diff 算法。通过编译阶段的优化，Vue3 能区分静态节点和动态节点。
- **PatchFlag**：给动态节点打标（如 text, class, style），diff 时只对比这些变化点。
- **Block Tree**：将模板切分为 block，只收集动态节点，diff 时直接遍历动态节点数组，忽略静态节点，将 diff 复杂度从 O(TemplateSize) 降为 O(DynamicNodes)。

```javascript
// 更高效的虚拟DOM diff算法
const vnode = h('div', { id: 'app' }, [
  h('span', null, 'Hello'),
  h('span', null, 'World')
]);
```

##### 3.2 静态树提升 (Static Hoisting)
编译器会检测静态节点、子树甚至静态属性，将其提升到渲染函数之外。
**好处**：静态内容只会在应用启动时创建一次，后续更新直接复用，不再重复创建 VNode。

```html
<!-- 静态内容会被提升 -->
<template>
  <div>
    <h1>Static Title</h1>
    <p>Static content</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

##### 3.3 基于Proxy的响应式系统
Vue3 废弃了 `Object.defineProperty`，改用 ES6 的 `Proxy`。
**优势**：
- **全方位监听**：原生支持监听数组索引修改、数组长度变化、对象属性的新增和删除。
- **性能更优**：不需要初始化时一次性递归遍历整个对象（Vue2 是递归 defineProperty），而是按需代理（访问深层属性时才代理），初始化速度提升明显。

```javascript
// 使用Proxy实现响应式
const state = reactive({
  count: 0,
  user: {
    name: 'John'
  }
});

// 深层响应式
state.user.name = 'Jane';
```


#### 4. TypeScript支持
Vue3 源码完全使用 TypeScript 重写，提供了更好的 TS 支持。

##### 4.1 类型定义
Vue3 提供了 `defineComponent` 函数，使得组件内部逻辑（特别是 `setup` 中）能够获得完美的类型推导。
**优势**：在 IDE 中编写代码时，能获得精准的属性补全和类型检查，极大减少运行时错误。

```typescript
// 使用TypeScript
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

##### 4.2 类型推导
Vue3 的 API 设计充分考虑了类型推导。
- **ref/reactive**：能自动推导出响应式数据的类型。
- **props/emits**：在组合式 API 中声明时，能直接使用 TS 泛型或接口定义，不再需要复杂的 PropType 包装。

```typescript
// 自动类型推导
const count = ref(0); // Ref<number>
const user = ref({ name: 'John' }); // Ref<{ name: string }>
```


#### 5. 最佳实践
1. 使用组合式API
2. 合理使用响应式系统
3. 使用TypeScript
4. 使用新特性
5. 注意性能优化
6. 使用Suspense
7. 使用Teleport
8. 使用Fragments
9. 保持代码简洁
10. 遵循Vue 3规范

#### 6. 常见面试题
1. **Vue 3的主要改进**
   - 组合式API
   - 性能提升
   - TypeScript支持
   - 新特性（Teleport, Suspense等）

2. **组合式API的优势**
   - 更好的代码组织
   - 更好的类型推导
   - 更好的逻辑复用
   - 更好的测试性

3. **Vue 3的响应式系统**
   - 基于Proxy
   - 更好的性能
   - 更好的类型支持
   - 更灵活的API 