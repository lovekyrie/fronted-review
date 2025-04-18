const nanjas = [
  { name: "Yoshi", age: 18 },
  { name: "Hattori", age: 19 },
  { name: "Yagyu", age: 20 },
];

const first = nanjas.map((ninja) => ninja.age);
const second = nanjas.filter(({ age }) => age % 2 === 0);
console.log(second);
