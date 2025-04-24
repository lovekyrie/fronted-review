### 字符串操作
字符串是最常用的数据类型之一，掌握字符串操作是算法和数据结构的基础。

#### 1. 基本操作
##### 1.1 字符串方法
```javascript
// 字符串创建
const str = 'Hello World';
const str2 = new String('Hello World');

// 字符串长度
const length = str.length;

// 字符串访问
const char = str[0];  // 使用索引
const char2 = str.charAt(0);  // 使用charAt

// 字符串拼接
const concat = str + '!';
const concat2 = str.concat('!');
const template = `${str}!`;

// 字符串截取
const slice = str.slice(0, 5);  // 'Hello'
const substring = str.substring(0, 5);  // 'Hello'
const substr = str.substr(0, 5);  // 'Hello'
```

##### 1.2 字符串转换
```javascript
// 大小写转换
const upper = str.toUpperCase();  // 'HELLO WORLD'
const lower = str.toLowerCase();  // 'hello world'

// 字符串分割
const words = str.split(' ');  // ['Hello', 'World']

// 字符串替换
const replaced = str.replace('World', 'JavaScript');
const replacedAll = str.replaceAll('l', 'L');

// 字符串修剪
const trimmed = '  Hello  '.trim();  // 'Hello'
const trimmedStart = '  Hello  '.trimStart();  // 'Hello  '
const trimmedEnd = '  Hello  '.trimEnd();  // '  Hello'
```

#### 2. 高级操作
##### 2.1 字符串查找
```javascript
// 基本查找
const index = str.indexOf('World');  // 6
const lastIndex = str.lastIndexOf('l');  // 9
const includes = str.includes('World');  // true
const startsWith = str.startsWith('Hello');  // true
const endsWith = str.endsWith('World');  // true

// 正则查找
const match = str.match(/[A-Z]/g);  // ['H', 'W']
const search = str.search(/World/);  // 6
```

##### 2.2 字符串处理
```javascript
// 字符串填充
const padded = str.padStart(15, '*');  // '****Hello World'
const paddedEnd = str.padEnd(15, '*');  // 'Hello World****'

// 字符串重复
const repeated = str.repeat(2);  // 'Hello WorldHello World'

// 字符串比较
const compare = str.localeCompare('Hello World');  // 0
const compare2 = str.localeCompare('hello world');  // 1
```

#### 3. 字符串算法
##### 3.1 字符串匹配
```javascript
// 暴力匹配
function bruteForce(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  
  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) {
      j++;
    }
    if (j === m) return i;
  }
  
  return -1;
}

// KMP算法
function kmp(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const next = getNext(pattern);
  
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (j === -1 || text[i] === pattern[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  
  return j === m ? i - j : -1;
}

function getNext(pattern) {
  const next = new Array(pattern.length).fill(0);
  next[0] = -1;
  
  let i = 0, j = -1;
  while (i < pattern.length - 1) {
    if (j === -1 || pattern[i] === pattern[j]) {
      i++;
      j++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  
  return next;
}
```

##### 3.2 字符串处理
```javascript
// 字符串反转
function reverse(str) {
  return str.split('').reverse().join('');
}

// 回文判断
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// 字符串压缩
function compress(str) {
  let result = '';
  let count = 1;
  
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + (count > 1 ? count : '');
      count = 1;
    }
  }
  
  return result;
}
```

#### 4. 性能优化
##### 4.1 字符串拼接
```javascript
// 使用数组拼接
function joinStrings(strings) {
  return strings.join('');
}

// 使用StringBuilder
class StringBuilder {
  constructor() {
    this.strings = [];
  }
  
  append(str) {
    this.strings.push(str);
    return this;
  }
  
  toString() {
    return this.strings.join('');
  }
}
```

##### 4.2 字符串缓存
```javascript
// 使用Map缓存
const cache = new Map();

function memoizedFunction(str) {
  if (cache.has(str)) {
    return cache.get(str);
  }
  
  const result = expensiveOperation(str);
  cache.set(str, result);
  return result;
}

// 使用LRU缓存
class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
```

#### 5. 最佳实践
1. 选择合适的字符串方法
2. 考虑性能影响
3. 处理边界情况
4. 使用正则表达式
5. 实现错误处理
6. 优化字符串拼接
7. 使用字符串缓存
8. 保持代码可读性
9. 添加注释说明
10. 编写单元测试

#### 6. 常见面试题
1. **字符串操作效率**
   - 时间复杂度
   - 空间复杂度
   - 性能优化
   - 实际应用

2. **字符串算法实现**
   - 字符串匹配
   - 字符串处理
   - 字符串压缩
   - 回文判断

3. **字符串应用场景**
   - 文本处理
   - 算法实现
   - 性能优化
   - 实际应用 