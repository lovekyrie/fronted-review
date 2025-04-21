// 借用构造函数（经典）
function Parent() {
  this.names = ['kevin', 'daisy']
}

function Child() {
  Parent.call(this)
}

const child1 = new Child()
const child2 = new Child()
child1.names.push('yayu')

console.log(child1.names)
console.log(child2.names)
// 优点 1.避免了引用类型属性被所有实例共享2.可以在Child中向Parent传值
/* function Parent(name) {
  this.name = name;
}

function Child(name) {
  Parent.call(this, name);
}

var child1 = new Child('kevin');

console.log(child1.name); // kevin

var child2 = new Child('daisy');

console.log(child2.name); // daisy */
// 缺点：方法都在构造函数中定义，每次创建实例都会创建一遍
