### Array Operations
Arrays are one of the most basic data structures. Mastering array operations is the foundation of algorithms and data structures.

#### 1. Basic operations
##### 1.1 CRUD
```javascript
// Add elements
const arr = [1, 2, 3];
arr.push(4);        // Append at the end
arr.unshift(0);     // Insert at the beginning
arr.splice(2, 0, 2.5); // Insert at a given index

// Remove elements
arr.pop();          // Remove from the end
arr.shift();        // Remove from the beginning
arr.splice(2, 1);   // Remove at a given index

// Update elements
arr[0] = 10;        // Update by index
arr.splice(1, 1, 20); // Update at a given index

// Search elements
const index = arr.indexOf(3);  // Find index
const element = arr.find(x => x > 2); // Find by predicate
const exists = arr.includes(3); // Check existence
```

##### 1.2 Array conversions
```javascript
// Array to string
const str = arr.join(',');

// String to array
const arr2 = str.split(',');

// Array to object
const obj = arr.reduce((acc, curr, index) => {
  acc[index] = curr;
  return acc;
}, {});

// Object to array
const arr3 = Object.values(obj);
```

#### 2. Advanced operations
##### 2.1 Traversal
```javascript
// Basic loop
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// forEach
arr.forEach((item, index) => {
  console.log(item, index);
});

// map
const doubled = arr.map(x => x * 2);

// filter
const even = arr.filter(x => x % 2 === 0);

// reduce
const sum = arr.reduce((acc, curr) => acc + curr, 0);
```

##### 2.2 Sorting
```javascript
// Basic sort
arr.sort((a, b) => a - b);

// Custom sort
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];
users.sort((a, b) => a.age - b.age);

// Multi-field sort
users.sort((a, b) => {
  if (a.age !== b.age) return a.age - b.age;
  return a.name.localeCompare(b.name);
});
```

#### 3. Array algorithms
##### 3.1 Search algorithms
```javascript
// Binary search
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

// Linear search
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

##### 3.2 Array manipulations
```javascript
// Deduplicate
const unique = [...new Set(arr)];

// Flatten
const flat = arr.flat(Infinity);

// Group by
const groupBy = (arr, key) => {
  return arr.reduce((acc, curr) => {
    const group = curr[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(curr);
    return acc;
  }, {});
};

// Chunk
const chunk = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
```

#### 4. Performance optimization
##### 4.1 Space
```javascript
// In-place
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

// Bitwise swap
function swap(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}
```

##### 4.2 Time
```javascript
// Speed up lookup with Map
const map = new Map(arr.map((item, index) => [item, index]));
const index = map.get(target);

// Deduplicate with Set
const set = new Set(arr);
const unique = Array.from(set);

// Memoize recursion
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);
  const result = n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
  cache.set(n, result);
  return result;
}
```

#### 5. Best practices
1. Pick the right method
2. Consider the performance impact
3. Handle edge cases
4. Prefer a functional style
5. Add error handling
6. Optimize space usage
7. Optimize time efficiency
8. Keep the code readable
9. Add comments
10. Write unit tests

#### 6. Common interview questions
1. **Array operation efficiency**
   - Time complexity
   - Space complexity
   - Performance optimization
   - Real-world use

2. **Implementing array algorithms**
   - Search algorithms
   - Sorting algorithms
   - Deduplication algorithms
   - Grouping algorithms

3. **Where arrays are used**
   - Data processing
   - Algorithm implementation
   - Performance optimization
   - Real-world use

#### 7. High-frequency gaps (array ops, quick answers)

##### 7.1 Complexity cheat sheet
- Tail insert/remove `push/pop`: amortized `O(1)`.
- Head insert/remove `shift/unshift`: `O(n)` (elements must be shifted).
- Mid insert/remove `splice`: typically `O(n)`.
- Random access `arr[i]`: `O(1)`.

##### 7.2 High-frequency interview phrasing
1. Frequent existence checks: `Set/Map` beats linear `indexOf/includes`.
2. Frequent operations at the head: prefer a queue (deque) over a plain array.
3. Immutable updates: prefer `map/filter/reduce` or the spread operator.

##### 7.3 Pitfall checklist
1. `sort()` sorts as strings by default; pass a comparator for numbers.
2. Mixing in-place and non-mutating APIs causes side effects (`sort/splice`).
3. Repeated `shift` on large arrays degrades performance.
