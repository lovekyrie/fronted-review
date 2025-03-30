function add(...rest) {
  return rest.reduce((acc, next) => acc + next, 0)
}

console.log(add(1, 2, 3))

const arr = [1, 2, 3]
Math.max(...arr) // The spread operator unpacks the array elements into individual arguments for Math.max.

Math.max.apply(null, arr) // Equivalent to Math.max(...arr).
console.log(...arr);
