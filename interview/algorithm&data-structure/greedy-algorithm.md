# 贪心算法 (Greedy Algorithm) 经典题目

贪心算法是指在对问题求解时，总是做出在当前看来是最好的选择。也就是说，不从整体最优上加以考虑，他所做出的是在某种意义上的局部最优解。

贪心算法不是对所有问题都能得到整体最优解，关键是贪心策略的选择。

---

## 1. 分发饼干 (Assign Cookies)

### 题目描述
假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。
对每个孩子 `i`，都有一个胃口值 `g[i]`，这是能让孩子满足胃口的饼干的最小尺寸；每块饼干 `j`，都有一个尺寸 `s[j]` 。如果 `s[j] >= g[i]`，我们可以将这个饼干 `j` 分配给孩子 `i` ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

### 解题思路
**贪心策略**：为了尽可能满足更多的孩子，我们应该优先满足胃口最小的孩子，并且用尺寸最小且能满足该孩子的饼干。
1. 对孩子胃口数组 `g` 和饼干尺寸数组 `s` 进行从小到大排序。
2. 遍历饼干，如果当前饼干能满足当前孩子，则孩子指针后移，计数加一。

### 代码实现
```javascript
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  
  let child = 0;
  let cookie = 0;
  
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++;
    }
    cookie++;
  }
  
  return child;
}
```

---

## 2. 买卖股票的最佳时机 II (Best Time to Buy and Sell Stock II)

### 题目描述
给你一个整数数组 `prices` ，其中 `prices[i]` 表示某支股票第 `i` 天的价格。
在每一天，你可以决定是否购买和/或出售股票。你在任何时候最多只能持有一股股票。你也可以先购买，然后在同一天出售。
返回你能获得的最大利润。

### 解题思路
**贪心策略**：由于不限制交易次数，只要今天的价格比昨天高，我们就认为产生了利润。最终利润就是所有正收益的总和。
（注意：这并不代表实际的交易过程，而是一种计算最大利润的等价方式）。

### 代码实现
```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}
```

---

## 3. 跳跃游戏 (Jump Game)

### 题目描述
给定一个非负整数数组 `nums` ，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度。
判断你是否能够到达最后一个下标。

### 解题思路
**贪心策略**：实时维护一个当前能到达的最远距离 `maxReach`。
1. 遍历数组，如果当前位置 `i` 在 `maxReach` 范围内，尝试更新 `maxReach`。
2. 如果 `maxReach` 已经覆盖了最后一个下标，返回 `true`。
3. 如果遍历结束仍未到达，返回 `false`。

### 代码实现
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return false;
}
```

---

## 4. 无重叠区间 (Non-overlapping Intervals)

### 题目描述
给定一个区间的集合 `intervals` ，其中 `intervals[i] = [starti, endi]` 。返回需要移除区间的最小数量，使剩余区间互不重叠。

### 解题思路
**贪心策略**：优先保留结尾最早的区间，给后面留出更多空间。
1. 按区间的结束位置 `end` 进行升序排序。
2. 记录当前选中的最后一个区间的结束位置。
3. 遍历其余区间，如果当前区间的开始位置小于记录的结束位置，说明重叠，需要移除。

### 代码实现
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  
  // 按右边界排序
  intervals.sort((a, b) => a[1] - b[1]);
  
  let count = 0;
  let end = intervals[0][1];
  
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      count++;
    } else {
      end = intervals[i][1];
    }
  }
  
  return count;
}
```

---

## 5. 柠檬水找零 (Lemonade Change)

### 题目描述
在柠檬水摊上，每一杯柠檬水的售价为 5 美元。顾客排队购买你的产品，（按账单 bills 支付的顺序）一次购买一杯。
每位顾客只买一杯柠檬水，然后向你付 5 美元、10 美元或 20 美元。你必须给每个顾客正确找零。
如果你能给每位顾客正确找零，返回 `true` ，否则返回 `false` 。

### 解题思路
**贪心策略**：当顾客支付 20 美元时，优先找零 10+5 美元，而不是 5+5+5 美元。因为 5 美元面值更灵活，应该尽量保留。

### 代码实现
```javascript
/**
 * @param {number[]} bills
 * @return {boolean}
 */
function lemonadeChange(bills) {
  let five = 0, ten = 0;
  for (let bill of bills) {
    if (bill === 5) {
      five++;
    } else if (bill === 10) {
      if (five === 0) return false;
      five--;
      ten++;
    } else {
      // 优先找 10 + 5
      if (ten > 0 && five > 0) {
        ten--;
        five--;
      } else if (five >= 3) {
        five -= 3;
      } else {
        return false;
      }
    }
  }
  return true;
}
```
