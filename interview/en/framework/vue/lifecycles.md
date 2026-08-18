### Vue.js Lifecycle
The Vue.js lifecycle is the full process of a Vue instance from creation to destruction.

#### 1. Lifecycle phases
##### 1.1 Creation phase
```javascript
// Before creation
beforeCreate() {
  // Before the instance is created
  // data and methods are not initialized yet
  console.log('beforeCreate');
}

// After creation
created() {
  // After the instance is created
  // data and methods are initialized
  // You can access data and methods
  console.log('created');
}
```

##### 1.2 Mount phase
```javascript
// Before mount
beforeMount() {
  // After the template is compiled, before mount
  // The DOM has not been rendered yet
  console.log('beforeMount');
}

// After mount
mounted() {
  // Mount is complete
  // The DOM has been rendered
  // You can access DOM elements
  console.log('mounted');
}
```

##### 1.3 Update phase
```javascript
// Before update
beforeUpdate() {
  // Before data is updated
  // The DOM has not been updated yet
  console.log('beforeUpdate');
}

// After update
updated() {
  // After data is updated
  // The DOM has been updated
  console.log('updated');
}
```

##### 1.4 Destroy phase
```javascript
// Before destroy
beforeDestroy() {
  // Before the instance is destroyed
  // The instance is still usable
  console.log('beforeDestroy');
}

// After destroy
destroyed() {
  // After the instance is destroyed
  // The instance is no longer usable
  console.log('destroyed');
}
```

#### 2. Lifecycle diagram
```
Creation phase:
beforeCreate -> created

Mount phase:
beforeMount -> mounted

Update phase:
beforeUpdate -> updated

Destroy phase:
beforeDestroy -> destroyed
```

#### 3. Lifecycle use cases
##### 3.1 Data initialization
```javascript
export default {
  data() {
    return {
      message: ''
    }
  },
  created() {
    // Initialize data in created
    this.message = 'Hello Vue';
  }
}
```

##### 3.2 DOM operations
```javascript
export default {
  mounted() {
    // Perform DOM operations in mounted
    this.$refs.myElement.style.color = 'red';
  }
}
```

##### 3.3 Event listeners
```javascript
export default {
  created() {
    // Add event listeners in created
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // Remove event listeners in beforeDestroy
    window.removeEventListener('resize', this.handleResize);
  }
}
```

##### 3.4 Async requests
```javascript
export default {
  data() {
    return {
      users: []
    }
  },
  async created() {
    // Make async requests in created
    try {
      const response = await axios.get('/api/users');
      this.users = response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
```

#### 4. Best practices
1. Initialize data in `created`
2. Perform DOM operations in `mounted`
3. Clean up resources in `beforeDestroy`
4. Avoid accessing `data` in `beforeCreate`
5. Avoid modifying the DOM in `beforeMount`
6. Avoid mutating data in `beforeUpdate`
7. Use async/await for async work
8. Use lifecycle hooks appropriately
9. Watch out for memory leaks
10. Keep the code simple

#### 5. Common interview questions
1. **Vue lifecycle execution order**
   - Creation phase: beforeCreate -> created
   - Mount phase: beforeMount -> mounted
   - Update phase: beforeUpdate -> updated
   - Destroy phase: beforeDestroy -> destroyed

2. **Difference between created and mounted**
   - created: after the instance is created, the DOM has not been rendered
   - mounted: after the DOM has been rendered
   - created is suitable for data initialization
   - mounted is suitable for DOM operations

3. **How to avoid memory leaks**
   - Clean up resources in `beforeDestroy`
   - Remove event listeners
   - Clear timers
   - Cancel unfinished requests
