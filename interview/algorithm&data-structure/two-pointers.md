# 双指针 (Two Pointers) 常用技巧

双指针是一种常用的算法优化技巧，通过设置两个指针（通常是下标）来减少时间复杂度。主要分为：
1.  **对撞指针**：从两端向中间靠拢。
2.  **快慢指针**：两个指针同向而行，但移动速度不同。

---

## 1. 两数之和 II - 输入有序数组 (Two Sum II)

### 题目描述
给你一个下标从 1 开始的整数数组 `numbers` ，该数组已按 **非递减顺序** 排列 ，请你从数组中找出满足相加之和等于目标数 `target` 的两个数。

### 解题思路
**对撞指针**：
1. 设置 `left` 为 0，`right` 为末尾。
2. 如果 `sum == target`，返回下标。
3. 如果 `sum < target`，`left++`（增加和）。
4. 如果 `sum > target`，`right--`（减小和）。

### 代码实现
```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}
```

---

## 2. 验证回文串 (Valid Palindrome)

### 题目描述
给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

### 解题思路
**对撞指针**：
1. 将字符串转为小写并过滤非字母数字字符。
2. 设置 `left` 和 `right` 分别指向两端。
3. 比较对应字符是否相同，直到指针相遇。

### 代码实现
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // 正则过滤出数字和字母
  s = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

---

## 3. 删除有序数组中的重复项 (Remove Duplicates)

### 题目描述
给你一个 **升序排列** 的数组 `nums` ，请你 **原地** 删除重复出现的元素，使每个元素 **只出现一次** ，返回删除后数组的新长度。元素的 **相对顺序** 应该保持一致。

### 解题思路
**快慢指针**：
1. 慢指针 `slow` 指向去重后应该存放的位置。
2. 快指针 `fast` 遍历数组。
3. 当 `nums[fast] !== nums[slow]` 时，将 `fast` 的值赋给 `slow` 的下一位。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
```

---

## 4. 盛最多水的容器 (Container With Most Water)

### 题目描述
给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂直线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

### 解题思路
**对撞指针**：
1. 容积计算：`area = min(height[left], height[right]) * (right - left)`。
2. 每次移动较矮的那根柱子（因为移动较高的柱子，宽度变小且高度受限于较矮柱子，容积只会变小）。

### 代码实现
```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let max = 0;
  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, currentArea);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}
```

---

## 5. 反转字符串 (Reverse String)

### 题目描述
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 `s` 的形式给出。不要给另外的数组分配额外的空间，你必须原地修改输入数组。

### 解题思路
**对撞指针**：
1. 交换 `s[left]` 和 `s[right]`。
2. 向中间靠拢。

### 代码实现
```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}
```
