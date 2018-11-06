// promise状态常量
const STATUS = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
}

/**
 * 根据参数的不同，返回不同的结果
 * Promise实例：不作处理，直接返回
 * 具有then属性的方法：会将其转为Promise对象，并执行then方法
 * 参数不是具有then方法的对象， 或根本就不是对象: 返回一个新的 Promise 对象， 状态为resolved
 * 不带有任何参数:直接返回一个resolved状态的 Promise 对象。
 */
function promiseResolve(value, resolve, reject) {
    try {
        if (typeof value === 'object' && value.then && typeof value.then === 'function') {
            value.then(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        } else {
            resolve(value);
        }
    } catch (e) {
        reject(e);
    }
}

function Promise(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError(`the resolver ${executor} must be a function.`);
    }

    if (!(this instanceof Promise)) {
        return new Promise(executor);
    }

    let _this = this;

    _this.status = STATUS.PENDING;
    _this.resolvedCallbacks = [];
    _this.rejectedCallbacks = [];
    _this.result = '';

    function resolve(res) {
        if (_this.status === STATUS.PENDING) {
            // 异步执行，保证所有同步的逻辑全部执行完成(then，catch等))
            setTimeout(() => {
                _this.status = STATUS.RESOLVED;
                _this.result = res;
                _this.resolvedCallbacks.forEach((item) => {
                    item(res);
                });
            }, 0);
        }
    }

    function reject(err) {
        if (_this.status === STATUS.PENDING) {
            setTimeout(() => {
                _this.status = STATUS.REJECTED;
                _this.result = err;
                _this.rejectedCallbacks.forEach((item) => {
                    item(err);
                });
            }, 0);
        }
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// 返回一个新的promise
Promise.prototype.then = function (resolveFn, rejectFN) {
    let _this = this,
        newPromise;

    resolveFn = typeof resolveFn === 'function' ? resolveFn : function (res) {
        return res
    };
    rejectFN = typeof rejectFN === 'function' ? rejectFN : function (err) {
        throw err;
    }

    switch (_this.status) {
        case STATUS.RESOLVED:
            newPromise = new Promise((resolve, reject) => {
                try {
                    let val = resolveFn(_this.result);
                    promiseResolve(val, resolve, reject);
                } catch (e) {
                    return reject(e);
                }
            });
            break;
        case STATUS.REJECTED:
            newPromise = new Promise((resolve, reject) => {
                try {
                    let val = rejectFN(_this.result);
                    promiseResolve(val, resolve, reject);
                } catch (e) {
                    return reject(e);
                }
            });
            break;
        default:
            newPromise = new Promise((resolve, reject) => {
                _this.resolvedCallbacks.push(function (data) {
                    try {
                        let val = resolveFn(data);
                        promiseResolve(val, resolve, reject);
                    } catch (e) {
                        return reject(e);
                    }
                });
                _this.rejectedCallbacks.push(function (data) {
                    try {
                        let val = rejectFN(data);
                        promiseResolve(val, resolve, reject);
                    } catch (e) {
                        return reject(e);
                    }
                });
            });
            break;
    }

    return newPromise;
}

Promise.prototype.catch = function (rejectFN) {
    return this.then(null, rejectFN);
}

Promise.resolve = function (val) {
    let promise = new Promise((resolve, reject) => {
        promiseResolve(val);
    });
    return promise;
}

Promise.reject = function (val) {
    let promise = new Promise((resolve, reject) => {
        reject(val);
    });
    return promise;
}

module.exports = Promise;
