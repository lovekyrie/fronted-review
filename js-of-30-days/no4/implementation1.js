/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
function createCounter(init) {
  let initial = init
  return {
    increment() {
      initial++
      return initial
    },
    decrement() {
      initial--
      return initial
    },
    reset() {
      initial = init
      return initial
    },
  }
}

/**
 * const counter = createCounter(5)
 * counter.increment(); // 6
 * counter.reset(); // 5
 * counter.decrement(); // 4
 */
