### TypeScript 基础
TypeScript是JavaScript的超集，它添加了静态类型系统。

#### 1. 基本类型
##### 1.1 原始类型
```typescript
// 基本类型
let str: string = 'hello';
let num: number = 42;
let bool: boolean = true;
let n: null = null;
let u: undefined = undefined;
let sym: symbol = Symbol('key');
let big: bigint = 42n;
```

##### 1.2 数组
```typescript
// 数组类型
let arr1: number[] = [1, 2, 3];
let arr2: Array<string> = ['a', 'b', 'c'];
let arr3: (number | string)[] = [1, 'a', 2];
```

##### 1.3 元组
```typescript
// 元组类型
let tuple: [string, number] = ['hello', 42];
let tuple2: [string, number, boolean] = ['hello', 42, true];
```

##### 1.4 枚举
```typescript
// 枚举类型
enum Color {
  Red,
  Green,
  Blue
}

let color: Color = Color.Red;
console.log(color); // 0

// 字符串枚举
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}
```

#### 2. 接口
##### 2.1 基本接口
```typescript
interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
}

const user: User = {
  name: 'John',
  age: 30,
  id: 1
};
```

##### 2.2 函数接口
```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const search: SearchFunc = (source, subString) => {
  return source.includes(subString);
};
```

##### 2.3 类接口
```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}
```

#### 3. 类
##### 3.1 基本类
```typescript
class Animal {
  private name: string;
  protected age: number;
  public readonly type: string;

  constructor(name: string, age: number, type: string) {
    this.name = name;
    this.age = age;
    this.type = type;
  }

  makeSound(): void {
    console.log('Some sound');
  }
}
```

##### 3.2 继承
```typescript
class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, 'Dog');
  }

  makeSound(): void {
    console.log('Woof!');
  }
}
```

##### 3.3 抽象类
```typescript
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

#### 4. 泛型
##### 4.1 基本泛型
```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>('hello');
let output2 = identity(42); // 类型推断
```

##### 4.2 泛型接口
```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

##### 4.3 泛型类
```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = (x, y) => x + y;
```

#### 5. 类型断言
```typescript
// 类型断言
let someValue: unknown = 'this is a string';
let strLength: number = (someValue as string).length;

// 类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

if (isString(someValue)) {
  console.log(someValue.length);
}
```

#### 6. 高级类型
##### 6.1 联合类型
```typescript
type StringOrNumber = string | number;
let value: StringOrNumber = 'hello';
value = 42;
```

##### 6.2 交叉类型
```typescript
type A = { a: string };
type B = { b: number };
type C = A & B;

const c: C = { a: 'hello', b: 42 };
```

##### 6.3 映射类型
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

#### 7. 最佳实践
1. 使用类型注解
2. 使用接口定义对象结构
3. 使用类型守卫
4. 使用泛型增加代码复用性
5. 使用类型断言谨慎
6. 使用类型别名提高可读性
7. 使用枚举定义常量
8. 使用类实现面向对象
9. 使用模块化组织代码
10. 使用TypeScript配置文件

#### 8. 常见面试题
1. **类型和接口的区别**
   - 类型可以表示联合类型和交叉类型
   - 接口可以合并声明
   - 接口更适合定义对象结构

2. **泛型的使用场景**
   - 函数参数和返回值类型
   - 类属性和方法
   - 接口定义

3. **类型守卫的作用**
   - 缩小类型范围
   - 提供类型安全
   - 改善代码可读性 