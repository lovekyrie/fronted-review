export default class Comparator {
  // 可以自定义比较方式
  constructor(compareFunction) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  /**
   * 默认比较方法
   * @param {string|number} a
   * @param {string|number} b
   * @returns {boolean}
   */
  static defaultCompareFunction(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

  /**
   * 比较两个参数是否相等
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  equal(a, b) {
    return this.compare(a, b) === 0;
  }

  /**
   * 比较a是否小于b
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  lessThan(a, b) {
    return this.compare(a, b) < 0;
  }

  /**
   * 比较a是否大于b
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  greaterThan(a, b) {
    return this.compare(a, b) > 0;
  }

  /**
   * 比较a小于等于b
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  lessThanOrEqual(a, b) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  /**
   * 比较a大于等于b
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  greaterThanOrEqual(a, b) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  /**
   * 反转参数
   */
  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a, b) => this.compareOriginal(b, a);
  }
}
