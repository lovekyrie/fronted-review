# Day 10 Algorithm Warmup 1 (Arrays / Strings / Two Pointers) Execution Log

## Quick nav

| Day | Topic | Core files |
|------|------|----------|
| Day 10 | Algorithm warmup (arrays/strings/two pointers) | [Array Operations](../algorithm&data-structure/array-operation), [String Operations](../algorithm&data-structure/string-operation), [Two Pointers](../algorithm&data-structure/two-pointers), [Sliding Window](../algorithm&data-structure/sliding-window) |

## Today's goals

- Finish `/en/algorithm&data-structure/array-operation`, `string-operation`, `two-pointers`
- Produce solving templates for high-frequency array / string problems
- Summarize 4 two-pointer scenarios (two ends / fast-slow / window / in-place swap)

## Reading checkpoints

- The core of two pointers is “monotonicity”; only after you find it can you drop O(n²) to O(n)
- Array dedup / flatten / sliding-window problems are often nested in interviews
- For string problems, prefer `charCodeAt` or `Map` over nested `indexOf`

## Cheat sheet / knowledge points

### Four two-pointer scenarios

| Type | Fit for | Typical problems |
|------|----------|--------|
| Two ends | sorted arrays, palindrome checks | two-sum (after sorting), 3Sum |
| Fast / slow | cycle detection, midpoint | linked-list cycle, middle of the list |
| Sliding window | contiguous substring / subarray | longest substring without repeating chars, minimum window substring |
| In-place swap | dedup, remove elements | remove duplicates from sorted array, move zeroes |

Core idea: use **monotonicity** so both pointers only move in one direction, dropping O(n²) to O(n).

### Sliding-window template

```js
function slidingWindow(s) {
  const map = new Map()
  let left = 0, result = 0
  for (let right = 0; right < s.length; right++) {
    // 1. Expand the window: add s[right]
    map.set(s[right], (map.get(s[right]) || 0) + 1)
    // 2. Shrink the window: move left while the condition fails
    while (/* window is invalid */) {
      map.set(s[left], map.get(s[left]) - 1)
      if (map.get(s[left]) === 0) map.delete(s[left])
      left++
    }
    // 3. Update the result
    result = Math.max(result, right - left + 1)
  }
  return result
}
```

### High-frequency array operations

- **Dedup**: `[...new Set(arr)]` or sort then two pointers.
- **Flatten**: `arr.flat(Infinity)` or recursive `reduce + concat`.
- **Sort**: `arr.sort((a, b) => a - b)`; note the default is lexicographic.

### High-frequency string tricks

- Character frequency: a `Map` or a length-128 array.
- Palindrome check: two ends with `left < right`.
- Substring search: prefer `includes` / `indexOf`; handwritten version uses a sliding window.

## Handwritten notes / flowcharts

### Longest substring without repeating characters (LeetCode 3)

```js
function lengthOfLongestSubstring(s) {
  const map = new Map()
  let left = 0, maxLen = 0
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) {
      left = Math.max(left, map.get(s[right]) + 1)
    }
    map.set(s[right], right)
    maxLen = Math.max(maxLen, right - left + 1)
  }
  return maxLen
}
```

### Two Sum (LeetCode 1)

```js
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) return [map.get(complement), i]
    map.set(nums[i], i)
  }
}
```

### 3Sum (LeetCode 15)

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue // skip duplicates
    let left = i + 1, right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]])
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--
        left++; right--
      } else if (sum < 0) left++
      else right--
    }
  }
  return result
}
```

## Oral questions

### 1. When should two pointers be your first thought?

Answer template:

> The core prerequisite for two pointers is **monotonicity**. When data is sorted or a window has a shrink direction, two pointers moving only one way can drop a brute-force O(n²) to O(n).
>
> Four scenarios: first, two ends, for search on a sorted array (two-sum after sorting); second, fast/slow, for cycle detection and finding the midpoint; third, sliding window, for extrema on contiguous substrings/subarrays; fourth, in-place swap, for dedup and removing elements (move zeroes).
>
> Heuristic: keywords like “contiguous”, “substring”, “subarray”, “longest”, “shortest” → sliding window first; “sorted” → two ends.

### 2. How do you classify array dedup / flatten / sliding-window problems?

Answer template:

> These are all array problems, but the ideas differ. Dedup is about a set (Set, or sort then two pointers skipping duplicates). Flatten is recursion (`flat(Infinity)` or `reduce + concat + isArray`). Sliding window is about maintaining window state (a Map or a counter) and controlling size with left/right.
>
> When they are nested in interviews, you usually preprocess first (dedup or sort), then use two pointers or a sliding window as the main logic. The key is recognizing which strategy each step needs.

## 5-minute recording order

Record in this order; do not reorganize on the fly:

1. Four two-pointer scenarios + one typical problem each (2 minutes)
2. Sliding-window template + longest substring without repeating characters (1.5 minutes)
3. One-sentence solutions for array dedup / flatten / sort (1.5 minutes)

Self-check after recording:

- Did you say the core of two pointers is "monotonicity"?
- Did you say the three sliding-window steps (expand, shrink, update)?
- Did you say the 3Sum duplicate-skipping trick?
- Did you say `[...new Set(arr)]` for dedup?

## Today's review

The 3 points that most need follow-up today:

1. How to flexibly adjust the sliding-window “shrink condition” to the problem.
2. 3Sum time-complexity analysis (sort O(n log n) + two pointers O(n²)).
3. Choosing `Map` vs array indices for frequency counts (small alphabet → array, large → Map).
