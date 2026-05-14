# Day 10 算法保温 1（数组 / 字符串 / 双指针） 执行记录

## 快速导航

| 今日 | 主题 | 核心文件 |
|------|------|----------|
| Day 10 | 算法保温（数组/字符串/双指针） | [数组操作](../algorithm&data-structure/array-operation)、[字符串操作](../algorithm&data-structure/string-operation)、[双指针](../algorithm&data-structure/two-pointers)、[滑动窗口](../algorithm&data-structure/sliding-window) |

## 今日目标

- 看完 `/algorithm&data-structure/array-operation`、`string-operation`、`two-pointers`
- 输出数组 / 字符串高频题解题模板
- 输出双指针 4 类适用场景总结（对撞 / 快慢 / 窗口 / 原地交换）

## 阅读卡点

- 双指针的核心是“单调性”，找到单调后才能把 O(n²) 降到 O(n)
- 数组去重 / 扁平化 / 滑窗三类题在面试里经常互相嵌套
- 字符串类题优先用 `charCodeAt` 或 `Map` 替代嵌套 indexOf

## 速记卡 / 知识点

### 双指针 4 类场景

| 类型 | 适用场景 | 典型题 |
|------|----------|--------|
| 对撞指针 | 有序数组、回文判断 | 两数之和（排序后）、三数之和 |
| 快慢指针 | 链表环检测、中点 | 环形链表、链表中点 |
| 滑动窗口 | 连续子串/子数组 | 无重复最长子串、最小覆盖子串 |
| 原地交换 | 去重、移除元素 | 有序数组去重、移动零 |

核心原理：利用**单调性**，让双指针只往一个方向走，把 O(n²) 降到 O(n)。

### 滑动窗口模板

```js
function slidingWindow(s) {
  const map = new Map()
  let left = 0, result = 0
  for (let right = 0; right < s.length; right++) {
    // 1. 扩大窗口：加入 s[right]
    map.set(s[right], (map.get(s[right]) || 0) + 1)
    // 2. 收缩窗口：不满足条件时移动 left
    while (/* 窗口不合法 */) {
      map.set(s[left], map.get(s[left]) - 1)
      if (map.get(s[left]) === 0) map.delete(s[left])
      left++
    }
    // 3. 更新结果
    result = Math.max(result, right - left + 1)
  }
  return result
}
```

### 数组高频操作

- **去重**：`[...new Set(arr)]` 或排序后双指针。
- **扁平化**：`arr.flat(Infinity)` 或递归 `reduce + concat`。
- **排序**：`arr.sort((a, b) => a - b)` 注意默认是字典序。

### 字符串高频技巧

- 字符频次统计：用 `Map` 或长度 128 的数组。
- 回文判断：对撞指针 `left < right`。
- 子串搜索：优先 `includes` / `indexOf`，手写用滑窗。

## 手写 / 流程图

### 无重复最长子串（LeetCode 3）

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

### 两数之和（LeetCode 1）

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

### 三数之和（LeetCode 15）

```js
function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue // 去重
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

## 口述题

### 1. 什么场景优先想到双指针？

回答模板：

> 双指针的核心前提是**单调性**。当数据有序或窗口有收缩方向时，两个指针只往一个方向走，就能把暴力的 O(n²) 降到 O(n)。
>
> 四类场景：一是对撞指针，适合有序数组的查找（如两数之和排序后）；二是快慢指针，适合链表环检测和找中点；三是滑动窗口，适合连续子串/子数组的最值问题；四是原地交换，适合去重、移除元素（如移动零）。
>
> 判断标准：看到"连续""子串""子数组""最长""最短"这些关键词，优先考虑滑窗；看到"有序"，考虑对撞。

### 2. 数组去重 / 扁平化 / 滑窗类题怎么分类？

回答模板：

> 这三类题虽然都是数组操作，但思路不同。去重的核心是集合（Set 或排序后双指针跳重复）；扁平化的核心是递归（`flat(Infinity)` 或 `reduce + concat + isArray`）；滑窗的核心是维护窗口状态（Map 或计数器），通过 left/right 两个指针控制窗口大小。
>
> 面试嵌套出现时，通常是先做一步预处理（如去重或排序），再用双指针或滑窗做主逻辑。关键是识别每一步用什么策略。

## 5 分钟录音顺序

按这个顺序录，不要临场重新组织：

1. 双指针 4 类场景 + 每类一个典型题（2 分钟）
2. 滑动窗口模板 + 无重复最长子串思路（1.5 分钟）
3. 数组去重/扁平化/排序的一句话解法（1.5 分钟）

录完后自查：

- 是否说出双指针的核心是"单调性"。
- 是否说出滑窗模板的三步（扩大、收缩、更新）。
- 是否说出三数之和的去重技巧。
- 是否说出 `[...new Set(arr)]` 去重。

## 今日复盘

今天最需要回补的 3 个点：

1. 滑窗模板的"收缩条件"如何根据题意灵活调整。
2. 三数之和的时间复杂度分析（排序 O(n log n) + 双指针 O(n²)）。
3. `Map` vs 数组下标做频次统计的选择（字符集小用数组，大用 Map）。
