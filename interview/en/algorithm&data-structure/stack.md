# Classic Stack Problems

## 1. Valid Parentheses

### Problem
Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine whether the string is valid.
A valid string must satisfy:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

### Approach
Use the stack’s **last-in, first-out (LIFO)** property. Scan the string:
- On an opening bracket, push its matching closing bracket onto the stack.
- On a closing bracket, pop the top and check whether it matches.
- At the end, the stack must be empty.

### Implementation
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

## 2. Min Stack

### Problem
Design a stack that supports `push`, `pop`, and `top`, and can retrieve the minimum element in constant time.

### Approach
Use an **auxiliary stack**. The main stack stores all values; the auxiliary stack stores the current minimum.
- `push`: if the new value is less than or equal to the auxiliary top, push it onto the auxiliary stack as well.
- `pop`: if the value popped from the main stack equals the auxiliary top, pop the auxiliary stack too.

### Implementation
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

## 3. Evaluate Reverse Polish Notation (Evaluate RPN)

### Problem
Evaluate the value of an arithmetic expression in Reverse Polish Notation (postfix). Valid operators are `+`, `-`, `*`, and `/`.

### Approach
Scan the expression:
- On a number: push it onto the stack.
- On an operator: pop the top two numbers, compute, and push the result back.

### Implementation
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
        case '/': stack.push(parseInt(a / b)); break; // Truncate toward zero
      }
    }
  }
  return stack.pop();
}
```

---

## 4. Implement Queue using Stacks

### Problem
Implement a first-in, first-out (FIFO) queue using two stacks.

### Approach
- `stackIn`: used for enqueue (`push`).
- `stackOut`: used for dequeue (`pop`) or peeking at the front (`peek`).
- When a dequeue is needed and `stackOut` is empty, pop every element from `stackIn` and push it onto `stackOut`.

### Implementation
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

## 5. Daily Temperatures — monotonic stack

### Problem
Given an integer array `temperatures` representing daily temperatures, return an array `answer` where `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, put `0` instead.

### Approach
**Monotonically decreasing stack**: store indices whose corresponding temperatures are monotonically decreasing.
- Scan the temperatures. If the current temperature is greater than the temperature at the top index, you have found the first warmer day after that stack top.
- Pop the top and compute the index difference.
// [10, 3, 6, 15]
### Implementation
```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  const stack = []; // store indices
  
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

---

## Interview answer template (Stack)

### 1) How to recognize the pattern
- Bracket matching, expression evaluation, next greater/smaller element.
- Common keywords: last in first out, backtracking, nested structure, monotonic stack.

### 2) General solving framework
1. Be clear whether the stack stores values or indices.
2. Define the push and pop conditions.
3. Update the answer on pop (e.g. index difference, mapping).

### 3) Complexity (quick answer)
- Typical stack problems are `O(n)` time and `O(n)` space.
- A monotonic stack still has a while loop, but each element is pushed and popped at most once, so the overall cost remains `O(n)`.

### 4) Common pitfalls
1. Calling `pop/peek` on an empty stack causes logic errors.
2. Getting the monotonic direction wrong (increasing vs decreasing).
3. Reversing operand order in expression evaluation (`a-b`, `a/b`).
