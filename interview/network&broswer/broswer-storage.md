### 浏览器存储
浏览器提供了多种存储机制，用于在客户端保存数据。

#### 1. Cookie
##### 1.1 基本概念
```javascript
// 设置Cookie
document.cookie = "name=value; expires=Fri, 31 Dec 2023 23:59:59 GMT; path=/; domain=example.com; secure; HttpOnly";

// 读取Cookie
const cookies = document.cookie.split(';').map(cookie => cookie.trim());

// 删除Cookie
document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

##### 1.2 属性
```javascript
// Cookie属性
{
  name: "sessionId",
  value: "abc123",
  expires: "2023-12-31T23:59:59Z",
  path: "/",
  domain: "example.com",
  secure: true,
  HttpOnly: true,
  SameSite: "Strict"
}
```

#### 2. LocalStorage
##### 2.1 基本操作
```javascript
// 存储数据
localStorage.setItem('user', JSON.stringify({
  name: 'John',
  age: 30
}));

// 读取数据
const user = JSON.parse(localStorage.getItem('user'));

// 删除数据
localStorage.removeItem('user');

// 清空所有数据
localStorage.clear();
```

##### 2.2 事件监听
```javascript
// 监听存储变化
window.addEventListener('storage', (event) => {
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('Storage area:', event.storageArea);
});
```

#### 3. SessionStorage
##### 3.1 基本操作
```javascript
// 存储数据
sessionStorage.setItem('token', 'abc123');

// 读取数据
const token = sessionStorage.getItem('token');

// 删除数据
sessionStorage.removeItem('token');

// 清空所有数据
sessionStorage.clear();
```

##### 3.2 特性
```javascript
// 会话级别存储
sessionStorage.setItem('sessionId', 'xyz789');

// 页面刷新后数据仍然存在
// 关闭标签页后数据被清除
```

#### 4. IndexedDB
##### 4.1 基本操作
```javascript
// 打开数据库
const request = indexedDB.open('MyDatabase', 1);

// 创建对象存储
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
};

// 添加数据
const transaction = db.transaction(['users'], 'readwrite');
const store = transaction.objectStore('users');
store.add({ id: 1, name: 'John' });

// 读取数据
const request = store.get(1);
request.onsuccess = (event) => {
  const user = event.target.result;
  console.log(user);
};
```

##### 4.2 高级操作
```javascript
// 使用游标遍历数据
const request = store.openCursor();
request.onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(cursor.value);
    cursor.continue();
  }
};

// 使用索引查询
const index = store.index('name');
const request = index.get('John');
```

#### 5. Cache API
##### 5.1 基本操作
```javascript
// 打开缓存
caches.open('my-cache').then(cache => {
  // 添加资源到缓存
  cache.add('/index.html');
  cache.addAll(['/style.css', '/script.js']);
});

// 从缓存获取资源
caches.match('/index.html').then(response => {
  if (response) {
    return response;
  }
  return fetch('/index.html');
});
```

##### 5.2 缓存策略
```javascript
// 缓存优先策略
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetch(request);
}

// 网络优先策略
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open('my-cache');
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
```

#### 6. 最佳实践
1. 选择合适的存储方式
2. 注意存储限制
3. 处理存储异常
4. 实现数据同步
5. 考虑安全性
6. 优化性能
7. 处理兼容性
8. 实现数据备份
9. 管理存储空间
10. 实现数据迁移

#### 7. 常见面试题
1. **不同存储方式的区别**
   - 存储容量
   - 生命周期
   - 作用域
   - 使用场景

2. **如何选择存储方式**
   - 数据大小
   - 持久性需求
   - 安全性要求
   - 性能考虑

3. **如何处理存储限制**
   - 数据压缩
   - 分片存储
   - 定期清理
   - 优先级管理 