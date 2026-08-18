### Vue.js Performance Optimization
Vue.js performance optimization covers several areas, including code optimization, render optimization, and bundle optimization.

#### 1. Code optimization
##### 1.1 Use computed properties appropriately
```javascript
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    // Cache the result with a computed property
    filteredItems() {
      return this.items.filter(item => item.active);
    },
    // Avoid complex calculations in the template
    sortedItems() {
      return [...this.filteredItems].sort((a, b) => b.price - a.price);
    }
  }
}
```

##### 1.2 Avoid unnecessary computation
```javascript
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    // Avoid complex calculations inside loops
    processItems() {
      const processed = [];
      for (const item of this.items) {
        // Extract complex calculations into a method
        processed.push(this.processItem(item));
      }
      return processed;
    },
    processItem(item) {
      // Complex calculation logic
      return {
        ...item,
        processed: true
      };
    }
  }
}
```

#### 2. Render optimization
##### 2.1 Use v-show instead of v-if
v-if sets the element's `display: none`, while v-show sets `visibility: hidden`, which reduces page rendering.
```html
<!-- Use v-show when toggling frequently -->
<template>
  <div v-show="isVisible">
    <!-- Content -->
  </div>
</template>

<!-- Use v-if for conditional rendering -->
<template>
  <div v-if="shouldRender">
    <!-- Content -->
  </div>
</template>
```

##### 2.2 Use key to optimize list rendering
```html
<!-- Use key to optimize list rendering -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

##### 2.3 Use virtual scrolling
```javascript
// Use vue-virtual-scroller
import { RecycleScroller } from 'vue-virtual-scroller';

export default {
  components: {
    RecycleScroller
  },
  data() {
    return {
      items: [] // Large dataset
    }
  }
}
```

#### 3. Bundle optimization
##### 3.1 Route lazy loading
```javascript
// Route lazy loading
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
];
```

##### 3.2 Component lazy loading
```javascript
// Component lazy loading
export default {
  components: {
    MyComponent: () => import('./MyComponent.vue')
  }
}
```

##### 3.3 Load third-party libraries on demand
```javascript
// Load Element UI on demand
import { Button, Select } from 'element-ui';

Vue.use(Button);
Vue.use(Select);
```

#### 4. Cache optimization
##### 4.1 Use keep-alive
```html
<!-- Cache components with keep-alive -->
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

##### 4.2 Use computed caching appropriately
```javascript
export default {
  computed: {
    // Cache the computed result with computed
    expensiveComputation() {
      return this.items.reduce((sum, item) => sum + item.value, 0);
    }
  }
}
```

#### 5. Network optimization
##### 5.1 Image lazy loading
```html
<!-- Use the v-lazy directive -->
<template>
  <img v-lazy="imageUrl" />
</template>
```

##### 5.2 Preload critical resources
```html
<!-- Preload critical resources -->
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="critical.css" as="style">
```

#### 6. Best practices
1. Use computed properties appropriately
2. Avoid unnecessary computation
3. Use v-show instead of v-if
4. Use key to optimize lists
5. Use virtual scrolling
6. Route lazy loading
7. Component lazy loading
8. Use keep-alive
9. Image lazy loading
10. Preload critical resources

#### 7. Common interview questions
1. **Vue performance optimization techniques**
   - Code optimization
   - Render optimization
   - Bundle optimization
   - Cache optimization

2. **How to optimize large lists**
   - Use virtual scrolling
   - Use key
   - Avoid unnecessary computation
   - Load data with pagination

3. **How to optimize first-screen loading**
   - Route lazy loading
   - Component lazy loading
   - Preload critical resources
   - Use a CDN for faster delivery
