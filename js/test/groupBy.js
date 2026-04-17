const arr = [
  { name: 'John', age: 20 },
  { name: 'Jane', age: 21 },
  { name: 'Jim', age: 20 },
  { name: 'Jill', age: 21 },
]
function groupBy(arr, key) {
  return arr.reduce((acc, curr) => {
    const group = curr[key]
    if (!acc[group])
      acc[group] = []
    acc[group].push(curr)
    return acc
  }, {})
}

const obj = groupBy(arr, 'age')
console.log(Object.values(obj))

function groupBy2(arr) {
  return Object.values(arr.reduce((acc, curr) => {
    const { age, name } = curr
    if (!acc[age]) {
      acc[age] = { age, name: [] }
    }
    acc[age].name.push(name)
    return acc
  }, {}))
}
const obj2 = groupBy2(arr)
console.log(obj2)
