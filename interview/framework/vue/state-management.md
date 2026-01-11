### Vue.js 状态管理
Vue.js提供了Vuex和Pinia两种状态管理方案，用于管理应用中的全局状态。

#### 1. Vuex
##### 1.1 基本概念
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
```

##### 1.2 核心概念
```javascript
// State
state: {
  count: 0,
  todos: []
}

// Getters
getters: {
  doneTodos: state => {
    return state.todos.filter(todo => todo.done);
  },
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length;
  }
}

// Mutations
mutations: {
  increment(state, payload) {
    state.count += payload.amount;
  }
}

// Actions
actions: {
  incrementAsync({ commit }, payload) {
    setTimeout(() => {
      commit('increment', payload);
    }, 1000);
  }
}
```

##### 1.3 模块化
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

// store/index.js
import user from './modules/user';

export default new Vuex.Store({
  modules: {
    user
  }
});
```

#### 2. Pinia
##### 2.1 基本使用
```javascript
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    },
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.count++;
    }
  }
});
```

##### 2.2 组合式API
```javascript
// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoggedIn = computed(() => !!user.value);

  function login(credentials) {
    // 登录逻辑
    user.value = { /* user data */ };
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    isLoggedIn,
    login,
    logout
  };
});
```

##### 2.3 模块化
```javascript
// stores/index.js
import { useCounterStore } from './counter';
import { useUserStore } from './user';

export {
  useCounterStore,
  useUserStore
};
```

#### 3. 使用对比
##### 3.1 Vuex使用

**1. 基础使用方式**
通过 `this.$store` 直接访问。

```javascript
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
      this.$store.commit('increment'); // 提交 mutation
    },
    incrementAsync() {
      this.$store.dispatch('incrementAsync'); // 分发 action
    }
  }
}
```

**2. 辅助函数（缩写方式）**
使用 `mapState`, `mapGetters`, `mapActions`, `mapMutations` 简化代码。

```javascript
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    // 映射 state.count 为 this.count
    ...mapState(['count']),
    // 映射 getters.doubleCount 为 this.doubleCount
    ...mapGetters(['doubleCount']),
    
    // 如果是带命名空间的模块：
    // ...mapState('user', ['userInfo']),
  },
  methods: {
    // 映射 this.increment() 为 this.$store.commit('increment')
    ...mapMutations(['increment']),
    // 映射 this.incrementAsync() 为 this.$store.dispatch('incrementAsync')
    ...mapActions(['incrementAsync']),
    
    // 也可以重命名：
    // ...mapActions({ addAsync: 'incrementAsync' })
  }
}
```

##### 3.2 Pinia使用
```javascript
// 组件中使用Pinia
import { useCounterStore } from '@/stores';

export default {
  setup() {
    const counter = useCounterStore();

    return {
      count: computed(() => counter.count),
      doubleCount: computed(() => counter.doubleCount),
      increment: () => counter.increment(),
      incrementAsync: () => counter.incrementAsync()
    };
  }
}
```

#### 4. 最佳实践
1. 合理组织状态
2. 使用模块化管理
3. 避免状态冗余
4. 使用getters计算派生状态
5. 使用actions处理异步
6. 保持状态可预测
7. 使用TypeScript
8. 注意性能优化
9. 保持代码简洁
10. 遵循单向数据流

#### 5. 常见面试题
1. **Vuex和Pinia的区别**
   - Vuex更传统，Pinia更现代
   - Pinia支持组合式API
   - Pinia不需要模块嵌套
   - Pinia更好的TypeScript支持

2. **状态管理的使用场景**
   - 全局状态管理
   - 组件间共享数据
   - 复杂状态逻辑
   - 异步操作处理

3. **如何选择状态管理方案**
   - 小型项目用Pinia
   - 大型项目用Vuex
   - 考虑团队熟悉度
   - 考虑项目需求 