# 滑动窗口 (Sliding Window) 常用技巧

滑动窗口算法是在给定特定窗口大小的数组或字符串上执行要求的操作。该技术可以将双重循环转换为单层循环，从而将时间复杂度从 $O(n^2)$ 降低到 $O(n)$。

---

## 1. 无重复字符的最长子串 (Longest Substring Without Repeating Characters)

### 题目描述
给定一个字符串 `s` ，请你找出其中不含有重复字符的 **最长子串** 的长度。

### 解题思路
1. 使用一个 `Map` 记录字符最后出现的位置。
2. 使用 `left` 指针表示窗口左边界，`i` 遍历作为右边界。
3. 当遇到重复字符时，更新 `left` 指针到重复字符上一次出现位置的下一个位置。
4. 每次循环更新最大长度。

### 代码实现
```javascript
/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  let map = new Map();
  let left = 0;
  let maxLen = 0;
  
  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i])) {
      // 这里的 left 取最大值是为了防止指针回退
      left = Math.max(left, map.get(s[i]) + 1);
    }
    map.set(s[i], i);
    maxLen = Math.max(maxLen, i - left + 1);
  }
  return maxLen;
}
```

---

## 2. 长度最小的子数组 (Minimum Size Subarray Sum)

### 题目描述
给定一个含有 `n` 个正整数的数组和一个正整数 `target` 。找出该数组中满足其和 `≥ target` 的长度最小的 **连续子数组**，并返回其长度。如果不存在，返回 0。

### 解题思路
1. 使用 `left` 和 `right` 指针构建窗口。
2. 累加 `right` 指向的值到 `sum`。
3. 当 `sum >= target` 时，尝试缩小窗口（`left++`）并记录最小长度。

### 代码实现
```javascript
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
function minSubArrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;
  
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}
```

---

## 3. 找到字符串中所有字母异位词 (Find All Anagrams)

### 题目描述
给定两个字符串 `s` 和 `p`，找到 `s` 中所有 `p` 的 **异位词** 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

### 解题思路
1. 使用两个频率数组/Map 记录 `p` 中的字符和当前窗口中的字符。
2. 窗口大小固定为 `p.length`。
3. 比较两个频率表是否相等。

### 代码实现
```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
function findAnagrams(s, p) {
  const result = [];
  const pCount = new Array(26).fill(0);
  const sCount = new Array(26).fill(0);
  const aCode = 'a'.charCodeAt(0);

  if (s.length < p.length) return [];

  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - aCode]++;
    sCount[s.charCodeAt(i) - aCode]++;
  }

  if (sCount.toString() === pCount.toString()) result.push(0);

  for (let i = p.length; i < s.length; i++) {
    sCount[s.charCodeAt(i) - aCode]++; // 右进
    sCount[s.charCodeAt(i - p.length) - aCode]--; // 左出
    
    if (sCount.toString() === pCount.toString()) {
      result.push(i - p.length + 1);
    }
  }
  return result;
}
```

---

## 4. 子数组最大平均数 I (Maximum Average Subarray I)

### 题目描述
给你一个由 `n` 个元素组成的整数数组 `nums` 和一个整数 `k` 。找出平均数最大的长度为 `k` 的连续子数组，并输出该最大平均数。

### 解题思路
1. 维护一个长度为 `k` 的窗口。
2. 计算第一个窗口的和。
3. 向右滑动：减去左边的值，加上右边新进来的值。
4. 记录过程中出现的最大和。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += nums[i];
  }
  
  let maxSum = sum;
  for (let i = k; i < nums.length; i++) {
    sum = sum - nums[i - k] + nums[i];
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum / k;
}
```

---

## 5. 最小覆盖子串 (Minimum Window Substring)

### 题目描述
给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中包含 `t` 所有字符的最小子串。如果 `s` 中不存在符合条件的子串，则返回空字符串 `""` 。

### 解题思路
1. 使用 `need` 对象记录 `t` 中各字符出现的次数，`window` 记录当前窗口。
2. `right` 指针向右扩大窗口，直到满足 `need` 要求。
3. `left` 指针收缩窗口，直到不再满足 `need` 要求。
4. 记录窗口最小长度和起始位置。

### 代码实现
```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindow(s, t) {
  let need = {}, window = {};
  for (let c of t) need[c] = (need[c] || 0) + 1;

  let left = 0, right = 0;
  let valid = 0; // 满足 need 条件的字符个数
  let start = 0, len = Infinity;

  while (right < s.length) {
    let c = s[right];
    right++;
    if (need[c]) {
      window[c] = (window[c] || 0) + 1;
      if (window[c] === need[c]) valid++;
    }

    while (valid === Object.keys(need).length) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      let d = s[left];
      left++;
      if (need[d]) {
        if (window[d] === need[d]) valid--;
        window[d]--;
      }
    }
  }
  return len === Infinity ? "" : s.substr(start, len);
}
```
