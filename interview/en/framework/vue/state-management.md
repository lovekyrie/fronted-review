### Vue.js State Management
Vue.js provides two state-management solutions, Vuex and Pinia, for managing global state in an application.

#### 1. Vuex
##### 1.1 Basic concepts
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

##### 1.2 Core concepts
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

##### 1.3 Modularization
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
      // Login logic
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
##### 2.1 Basic usage
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

##### 2.2 Composition API
```javascript
// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoggedIn = computed(() => !!user.value);

  function login(credentials) {
    // Login logic
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

##### 2.3 Modularization
```javascript
// stores/index.js
import { useCounterStore } from './counter';
import { useUserStore } from './user';

export {
  useCounterStore,
  useUserStore
};
```

#### 3. Usage comparison
##### 3.1 Using Vuex

**1. Basic usage**
Access it directly via `this.$store`.

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
      this.$store.commit('increment'); // Commit a mutation
    },
    incrementAsync() {
      this.$store.dispatch('incrementAsync'); // Dispatch an action
    }
  }
}
```

**2. Helper functions (shorthand)**
Use `mapState`, `mapGetters`, `mapActions`, and `mapMutations` to simplify the code.

```javascript
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    // Map state.count to this.count
    ...mapState(['count']),
    // Map getters.doubleCount to this.doubleCount
    ...mapGetters(['doubleCount']),
    
    // For a namespaced module:
    // ...mapState('user', ['userInfo']),
  },
  methods: {
    // Map this.increment() to this.$store.commit('increment')
    ...mapMutations(['increment']),
    // Map this.incrementAsync() to this.$store.dispatch('incrementAsync')
    ...mapActions(['incrementAsync']),
    
    // You can also rename:
    // ...mapActions({ addAsync: 'incrementAsync' })
  }
}
```

##### 3.2 Using Pinia
```javascript
// Using Pinia in a component
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

#### 4. Best practices
1. Organize state reasonably
2. Use modular management
3. Avoid redundant state
4. Use getters for derived state
5. Use actions for async work
6. Keep state predictable
7. Use TypeScript
8. Pay attention to performance
9. Keep the code concise
10. Follow unidirectional data flow

#### 5. Common interview questions
1. **Differences between Vuex and Pinia**
   - Vuex is more traditional; Pinia is more modern
   - Pinia supports the Composition API
   - Pinia does not need nested modules
   - Pinia has better TypeScript support

2. **When to use state management**
   - Global state management
   - Sharing data across components
   - Complex state logic
   - Handling async operations

3. **How to choose a state-management solution**
   - Use Pinia for small projects
   - Use Vuex for large projects
   - Consider team familiarity
   - Consider project needs

#### 6. High-frequency gaps (state-management follow-ups)

##### 6.1 Pinia vs Vuex interview quick-answer template
- Pinia's API is lighter and integrates more naturally with the Composition API.
- Pinia stores are flat by default, without Vuex's nested-modules mental overhead.
- TypeScript inference is usually better, and the official recommendation for Vue 3 projects is Pinia first.

##### 6.2 What state belongs in the global store
State that usually belongs globally:
1. Shared across many pages and read frequently (user info, permissions, theme).
2. Needs to stay in sync across components (filters, cart).
3. Needs to be persisted and restored (login state, preferences).

Do not put in the global store:
- UI state used by a single component (modal open/close, input drafts).

##### 6.3 Persistence and security boundaries
- Persistence is usually done with a `localStorage` or `sessionStorage` plugin.
- Do not persist sensitive data (such as long-lived tokens) in plaintext; prefer an HttpOnly Cookie approach coordinated with the backend.

##### 6.4 Performance tips
1. Selectors / computed properties should expose only the derived state you need.
2. Avoid storing oversized, redundant structures in the store.
3. Update large objects more granularly to reduce unrelated component reactions.
