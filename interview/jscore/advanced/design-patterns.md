### 设计模式
设计模式是软件开发中常见问题的解决方案，它们提供了可重用的设计思路。

#### 1. 创建型模式
##### 1.1 单例模式 (Singleton)
确保一个类只有一个实例，并提供一个全局访问点。
```js
class Singleton {
  static instance;

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }
}

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

##### 1.2 工厂模式 (Factory)
定义一个创建对象的接口，让子类决定实例化哪个类。
```js
class Product {
  constructor(name) {
    this.name = name;
  }
}

class ProductFactory {
  createProduct(type) {
    switch (type) {
      case 'A':
        return new Product('Product A');
      case 'B':
        return new Product('Product B');
      default:
        throw new Error('Invalid product type');
    }
  }
}

const factory = new ProductFactory();
const productA = factory.createProduct('A');
const productB = factory.createProduct('B');
```

##### 1.3 建造者模式 (Builder)
将一个复杂对象的构建与它的表示分离。
```js
class Car {
  constructor() {
    this.wheels = 0;
    this.engine = '';
    this.color = '';
  }
}

class CarBuilder {
  constructor() {
    this.car = new Car();
  }

  addWheels(wheels) {
    this.car.wheels = wheels;
    return this;
  }

  addEngine(engine) {
    this.car.engine = engine;
    return this;
  }

  addColor(color) {
    this.car.color = color;
    return this;
  }

  build() {
    return this.car;
  }
}

const car = new CarBuilder()
  .addWheels(4)
  .addEngine('V8')
  .addColor('red')
  .build();
```

#### 2. 结构型模式
##### 2.1 适配器模式 (Adapter)
将一个类的接口转换成客户希望的另外一个接口。
```js
class OldInterface {
  oldMethod() {
    return 'old method';
  }
}

class NewInterface {
  newMethod() {
    return 'new method';
  }
}

class Adapter {
  constructor(oldInterface) {
    this.oldInterface = oldInterface;
  }

  newMethod() {
    return this.oldInterface.oldMethod();
  }
}

const oldInterface = new OldInterface();
const adapter = new Adapter(oldInterface);
console.log(adapter.newMethod()); // 'old method'
```

##### 2.2 装饰器模式 (Decorator)
动态地给一个对象添加一些额外的职责。
```js
class Coffee {
  cost() {
    return 5;
  }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost() + 2;
  }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost() + 1;
  }
}

let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(coffee.cost()); // 8
```

##### 2.3 代理模式 (Proxy)
为其他对象提供一种代理以控制对这个对象的访问。
```js
class RealSubject {
  request() {
    return 'real subject';
  }
}

class Proxy {
  constructor(realSubject) {
    this.realSubject = realSubject;
  }

  request() {
    if (this.checkAccess()) {
      return this.realSubject.request();
    }
    return 'access denied';
  }

  checkAccess() {
    return true;
  }
}

const realSubject = new RealSubject();
const proxy = new Proxy(realSubject);
console.log(proxy.request()); // 'real subject'
```

#### 3. 行为型模式
##### 3.1 观察者模式 (Observer)
定义对象间的一种一对多依赖关系。
```js
class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify() {
    this.observers.forEach(observer => observer.update());
  }
}

class Observer {
  update() {
    console.log('observer updated');
  }
}

const subject = new Subject();
const observer = new Observer();
subject.attach(observer);
subject.notify(); // 'observer updated'
```

##### 3.2 策略模式 (Strategy)
定义一系列算法，将每个算法封装起来，并使它们可以互换。
```js
class Strategy {
  execute() {}
}

class StrategyA extends Strategy {
  execute() {
    return 'strategy A';
  }
}

class StrategyB extends Strategy {
  execute() {
    return 'strategy B';
  }
}

class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  executeStrategy() {
    return this.strategy.execute();
  }
}

const context = new Context(new StrategyA());
console.log(context.executeStrategy()); // 'strategy A'
```

##### 3.3 命令模式 (Command)
将请求封装成对象，使发出请求的责任和执行请求的责任分割开。
```js
class Command {
  execute() {}
}

class ConcreteCommand extends Command {
  constructor(receiver) {
    super();
    this.receiver = receiver;
  }

  execute() {
    this.receiver.action();
  }
}

class Receiver {
  action() {
    console.log('receiver action');
  }
}

class Invoker {
  constructor(command) {
    this.command = command;
  }

  executeCommand() {
    this.command.execute();
  }
}

const receiver = new Receiver();
const command = new ConcreteCommand(receiver);
const invoker = new Invoker(command);
invoker.executeCommand(); // 'receiver action'
```

#### 4. 最佳实践
1. 根据具体需求选择合适的设计模式
2. 不要过度使用设计模式
3. 保持代码的简洁性和可维护性
4. 考虑性能影响
5. 注意设计模式之间的组合使用
6. 遵循SOLID原则
7. 使用TypeScript增强类型安全
8. 编写单元测试确保正确性
9. 使用设计模式解决实际问题
10. 持续学习和实践 