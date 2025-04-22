class Rectangle {
  // 补全代码
  constructor(height, width) {
    this.height = height
    this.width = width
  }

  get area() {
    return this.height * this.width
  }
}

const rectangle = new Rectangle(10, 20)
console.log(rectangle.area)
