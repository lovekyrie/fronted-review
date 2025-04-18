export default class LinkedListNode {
  /**
   * 一个链表节点有值跟指向下一个节点的指针组成(除了尾节点)
   * @param {*} value
   * @param {*} next
   */
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }

  /**
   * 当有回调方法时，直接调用回调方法的取值方式
   * @param {*} callback
   * @returns
   */
  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
