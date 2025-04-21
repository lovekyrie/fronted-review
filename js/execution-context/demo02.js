function f1() {
  const n = 999
  function f2() {
    alert(n)
  }

  return f2
}

const result = f1()
result()
