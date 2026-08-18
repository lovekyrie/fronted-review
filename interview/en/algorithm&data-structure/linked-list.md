# Linked List Classic Problems

## 1. Reverse a Linked List

### Problem
Given a linked list, reverse it and return the head of the new list.

### Approach
Use three pointers: `prev` (previous), `curr` (current), `next` (successor). Traverse the list and reverse the pointers one by one.
Input: 1->2->3->4->5->NULL
Output: 5->4->3->2->1->NULL
### Implementation
```javascript
/**
 * @param {LinkedListNode} head
 * @return {LinkedListNode}
 */
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next; // save the next node
    curr.next = prev;         // reverse the pointer
    prev = curr;              // move prev forward
    curr = nextTemp;          // move curr forward
  }
  return prev;
}
```

---

## 2. Cycle Detection

### Problem
Determine whether a linked list has a cycle.

### Approach
**Fast and slow pointers (Floyd's Cycle-Finding Algorithm)**: define two pointers. The fast pointer moves two steps at a time, the slow pointer one step. If the list has a cycle, the fast pointer will eventually catch up with the slow pointer.

### Implementation
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

## 3. Merge Two Sorted Lists

### Problem
Merge two ascending linked lists into a new ascending list and return it. The new list is made by splicing together the nodes of the two given lists.

### Approach
Use iteration or recursion. Create a dummy node as the head of the new list, compare node values, and attach them to the new list one by one.

### Implementation
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
  
  // if either list is empty, attach the remainder of the other
  curr.next = l1 !== null ? l1 : l2;
  
  return dummy.next;
}
```

---

## 4. Remove N-th Node From End

### Problem
Given a linked list, delete the n-th node from the end and return the head of the list.

### Approach
**Two pointers**: the first pointer walks n steps first, then the second pointer starts from the head, and both move together. When the first pointer reaches the end, the second pointer is at the node just before the n-th node from the end.

### Implementation
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
  
  // fast walks n+1 steps first so slow stops at the node before the n-th from the end
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  
  // delete the node
  slow.next = slow.next.next;
  
  return dummy.next;
}
```

---

## 5. Find Middle Node

### Problem
Given a non-empty singly linked list with head `head`, return the middle node. If there are two middle nodes, return the second one.

### Approach
**Fast and slow pointers**: the slow pointer moves one step, the fast pointer two. When the fast pointer reaches the end, the slow pointer is at the middle.

### Implementation
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

---

## Interview Answer Template (Linked List)

### 1) Problem-recognition signals
- Pointer operations, in-place updates, delete/reverse/merge, cycle detection, and similar tasks.
- Array solutions use more space; linked-list problems usually test pointer details and edge cases.

### 2) Common techniques
1. **Dummy node**: uniformly handle edge cases such as deleting the head.
2. **Fast and slow pointers**: midpoint, cycle detection, n-th node from the end.
3. **Three-pointer reverse**: `prev/curr/next`.
4. **Break and relink**: save the successor before changing `next`.

### 3) Complexity quick answer
- Most linked-list traversal problems: time `O(n)`, extra space `O(1)`.
- Recursive reverse uses `O(n)` call-stack space.

### 4) High-frequency pitfalls
1. Not handling a changed head (returning the old head).
2. Missing null checks when deleting a node (`node.next` throws).
3. Wrong number of steps for “n-th from the end” (common mix-up of `n` vs `n+1`).
