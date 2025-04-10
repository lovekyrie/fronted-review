debugger;
const findIndex = require('./findIndex')
const findLastIndex = require('./findLastIndex')
const sortedIndex = require('./sortedIndex')

// indexOf 第一版
function createIndexOfFinder(dir) {
  return function (array, item) {
    var length = array.length
    var index = dir > 0 ? 0 : length - 1
    for (; index >= 0 && index < length; index += dir) {
      if (array[index] === item) return index
    }
    return -1
  }
}

var indexOf = createIndexOfFinder(1)
var lastIndexOf = createIndexOfFinder(-1)

var result = indexOf([1, 2, 3, 4, 5], 2)
console.log(result)

/* indexOf 可以传参数fromIndex 
 设定开始查找的位置。 如果该索引值大于或等于数组长度， 意味着不会在数组里查找， 返回 - 1。 
如果参数中提供的索引值是一个负值， 则将其作为数组末尾的一个抵消， 即 - 1 表示从最后一个元素开始查找， - 2 表示从倒数第二个元素开始查找， 以此类推。
 注意： 如果参数中提供的索引值是一个负值， 仍然从前向后查询数组。 如果抵消后的索引值仍小于 0， 则整个数组都将会被查询。 其默认值为 0。
 exp: 
    var array = [2, 5, 9];
    array.indexOf(2); // 0
    array.indexOf(7); // -1
    array.indexOf(9, 2); // 2
    array.indexOf(2, -1); // -1
    array.indexOf(2, -3); // 0
  */
/* lastIndexOf 可以传参数fromIndex 
从此位置开始逆向查找。 默认为数组的长度减 1(arr.length - 1)， 即整个数组都被查找。
 如果该值大于或等于数组的长度， 则整个数组会被查找。 如果为负值， 将其视为从数组末尾向前的偏移(-1表示偏移一位，就是数组的最后一位)。
  即使该值为负， 数组仍然会被从后向前查找。 如果该值为负时， 其绝对值大于数组长度， 则方法返回 - 1， 即数组不会被查找
exp: 
   var array = [2, 5, 9];
   array.indexOf(2); // 0
   array.indexOf(7); // -1
   array.indexOf(9, 2); // 2
   array.indexOf(2, -1); // -1
   array.indexOf(2, -3); // 0
 */

// 第四版 增加isNaN判断，并且优化：支持对有序的数组进行更快的二分查找
function createIndexOfFinderV4(dir, predicate, sortedIndex) {
  return function (array, item, idx) {
    var length = array.length;
    var i = 0;

    if (typeof idx === 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(length + idx, 0)
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item)
      //如果该插入的位置的值正好等于元素的值，说明是第一个符合要求的值
      return array[idx] === item ? idx : -1
    }

    //判断是否是NaN
    if (item !== item) {
      idx = predicate(array.slice(i, length), isNaN)
      return idx >= 0 ? idx + i : -1
    }

    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx
    }
    return -1
  }
}

var indexOf = createIndexOfFinderV4(1, findIndex, sortedIndex)
var lastIndexOf = createIndexOfFinderV4(-1, findLastIndex)