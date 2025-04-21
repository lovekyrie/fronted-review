const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name)
  },
  arrowGreat: () => {
    console.log(this.name)
  },
}

obj.greet()
obj.arrowGreat()
