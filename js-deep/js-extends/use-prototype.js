//原型链继承
function Parent() {
  this.name = 'kevin'
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child() {}
/*  参考person=Person.prototype because of person.constructor=Person.prototype.constructor,
 *  所以此处new Parent()对象实际上就是Parent.prototype
 */
Child.prototype = new Parent()

var child1 = new Child()
child1.getName()

//问题：1.引用类型的属性被所有实例共享 2.在创建Child实例时,不能向Parent传参
function Parent() {
  this.names = ['kevin', 'daisy'];
}

function Child() {

}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy", "yayu"]