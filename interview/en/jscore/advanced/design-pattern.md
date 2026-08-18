### Design Patterns
Design patterns are solutions to common problems in software development. They provide reusable design ideas.

#### 1. Creational Patterns
##### 1.1 Singleton
Ensures a class has only one instance and provides a global access point.
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

##### 1.2 Factory
Defines an interface for creating objects and lets subclasses decide which class to instantiate.
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

##### 1.3 Builder
Separates the construction of a complex object from its representation.
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

#### 2. Structural Patterns
##### 2.1 Adapter
Converts one class's interface into another interface that clients expect.
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

##### 2.2 Decorator
Dynamically adds extra responsibilities to an object.
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

##### 2.3 Proxy
Provides a surrogate for another object to control access to it.
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

#### 3. Behavioral Patterns
##### 3.1 Observer
Defines a one-to-many dependency between objects.
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

##### 3.2 Strategy
Defines a family of algorithms, encapsulates each one, and makes them interchangeable.
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

##### 3.3 Command
Encapsulates a request as an object, separating the responsibility of issuing a request from that of executing it.
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

#### 4. Best Practices
1. Choose the right design pattern based on the actual need
2. Do not overuse design patterns
3. Keep the code simple and maintainable
4. Consider performance impact
5. Pay attention to combining design patterns
6. Follow the SOLID principles
7. Use TypeScript to strengthen type safety
8. Write unit tests to ensure correctness
9. Use design patterns to solve real problems
10. Keep learning and practicing
