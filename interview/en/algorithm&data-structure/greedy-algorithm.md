# Greedy Algorithm Classic Problems

A greedy algorithm always makes the choice that looks best at the current step. In other words, it does not consider the global optimum; the choice it makes is a local optimum in some sense.

Greedy algorithms do not produce a globally optimal solution for every problem. The key is choosing the right greedy strategy.

---

## 1. Assign Cookies

### Problem
You are a great parent who wants to give some cookies to your children. However, each child can receive at most one cookie.
For each child `i`, there is a greed factor `g[i]`, which is the minimum cookie size that will satisfy that child. For each cookie `j`, there is a size `s[j]`. If `s[j] >= g[i]`, we can assign cookie `j` to child `i`, and that child will be satisfied. Your goal is to satisfy as many children as possible and return that maximum number.

### Approach
**Greedy strategy**: To satisfy as many children as possible, we should first satisfy the child with the smallest greed factor, using the smallest cookie that can still satisfy that child.
1. Sort the children's greed array `g` and the cookie size array `s` in ascending order.
2. Iterate through the cookies. If the current cookie can satisfy the current child, move the child pointer forward and increment the count.

### Implementation
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

## 2. Best Time to Buy and Sell Stock II

### Problem
You are given an integer array `prices`, where `prices[i]` is the price of a given stock on day `i`.
On each day, you may decide to buy and/or sell the stock. You can hold at most one share of the stock at any time. You can also buy and then sell on the same day.
Return the maximum profit you can achieve.

### Approach
**Greedy strategy**: Since there is no limit on the number of transactions, whenever today's price is higher than yesterday's, we treat the difference as profit. The final profit is the sum of all positive gains.
(Note: this does not represent the actual sequence of trades; it is an equivalent way to compute the maximum profit.)

### Implementation
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

## 3. Jump Game

### Problem
Given a non-negative integer array `nums`, you start at the first index of the array. Each element represents the maximum jump length from that position.
Determine whether you can reach the last index.

### Approach
**Greedy strategy**: Maintain the farthest index you can currently reach, `maxReach`.
1. Iterate through the array. If the current index `i` is within `maxReach`, try to update `maxReach`.
2. If `maxReach` already covers the last index, return `true`.
3. If you finish iterating without reaching the end, return `false`.

### Implementation
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

## 4. Non-overlapping Intervals

### Problem
Given a collection of intervals `intervals`, where `intervals[i] = [starti, endi]`. Return the minimum number of intervals you need to remove so that the remaining intervals do not overlap.

### Approach
**Greedy strategy**: Prefer keeping the interval that ends earliest, leaving more room for later intervals.
1. Sort intervals by end position `end` in ascending order.
2. Record the end of the last selected interval.
3. Iterate through the remaining intervals. If the current interval's start is less than the recorded end, they overlap and the current one should be removed.

### Implementation
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  
  // sort by right endpoint
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

## 5. Lemonade Change

### Problem
At a lemonade stand, each lemonade costs 5 dollars. Customers stand in a queue to buy from you and buy one cup at a time (in the order of `bills`).
Each customer buys one lemonade and pays with 5, 10, or 20 dollars. You must give each customer the correct change.
Return `true` if you can give every customer the correct change, otherwise return `false`.

### Approach
**Greedy strategy**: When a customer pays 20 dollars, prefer giving change as 10 + 5 rather than 5 + 5 + 5. The 5-dollar bills are more flexible and should be kept whenever possible.

### Implementation
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
      // prefer making change with 10 + 5
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

---

## Interview Answer Template (Greedy)

### 1) Problem-recognition signals
- Asking for “maximum / minimum / optimal” where each step looks locally decidable.
- Common in interval scheduling, resource allocation, jump coverage, making change, and similar problems.

### 2) Standard answer structure
1. State the greedy strategy first (e.g. “prefer the interval with the smallest right endpoint”).
2. Then explain why the local optimum leads to a global optimum (swap argument / proof by contradiction).
3. Finish with sort + a single pass.

### 3) Complexity quick answer
- If sorting is involved: time is usually `O(n log n)`.
- The scan is generally `O(n)`; extra space is mostly `O(1)` or `O(n)` depending on the implementation.

### 4) Pitfall checklist
1. Giving only intuition without proving the strategy is correct — interviewers often follow up and you get stuck.
2. Picking the wrong sort key on interval problems (sometimes you should sort by end, not start).
3. Treating Stock II as “at most one transaction”, which leads to DP or a nested loop.
