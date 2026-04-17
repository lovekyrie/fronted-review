### 数组操作
数组是最基本的数据结构之一，掌握数组操作是算法和数据结构的基础。

#### 1. 基本操作
##### 1.1 增删改查
```javascript
// 增加元素
const arr = [1, 2, 3];
arr.push(4);        // 末尾添加
arr.unshift(0);     // 开头添加
arr.splice(2, 0, 2.5); // 指定位置添加

// 删除元素
arr.pop();          // 末尾删除
arr.shift();        // 开头删除
arr.splice(2, 1);   // 指定位置删除

// 修改元素
arr[0] = 10;        // 直接修改
arr.splice(1, 1, 20); // 指定位置修改

// 查找元素
const index = arr.indexOf(3);  // 查找索引
const element = arr.find(x => x > 2); // 条件查找
const exists = arr.includes(3); // 存在性检查
```

##### 1.2 数组转换
```javascript
// 数组转字符串
const str = arr.join(',');

// 字符串转数组
const arr2 = str.split(',');

// 数组转对象
const obj = arr.reduce((acc, curr, index) => {
  acc[index] = curr;
  return acc;
}, {});

// 对象转数组
const arr3 = Object.values(obj);
```

#### 2. 高级操作
##### 2.1 数组遍历
```javascript
// 基本遍历
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// forEach遍历
arr.forEach((item, index) => {
  console.log(item, index);
});

// map转换
const doubled = arr.map(x => x * 2);

// filter过滤
const even = arr.filter(x => x % 2 === 0);

// reduce归并
const sum = arr.reduce((acc, curr) => acc + curr, 0);
```

##### 2.2 数组排序
```javascript
// 基本排序
arr.sort((a, b) => a - b);

// 自定义排序
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];
users.sort((a, b) => a.age - b.age);

// 多字段排序
users.sort((a, b) => {
  if (a.age !== b.age) return a.age - b.age;
  return a.name.localeCompare(b.name);
});
```

#### 3. 数组算法
##### 3.1 查找算法
```javascript
// 二分查找
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

// 线性查找
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

##### 3.2 数组操作
```javascript
// 数组去重
const unique = [...new Set(arr)];

// 数组扁平化
const flat = arr.flat(Infinity);

// 数组分组
const groupBy = (arr, key) => {
  return arr.reduce((acc, curr) => {
    const group = curr[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(curr);
    return acc;
  }, {});
};

// 数组分块
const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
```

#### 4. 性能优化
##### 4.1 空间优化
```javascript
// 原地操作
function reverseInPlace(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}

// 使用位运算
function swap(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}
```

##### 4.2 时间优化
```javascript
// 使用Map优化查找
const map = new Map(arr.map((item, index) => [item, index]));
const index = map.get(target);

// 使用Set优化去重
const set = new Set(arr);
const unique = Array.from(set);

// 使用缓存优化递归
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);
  const result = n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
  cache.set(n, result);
  return result;
}
```

#### 5. 最佳实践
1. 选择合适的操作方法
2. 考虑性能影响
3. 处理边界情况
4. 使用函数式编程
5. 实现错误处理
6. 优化空间使用
7. 优化时间效率
8. 保持代码可读性
9. 添加注释说明
10. 编写单元测试

#### 6. 常见面试题
1. **数组操作效率**
   - 时间复杂度
   - 空间复杂度
   - 性能优化
   - 实际应用

2. **数组算法实现**
   - 查找算法
   - 排序算法
   - 去重算法
   - 分组算法

3. **数组应用场景**
   - 数据处理
   - 算法实现
   - 性能优化
   - 实际应用 