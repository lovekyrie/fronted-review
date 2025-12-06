### Vue.js 生命周期
Vue.js的生命周期是指Vue实例从创建到销毁的整个过程。

#### 1. 生命周期阶段
##### 1.1 创建阶段
```javascript
// 创建前
beforeCreate() {
  // 实例创建前
  // 此时data和methods还未初始化
  console.log('beforeCreate');
}

// 创建后
created() {
  // 实例创建后
  // 此时data和methods已初始化
  // 可以访问data和methods
  console.log('created');
}
```

##### 1.2 挂载阶段
```javascript
// 挂载前
beforeMount() {
  // 模板编译后，挂载前
  // 此时DOM还未渲染
  console.log('beforeMount');
}

// 挂载后
mounted() {
  // 挂载完成
  // 此时DOM已渲染
  // 可以访问DOM元素
  console.log('mounted');
}
```

##### 1.3 更新阶段
```javascript
// 更新前
beforeUpdate() {
  // 数据更新前
  // 此时DOM还未更新
  console.log('beforeUpdate');
}

// 更新后
updated() {
  // 数据更新后
  // 此时DOM已更新
  console.log('updated');
}
```

##### 1.4 销毁阶段
```javascript
// 销毁前
beforeDestroy() {
  // 实例销毁前
  // 此时实例仍可用
  console.log('beforeDestroy');
}

// 销毁后
destroyed() {
  // 实例销毁后
  // 此时实例已不可用
  console.log('destroyed');
}
```

#### 2. 生命周期图示
```
创建阶段：
beforeCreate -> created

挂载阶段：
beforeMount -> mounted

更新阶段：
beforeUpdate -> updated

销毁阶段：
beforeDestroy -> destroyed
```

#### 3. 生命周期应用
##### 3.1 数据初始化
```javascript
export default {
  data() {
    return {
      message: ''
    }
  },
  created() {
    // 在created中初始化数据
    this.message = 'Hello Vue';
  }
}
```

##### 3.2 DOM操作
```javascript
export default {
  mounted() {
    // 在mounted中进行DOM操作
    this.$refs.myElement.style.color = 'red';
  }
}
```

##### 3.3 事件监听
```javascript
export default {
  created() {
    // 在created中添加事件监听
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 在beforeDestroy中移除事件监听
    window.removeEventListener('resize', this.handleResize);
  }
}
```

##### 3.4 异步请求
```javascript
export default {
  data() {
    return {
      users: []
    }
  },
  async created() {
    // 在created中进行异步请求
    try {
      const response = await axios.get('/api/users');
      this.users = response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
```

#### 4. 最佳实践
1. 在created中进行数据初始化
2. 在mounted中进行DOM操作
3. 在beforeDestroy中清理资源
4. 避免在beforeCreate中访问data
5. 避免在beforeMount中修改DOM
6. 避免在beforeUpdate中修改数据
7. 使用async/await处理异步
8. 合理使用生命周期钩子
9. 注意内存泄漏
10. 保持代码简洁

#### 5. 常见面试题
1. **Vue生命周期的执行顺序**
   - 创建阶段：beforeCreate -> created
   - 挂载阶段：beforeMount -> mounted
   - 更新阶段：beforeUpdate -> updated
   - 销毁阶段：beforeDestroy -> destroyed

2. **created和mounted的区别**
   - created：实例创建后，DOM未渲染
   - mounted：DOM渲染完成后
   - created适合数据初始化
   - mounted适合DOM操作

3. **如何避免内存泄漏**
   - 在beforeDestroy中清理资源
   - 移除事件监听
   - 清除定时器
   - 取消未完成的请求 