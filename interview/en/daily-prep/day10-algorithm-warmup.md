# Day 10 Algorithm Warmup 1 (Arrays / Strings / Two Pointers)

## Goals

- Finish `/en/algorithm&data-structure/array-operation`, `string-operation`, `two-pointers`
- Produce solving templates for high-frequency array / string problems
- Summarize 4 two-pointer scenarios (two ends / fast-slow / window / in-place swap)

## Read in order

1. [Array Operations](../algorithm&data-structure/array-operation)
2. [String Operations](../algorithm&data-structure/string-operation)
3. [Two Pointers](../algorithm&data-structure/two-pointers)
4. [Sliding Window](../algorithm&data-structure/sliding-window)

## Practice and self-check

**Checkpoints**

- The core of two pointers is “monotonicity”; only after you find it can you drop O(n²) to O(n)
- Array dedup / flatten / sliding-window problems are often nested in interviews
- For string problems, prefer `charCodeAt` or `Map` over nested `indexOf`

**Produce or redraw from memory**

- Four two-pointer scenarios — [reference section](../algorithm&data-structure/two-pointers#day-10-four-two-pointer-scenarios)
- Sliding-window template — [reference section](../algorithm&data-structure/sliding-window#day-10-sliding-window-template)
- High-frequency array operations — [reference section](../algorithm&data-structure/array-operation#day-10-high-frequency-array-operations)
- High-frequency string tricks — [reference section](../algorithm&data-structure/string-operation#day-10-high-frequency-string-tricks)
- Longest substring without repeating characters (LeetCode 3) — [reference section](../algorithm&data-structure/string-operation#day-10-longest-substring-without-repeating-characters-leetcode-3)
- Two Sum (LeetCode 1) — [reference section](../algorithm&data-structure/array-operation#day-10-two-sum-leetcode-1)
- 3Sum (LeetCode 15) — [reference section](../algorithm&data-structure/array-operation#day-10-3sum-leetcode-15)

**Answer aloud without reading a reference answer**

- 1. When should two pointers be your first thought?
- 2. How do you classify array dedup / flatten / sliding-window problems?

**Recording drill**

Record in this order; do not reorganize on the fly:

1. Four two-pointer scenarios + one typical problem each (2 minutes)
2. Sliding-window template + longest substring without repeating characters (1.5 minutes)
3. One-sentence solutions for array dedup / flatten / sort (1.5 minutes)

Self-check after recording:

- Did you say the core of two pointers is "monotonicity"?
- Did you say the three sliding-window steps (expand, shrink, update)?
- Did you say the 3Sum duplicate-skipping trick?
- Did you say `[...new Set(arr)]` for dedup?

## Recap

The 3 points that most need follow-up today:

1. How to flexibly adjust the sliding-window “shrink condition” to the problem.
2. 3Sum time-complexity analysis (sort O(n log n) + two pointers O(n²)).
3. Choosing `Map` vs array indices for frequency counts (small alphabet → array, large → Map).
