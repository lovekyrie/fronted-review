# Singleton pattern

```javascript
// Singleton. `construct` intercepts `new` on this function
function proxy(func) {
  // `instance` is a closure over the global call site
  let instance
  const handler = {
    construct(target, args) {
      if (!instance) {
        instance = Reflect.construct(func, args)
      }
      return instance
    },
  }
  return new Proxy(func, handler)
}
// Singleton via ES6 Proxy intercepting the constructor

function Person(name, age) {
  this.name = name
  this.age = age
}

const singletonPerson = proxy(Person)

const person1 = new singletonPerson('lzq', 30)
const person2 = new singletonPerson('zsq', 22) // ignored; returns person1
console.log(person1 === person2)
```
