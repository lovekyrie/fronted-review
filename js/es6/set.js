// ES6新增了数据结构Set 它类似于数组，但是成员的值都是唯一的

// 初始化，Set是一个构造函数，用来生成Set数据结构
let set = new Set();

// Set参数可以是实现iterator接口的其他数据类型，如数组，类数组等..
set = new Set([1, 2, 3, 4, 4]);
console.log(set);

// set = new Set(document.querySelectorAll("div")); //浏览器使用
console.log(set.size);

set = new Set([1, 2, 3, 4]);
console.log(set.size);

// 属性和方法 1.add(value) 返回set 2.delete(value) 返回布尔 3.has(value) 返回布尔 4.clear无返回
// 遍历方法：1.keys() 返回键名的遍历器 2.values() 返回键值的遍历器 3.entries()返回键值对的遍历器 4.forEach()使用回调函数遍历每个成员 无返回值
console.log(set.clear()); //undefined
console.log(set.add(1).add(2)); //Set[1,2]

console.log(set.delete(2)); //true
console.log(set.has(2)); //false

// 注意keys()、values()、entries()返回的都是遍历器
set = new Set(["a", "b", "c"]);
console.log(set.keys()); // [Set Iterator] {"a", "b", "c"}
console.log([...set.keys()]); //['a','b','c']

console.log(set.values()); // [Set Iterator] {"a", "b", "c"}
console.log([...set.values()]); //['a','b','c']

console.log(set.entries()); // [Set Iterator] {["a",'a'], ['b',"b"], ["c",'c']}
console.log([...set.entries()]); //[["a",'a'], ['b',"b"], ["c",'c']]

set = new Set([1, 2, 3]);
set.forEach((key, value) => {
  console.log(key + ":" + value);
});

/* 属性：
  Set.prototype.constructor：构造函数，默认就是 Set 函数。
  Set.prototype.size：返回 Set 实例的成员总数。
 */
