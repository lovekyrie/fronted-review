# Day 10 算法保温 1（数组 / 字符串 / 双指针）

## 今日目标

- 看完 `/algorithm&data-structure/array-operation`、`string-operation`、`two-pointers`
- 输出数组 / 字符串高频题解题模板
- 输出双指针 4 类适用场景总结（对撞 / 快慢 / 窗口 / 原地交换）

## 按顺序阅读

1. [数组操作](../algorithm&data-structure/array-operation)
2. [字符串操作](../algorithm&data-structure/string-operation)
3. [双指针](../algorithm&data-structure/two-pointers)
4. [滑动窗口](../algorithm&data-structure/sliding-window)

## 实操与自测

**检查点**

- 双指针的核心是“单调性”，找到单调后才能把 O(n²) 降到 O(n)
- 数组去重 / 扁平化 / 滑窗三类题在面试里经常互相嵌套
- 字符串类题优先用 `charCodeAt` 或 `Map` 替代嵌套 indexOf

**先独立完成，再对照专题**

- 双指针 4 类场景 — [参考章节](../algorithm&data-structure/two-pointers#day-10-双指针-4-类场景)
- 滑动窗口模板 — [参考章节](../algorithm&data-structure/sliding-window#day-10-滑动窗口模板)
- 数组高频操作 — [参考章节](../algorithm&data-structure/array-operation#day-10-数组高频操作)
- 字符串高频技巧 — [参考章节](../algorithm&data-structure/string-operation#day-10-字符串高频技巧)
- 无重复最长子串（LeetCode 3） — [参考章节](../algorithm&data-structure/string-operation#day-10-无重复最长子串-leetcode-3)
- 两数之和（LeetCode 1） — [参考章节](../algorithm&data-structure/array-operation#day-10-两数之和-leetcode-1)
- 三数之和（LeetCode 15） — [参考章节](../algorithm&data-structure/array-operation#day-10-三数之和-leetcode-15)

**脱稿口述题**

- 1. 什么场景优先想到双指针？
- 2. 数组去重 / 扁平化 / 滑窗类题怎么分类？

**录音练习**

按这个顺序录，不要临场重新组织：

1. 双指针 4 类场景 + 每类一个典型题（2 分钟）
2. 滑动窗口模板 + 无重复最长子串思路（1.5 分钟）
3. 数组去重/扁平化/排序的一句话解法（1.5 分钟）

录完后自查：

- 是否说出双指针的核心是"单调性"。
- 是否说出滑窗模板的三步（扩大、收缩、更新）。
- 是否说出三数之和的去重技巧。
- 是否说出 `[...new Set(arr)]` 去重。

## 复盘

今天最需要回补的 3 个点：

1. 滑窗模板的"收缩条件"如何根据题意灵活调整。
2. 三数之和的时间复杂度分析（排序 O(n log n) + 双指针 O(n²)）。
3. `Map` vs 数组下标做频次统计的选择（字符集小用数组，大用 Map）。
