// 工厂：dir=1 正向 findIndex，dir=-1 反向 findLastIndex
function createIndexFinder(dir) {
  return function (array, predicate, context) {
    const length = array.length
    let index = dir > 0 ? 0 : length - 1

    for (; index >= 0 && index < length; index += dir) {
      if (predicate.call(context, array[index], index, array))
        return index
    }

    return -1
  }
}

const findIndex = createIndexFinder(1)
const findLastIndex = createIndexFinder(-1)
