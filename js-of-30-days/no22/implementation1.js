/**
 * @return {null | boolean | number | string | Array | object}
 */
// eslint-disable-next-line no-extend-native
Array.prototype.last = function () {
  if (this.length === 0)
    return -1
  return this[this.length - 1]
}
