// 构造函数return的情况

function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === "object" ? ret : obj;
}

function Otaku(name, age) {
  this.strength = 60;
  this.age = age;

  return {
    name: name,
    habit: "Games",
  };
}

var person = objectFactory(Otaku, "Kevin", 18);

console.log("person:" + person.name); // Kevin
console.log("person:" + person.habit); // Games
console.log("person:" + person.strength); // undefined
console.log("person:" + person.age); // undefine

function Otaku1(name, age) {
  this.strength = 60;
  this.age = age;

  return "handsome boy";
}

var person1 = objectFactory(Otaku1, "kevin", 18);

console.log("person1:" + person1.name); // Kevin
console.log("person1:" + person1.habit); // Games
console.log("person1:" + person1.strength); // undefined
console.log("person1:" + person1.age); // undefine
