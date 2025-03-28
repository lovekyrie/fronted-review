/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
var map = function(arr, fn) {
    return arr.reduce((acc, next, idx) =>{
        acc.push(fn(next, idx))
        return acc
    }, [])
};

var arr  = [1,2,3]
var fn = function plusone(n) {
  return n + 1
}

map(arr, fn)