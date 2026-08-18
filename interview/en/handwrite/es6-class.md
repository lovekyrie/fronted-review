# How ES6 class inheritance works

```javascript
/* ES6 class inheritance is parasitic combination inheritance — the best pattern we have.
   Object.create makes an empty object whose prototype is the argument.
   Assign that object to the subclass prototype so:
   instance -> empty object -> superType.prototype.
   Object.create also accepts a second argument for property / accessor descriptors.
   Defining `constructor` there matches default inheritance and keeps it non-enumerable.
   ES6 classes also inherit static methods and static fields.
   Plain parasitic combination inheritance only covers instance-to-instance inheritance;
   class-to-class inheritance needs extra work.
   Object.setPrototypeOf(subType, superType) lets the subclass inherit statics. */
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      value: subType,
      enumerable: false,
      configurable: true,
      writable: true,
      },
  })
  Object.setPrototypeOf(subType, superType)
}
```
