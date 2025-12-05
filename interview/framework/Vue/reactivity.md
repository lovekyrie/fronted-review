### Vue.js 响应式原理
Vue.js的响应式系统是其核心特性之一，能够自动追踪依赖并在数据变化时更新视图。

#### 1. 响应式基础
##### 1.1 数据劫持
```javascript
// 使用Object.defineProperty实现数据劫持
function defineReactive(obj, key, val) {
  // 为每个属性创建依赖收集器
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      // 通知更新
      dep.notify();
    }
  });
}
```

##### 1.2 依赖收集
```javascript
// 依赖收集器
class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (Dep.target) {
      this.subscribers.add(Dep.target);
    }
  }

  notify() {
    this.subscribers.forEach(watcher => watcher.update());
  }
}

// 当前正在收集依赖的Watcher
Dep.target = null;
```

#### 2. 响应式系统
##### 2.1 观察者模式
```javascript
// 观察者
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
  }

  get() {
    Dep.target = this;
    const value = this.vm.$data[this.exp];
    Dep.target = null;
    return value;
  }

  update() {
    const newValue = this.vm.$data[this.exp];
    const oldValue = this.value;
    if (newValue !== oldValue) {
      this.value = newValue;
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
}
```

##### 2.2 响应式处理
```javascript
// 递归处理对象的所有属性
function observe(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

// 创建响应式数据
function reactive(data) {
  observe(data);
  return data;
}
```

#### 3. 数组响应式
##### 3.1 数组方法重写
```javascript
// 需要重写的数组方法
const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

// 创建数组原型
const arrayProto = Array.prototype;
const arrayMethodsProto = Object.create(arrayProto);

// 重写数组方法
arrayMethods.forEach(method => {
  const original = arrayProto[method];
  arrayMethodsProto[method] = function(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    
    if (inserted) ob.observeArray(inserted);
    ob.dep.notify();
    return result;
  };
});
```

##### 3.2 数组响应式处理
```javascript
// 处理数组响应式
function observeArray(items) {
  for (let i = 0; i < items.length; i++) {
    observe(items[i]);
  }
}
```

#### 4. 计算属性
##### 4.1 计算属性实现
```javascript
// 计算属性
class ComputedWatcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.dirty = true;
    this.value = undefined;
    this.dep = new Dep();
  }

  get() {
    if (this.dirty) {
      this.value = this.cb.call(this.vm);
      this.dirty = false;
    }
    return this.value;
  }

  update() {
    this.dirty = true;
    this.dep.notify();
  }
}
```

##### 4.2 计算属性使用
```javascript
// 使用计算属性
const vm = new Vue({
  data: {
    firstName: 'John',
    lastName: 'Doe'
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName;
    }
  }
});
```

#### 5. 最佳实践
1. 避免深层嵌套
2. 合理使用计算属性
3. 避免频繁修改数组
4. 使用Vue.set添加响应式属性
5. 使用Vue.delete删除响应式属性
6. 避免直接修改数组索引
7. 使用Object.freeze冻结数据
8. 合理使用watch
9. 注意性能优化
10. 保持代码简洁

#### 6. 常见面试题
1. **Vue响应式原理**
   - 使用Object.defineProperty
   - 依赖收集和派发更新
   - 观察者模式
   - 数组方法重写

2. **计算属性和方法的区别**
   - 计算属性有缓存
   - 方法每次都会执行
   - 计算属性适合复杂计算
   - 方法适合事件处理

3. **如何优化响应式性能**
   - 避免深层嵌套
   - 使用Object.freeze
   - 合理使用计算属性
   - 避免频繁修改数组 