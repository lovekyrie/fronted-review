// 给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。
// 给定一个链表: 1->2->3->4->5, 和 n = 2.
// 当删除了倒数第二个节点后，链表变为 1->2->3->5.
/**
 * 解题思路
 * 双指针法：第一个指针先走 n 步，然后第二个指针从头开始，两个指针同时移动。当第一个指针到达末尾时，第二个指针正好指向倒数第 n 个节点的前一个节点。
 */

import LinkedList from './LinkedList.js'
import LinkedListNode from './LinkedListNode.js'

/**
 * @param {LinkedListNode} head
 * @param {number} n
 * @returns {LinkedListNode}
 */
function removeNthFromEnd(head, n) {
  let fast = head
  let slow = head

  // fast 先走 n+1 步，为了让 slow 停在倒数第 n 个节点的前一个
  for (let i = 0; i <= n; i++) {
    fast = fast.next
  }
  while (fast !== null) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next

  const resultList = new LinkedList()
  resultList.head = head
  return resultList
}

// 渲染3次
for (let i = 0; i <= 2; i++) {
  console.log(i)
}

const list = LinkedList.fromArray([1, 2, 3, 4, 5])
console.log(removeNthFromEnd(list.head, 2).toArray())
