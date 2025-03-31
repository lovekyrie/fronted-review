function Counter() {
  this.counter = 0;

  setTimeout(function() {
    this.counter++;
    console.log(this.counter);
  }.myBind(this), 100);
}

new Counter();
