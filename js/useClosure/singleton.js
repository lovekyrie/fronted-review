const SingStudent = (function () {
  function Student() {}
  let _student
  return function () {
    if (_student)
      return _student
    _student = new Student()
    return _student
  }
})()

const s = new SingStudent()
const s1 = new SingStudent()

console.log(s === s1)
