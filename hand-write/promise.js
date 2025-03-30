var PENDING = 'pending'
var FULFILLED = 'fulfilled'
var REJECTED = 'rejected'

function Promise(execute){
  var self = this
  self.state = PENDING
  self.onFulfilledFn = null
  self.onRejectedFn = null

  function resolve(value) {
    if(self.state === PENDING) {
      self.state = FULFILLED
      self.value = value
      self.onFulfilledFn(self.value)
    }
  }

  function reject(reason) {
    if(self.state === PENDING) {
      self.state = REJECTED
      self.reason = reason
      self.onRejectedFn(self.reason)
    }
  }

  try {
    execute(resolve, reject) 
  } catch (error) {
   reject(error) 
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled: function(x) {
    return x
  }
  onRejected = typeof onRejected === 'function' ? onRejected: function(e) {
    throw e
  }

  var self = this
  switch(self.state) {
    case FULFILLED:
      setTimeout(function(){
        onFulfilled(self.value) 
      });
      break
    case REJECTED:
      setTimeout(function() {
        onRejected(self.reason)
      })
      break
    case PENDING:
      // todo 
      self.onFulfilledFn = function() {
        onFulfilled(self.value)
      }
      self.onRejectedFn = function() {
        onRejected(self.reason)
      }
      break
  }
}

export default Promise