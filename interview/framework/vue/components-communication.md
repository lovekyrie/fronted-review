### Vue.js 组件通信
Vue.js提供了多种组件通信方式，用于不同场景下的数据传递和事件处理。

#### 1. Props和Events
##### 1.1 Props传递
```javascript
// 父组件
<template>
  <child-component :message="parentMessage" @update="handleUpdate" />
</template>

<script>
export default {
  data() {
    return {
      parentMessage: 'Hello from parent'
    }
  },
  methods: {
    handleUpdate(newValue) {
      this.parentMessage = newValue;
    }
  }
}
</script>

// 子组件
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="updateMessage">Update</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    updateMessage() {
      this.$emit('update', 'New message');
    }
  }
}
</script>
```

##### 1.2 事件处理
```javascript
// 自定义事件
this.$emit('custom-event', data);

// 事件监听
this.$on('custom-event', this.handleEvent);

// 事件移除
this.$off('custom-event', this.handleEvent);

// 一次性事件
this.$once('custom-event', this.handleEvent);
```

#### 2. 事件总线
##### 2.1 创建事件总线
```javascript
// 创建事件总线
export const EventBus = new Vue();

// 使用事件总线
import { EventBus } from './event-bus';

// 发送事件
EventBus.$emit('event-name', data);

// 监听事件
EventBus.$on('event-name', data => {
  console.log(data);
});

// 移除事件
EventBus.$off('event-name');
```

##### 2.2 事件总线应用
```javascript
// 组件A
export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', 'Hello from A');
    }
  }
}

// 组件B
export default {
  created() {
    EventBus.$on('message', message => {
      console.log(message);
    });
  },
  beforeDestroy() {
    EventBus.$off('message');
  }
}
```

#### 3. Vuex状态管理
##### 3.1 基本使用
```javascript
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
});

// 组件中使用
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    doubleCount() {
      return this.$store.getters.doubleCount;
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment');
    },
    incrementAsync() {
      this.$store.dispatch('incrementAsync');
    }
  }
}
```

##### 3.2 模块化
```javascript
// store/modules/user.js
export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    login({ commit }, credentials) {
      // 登录逻辑
      commit('setUser', user);
    }
  }
}

// 组件中使用
export default {
  computed: {
    user() {
      return this.$store.state.user.user;
    }
  },
  methods: {
    login() {
      this.$store.dispatch('user/login', credentials);
    }
  }
}
```

#### 4. 依赖注入
##### 4.1 provide/inject
```javascript
// 父组件
export default {
  provide() {
    return {
      theme: this.theme
    }
  },
  data() {
    return {
      theme: 'dark'
    }
  }
}

// 子组件
export default {
  inject: ['theme'],
  created() {
    console.log(this.theme);
  }
}
```

##### 4.2 响应式注入
```javascript
// 父组件
export default {
  provide() {
    return {
      theme: computed(() => this.theme)
    }
  },
  data() {
    return {
      theme: 'dark'
    }
  }
}
```

#### 5. 最佳实践
1. 合理选择通信方式
2. 避免过度使用事件总线
3. 使用Vuex管理全局状态
4. 保持组件独立性
5. 使用props验证
6. 避免props突变
7. 合理使用计算属性
8. 注意性能优化
9. 保持代码简洁
10. 遵循单向数据流

#### 6. 常见面试题
1. **Vue组件通信方式**
   - Props和Events
   - 事件总线
   - Vuex状态管理
   - 依赖注入

2. **Vuex的使用场景**
   - 全局状态管理
   - 组件间共享数据
   - 复杂状态逻辑
   - 异步操作处理

3. **如何选择通信方式**
   - 父子组件用Props
   - 兄弟组件用事件总线
   - 复杂状态用Vuex
   - 深层组件用依赖注入 