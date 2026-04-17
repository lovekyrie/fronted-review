// 输入一个链表，反转链表后，输出新链表的表头。

/**
 * 解题思路
 * 利用三个指针：`prev`（前驱）、`curr`（当前）、`next`（后继）。遍历链表，依次改变指针指向。
 * 输入: 1->2->3->4->5->NULL
 * 输出: 5->4->3->2->1->NULL
 */

/**
 * @param {LinkedListNode} head
 * @returns {LinkedListNode}
 */
function reverseLinked(head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

const list = LinkedList.fromArray([1, 2, 3, 4, 5])
console.log(reverseLinked(list.head).toArray())
