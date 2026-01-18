// 将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。
// 输入：1->2->4, 1->3->4
// 输出：1->1->2->3->4->4
/**
 * 解题思路
 * 利用迭代或递归。创建一个哨兵节点（dummy node）作为新链表的头部，比较两个链表节点的值，依次接入新链表。
 */
import LinkedList from './LinkedList.js'
import LinkedListNode from './LinkedListNode.js'
/**
 * @param {LinkedListNode} l1
 * @param {LinkedListNode} l2
 * @returns {LinkedList}
 */
function mergeTwoSortedListed(l1, l2) {
  const dummy = new LinkedListNode(0)
  let curr = dummy
  while (l1 !== null && l2 !== null) {
    if (l1.value <= l2.value) {
      curr.next = l1
      l1 = l1.next
    }
    else {
      curr.next = l2
      l2 = l2.next
    }
    curr = curr.next
  }

  curr.next = l1 !== null ? l1 : l2

  const resultList = new LinkedList()
  resultList.head = dummy.next
  return resultList
}

const list1 = LinkedList.fromArray([1, 2, 4])
const list2 = LinkedList.fromArray([1, 3, 4])
console.log(mergeTwoSortedListed(list1.head, list2.head).toArray())
