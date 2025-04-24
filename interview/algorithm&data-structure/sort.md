### 排序算法
排序算法是计算机科学中最基本的算法之一，用于将一组数据按照特定顺序排列。

#### 1. 冒泡排序
##### 1.1 基本实现
```javascript
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 优化版本
function bubbleSortOptimized(arr) {
  const len = arr.length;
  let swapped;
  for (let i = 0; i < len - 1; i++) {
    swapped = false;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
```

##### 1.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n)
- 最坏情况：O(n²)
- 平均情况：O(n²)

空间复杂度：O(1)
稳定性：稳定
```

#### 2. 选择排序
##### 2.1 基本实现
```javascript
function selectionSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
```

##### 2.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n²)
- 最坏情况：O(n²)
- 平均情况：O(n²)

空间复杂度：O(1)
稳定性：不稳定
```

#### 3. 插入排序
##### 3.1 基本实现
```javascript
function insertionSort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
```

##### 3.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n)
- 最坏情况：O(n²)
- 平均情况：O(n²)

空间复杂度：O(1)
稳定性：稳定
```

#### 4. 快速排序
##### 4.1 基本实现
```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (let element of arr) {
    if (element < pivot) {
      left.push(element);
    } else if (element > pivot) {
      right.push(element);
    } else {
      equal.push(element);
    }
  }
  
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 原地快速排序
function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

##### 4.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n log n)
- 最坏情况：O(n²)
- 平均情况：O(n log n)

空间复杂度：O(log n)
稳定性：不稳定
```

#### 5. 归并排序
##### 5.1 基本实现
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

##### 5.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n log n)
- 最坏情况：O(n log n)
- 平均情况：O(n log n)

空间复杂度：O(n)
稳定性：稳定
```

#### 6. 堆排序
##### 6.1 基本实现
```javascript
function heapSort(arr) {
  const len = arr.length;
  
  // 构建最大堆
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }
  
  // 逐个提取元素
  for (let i = len - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}
```

##### 6.2 复杂度分析
```plaintext
时间复杂度：
- 最好情况：O(n log n)
- 最坏情况：O(n log n)
- 平均情况：O(n log n)

空间复杂度：O(1)
稳定性：不稳定
```

#### 7. 最佳实践
1. 选择合适的排序算法
2. 考虑数据规模
3. 考虑数据特征
4. 考虑稳定性要求
5. 考虑空间限制
6. 优化算法实现
7. 处理边界情况
8. 考虑性能影响
9. 实现错误处理
10. 添加单元测试

#### 8. 常见面试题
1. **如何选择排序算法**
   - 数据规模
   - 数据特征
   - 稳定性要求
   - 空间限制

2. **排序算法的优化**
   - 算法改进
   - 实现优化
   - 性能提升
   - 特殊情况处理

3. **排序算法的应用**
   - 实际场景
   - 性能考虑
   - 实现难度
   - 维护成本 