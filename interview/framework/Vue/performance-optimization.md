### Vue.js 性能优化
Vue.js性能优化涉及多个方面，包括代码优化、渲染优化、打包优化等。

#### 1. 代码优化
##### 1.1 合理使用计算属性
```javascript
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    // 使用计算属性缓存结果
    filteredItems() {
      return this.items.filter(item => item.active);
    },
    // 避免在模板中进行复杂计算
    sortedItems() {
      return [...this.filteredItems].sort((a, b) => b.price - a.price);
    }
  }
}
```

##### 1.2 避免不必要的计算
```javascript
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    // 避免在循环中进行复杂计算
    processItems() {
      const processed = [];
      for (const item of this.items) {
        // 将复杂计算提取到方法中
        processed.push(this.processItem(item));
      }
      return processed;
    },
    processItem(item) {
      // 复杂计算逻辑
      return {
        ...item,
        processed: true
      };
    }
  }
}
```

#### 2. 渲染优化
##### 2.1 使用v-show代替v-if
```html
<!-- 频繁切换时使用v-show -->
<template>
  <div v-show="isVisible">
    <!-- 内容 -->
  </div>
</template>

<!-- 条件渲染使用v-if -->
<template>
  <div v-if="shouldRender">
    <!-- 内容 -->
  </div>
</template>
```

##### 2.2 使用key优化列表渲染
```html
<!-- 使用key优化列表渲染 -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

##### 2.3 使用虚拟滚动
```javascript
// 使用vue-virtual-scroller
import { RecycleScroller } from 'vue-virtual-scroller';

export default {
  components: {
    RecycleScroller
  },
  data() {
    return {
      items: [] // 大量数据
    }
  }
}
```

#### 3. 打包优化
##### 3.1 路由懒加载
```javascript
// 路由懒加载
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
];
```

##### 3.2 组件懒加载
```javascript
// 组件懒加载
export default {
  components: {
    MyComponent: () => import('./MyComponent.vue')
  }
}
```

##### 3.3 第三方库按需加载
```javascript
// 按需加载Element UI
import { Button, Select } from 'element-ui';

Vue.use(Button);
Vue.use(Select);
```

#### 4. 缓存优化
##### 4.1 使用keep-alive
```html
<!-- 使用keep-alive缓存组件 -->
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

##### 4.2 合理使用computed缓存
```javascript
export default {
  computed: {
    // 使用computed缓存计算结果
    expensiveComputation() {
      return this.items.reduce((sum, item) => sum + item.value, 0);
    }
  }
}
```

#### 5. 网络优化
##### 5.1 图片懒加载
```html
<!-- 使用v-lazy指令 -->
<template>
  <img v-lazy="imageUrl" />
</template>
```

##### 5.2 预加载关键资源
```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="critical.css" as="style">
```

#### 6. 最佳实践
1. 合理使用计算属性
2. 避免不必要的计算
3. 使用v-show代替v-if
4. 使用key优化列表
5. 使用虚拟滚动
6. 路由懒加载
7. 组件懒加载
8. 使用keep-alive
9. 图片懒加载
10. 预加载关键资源

#### 7. 常见面试题
1. **Vue性能优化方法**
   - 代码优化
   - 渲染优化
   - 打包优化
   - 缓存优化

2. **如何优化大型列表**
   - 使用虚拟滚动
   - 使用key
   - 避免不必要的计算
   - 使用分页加载

3. **如何优化首屏加载**
   - 路由懒加载
   - 组件懒加载
   - 预加载关键资源
   - 使用CDN加速 