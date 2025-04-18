// 模版字符串

// eg1. 如果要在字符串中用反撇号，可以用\转义
let message = `hello \` world`;
console.log(message);

// eg2. 在模板字符串中，空格、缩进、换行都会被保留,并且可以使用trim()
message = `
	<ul>
		<li>1</li>
		<li>2</li>
	</ul>
`;
console.log(message);
console.log(message.trim());

// eg3. 嵌入变量（任何表达式都可以），并支持嵌套
let x = 1,
  y = 2;
message = `<ul><li>${x}</li><li>${x + y}</li></ul>`;
console.log(message); // <ul><li>1</li><li>3</li></ul>

let arr = [{ value: 1 }, { value: 2 }];
message = `
	<ul>
		${arr
      .map((item) => {
        return `
				<li>${item.value}</li>
			`;
      })
      .join("")} 
	</ul>
`;
console.log(message);
//注意这里加join的原因(ps:加的位置是因为数组map之后还是一个数组)是当{}内的内容不是字符串时，会进行转换 [1,2,3] 转成字符串就是1,2,3
