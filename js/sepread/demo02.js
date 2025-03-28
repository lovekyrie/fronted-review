// Example showing that the spread operator cannot perform a deep copy
const original = {
  name: "Mikasa",
  details: {
    age: 25,
    hobbies: ["reading", "traveling"]
  } 
};

// Using spread operator to create a shallow copy
const shallowCopy = { ...original };

// Modifying the nested object in the shallow copy
shallowCopy.details.age = 30;
shallowCopy.details.hobbies.push("coding");

console.log("Original Object:", original);
// Output: Original Object: { name: 'Mikasa', details: { age: 30, hobbies: [ 'reading', 'traveling', 'coding' ] } }

console.log("Shallow Copy:", shallowCopy);
// Output: Shallow Copy: { name: 'Mikasa', details: { age: 30, hobbies: [ 'reading', 'traveling', 'coding' ] } }

// The nested object is shared between the original and the shallow copy,
// demonstrating that the spread operator does not perform a deep copy.