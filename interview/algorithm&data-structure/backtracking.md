# 回溯算法 (Backtracking) 详解

回溯算法是一种通过探索所有可能的候选解来找出所有的解的算法。如果候选解被确认不是一个解（或者至少不是最后一个解），回溯算法会通过在上一步进行一些修改来丢弃它，即“回溯”到上一步，然后继续尝试其他的可能性。

回溯算法通常采用 **深度优先搜索 (DFS)** 的思想，其核心在于：**路径、选择列表、终止条件**。

---

## 1. 全排列 (Permutations)

### 题目描述
给定一个不含重复数字的数组 `nums` ，返回其所有可能的全排列。你可以按任意顺序返回答案。

### 解题思路
1.  **路径**：已经做出的选择。
2.  **选择列表**：当前可以做的选择。
3.  **结束条件**：到达决策树底层，即路径长度等于原数组长度。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums) {
  const res = [];
  const used = {};

  function backtrack(path) {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[nums[i]]) continue;
      
      path.push(nums[i]);
      used[nums[i]] = true;
      backtrack(path);
      // 回溯：撤销选择
      path.pop();
      used[nums[i]] = false;
    }
  }

  backtrack([]);
  return res;
}
```

---

## 2. 子集 (Subsets)

### 题目描述
给你一个整数数组 `nums` ，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。解集不能包含重复的子集。

### 解题思路
这是一个组合问题，每个元素都有“选”或“不选”两种状态。在递归过程中，每一层都将当前路径加入结果集。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function subsets(nums) {
  const res = [];

  function backtrack(start, path) {
    res.push([...path]);
    
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop(); // 回溯
    }
  }

  backtrack(0, []);
  return res;
}
```

---

## 3. 组合总和 (Combination Sum)

### 题目描述
给你一个无重复元素的整数数组 `candidates` 和一个目标整数 `target` ，找出 `candidates` 中可以使数字和为目标数 `target` 的所有不同组合。`candidates` 中的数字可以无限制重复被选取。

### 解题思路
由于数字可以重复选取，递归时 `start` 索引不需要加 1。当 `target < 0` 时剪枝。

### 代码实现
```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
function combinationSum(candidates, target) {
  const res = [];

  function backtrack(start, path, sum) {
    if (sum === target) {
      res.push([...path]);
      return;
    }
    if (sum > target) return;

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, path, sum + candidates[i]); // i 不变表示可以重复选
      path.pop();
    }
  }

  backtrack(0, [], 0);
  return res;
}
```

---

## 4. N 皇后 (N-Queens)

### 题目描述
在 $n \times n$ 的棋盘上放置 $n$ 个皇后，使得它们不能互相攻击（即任意两个皇后不能处于同一行、同一列或同一斜线上）。

### 解题思路
逐行放置皇后，每行检查列、左对角线、右对角线是否冲突。

### 代码实现
```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n) {
  const res = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));

  function isValid(row, col) {
    // 检查列
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    // 检查左上对角线
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    // 检查右上对角线
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }

  function backtrack(row) {
    if (row === n) {
      res.push(board.map(row => row.join('')));
      return;
    }

    for (let col = 0; i < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.'; // 回溯
      }
    }
  }

  backtrack(0);
  return res;
}
```

---

## 5. 单词搜索 (Word Search)

### 题目描述
给定一个 `m x n` 二维字符网格 `board` 和一个字符串单词 `word` 。如果 `word` 存在于网格中，返回 `true` ；否则，返回 `false` 。

### 解题思路
典型的网格 DFS + 回溯。
1. 遍历网格寻找起点。
2. 从起点开始向四个方向搜索。
3. 搜索时标记已访问（或修改原字符），回溯时恢复。

### 代码实现
```javascript
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
function exist(board, word) {
  const m = board.length;
  const n = board[0].length;

  function backtrack(i, j, k) {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;

    const temp = board[i][j];
    board[i][j] = '#'; // 标记已访问

    const res = backtrack(i + 1, j, k + 1) || 
                backtrack(i - 1, j, k + 1) || 
                backtrack(i, j + 1, k + 1) || 
                backtrack(i, j - 1, k + 1);

    board[i][j] = temp; // 回溯：恢复现场
    return res;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (backtrack(i, j, 0)) return true;
    }
  }
  return false;
}
```
