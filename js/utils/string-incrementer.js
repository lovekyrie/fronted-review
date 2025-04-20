function incrementString (strng) {
  // return incrementedString
  const regex = /(\d+)$/;
  const match = strng.match(regex);
  if (match) {
    const len = match[0].length;
    return strng.slice(0, strng.length - len) + (parseInt(match[0]) + 1).toString().padStart(len, "0");
  }
  return strng + "1";
}

// best practice
function incrementedString1(string) {
  if(isNaN(parseInt(string[string.length - 1]))) return string + '1'
  return string.replace(/(0*)([0-9]+)$/, (match, p1, p2) => {
    const incremented = parseInt(p2) + 1;
    return incremented.toString().length > p2.length ? p1.slice(0, -1) + incremented : p1 + incremented
  })
}
console.log(incrementedString1("foo"));
console.log(incrementedString1("foobar23"));
console.log(incrementedString1("foo0042"));
console.log(incrementedString1("foo9"));
console.log(incrementedString1("foo099"));
console.log(incrementedString1("foo000"));
console.log(incrementString('fo99obar99'))
