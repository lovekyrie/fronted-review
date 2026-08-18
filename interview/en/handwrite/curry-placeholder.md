# Function curry (with placeholders)

```javascript
function curry3(fn, placeholder = '_') {
  curry3.placeholder = placeholder
  if (fn.length <= 1)
    return fn
  const argsList = []
  const generator = (...args) => {
    let currentPlaceholderIndex = -1
    args.forEach((arg) => {
      const placeholderIndex = argsList.findIndex(item => item === curry3.placeholder)
      if (placeholderIndex < 0) {
        // No placeholder in the list yet — append
        currentPlaceholderIndex = argsList.push(arg) - 1
        // Do not fill a placeholder that belongs to the current round
        // (1, '_')('_', 2) — 2 should fill the placeholder after 1, not the one before 2
      }
      else if (placeholderIndex !== currentPlaceholderIndex) {
        argsList[placeholderIndex] = arg
      }
      else {
        argsList.push(arg)
      }
    })
    const realArgsList = argsList.filter(arg => arg !== curry3.placeholder)
    if (realArgsList.length === fn.length) {
      return fn(...argsList)
    }
    else if (realArgsList.length > fn.length) {
      throw new Error('too many arguments for the original function')
    }
    else {
      return generator
    }
  }
  return generator
}

const fn = curry3((a, b, c) => {
  console.log([a, b, c])
})
fn('a', '_', 'c')('b')

const display = (a, b, c, d, e, f, g, h) => console.log([a, b, c, d, e, f, g, h])
const curriedDisplay = curry3(display)
curriedDisplay('_', 2)(1, '_')(3)(4, '_')('_', 5)(6)(7, 8)
/* Placeholders make curry more flexible.
   Each new batch first fills placeholders from previous batches.
   Placeholders in the current batch go to the end of the internal list
   and are not filled by other args from the same batch. */
```
