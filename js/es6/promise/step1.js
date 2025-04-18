class Promise {
  constructor(executor) {
    // 默认状态是等待状态
    this.status = "pending";
    this.value = null;
    this.reason = null;
    //存放成功的回调
    this.onResolvedCallbacks = [];
    //存放失败的回调
    this.onRejectedCallbacks = [];
    const resolve = (data) => {
      if (this.status === "pending") {
        this.value = data;
        this.status = "resolved";
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (data) => {
      if (this.status === "pending") {
        this.reason = data;
        this.status = "rejected";
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}
