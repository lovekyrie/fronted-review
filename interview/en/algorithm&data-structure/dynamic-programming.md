### Dynamic Programming
Dynamic programming is an algorithm design method that solves a complex problem by breaking it into simpler subproblems.

#### 1. Basic Concepts
##### 1.1 Core Ideas
- Decompose the problem into overlapping subproblems
- Store solutions to subproblems (memoization)
- Solve bottom-up or top-down

##### 1.2 When It Applies
- Optimal substructure
- Overlapping subproblems
- No aftereffect (future decisions do not depend on how the current state was reached)

#### 2. Classic Problems
##### 2.1 Fibonacci Sequence
```javascript
// Recursive solution (with memoization)
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// Iterative solution
function fibonacciIterative(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}
```

##### 2.2 Climbing Stairs
```javascript
// Recursive solution (with memoization)
function climbStairs(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return n;
  
  memo[n] = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  return memo[n];
}

// Iterative solution
function climbStairsIterative(n) {
  if (n <= 2) return n;
  
  let prev = 1;
  let curr = 2;
  
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}
```

#### 3. Knapsack Problems
##### 3.1 0-1 Knapsack
```javascript
// Recursive solution (with memoization)
function knapsack(weights, values, capacity, index = 0, memo = {}) {
  const key = `${index}-${capacity}`;
  if (key in memo) return memo[key];
  if (index >= weights.length || capacity <= 0) return 0;
  
  if (weights[index] > capacity) {
    memo[key] = knapsack(weights, values, capacity, index + 1, memo);
  } else {
    memo[key] = Math.max(
      values[index] + knapsack(weights, values, capacity - weights[index], index + 1, memo),
      knapsack(weights, values, capacity, index + 1, memo)
    );
  }
  
  return memo[key];
}

// Iterative solution
function knapsackIterative(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}
```

##### 3.2 Unbounded Knapsack
```javascript
// Iterative solution
function unboundedKnapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(capacity + 1).fill(0);
  
  for (let w = 0; w <= capacity; w++) {
    for (let i = 0; i < n; i++) {
      if (weights[i] <= w) {
        dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
      }
    }
  }
  
  return dp[capacity];
}
```

#### 4. String Problems
##### 4.1 Longest Common Subsequence
```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}
```

##### 4.2 Edit Distance
```javascript
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,  // replace
          dp[i - 1][j] + 1,      // delete
          dp[i][j - 1] + 1       // insert
        );
      }
    }
  }
  
  return dp[m][n];
}
```

#### 5. Matrix Problems
##### 5.1 Minimum Path Sum
```javascript
function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array(m).fill().map(() => Array(n).fill(0));
  
  dp[0][0] = grid[0][0];
  
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  
  for (let j = 1; j < n; j++) {
    dp[0][j] = dp[0][j - 1] + grid[0][j];
  }
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  
  return dp[m - 1][n - 1];
}
```

##### 5.2 Maximal Square
```javascript
function maximalSquare(matrix) {
  if (!matrix.length) return 0;
  
  const m = matrix.length;
  const n = matrix[0].length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  let maxLen = 0;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (matrix[i - 1][j - 1] === '1') {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }
  
  return maxLen * maxLen;
}
```

#### 6. Best Practices
1. Define the state
2. Define the state transition
3. Define the initial state
4. Define the computation order
5. Optimize space complexity
6. Handle edge cases
7. Use memoized search
8. Consider state compression
9. Verify correctness
10. Analyze complexity

#### 7. Common Interview Questions
1. **Basic dynamic programming**
   - Fibonacci sequence
   - Climbing stairs
   - Coin change
   - Longest increasing subsequence

2. **Knapsack problems**
   - 0-1 knapsack
   - Unbounded knapsack
   - Bounded knapsack
   - Grouped knapsack

3. **String problems**
   - Longest common subsequence
   - Edit distance
   - Palindrome strings
   - Regular expression matching

4. **Matrix problems**
   - Minimum path sum
   - Maximal square
   - Matrix chain multiplication
   - Triangle minimum path sum

#### 8. High-Frequency Gaps (DP Interview Quick Answers)

##### 8.1 Five-step method (worth memorizing)
1. **Define the state**: what `dp[i]` or `dp[i][j]` represents.
2. **State transition**: how the current state is derived from subproblems.
3. **Initialization**: boundary values and base cases.
4. **Iteration order**: ensure dependent states are computed first.
5. **Answer location**: return `dp[n]`, `dp[m][n]`, or the extremum tracked during iteration.

