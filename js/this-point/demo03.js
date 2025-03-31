const obj3 = {
  name: 'Eva',
  greet: function () {
    console.log(this)
    setTimeout(() => {
      // Eve, because arrow function uses 'this' from greet's context
      console.log(this.name)
    }, 100)
  },
}

obj3.greet()

// change style
const obj5 = {
  name: 'Frank',
  greet: function() {
    console.log(this.name)
  }
}

setTimeout(() => obj5.greet(), 100)