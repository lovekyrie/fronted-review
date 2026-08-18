# Two Pointers Common Techniques

Two pointers is a common algorithm optimization technique that uses two pointers (usually indices) to reduce time complexity. The main variants are:
1.  **Opposite pointers**: start from both ends and move toward the middle.
2.  **Fast and slow pointers**: both pointers move in the same direction at different speeds.

---

## 1. Two Sum II - Input Array Is Sorted

### Problem
You are given a 1-indexed integer array `numbers` that is already sorted in **non-decreasing order**. Find two numbers in the array such that they add up to the target number `target`.

### Approach
**Opposite pointers**:
1. Set `left` to 0 and `right` to the last index.
2. If `sum == target`, return the indices.
3. If `sum < target`, `left++` (increase the sum).
4. If `sum > target`, `right--` (decrease the sum).

### Implementation
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

## 2. Valid Palindrome

### Problem
Given a string, determine whether it is a palindrome, considering only alphanumeric characters and ignoring case.

### Approach
**Opposite pointers**:
1. Convert the string to lowercase and filter out non-alphanumeric characters.
2. Set `left` and `right` at the two ends.
3. Compare the corresponding characters until the pointers meet.

### Implementation
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // regex: keep letters and digits
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

## 3. Remove Duplicates from Sorted Array

### Problem
Given an array `nums` sorted in **ascending order**, **in-place** remove the duplicates so that each element appears **only once**, and return the new length of the array. The **relative order** of the elements should be kept the same.

### Approach
**Fast and slow pointers**:
1. Slow pointer `slow` points to where the next unique value should be stored.
2. Fast pointer `fast` scans the array.
3. When `nums[fast] !== nums[slow]`, assign the value at `fast` to the next slot after `slow`.

### Implementation
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

## 4. Container With Most Water

### Problem
Given an integer array `height` of length `n`. There are `n` vertical lines; the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`. Find two lines such that together with the x-axis they form a container that holds the most water.

### Approach
**Opposite pointers**:
1. Area formula: `area = min(height[left], height[right]) * (right - left)`.
2. Always move the shorter line (moving the taller one shrinks the width while height is still limited by the shorter line, so the area can only decrease).

### Implementation
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

## 5. Reverse String

### Problem
Write a function that reverses a string. The input string is given as an array of characters `s`. Do not allocate extra space for another array; you must modify the input array in place.

### Approach
**Opposite pointers**:
1. Swap `s[left]` and `s[right]`.
2. Move toward the middle.

### Implementation
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

---

## Interview Answer Template (Two Pointers)

### 1) Problem-recognition signals
- Array/string problems that require in-place, linear time, and little extra space.
- Keywords such as two-sum on a sorted array, deduplication, palindrome check, and shrinking an interval.
- Explicit “approach from both ends” or “fast/slow movement” that can optimize a brute-force solution.

### 2) General solving framework
1. Define the two pointers and what they mean (`left/right` or `slow/fast`).
2. Write the movement rules (when to move left, right, or both).
3. Maintain the invariant (e.g. no duplicates in the window, `[0..slow]` already unique).
4. Handle boundaries (empty array, length 1, out-of-bounds termination).

### 3) Complexity quick answer
- Time complexity is usually `O(n)` (each element is visited a constant number of times).
- Space complexity is usually `O(1)` (in-place scenarios).

### 4) Pitfall checklist
1. Pointer out of bounds and infinite loops (wrong `while (left < right)` condition).
2. Confusing the initial position of `slow` with the return value `slow + 1` in deduplication problems.
3. Using a hash map on a sorted-array problem: it works, but does not meet the optimal space requirement.
