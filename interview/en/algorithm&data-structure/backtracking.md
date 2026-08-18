# Backtracking Explained

Backtracking is an algorithm that finds all solutions by exploring every possible candidate. If a candidate is confirmed not to be a solution (or at least not the last solution), backtracking discards it by undoing some changes from the previous step — that is, it “backtracks” one step — and then continues trying other possibilities.

Backtracking usually follows the idea of **depth-first search (DFS)**. The core is: **path, choice list, and termination condition**.

---

## 1. Permutations

### Problem
Given an array `nums` of distinct integers, return all possible permutations. You may return the answer in any order.

### Approach
1.  **Path**: the choices already made.
2.  **Choice list**: the choices available at the current step.
3.  **Termination**: you have reached the bottom of the decision tree, i.e. the path length equals the original array length.

### Implementation
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
      // Backtrack: undo the choice
      path.pop();
      used[nums[i]] = false;
    }
  }

  backtrack([]);
  return res;
}
```

---

## 2. Subsets

### Problem
Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

### Approach
This is a combination problem: each element has two states, “take” or “skip”. At every recursion level, add the current path to the result set.

### Implementation
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
      path.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return res;
}
```

---

## 3. Combination Sum

### Problem
Given an array of distinct integers `candidates` and a target integer `target`, return all unique combinations of `candidates` where the chosen numbers sum to `target`. You may reuse numbers from `candidates` an unlimited number of times.

### Approach
Because numbers can be reused, do not increment the `start` index when recursing. Prune when `target < 0`.

### Implementation
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
      backtrack(i, path, sum + candidates[i]); // Keep i unchanged so the number can be reused
      path.pop();
    }
  }

  backtrack(0, [], 0);
  return res;
}
```

---

## 4. N-Queens

### Problem
Place $n$ queens on an $n \times n$ chessboard so that they cannot attack each other (no two queens share the same row, column, or diagonal).

### Approach
Place queens row by row. For each row, check whether the column, left diagonal, and right diagonal conflict.

### Implementation
```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(n) {
  const res = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));

  function isValid(row, col) {
    // Check the column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    // Check the upper-left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    // Check the upper-right diagonal
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

    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.'; // Backtrack
      }
    }
  }

  backtrack(0);
  return res;
}
```

---

## 5. Word Search

### Problem
Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid; otherwise return `false`.

### Approach
A typical grid DFS plus backtracking.
1. Scan the grid to find a starting cell.
2. From that start, search in four directions.
3. Mark a cell as visited while searching (or overwrite the original character), then restore it on backtrack.

### Implementation
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
    board[i][j] = '#'; // Mark as visited

    const res = backtrack(i + 1, j, k + 1) || 
                backtrack(i - 1, j, k + 1) || 
                backtrack(i, j + 1, k + 1) || 
                backtrack(i, j - 1, k + 1);

    board[i][j] = temp; // Backtrack: restore the cell
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

---

## Interview Answer Template (Backtracking)

### 1) Signals for recognizing the problem type
- Keywords: all solutions, all combinations, permutations, subsets, path search.
- The essence is “DFS on a decision tree + undo the choice”.

### 2) General solving framework
1. Define recursive parameters (current path, start index, remaining target, etc.).
2. Write the termination condition (collect an answer when the path satisfies the constraint).
3. Enumerate the choice list and make a choice.
4. Recurse into the next level.
5. Backtrack and restore state (`pop` / unmark).

### 3) Pruning ideas (interview bonus)
- Sort then prune (e.g. combination sum can `break` early).
- Use a visited array to avoid reusing an element.
- Return as soon as a constraint fails (e.g. `sum > target`).

### 4) Pitfall checklist
1. Pushing the `path` reference into the result without copying (should `push([...path])`).
2. Forgetting to restore state on backtrack, which pollutes later branches.
3. Forgetting to restore the original character in grid-search problems.
