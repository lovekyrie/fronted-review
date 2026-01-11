# 链表经典题目

## 1. 单链表反转 (Reverse a Linked List)

### 题目描述
输入一个链表，反转链表后，输出新链表的表头。

### 解题思路
利用三个指针：`prev`（前驱）、`curr`（当前）、`next`（后继）。遍历链表，依次改变指针指向。
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
### 代码实现
```javascript
/**
 * @param {LinkedListNode} head
 * @return {LinkedListNode}
 */
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next; // 暂存后继节点
    curr.next = prev;         // 反转指向
    prev = curr;              // 前驱后移
    curr = nextTemp;          // 当前后移
  }
  return prev;
}
```

---

## 2. 链表中环的检测 (Cycle Detection)

### 题目描述
判断一个链表中是否有环。

### 解题思路
**快慢指针法（Floyd's Cycle-Finding Algorithm）**：定义两个指针，快指针每次走两步，慢指针每次走一步。如果链表有环，快指针最终一定会追上慢指针。

### 代码实现
```javascript
/**
 * @param {LinkedListNode} head
 * @return {boolean}
 */
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head.next;
  
  while (slow !== fast) {
    if (!fast || !fast.next) return false;
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return true;
}
```

---

## 3. 两个有序的链表合并 (Merge Two Sorted Lists)

### 题目描述
将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

### 解题思路
利用迭代或递归。创建一个哨兵节点（dummy node）作为新链表的头部，比较两个链表节点的值，依次接入新链表。

### 代码实现
```javascript
/**
 * @param {LinkedListNode} l1
 * @param {LinkedListNode} l2
 * @return {LinkedListNode}
 */
function mergeTwoLists(l1, l2) {
  const dummy = new LinkedListNode(0);
  let curr = dummy;
  
  while (l1 !== null && l2 !== null) {
    if (l1.value <= l2.value) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  
  // 任一为空，直接连接另一条剩余部分
  curr.next = l1 !== null ? l1 : l2;
  
  return dummy.next;
}
```

---

## 4. 删除链表倒数第 N 个结点 (Remove N-th Node From End)

### 题目描述
给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

### 解题思路
**双指针法**：第一个指针先走 n 步，然后第二个指针从头开始，两个指针同时移动。当第一个指针到达末尾时，第二个指针正好指向倒数第 n 个节点的前一个节点。

### 代码实现
```javascript
/**
 * @param {LinkedListNode} head
 * @param {number} n
 * @return {LinkedListNode}
 */
function removeNthFromEnd(head, n) {
  const dummy = new LinkedListNode(0);
  dummy.next = head;
  let fast = dummy;
  let slow = dummy;
  
  // fast 先走 n+1 步，为了让 slow 停在倒数第 n 个节点的前一个
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  
  // 删除节点
  slow.next = slow.next.next;
  
  return dummy.next;
}
```

---

## 5. 求链表的中间结点 (Find Middle Node)

### 题目描述
给定一个头结点为 head 的非空单链表，返回链表的中间结点。如果有两个中间结点，则返回第二个。

### 解题思路
**快慢指针法**：慢指针走一步，快指针走两步。当快指针到达结尾时，慢指针正好在中间。

### 代码实现
```javascript
/**
 * @param {LinkedListNode} head
 * @return {LinkedListNode}
 */
function findMiddleNode(head) {
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}
```
