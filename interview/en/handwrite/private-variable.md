# Implementing private variables

```javascript
// Use Proxy — Vue 3 rebuilt reactivity with it
const proxy = function (obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (key.startsWith('_')) {
        throw new Error('private key')
      }
      return Reflect.get(target, key)
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(key => !key.startsWith('_'))
    }
  })
}
// Proxy hides every key that starts with `_` from the outside

const Person1 = (function () {
  const _name = Symbol('name')

  class Person {
    constructor(name) {
      this[_name] = name
    }

    getName() {
      return this[_name]
    }
  }

  return Person
})()
// Private state via closure. Downside: every instance shares the same private variable

class Person2 {
  constructor(name) {
    let _name = name
    this.getName = function () {
      return _name
    }
  }
}
/* This closure style fixes the shared-state issue: each instance has its own private variable.
   Downside: you lose the brevity of class syntax, because privileged methods live on the constructor. */

const Person3 = (function () {
  let wp = new WeakMap()

  class Person {
    constructor(name) {
      wp.set(this, {
        name
      })
    }
    getName() {
      return wp.get(this).name
    }
  }
  return Person
})()
/* WeakMap + closure: on each construct, store the instance and its private fields.
   The WeakMap is not reachable from outside.
   When nothing references an instance, its private data can be GC'd, which reduces leaks. */
```