##### 8.2 When to think of DP
- Asking for an optimum (max / min / number of ways).
- Overlapping subproblems exist, and naive recursion would recompute them.
- The current decision can be built from smaller-scale problems (optimal substructure).

##### 8.3 Complexity phrasing template
- 2D table: time is usually `O(m*n)`, space `O(m*n)`.
- If the state only depends on the previous row / previous column, compress space to `O(n)`.

##### 8.4 Pitfall checklist
1. Vague state definition, which makes the transition equation fuzzy.
2. Forgetting to initialize the first row / first column.
3. Wrong iteration direction (for example, 0-1 knapsack capacity should be iterated in reverse).

---

#### 9. Space Compression Techniques (Follow-up)

**When you can compress space**
- When the transition only depends on the previous row (or previous column), use a rolling array.
- Typical examples: 0-1 knapsack, path DP.

```javascript
// 2D DP → 1D DP (0-1 knapsack)
function knapsack1D(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0)

  for (let i = 0; i < weights.length; i++) {
    // Must go in reverse! Prevents the same item from being chosen more than once
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]])
    }
  }

  return dp[capacity]
}
```

> **High-frequency follow-up**: Why must 0-1 knapsack iterate capacity in reverse? — Iterating forward would pollute `dp[w - weights[i]]` with the value already updated by the current item, which is equivalent to choosing the same item more than once.

**Criteria for 2D → 1D**
- State `dp[i][j]` only uses `dp[i-1][j]` (or `dp[i][j-1]`) → can be compressed.
- State uses both `dp[i-1][j]` and `dp[i-1][j-1]` → you must keep two rows.

---

#### 10. Criteria for "When to Think of DP" (Engineering Scenarios)

| Condition | Description | Typical problems |
|------|------|----------|
| **Optimal substructure** | The optimal solution of the large problem is composed of optimal solutions of subproblems | Knapsack, edit distance |
| **Overlapping subproblems** | The recursion tree has repeated computation | Fibonacci, matrix chain multiplication |
| **No aftereffect** | The current decision does not affect future decisions | Climbing stairs, coins |

**Counterexamples (DP does not apply):**
- Game-theory problems (the current decision affects the opponent's next move).
- The state cannot be split, or there is a cyclic dependency.

---

#### 11. Tree DP and Interval DP (Advanced Variants)

##### 11.1 Tree DP (tree diameter / maximum path sum)
```javascript
// Tree diameter: longest distance between any two nodes
function diameterOfTree(root) {
  let maxDiameter = 0

  function dfs(node) {
    if (!node) return { height: 0, diameter: 0 }

    const left = dfs(node.left)
    const right = dfs(node.right)

    const height = Math.max(left.height, right.height) + 1
    const diameter = Math.max(
      left.diameter,
      right.diameter,
      left.height + right.height  // longest path through the current node
    )

    maxDiameter = Math.max(maxDiameter, diameter)
    return { height, diameter }
  }

  dfs(root)
  return maxDiameter
}
```

##### 11.2 Interval DP (optimal matrix chain multiplication)
```javascript
// Matrix chain multiplication: split subintervals, find the minimum number of multiplications
function matrixChainOrder(p) {
  const n = p.length - 1
  const dp = Array(n).fill().map(() => Array(n).fill(0))

  for (let len = 2; len <= n; len++) {       // interval length
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      dp[i][j] = Infinity
      for (let k = i; k < j; k++) {
        dp[i][j] = Math.min(
          dp[i][j],
          dp[i][k] + dp[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
        )
      }
    }
  }

  return dp[0][n - 1]
}
```

---

#### 12. Criteria for 1D / 2D / 3D DP

| DP dimension | When it applies | Example problems |
|---------|----------|----------|
| **1D** | Linear problems that only care about "the first i items" | Climbing stairs, coin change |
| **2D** | Two variables determine the state | Path problems, edit distance, knapsack |
| **3D** | An extra dimension (e.g. multiple states) | Stock problems (k transactions), house robber |

```javascript
// 3D DP example: stock trading with a cooldown
function maxProfit(prices) {
  const n = prices.length
  const dp = Array(n).fill().map(() =>
    Array(2).fill().map(() => Array(2).fill(0))
  )
  // dp[i][j][k] = day i, holding state j (0/1), whether in cooldown k (0/1)
}
```
