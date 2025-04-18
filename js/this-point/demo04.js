function Counter() {
  this.counter = 0;

  setTimeout(function() {
    this.counter++;
    console.log(this.counter);
  }.myBind(this), 100);
}

new Counter();

// 如果想要在setTimeout中使用this，可以使用bind方法 
