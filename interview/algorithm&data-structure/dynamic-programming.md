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