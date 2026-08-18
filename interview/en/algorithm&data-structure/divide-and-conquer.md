# Divide and Conquer Explained

The core idea of divide and conquer is to split a hard problem into two or more identical or similar subproblems until those subproblems are easy enough to solve directly. The solution to the original problem is then the combination of the subproblem solutions.

Divide and conquer usually has three stages:
1.  **Divide**: split the original problem into several smaller, independent subproblems of the same form.
2.  **Conquer**: if a subproblem is small enough, solve it directly; otherwise solve each subproblem recursively.
3.  **Combine**: merge the subproblem solutions into the solution of the original problem.

---

## 1. Merge Sort

### Problem
Sort an array.

### Approach
1.  **Divide**: split the current range into two halves.
2.  **Conquer**: recursively merge-sort the two halves.
3.  **Combine**: merge the two sorted halves into one sorted range.

### Implementation
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

## 2. Quick Sort

### Problem
Sort an array.

### Approach
1.  **Divide**: pick a pivot and partition the array into a left part smaller than the pivot and a right part larger than the pivot.
2.  **Conquer**: recursively quick-sort the left and right parts.
3.  **Combine**: because this is in-place sorting, or you simply concatenate left + pivot + right, the combine step is simple.

### Implementation
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

## 3. Majority Element

### Problem
Given an array `nums` of size n, return the majority element. The majority element is the element that appears **more than** `⌊ n/2 ⌋` times.

### Approach
1.  **Divide**: split the array into left and right halves.
2.  **Conquer**: recursively find the majority of the left half and of the right half.
3.  **Combine**: if the two majorities are the same, that is the majority of this range; if they differ, count both candidates over the whole range and pick the one with the higher count.

### Implementation
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

## 4. Fast Exponentiation (Pow(x, n))

### Problem
Implement `pow(x, n)`, i.e. compute $x^n$.

### Approach
1.  **Divide**: computing $x^n$ reduces to computing $x^{n/2}$.
2.  **Conquer**: recursively compute $y = x^{n/2}$.
3.  **Combine**: if $n$ is even, the result is $y \times y$; if $n$ is odd, the result is $y \times y \times x$.

### Implementation
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

## 5. Kth Largest Element in an Array

### Problem
Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.

### Approach
Use the **Quick Select** idea from quicksort:
1.  Run one partition and get the pivot’s final index `p`.
2.  If `p` is exactly the target index, return it.
3.  If `p` is greater than the target index, search the left range; otherwise search the right range.

### Implementation
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

---

## Interview answer template (Divide and Conquer)

### 1) How to recognize the pattern
- The problem can be split into several subproblems of the same kind, and those subproblems are independent.
- There is a clear recursion-tree structure (sorting, exponentiation, selecting the kth largest).
- The combine step is clear (e.g. merge) or can be skipped (e.g. recurse after a quicksort partition).

### 2) General solving framework
1. Divide: be clear how to split the problem into two or more parts.
2. Recurse: define the subproblem function and the base case.
3. Combine: assemble the sub-results into the original result.

### 3) Complexity (quick answer)
- Common form: `T(n) = aT(n/b) + f(n)`, analyzed with the Master Theorem.
- Merge sort: `O(n log n)` time, `O(n)` space.
- Quick select: average `O(n)`, worst `O(n^2)`.

### 4) Common pitfalls
1. A wrong base case leads to infinite recursion.
2. After a quicksort / quick-select partition, the range bounds are updated incorrectly.
3. Reciting the code without being able to explain why the problem can be split and why the results can be merged.
