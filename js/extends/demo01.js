function _typeof(o) {
  '@babel/helpers - typeof'
  // Determines the type of a value, with special handling for symbols.
  return (
    (_typeof
      = typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (o) {
          return typeof o
        }
        : function (o) {
          return o && typeof Symbol == 'function' && o.constructor === Symbol && o !== Symbol.prototype ? 'symbol' : typeof o
        }),
    _typeof(o)
  )
}

function _callSuper(t, o, e) {
  // Calls the superclass constructor (super()) in the subclass constructor.
  return (o = _getPrototypeOf(o)), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e))
}

function _possibleConstructorReturn(t, e) {
  // Ensures the constructor returns an object. Defaults to 'this' if no object is returned.
  if (e && (_typeof(e) == 'object' || typeof e == 'function'))
    return e
  if (void 0 !== e)
    throw new TypeError('Derived constructors may only return object or undefined')
  return _assertThisInitialized(t)
}

function _assertThisInitialized(e) {
  // Ensures 'this' is initialized in the constructor.
  if (void 0 === e)
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')
  return e
}

function _isNativeReflectConstruct() {
  // Checks if the environment supports native Reflect.construct.
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], () => {}))
  }
  catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t
  })()
}

function _getPrototypeOf(t) {
  // Retrieves the prototype of an object.
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
        return t.__proto__ || Object.getPrototypeOf(t)
      }),
    _getPrototypeOf(t)
  )
}

function _inherits(t, e) {
  // Sets up the prototype chain for inheritance.
  if (typeof e != 'function' && e !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }(t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } })), Object.defineProperty(t, 'prototype', { writable: !1 }), e && _setPrototypeOf(t, e)
}

function _setPrototypeOf(t, e) {
  // Sets the prototype of an object.
  return (
    (_setPrototypeOf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
        return (t.__proto__ = e), t
      }),
    _setPrototypeOf(t, e)
  )
}

function _defineProperties(e, r) {
  // Defines properties (methods) on a class's prototype or the class itself.
  for (let t = 0; t < r.length; t++) {
    let o = r[t]
    ;(o.enumerable = o.enumerable || !1), (o.configurable = !0), 'value' in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o)
  }
}

function _createClass(e, r, t) {
  // Creates a class by defining its prototype methods and static methods.
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, 'prototype', { writable: !1 }), e
}

function _toPropertyKey(t) {
  // Converts a value to a property key (string or symbol).
  let i = _toPrimitive(t, 'string')
  return _typeof(i) == 'symbol' ? i : `${i}`
}

function _toPrimitive(t, r) {
  // Converts an object to a primitive value.
  if (_typeof(t) != 'object' || !t)
    return t
  let e = t[Symbol.toPrimitive]
  if (void 0 !== e) {
    let i = e.call(t, r || 'default')
    if (_typeof(i) != 'object')
      return i
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return (r === 'string' ? String : Number)(t)
}

function _classCallCheck(a, n) {
  // Ensures a class constructor is called with 'new'.
  if (!(a instanceof n))
    throw new TypeError('Cannot call a class as a function')
}

let Person = /* #__PURE__ */ _createClass(function Person() {
  // Constructor for the Person class.
  _classCallCheck(this, Person)
  this.type = 'person'
})

let Student = /* #__PURE__ */ (function (_Person) {
  function Student() {
    // Constructor for the Student class.
    _classCallCheck(this, Student)
    return _callSuper(this, Student)
  }
  _inherits(Student, _Person) // Sets up inheritance from Person.
  return _createClass(Student) // Defines the Student class.
})(Person)

// 注意js代码的执行。按照这个文件的顺序执行先执行_inherits把Student的prototype设置为了Person
// 然后再执行到我们调用new Student()的时候会进入到function Student() 这个方法内部
const student = new Student()