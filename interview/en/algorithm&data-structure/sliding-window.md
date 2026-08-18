# Common Sliding Window Techniques

A sliding-window algorithm performs the required operation on an array or string with a given window size. This technique can turn a nested loop into a single loop, reducing the time complexity from $O(n^2)$ to $O(n)$.

---

## 1. Longest Substring Without Repeating Characters

### Problem
Given a string `s`, find the length of the **longest substring** without repeating characters.

### Approach
1. Use a `Map` to record the last index of each character.
2. Use a `left` pointer as the left bound of the window, and `i` as the right bound while iterating.
3. When a duplicate character appears, move `left` to the position after the previous occurrence of that character.
4. Update the maximum length on every iteration.

### Implementation
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
      // Take the max so left never moves backward
      left = Math.max(left, map.get(s[i]) + 1);
    }
    map.set(s[i], i);
    maxLen = Math.max(maxLen, i - left + 1);
  }
  return maxLen;
}
```

---

## 2. Minimum Size Subarray Sum

### Problem
Given an array of `n` positive integers and a positive integer `target`, find the **shortest contiguous subarray** whose sum is `≥ target`, and return its length. Return 0 if none exists.

### Approach
1. Use `left` and `right` pointers to build the window.
2. Add the value at `right` into `sum`.
3. When `sum >= target`, shrink the window (`left++`) and record the minimum length.

### Implementation
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

## 3. Find All Anagrams in a String

### Problem
Given two strings `s` and `p`, find all **anagram** substrings of `p` in `s`, and return their start indices. The order of the answers does not matter.

### Approach
1. Use two frequency arrays/Maps to record characters in `p` and in the current window.
2. Fix the window size to `p.length`.
3. Compare whether the two frequency tables are equal.

### Implementation
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
    sCount[s.charCodeAt(i) - aCode]++; // Enter from the right
    sCount[s.charCodeAt(i - p.length) - aCode]--; // Leave from the left
    
    if (sCount.toString() === pCount.toString()) {
      result.push(i - p.length + 1);
    }
  }
  return result;
}
```

---

## 4. Maximum Average Subarray I

### Problem
Given an integer array `nums` of `n` elements and an integer `k`, find the contiguous subarray of length `k` with the largest average, and return that maximum average.

### Approach
1. Maintain a window of length `k`.
2. Compute the sum of the first window.
3. Slide right: subtract the value leaving on the left, add the new value entering on the right.
4. Track the maximum sum seen.

### Implementation
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

## 5. Minimum Window Substring

### Problem
Given strings `s` and `t`, return the smallest substring of `s` that covers all characters in `t`. If no such substring exists, return an empty string `""`.

### Approach
1. Use a `need` object for character counts in `t`, and `window` for the current window.
2. Expand the window with `right` until it satisfies `need`.
3. Shrink the window with `left` until it no longer satisfies `need`.
4. Record the minimum window length and start index.

### Implementation
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
  let valid = 0; // Number of characters that already meet the need counts
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

---

## Interview Answer Template (Sliding Window)

### 1) Signals for recognizing the problem type
- Keywords: contiguous subarray, contiguous substring, longest/shortest, satisfy some condition.
- The brute force is a nested loop `O(n^2)`; the problem usually wants an `O(n)` optimization.
- The condition depends on the window contents (sum, frequency, uniqueness, coverage).

### 2) General solving framework
1. Initialize the window `[left, right)` and the stats (`sum` / `Map` / frequency array).
2. Expand with the right pointer (`right++`) and update stats.
3. When the condition is met / not met, shrink with the left pointer (`left++`).
4. Update the answer at the right moment (max length / min length / start index).

### 3) Complexity quick answers
- Time complexity is usually `O(n)` (left and right pointers each move at most `n` times).
- Space complexity depends on the stats structure (treat as `O(1)` when the alphabet is fixed).

### 4) Pitfall checklist
1. Forgetting to roll back counts when shrinking the window, which makes the answer too large or too small.
2. Moving `left` backward (it should only move forward), which breaks linear complexity.
3. Getting `valid` counting or the `need` size check wrong in minimum window substring.
