### String Operations
Strings are one of the most commonly used data types. Mastering string operations is foundational for algorithms and data structures.

#### 1. Basic Operations
##### 1.1 String Methods
```javascript
// Create a string
const str = 'Hello World';
const str2 = new String('Hello World');

// String length
const length = str.length;

// Access characters
const char = str[0];  // Index access
const char2 = str.charAt(0);  // Using charAt

// Concatenate strings
const concat = str + '!';
const concat2 = str.concat('!');
const template = `${str}!`;

// Slice a string
const slice = str.slice(0, 5);  // 'Hello'
const substring = str.substring(0, 5);  // 'Hello'
const substr = str.substr(0, 5);  // 'Hello'
```

##### 1.2 String Conversion
```javascript
// Case conversion
const upper = str.toUpperCase();  // 'HELLO WORLD'
const lower = str.toLowerCase();  // 'hello world'

// Split a string
const words = str.split(' ');  // ['Hello', 'World']

// Replace in a string
const replaced = str.replace('World', 'JavaScript');
const replacedAll = str.replaceAll('l', 'L');

// Trim a string
const trimmed = '  Hello  '.trim();  // 'Hello'
const trimmedStart = '  Hello  '.trimStart();  // 'Hello  '
const trimmedEnd = '  Hello  '.trimEnd();  // '  Hello'
```

#### 2. Advanced Operations
##### 2.1 String Search
```javascript
// Basic search
const index = str.indexOf('World');  // 6
const lastIndex = str.lastIndexOf('l');  // 9
const includes = str.includes('World');  // true
const startsWith = str.startsWith('Hello');  // true
const endsWith = str.endsWith('World');  // true

// Regex search
const match = str.match(/[A-Z]/g);  // ['H', 'W']
const search = str.search(/World/);  // 6
```

##### 2.2 String Processing
```javascript
// Pad a string
const padded = str.padStart(15, '*');  // '****Hello World'
const paddedEnd = str.padEnd(15, '*');  // 'Hello World****'

// Repeat a string
const repeated = str.repeat(2);  // 'Hello WorldHello World'

// Compare strings
// Note: this comparison is not based on ASCII codes
const compare = str.localeCompare('Hello World');  // 0
const compare2 = str.localeCompare('hello world');  // 1
const compare3 = 'a'.localeCompare('c') // -1 'a' refrenceStr 'c' compareString
```

#### 3. String Algorithms
##### 3.1 String Matching
```javascript
// Brute-force matching
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

// KMP algorithm
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

##### 3.2 String Processing
```javascript
// Reverse a string
function reverse(str) {
  return str.split('').reverse().join('');
}

// Palindrome check
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// String compression
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

#### 4. Performance Optimization
##### 4.1 String Concatenation
```javascript
// Concatenate with an array
function joinStrings(strings) {
  return strings.join('');
}

// Use a StringBuilder
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

##### 4.2 String Caching
```javascript
// Cache with a Map
const cache = new Map();

function memoizedFunction(str) {
  if (cache.has(str)) {
    return cache.get(str);
  }
  
  const result = expensiveOperation(str);
  cache.set(str, result);
  return result;
}

// LRU cache
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

#### 5. Best Practices
1. Choose the right string methods
2. Consider performance impact
3. Handle edge cases
4. Use regular expressions
5. Implement error handling
6. Optimize string concatenation
7. Use string caching
8. Keep the code readable
9. Add comments
10. Write unit tests

#### 6. Common Interview Questions
1. **String operation efficiency**
   - Time complexity
   - Space complexity
   - Performance optimization
   - Real-world use cases

2. **String algorithms**
   - String matching
   - String processing
   - String compression
   - Palindrome checks

3. **Application scenarios**
   - Text processing
   - Algorithm implementations
   - Performance optimization
   - Real-world use cases

#### 7. High-frequency Gaps (Quick Answers for Strings)

##### 7.1 Problem Recognition and Templates
1. Substring matching: sliding window / KMP.
2. Palindrome check: two pointers shrinking from both ends.
3. Frequency counting: a hash map or a fixed-size count array.

##### 7.2 Complexity Quick Answers
- Naive matching: `O(n*m)`.
- KMP: `O(n + m)`.
- Two-pointer palindrome check: `O(n)`.

##### 7.3 Performance and Engineering Framing
- Prefer `array.join('')` for frequent concatenation; avoid repeated `+` inside a loop.
- In Unicode cases (emoji), `split('')` can break characters.

##### 7.4 Pitfall Checklist
1. Skipping preprocessing for case and non-alphanumeric characters.
2. `replace` only replaces the first match by default (use a regex with `g` or `replaceAll` for a global replace).
3. KMP next-array boundaries and fallback logic are easy to get wrong.
