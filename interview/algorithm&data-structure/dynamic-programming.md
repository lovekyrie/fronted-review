### 动态规划
动态规划是一种通过将复杂问题分解为更简单的子问题来解决的算法设计方法。

#### 1. 基本概念
##### 1.1 核心思想
- 将问题分解为重叠的子问题
- 存储子问题的解（记忆化）
- 自底向上或自顶向下求解

##### 1.2 适用场景
- 最优子结构
- 重叠子问题
- 无后效性

#### 2. 经典问题
##### 2.1 斐波那契数列
```javascript
// 递归解法（带记忆化）
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

// 迭代解法
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

##### 2.2 爬楼梯
```javascript
// 递归解法（带记忆化）
function climbStairs(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return n;
  
  memo[n] = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  return memo[n];
}

// 迭代解法
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

#### 3. 背包问题
##### 3.1 0-1背包
```javascript
// 递归解法（带记忆化）
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

// 迭代解法
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

##### 3.2 完全背包
```javascript
// 迭代解法
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

#### 4. 字符串问题
##### 4.1 最长公共子序列
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

##### 4.2 编辑距离
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
          dp[i - 1][j - 1] + 1,  // 替换
          dp[i - 1][j] + 1,      // 删除
          dp[i][j - 1] + 1       // 插入
        );
      }
    }
  }
  
  return dp[m][n];
}
```

#### 5. 矩阵问题
##### 5.1 最小路径和
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

##### 5.2 最大正方形
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

#### 6. 最佳实践
1. 确定状态定义
2. 确定状态转移方程
3. 确定初始状态
4. 确定计算顺序
5. 优化空间复杂度
6. 处理边界情况
7. 使用记忆化搜索
8. 考虑状态压缩
9. 验证正确性
10. 分析复杂度

#### 7. 常见面试题
1. **基础动态规划**
   - 斐波那契数列
   - 爬楼梯
   - 零钱兑换
   - 最长递增子序列

2. **背包问题**
   - 0-1背包
   - 完全背包
   - 多重背包
   - 分组背包

3. **字符串问题**
   - 最长公共子序列
   - 编辑距离
   - 回文串
   - 正则表达式匹配

4. **矩阵问题**
   - 最小路径和
   - 最大正方形
   - 矩阵链乘法
   - 三角形最小路径和 

#### 8. 高频疏漏补充（DP 面试快答）

##### 8.1 五步法（建议背熟）
1. **定义状态**：`dp[i]` 或 `dp[i][j]` 代表什么。
2. **状态转移**：当前状态如何由子问题推导。
3. **初始化**：边界值和 base case。
4. **遍历顺序**：确保依赖状态先被计算。
5. **答案位置**：返回 `dp[n]`、`dp[m][n]` 或遍历中的最值。

##### 8.2 何时想到 DP
- 求最值（最大/最小/方案数）。
- 存在重叠子问题，暴力递归会重复计算。
- 当前决策可由“更小规模问题”构成（最优子结构）。

##### 8.3 复杂度表达模板
- 二维表：时间通常 `O(m*n)`，空间 `O(m*n)`。
- 若状态仅依赖上一行/前一列，可做空间压缩到 `O(n)`。

##### 8.4 易错点清单
1. 状态定义不清，导致转移方程含糊。
2. 初始化漏掉第一行/第一列。
3. 遍历方向错误（例如 0-1 背包容量应逆序遍历）。

---

#### 9. 空间压缩技巧（高级追问）

**何时可以压缩空间**
- 状态转移只依赖上一行（或上一列）时，可用滚动数组。
- 典型例子：0-1 背包、路径 DP。

```javascript
// 二维 DP → 一维 DP（0-1 背包）
function knapsack一维(weights, values, capacity) {
  const dp = Array(capacity + 1).fill(0)

  for (let i = 0; i < weights.length; i++) {
    // 必须逆序！防止同一物品被多次选取
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]])
    }
  }

  return dp[capacity]
}
```

> **面试高频追问**：为什么 0-1 背包要逆序遍历容量？——正序会导致 dp[w - weights[i]] 被当前物品更新后的值污染，等于多次选取同一物品。

**二维 → 一维的判断标准**
- 状态 `dp[i][j]` 只用到 `dp[i-1][j]`（或 `dp[i][j-1]`）→ 可压缩。
- 状态用到 `dp[i-1][j]` 和 `dp[i-1][j-1]` → 必须保留两行。

---

#### 10. "何时想到 DP"的判断标准（工程场景）

| 条件 | 说明 | 典型问题 |
|------|------|----------|
| **最优子结构** | 大问题最优解由子问题最优构成 | 背包、编辑距离 |
| **重叠子问题** | 递归树有重复计算 | 斐波那契、矩阵链乘 |
| **无后效性** | 当前决策不影响未来决策 | 爬楼梯、硬币 |

**反例（不能用 DP）：**
- 博弈问题（当前决策影响对手下一步）。
- 状态不可分割，存在循环依赖。

---

#### 11. 树形 DP 与区间 DP（高级变种）

##### 11.1 树形 DP（树的直径 / 最大路径和）
```javascript
// 树的直径：任意两点最长距离
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
      left.height + right.height  // 经过当前节点的最长路径
    )

    maxDiameter = Math.max(maxDiameter, diameter)
    return { height, diameter }
  }

  dfs(root)
  return maxDiameter
}
```

##### 11.2 区间 DP（最优矩阵链乘）
```javascript
// 矩阵链乘：划分子区间，求最小乘法次数
function matrixChainOrder(p) {
  const n = p.length - 1
  const dp = Array(n).fill().map(() => Array(n).fill(0))

  for (let len = 2; len <= n; len++) {       // 区间长度
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

#### 12. 一维/二维/三维 DP 判断标准

| DP 维度 | 适用场景 | 示例问题 |
|---------|----------|----------|
| **一维** | 线性问题，只关心"前 i 个" | 爬楼梯、硬币找零 |
| **二维** | 两个变量决定状态 | 路径问题、编辑距离、背包 |
| **三维** | 额外维度（如多状态） | 股票问题（k 次交易）、打家劫舍 |

```javascript
// 三维 DP 示例：股票买卖含冷冻期
function maxProfit(prices) {
  const n = prices.length
  const dp = Array(n).fill().map(() =>
    Array(2).fill().map(() => Array(2).fill(0))
  )
  // dp[i][j][k] = 第i天，手上持有状态j（0/1），是否在冷冻期k（0/1）
}
```