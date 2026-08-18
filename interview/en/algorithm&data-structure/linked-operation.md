### Linked List Operations
A linked list is a linear data structure made up of a sequence of nodes. Each node holds data and a pointer to the next node.

#### 1. Basic Implementation
##### 1.1 Node Definition
```javascript
// Singly linked list node
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

// Doubly linked list node
class DoublyListNode {
  constructor(val) {
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}
```

##### 1.2 Linked List Implementation
```javascript
// Singly linked list
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Append a node
  append(val) {
    const node = new ListNode(val);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  // Insert a node
  insert(position, val) {
    if (position < 0 || position > this.size) return false;
    
    const node = new ListNode(val);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;
      let previous = null;
      let index = 0;
      
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      
      node.next = current;
      previous.next = node;
    }
    this.size++;
    return true;
  }

  // Remove a node
  removeAt(position) {
    if (position < 0 || position >= this.size) return null;
    
    let current = this.head;
    if (position === 0) {
      this.head = current.next;
    } else {
      let previous = null;
      let index = 0;
      
      while (index < position) {
        previous = current;
        current = current.next;
        index++;
      }
      
      previous.next = current.next;
    }
    this.size--;
    return current.val;
  }
}
```

#### 2. Common Operations
##### 2.1 Traversal and Search
```javascript
// Traverse the list
function traverse(head) {
  let current = head;
  while (current) {
    console.log(current.val);
    current = current.next;
  }
}

// Find a node
function find(head, val) {
  let current = head;
  while (current) {
    if (current.val === val) return current;
    current = current.next;
  }
  return null;
}

// Get a node's index
function indexOf(head, val) {
  let current = head;
  let index = 0;
  while (current) {
    if (current.val === val) return index;
    current = current.next;
    index++;
  }
  return -1;
}
```

##### 2.2 Linked List Operations
```javascript
// Reverse a linked list
function reverse(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

// Detect a cycle
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  
  return false;
}

// Merge two sorted lists
function mergeSortedLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}
```

#### 3. Advanced Operations
##### 3.1 Linked List Sorting
```javascript
// Merge sort
function mergeSort(head) {
  if (!head || !head.next) return head;
  
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null;
  
  return mergeSortedLists(mergeSort(head), mergeSort(right));
}

function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

// Quick sort
function quickSort(head) {
  if (!head || !head.next) return head;
  
  const pivot = head;
  let less = new ListNode(0);
  let greater = new ListNode(0);
  let lessCurrent = less;
  let greaterCurrent = greater;
  let current = head.next;
  
  while (current) {
    if (current.val < pivot.val) {
      lessCurrent.next = current;
      lessCurrent = lessCurrent.next;
    } else {
      greaterCurrent.next = current;
      greaterCurrent = greaterCurrent.next;
    }
    current = current.next;
  }
  
  lessCurrent.next = null;
  greaterCurrent.next = null;
  
  return mergeSortedLists(quickSort(less.next), pivot, quickSort(greater.next));
}
```

##### 3.2 Linked List Operations
```javascript
// Remove the Nth node from the end
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let first = dummy;
  let second = dummy;
  
  for (let i = 0; i <= n; i++) {
    first = first.next;
  }
  
  while (first) {
    first = first.next;
    second = second.next;
  }
  
  second.next = second.next.next;
  return dummy.next;
}

// Rotate the list
function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  
  let length = 1;
  let current = head;
  
  while (current.next) {
    current = current.next;
    length++;
  }
  
  k = k % length;
  if (k === 0) return head;
  
  current.next = head;
  current = head;
  
  for (let i = 0; i < length - k - 1; i++) {
    current = current.next;
  }
  
  const newHead = current.next;
  current.next = null;
  return newHead;
}
```

#### 4. Best Practices
1. Use a sentinel (dummy) node
2. Handle edge cases
3. Be careful with pointer updates
4. Avoid memory leaks
5. Optimize space usage
6. Optimize time efficiency
7. Keep the code readable
8. Add comments
9. Implement error handling
10. Write unit tests

#### 5. Common Interview Questions
1. **Basic linked list operations**
   - Insert a node
   - Delete a node
   - Find a node
   - Reverse a linked list

2. **Linked list algorithms**
   - Cycle detection
   - Merge lists
   - Sort a list
   - Delete a node

3. **Application scenarios**
   - Memory management
   - Cache implementations
   - Algorithm implementations
   - Real-world use cases

#### 6. High-frequency Gaps (Quick Answers for Linked Lists)

##### 6.1 Common Patterns to Memorize
1. Dummy node: unify head-node edge cases.
2. Fast/slow pointers: midpoint, cycle detection, Nth from the end.
3. Three pointers: reverse a list (`prev/curr/next`).

##### 6.2 Complexity Quick Answers
- Traversal, search, and reverse are usually `O(n)` time and `O(1)` extra space.
- Linked-list merge sort: `O(n log n)` time, recursive stack `O(log n)`.

##### 6.3 High-frequency Pitfalls
1. Not saving the successor before updating `next`, which breaks the chain.
2. Missing null checks when deleting a node.
3. Inconsistent fast/slow starting positions that pick the wrong midpoint (too far left or right).
