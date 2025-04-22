class Human {
  constructor(name) {
    this.name = name
    this.kingdom = 'animal'
    this.colors = ['yellow', 'white', 'brown', 'black']
  }

  getName() {
    return this.name
  }
}

class Man extends Human {
  constructor(name, age) {
    // 调用父类构造函数
    super(name)
    this.age = age
  }

  getAge() {
    return this.age
  }
}
