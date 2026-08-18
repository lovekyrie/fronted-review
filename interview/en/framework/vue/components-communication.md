### Vue.js Component Communication
Vue.js provides several component-communication patterns for passing data and handling events in different scenarios.

#### 1. Props and Events
##### 1.1 Passing props
```javascript
// Parent component
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

// Child component
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

##### 1.2 Event handling
```javascript
// Custom event
this.$emit('custom-event', data);

// Listen for events
this.$on('custom-event', this.handleEvent);

// Remove listener
this.$off('custom-event', this.handleEvent);

// One-time event
this.$once('custom-event', this.handleEvent);
```

#### 2. Event bus
##### 2.1 Creating an event bus
```javascript
// Create an event bus
export const EventBus = new Vue();

// Use the event bus
import { EventBus } from './event-bus';

// Emit an event
EventBus.$emit('event-name', data);

// Listen for an event
EventBus.$on('event-name', data => {
  console.log(data);
});

// Remove the listener
EventBus.$off('event-name');
```

##### 2.2 Event bus usage
```javascript
// Component A
export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message', 'Hello from A');
    }
  }
}

// Component B
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

#### 3. Vuex state management
##### 3.1 Basic usage
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

// Usage in a component
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

##### 3.2 Modularization
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

// Usage in a component
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

#### 4. Dependency injection
##### 4.1 provide/inject
```javascript
// Parent component
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

// Child component
export default {
  inject: ['theme'],
  created() {
    console.log(this.theme);
  }
}
```

##### 4.2 Reactive injection
```javascript
// Parent component
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

#### 5. Best practices
1. Choose the right communication pattern
2. Avoid overusing an event bus
3. Use Vuex for global state
4. Keep components independent
5. Validate props
6. Avoid mutating props
7. Use computed properties appropriately
8. Pay attention to performance
9. Keep the code concise
10. Follow unidirectional data flow

#### 6. Common interview questions
1. **Vue component communication patterns**
   - Props and Events
   - Event bus
   - Vuex state management
   - Dependency injection

2. **When to use Vuex**
   - Global state management
   - Sharing data across components
   - Complex state logic
   - Handling async operations

3. **How to choose a communication pattern**
   - Parent-child: props
   - Siblings: event bus
   - Complex state: Vuex
   - Deeply nested components: dependency injection
