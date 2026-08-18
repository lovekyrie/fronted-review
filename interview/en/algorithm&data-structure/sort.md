### Sorting Algorithms
Sorting algorithms are among the most fundamental algorithms in computer science. They arrange a set of data in a specific order.

#### 1. Bubble Sort
##### 1.1 Basic Implementation
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

// Optimized version
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

##### 1.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n)
- Worst case: O(n²)
- Average case: O(n²)

Space complexity: O(1)
Stability: stable
```

#### 2. Selection Sort
##### 2.1 Basic Implementation
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

##### 2.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n²)
- Worst case: O(n²)
- Average case: O(n²)

Space complexity: O(1)
Stability: unstable
```

#### 3. Insertion Sort
##### 3.1 Basic Implementation
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

##### 3.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n)
- Worst case: O(n²)
- Average case: O(n²)

Space complexity: O(1)
Stability: stable
```

#### 4. Quicksort
##### 4.1 Basic Implementation
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

// In-place quicksort
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

##### 4.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n log n)
- Worst case: O(n²)
- Average case: O(n log n)

Space complexity: O(log n)
Stability: unstable
```

#### 5. Merge Sort
##### 5.1 Basic Implementation
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

##### 5.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n log n)
- Worst case: O(n log n)
- Average case: O(n log n)

Space complexity: O(n)
Stability: stable
```

#### 6. Heap Sort
##### 6.1 Basic Implementation
```javascript
function heapSort(arr) {
  const len = arr.length;
  
  // Build a max heap
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }
  
  // Extract elements one by one
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

##### 6.2 Complexity Analysis
```plaintext
Time complexity:
- Best case: O(n log n)
- Worst case: O(n log n)
- Average case: O(n log n)

Space complexity: O(1)
Stability: unstable
```

#### 7. Best Practices
1. Choose the right sorting algorithm
2. Consider data size
3. Consider data characteristics
4. Consider stability requirements
5. Consider space constraints
6. Optimize the implementation
7. Handle edge cases
8. Consider performance impact
9. Implement error handling
10. Add unit tests

#### 8. Common Interview Questions
1. **How to choose a sorting algorithm**
   - Data size
   - Data characteristics
   - Stability requirements
   - Space constraints

2. **Optimizing sorting algorithms**
   - Algorithm improvements
   - Implementation optimizations
   - Performance gains
   - Special-case handling

3. **Applications of sorting algorithms**
   - Real-world scenarios
   - Performance considerations
   - Implementation difficulty
   - Maintenance cost

#### 9. High-Frequency Gaps (Sorting Interview Quick Answers)

##### 9.1 How to pick a sorting algorithm in 30 seconds
1. Small scale / nearly sorted: insertion sort (best case O(n)).
2. Best average performance: quicksort (watch the worst case).
3. Need stable and `O(n log n)`: merge sort.
4. Very tight space: heap sort (but unstable).

##### 9.2 Stability memory aid (high-frequency)
- Stable: bubble, insertion, merge.
- Unstable: selection, quicksort, heap.

> **Common follow-up**: What does sort stability mean in a product setting?
> Typical answer: for multi-key sorting, sort by the secondary key first, then apply a stable sort on the primary key so the secondary-key order is preserved.

##### 9.3 Complexity quick-answer template
- “Quicksort is `O(n log n)` on average and `O(n^2)` in the worst case; the in-place version uses about `O(log n)` space (recursion stack).”
- “Merge sort is a stable `O(n log n)` in time, but needs extra `O(n)` space.”

##### 9.4 Pitfall checklist
1. Wrong partition bounds in quicksort, causing an infinite loop or dropped elements.
2. Out-of-bounds merge indexes.
3. Only memorizing complexity in interviews, without being able to say “why you chose this one”.

---

#### 10. V8 Tim Sort (Follow-up)

V8’s `Array.prototype.sort()` uses **Tim Sort** (merge sort + insertion sort).

```javascript
// Chrome/V8 source idea (simplified)
function timSort(arr) {
  const RUN = 32  // Use insertion sort for small arrays
  const minRun = minRunLength(RUN)

  // 1. Insertion-sort each RUN
  for (let i = 0; i < n; i += RUN) {
    insertionSort(arr, i, Math.min(i + RUN - 1, n - 1))
  }

  // 2. Merge RUNs (similar to merge sort, but using a stack)
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1
      const right = Math.min(left + 2 * size - 1, n - 1)
      merge(arr, left, mid, right)
    }
  }
}
```

**Why does V8 use Tim Sort instead of pure quicksort?**
- Tim Sort is more efficient on “partially ordered” arrays, and the worst case is still `O(n log n)`, without quicksort’s `O(n^2)` risk.
- Real business data is often partially ordered, so Tim Sort fits production scenarios better.

##### 10.1 Engineering selection guide

| Data size | Recommended algorithm | Reason |
|----------|----------|------|
| n ≤ 10 | Insertion sort | Small constants; recursion overhead is large |
| n ≤ 1000 | Quicksort (in-place) | Fastest on average |
| n is huge, memory is limited | Heap sort | O(1) space |
| Need stability | Merge sort | Stable O(n log n) |
| JavaScript built-in sort | Tim Sort | V8 adaptive |

##### 10.2 Two advanced solutions for Top-K

```javascript
// Method 1: quicksort partition (average O(n))
function topKQuick(arr, k) {
  const pivot = arr[Math.floor(Math.random() * arr.length)]
  const left = arr.filter(x => x > pivot)
  const mid = arr.filter(x => x === pivot)
  const right = arr.filter(x => x < pivot)

  if (k <= left.length) return topKQuick(left, k)
  if (k <= left.length + mid.length) return mid[0]
  return topKQuick(right, k - left.length - mid.length)
}

// Method 2: maintain a min heap (O(n log k)), good for streaming data
function topKHeap(arr, k) {
  const heap = new MinHeap()
  for (const val of arr) {
    if (heap.size() < k) {
      heap.insert(val)
    } else if (val > heap.peek()) {
      heap.replace(val)
    }
  }
  return heap.toArray()
}
```

> **Interview comparison**: Use a heap for Top-K when you have a “data stream” (total count unknown); use quicksort partition when you have a “known array”. In engineering, if the volume is huge (for example massive log data), people usually use a heap + external sort.
