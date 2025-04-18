function timeLimit(fn, t) {
  return async function (...args) {
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Time Limit Exceeded'))
      }, t)
    })
    return Promise.race([fn(...args), timeoutPromise])
  }
}

export default timeLimit
