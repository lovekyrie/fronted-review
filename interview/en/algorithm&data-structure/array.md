# Array Classic Problems

## 1. Two Sum

### Problem
Given an integer array `nums` and an integer target `target`, find the **two** integers in the array that **add up to** `target`, and return their indices.

### Approach
Use a **hash map (Map)**. Iterate through the array. For each element `nums[i]`, check whether `target - nums[i]` is already in the map.
- If it is, return the two indices.
- If it is not, store `nums[i]` in the map.

### Implementation
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

---

## 2. 3Sum

### Problem
Given an array `nums` of `n` integers, determine whether there exist three elements `a, b, c` such that `a + b + c = 0`. Find all unique triplets that sum to `0`.

### Approach
**Sort + two pointers**.
1. First sort the array.
2. Iterate through the array, fix one number `nums[i]`, then use two pointers `L` and `R` in the remaining range to find the other two numbers.
3. Deduplicate: if `nums[i]` equals `nums[i-1]`, skip; also skip duplicate values when moving the pointers.

### Implementation
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let L = i + 1;
    let R = nums.length - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === 0) {
        result.push([nums[i], nums[L], nums[R]]);
        while (L < R && nums[L] === nums[L + 1]) L++;
        while (L < R && nums[R] === nums[R - 1]) R--;
        L++;
        R--;
      } else if (sum < 0) {
        L++;
      } else {
        R--;
      }
    }
  }
  return result;
}
```

---

## 3. Merge Sorted Array

### Problem
You are given two integer arrays `nums1` and `nums2` sorted in **non-decreasing order**, and two integers `m` and `n` representing the number of elements in `nums1` and `nums2` respectively. Merge `nums2` into `nums1` so that the merged array is also sorted in **non-decreasing order**.

### Approach
**Two pointers from the back**. Fill `nums1` from the end to avoid overwriting the unprocessed prefix of `nums1`.

### Implementation
```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} 
 */
function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;
  
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p--] = nums1[p1--];
    } else {
      nums1[p--] = nums2[p2--];
    }
  }
  
  // if nums2 still has leftovers, copy them to the front of nums1
  while (p2 >= 0) {
    nums1[p--] = nums2[p2--];
  }
}
```

---

## 4. Maximum Subarray

### Problem
Given an integer array `nums`, find a contiguous subarray with the largest sum (the subarray contains at least one element) and return its maximum sum.

### Approach
**Dynamic programming (Kadane's Algorithm)**.
- `f(i)` is the maximum subarray sum ending at the `i`-th element.
- Recurrence: `f(i) = max(f(i-1) + nums[i], nums[i])`.
- You only need to maintain a current maximum and a global maximum.

### Implementation
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let pre = 0, maxAns = nums[0];
  nums.forEach((x) => {
    pre = Math.max(pre + x, x);
    maxAns = Math.max(maxAns, pre);
  });
  return maxAns;
}
```

---

## 5. Move Zeroes

### Problem
Given an array `nums`, write a function to move all `0`s to the end of the array while keeping the relative order of the non-zero elements.

### Approach
**Fast and slow two pointers**.
- Slow pointer `j` points to where the next non-zero element should be placed.
- Fast pointer `i` scans the array.
- When `nums[i]` is non-zero, swap `nums[i]` and `nums[j]`, then `j++`.

### Implementation
```javascript
/**
 * @param {number[]} nums
 * @return {void}
 */
function moveZeroes(nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      if (i !== j) {
        [nums[j], nums[i]] = [nums[i], nums[j]];
      }
      j++;
    }
  }
}
```

---

## Interview Answer Template (Array)

### 1) Problem-recognition signals
- Sum combinations: `Two Sum / Three Sum` (hash + sort with two pointers).
- In-place modification: move zeroes, merge sorted arrays (two pointers).
- Max/min of a contiguous subarray: Kadane / sliding window.

### 2) General solving framework
1. Decide whether sorting is needed (it affects deduplication and whether two pointers work).
2. Clarify whether “in-place” and “stable order” are required.
3. Present the pointer/hash strategy and write down the deduplication rules.

### 3) Complexity quick answer
- Two Sum (hash): time `O(n)`, space `O(n)`.
- Three Sum (sort + two pointers): time `O(n^2)`, space about `O(1)` (not counting output).

### 4) High-frequency pitfalls
1. Incomplete Three Sum deduplication (duplicates can appear at `i`, `L`, and `R`).
2. Merging sorted arrays from front to back, which overwrites data.
3. Ignoring empty-array or all-negative edge cases (maximum subarray).
