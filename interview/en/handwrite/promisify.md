# How promisify works

```javascript
// Promisify for error-first async APIs (e.g. Node.js)
const fs = require('node:fs')

function promisify(asyncFunc) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) {
          return reject(err)
        }
        return resolve(...values)
      })
      asyncFunc.call(this, ...args)
    })
  }
}

const fsp = new Proxy(fs, {
  get(target, key) {
    return promisify(target[key])
  },
})

async function generateCommit() {
  try {
    let data = await fsp.readFile('./promisify.js', 'utf-8')
    data += '\n// I am a comment'
    await fsp.writeFile('./promisify.js', data)
  }
  catch (error) {
    console.log(error)
  }
}
generateCommit()

// I am a comment
/* promisify turns a callback API into a Promise. It fits error-first callbacks (Node.js):
   those APIs always call the last callback on success or failure.
   We only need that callback to settle the Promise.
   Proxy wraps the whole fs module and intercepts get, so we do not have to wrap every method by hand. */
```

## Daily practice reference

### Day 12: promisify in three steps

```text
1. Return a new function
2. Inside it, new Promise
3. Call the original function with an error-first callback: (err, data) => err ? reject : resolve
```

### Day 12: promisify

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}
```
