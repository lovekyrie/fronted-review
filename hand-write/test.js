const obj = {
  name: 'John',
  foo() {
    setTimeout(() => {
      console.log(this.name)
    }, 100)
  },
}

const foo = obj.foo // 'John'
foo() // undefined
