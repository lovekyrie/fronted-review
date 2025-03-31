const obj2 = {
  name: 'Dave',
  greet: function() {
    setTimeout(function() {
      console.log(this.name)
    }, 100)
  }
}

obj2.greet()