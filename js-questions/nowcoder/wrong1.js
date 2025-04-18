class Cls {
  count = 0
  constructor() {
    this.count++
  };
};
class Son extends Cls {};
const res = new Son()
const res1 = new Son()
console.log(res.count)
console.log(res1.count)
