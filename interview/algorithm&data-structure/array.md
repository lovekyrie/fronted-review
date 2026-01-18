# 数组 (Array) 经典题目

## 1. 两数之和 (Two Sum)

### 题目描述
给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** `target` 的那 **两个** 整数，并返回它们的数组下标。

### 解题思路
使用 **哈希表 (Map)**。遍历数组，对于每个元素 `nums[i]`，检查 `target - nums[i]` 是否已经在哈希表中。
- 如果在，返回两个下标。
- 如果不在，将 `nums[i]` 存入哈希表。

### 代码实现
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

## 2. 三数之和 (3Sum)

### 题目描述
给你一个包含 `n` 个整数的数组 `nums`，判断 `nums` 中是否存在三个元素 `a，b，c` ，使得 `a + b + c = 0` ？请你找出所有和为 `0` 且不重复的三元组。

### 解题思路
**排序 + 双指针**。
1. 首先对数组进行排序。
2. 遍历数组，固定一个数 `nums[i]`，然后在后面的区间内使用双指针 `L` 和 `R` 寻找另外两个数。
3. 注意去重：如果 `nums[i]` 与 `nums[i-1]` 相同，跳过；指针移动时也要跳过相同的值。

### 代码实现
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

## 3. 合并两个有序数组 (Merge Sorted Array)

### 题目描述
给你两个按 **非递减顺序** 排列的整数数组 `nums1` 和 `nums2`，另有两个整数 `m` 和 `n` ，分别表示 `nums1` 和 `nums2` 中的元素数目。请你合并 `nums2` 到 `nums1` 中，使合并后的数组同样按 **非递减顺序** 排列。

### 解题思路
**逆向双指针**。从后往前填充 `nums1`，可以避免覆盖 `nums1` 前部还未处理的数据。

### 代码实现
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
  
  // 如果 nums2 还有剩余，拷贝到 nums1 前面
  while (p2 >= 0) {
    nums1[p--] = nums2[p2--];
  }
}
```

---

## 4. 最大子数组和 (Maximum Subarray)

### 题目描述
给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

### 解题思路
**动态规划 (Kadane's Algorithm)**。
- `f(i)` 表示以第 `i` 个元素结尾的最大子数组和。
- 状态转移：`f(i) = max(f(i-1) + nums[i], nums[i])`。
- 只需维护一个当前最大值和全局最大值。

### 代码实现
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

## 5. 移动零 (Move Zeroes)

### 题目描述
给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

### 解题思路
**快慢双指针**。
- 慢指针 `j` 指向下一个非零元素应该放置的位置。
- 快指针 `i` 遍历数组。
- 当 `nums[i]` 非零时，交换 `nums[i]` 和 `nums[j]`，`j++`。

### 代码实现
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
