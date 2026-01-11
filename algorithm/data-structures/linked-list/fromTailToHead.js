// 输入一个链表，按链表值从尾到头的顺序返回一个ArrayList。
/**
 * @param {LinkedListNode} head
 * @returns {Array}
 */

import LinkedList from './LinkedList.js'

function fromTailToHead(head) {
  const result = []
  let current = head
  while (current) {
    result.push(current.value)
    current = current.next
  }
  return result.reverse() // 时间复杂度O(n)，空间复杂度O(n)
}

const list = LinkedList.fromArray([1, 2, 3, 4, 5])
console.log(fromTailToHead(list.head))
