# 分治算法 (Divide and Conquer) 详解

分治算法的核心思想是“分而治之”，将一个复杂的问题分成两个或多个相同或相似的子问题，直到最后子问题可以简单的直接求解，原问题的解即子问题的解的合并。

分治算法通常分为三个阶段：
1.  **分解 (Divide)**：将原问题分解为若干个规模较小，相互独立，与原问题形式相同的子问题。
2.  **解决 (Conquer)**：若子问题规模较小而容易被解决则直接解，否则递归地解各子问题。
3.  **合并 (Combine)**：将各子问题的解合并为原问题的解。

---

## 1. 归并排序 (Merge Sort)

### 题目描述
对一个数组进行排序。

### 解题思路
1.  **分解**：将当前区间一分为二。
2.  **解决**：递归地对两个子区间进行归并排序。
3.  **合并**：将两个已排序的子区间合并成一个有序区间。

### 代码实现
```javascript
function mergeSort(nums) {
  if (nums.length <= 1) return nums;

  const mid = Math.floor(nums.length / 2);
  const left = nums.slice(0, mid);
  const right = nums.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}
```

---

## 2. 快速排序 (Quick Sort)

### 题目描述
对一个数组进行排序。

### 解题思路
1.  **分解**：选择一个基准值（pivot），将数组分为比基准值小的左部分和比基准值大的右部分。
2.  **解决**：递归地对左右两部分进行快速排序。
3.  **合并**：因为是原地排序或通过连接左+基准+右，合并步骤较简单。

### 代码实现
```javascript
function quickSort(nums) {
  if (nums.length <= 1) return nums;

  const pivot = nums[0];
  const left = [];
  const right = [];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < pivot) left.push(nums[i]);
    else right.push(nums[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

---

## 3. 多数元素 (Majority Element)

### 题目描述
给定一个大小为 n 的数组 `nums` ，返回其中的多数元素。多数元素是指在数组中出现次数 **大于** `⌊ n/2 ⌋` 的元素。

### 解题思路
1.  **分解**：将数组分成左右两部分。
2.  **解决**：递归寻找左半部分的众数和右半部分的众数。
3.  **合并**：如果左右众数相同，则为该段众数；如果不同，统计两个众数在整段中出现的次数，多者为众数。

### 代码实现
```javascript
function majorityElement(nums) {
  function countInRange(nums, num, lo, hi) {
    let count = 0;
    for (let i = lo; i <= hi; i++) {
      if (nums[i] === num) count++;
    }
    return count;
  }

  function solve(lo, hi) {
    if (lo === hi) return nums[lo];

    const mid = Math.floor((hi - lo) / 2) + lo;
    const left = solve(lo, mid);
    const right = solve(mid + 1, hi);

    if (left === right) return left;

    const leftCount = countInRange(nums, left, lo, hi);
    const rightCount = countInRange(nums, right, lo, hi);

    return leftCount > rightCount ? left : right;
  }

  return solve(0, nums.length - 1);
}
```

---

## 4. 快速幂 (Pow(x, n))

### 题目描述
实现 `pow(x, n)` ，即计算 x 的 n 次幂函数（即 $x^n$）。

### 解题思路
1.  **分解**：计算 $x^n$ 可以分解为计算 $x^{n/2}$。
2.  **解决**：递归计算 $y = x^{n/2}$。
3.  **合并**：如果 $n$ 是偶数，结果为 $y \times y$；如果 $n$ 是奇数，结果为 $y \times y \times x$。

### 代码实现
```javascript
function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / myPow(x, -n);

  const half = myPow(x, Math.floor(n / 2));
  
  if (n % 2 === 0) {
    return half * half;
  } else {
    return half * half * x;
  }
}
```

---

## 5. 数组中的第K个最大元素 (Kth Largest Element in an Array)

### 题目描述
给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

### 解题思路
利用快速排序的 **快速选择 (Quick Select)** 思想：
1.  进行一次快排分区，得到基准值的最终索引 `p`。
2.  如果 `p` 正好是目标索引，直接返回。
3.  如果 `p` 大于目标索引，在左区间找；否则在右区间找。

### 代码实现
```javascript
function findKthLargest(nums, k) {
  const target = nums.length - k;
  let left = 0, right = nums.length - 1;

  while (left <= right) {
    const p = partition(nums, left, right);
    if (p === target) return nums[p];
    if (p < target) left = p + 1;
    else right = p - 1;
  }
}

function partition(nums, left, right) {
  const pivot = nums[left];
  let j = left;
  for (let i = left + 1; i <= right; i++) {
    if (nums[i] < pivot) {
      j++;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  [nums[left], nums[j]] = [nums[j], nums[left]];
  return j;
}
```
