# 栈 (Stack) 经典题目

## 1. 有效的括号 (Valid Parentheses)

### 题目描述
给定一个只包括 `'('`，`')'`，`'{'`，`'}'`，`'['`，`']'` 的字符串 `s` ，判断字符串是否有效。
有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。

### 解题思路
利用栈的 **后进先出 (LIFO)** 特性。遍历字符串：
- 遇到左括号，将其对应的右括号压入栈中。
- 遇到右括号，弹出栈顶元素并判断是否相等。
- 最后检查栈是否为空。

### 代码实现
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '[': ']',
    '{': '}'
  };

  for (let char of s) {
    if (map[char]) {
      stack.push(map[char]);
    } else {
      if (stack.pop() !== char) return false;
    }
  }

  return stack.length === 0;
}
```

---

## 2. 最小栈 (Min Stack)

### 题目描述
设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

### 解题思路
使用**辅助栈**。主栈存储所有数据，辅助栈存储当前的最小值。
- `push`: 如果新元素小于等于辅助栈顶，也压入辅助栈。
- `pop`: 如果主栈弹出的元素等于辅助栈顶，辅助栈也弹出。

### 代码实现
```javascript
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [Infinity];
  }

  push(val) {
    this.stack.push(val);
    this.minStack.push(Math.min(val, this.minStack[this.minStack.length - 1]));
  }

  pop() {
    this.stack.pop();
    this.minStack.pop();
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

---

## 3. 逆波兰表达式求值 (Evaluate RPN)

### 题目描述
根据逆波兰表示法（后缀表达式），求表达式的值。有效的算符包括 `+`、`-`、`*`、`/` 。

### 解题思路
遍历表达式：
- 遇到数字：压入栈。
- 遇到算符：弹出栈顶的两个数字进行运算，并将结果压回栈。

### 代码实现
```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
function evalRPN(tokens) {
  const stack = [];
  for (let token of tokens) {
    if (!isNaN(token)) {
      stack.push(Number(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(parseInt(a / b)); break; // 向零截断
      }
    }
  }
  return stack.pop();
}
```

---

## 4. 用栈实现队列 (Implement Queue using Stacks)

### 题目描述
使用两个栈实现先入先出 (FIFO) 的队列。

### 解题思路
- `stackIn`: 用于入队（push）。
- `stackOut`: 用于出队（pop）或查看队首（peek）。
- 当需要出队而 `stackOut` 为空时，将 `stackIn` 的所有元素弹出并压入 `stackOut`。

### 代码实现
```javascript
class MyQueue {
  constructor() {
    this.stackIn = [];
    this.stackOut = [];
  }

  push(x) {
    this.stackIn.push(x);
  }

  pop() {
    this.peek();
    return this.stackOut.pop();
  }

  peek() {
    if (!this.stackOut.length) {
      while (this.stackIn.length) {
        this.stackOut.push(this.stackIn.pop());
      }
    }
    return this.stackOut[this.stackOut.length - 1];
  }

  empty() {
    return !this.stackIn.length && !this.stackOut.length;
  }
}
```

---

## 5. 每日温度 (Daily Temperatures) - 单调栈

### 题目描述
给定一个整数数组 `temperatures`，表示每天的温度，返回一个数组 `answer`，其中 `answer[i]` 是指在第 `i` 天之后，才等待温度更高的一天所需的天数。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

### 解题思路
**单调递减栈**：栈内存储下标，对应温度单调递减。
- 遍历温度，如果当前温度大于栈顶下标对应的温度，说明找到了栈顶元素之后第一个更高温。
- 弹出栈顶并计算索引差值。
// [10, 3, 6, 15]
### 代码实现
```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  const stack = []; // 存储下标
  
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const preIndex = stack.pop();
      res[preIndex] = i - preIndex;
    }
    stack.push(i);
  }
  return res;
}
```
