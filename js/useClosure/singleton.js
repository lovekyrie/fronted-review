var SingStudent = (function () {
  function Student() {}
  var _student
  return function () {
    if (_student) return _student
    _student = new Student()
    return _student
  }
})()

var s = new SingStudent()
var s1 = new SingStudent()

console.log(s === s1)
