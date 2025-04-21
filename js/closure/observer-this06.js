const a = 10
const obj = {
  a: 20,
}

function fn() {
  console.log(this.a)
}

fn.call(obj)
