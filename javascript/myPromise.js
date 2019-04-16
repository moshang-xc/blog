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
            value.then(function(res) {
                resolve(res);
            }, function(err) {
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
Promise.prototype.then = function(resolveFn, rejectFN) {
    let _this = this,
        newPromise;

    resolveFn = typeof resolveFn === 'function' ? resolveFn : function(res) {
        return res
    };
    rejectFN = typeof rejectFN === 'function' ? rejectFN : function(err) {
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
                _this.resolvedCallbacks.push(function(data) {
                    try {
                        let val = resolveFn(data);
                        promiseResolve(val, resolve, reject);
                    } catch (e) {
                        return reject(e);
                    }
                });
                _this.rejectedCallbacks.push(function(data) {
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

Promise.prototype.catch = function(rejectFN) {
    return this.then(null, rejectFN);
}

Promise.resolve = function(val) {
    let promise = new Promise((resolve, reject) => {
        promiseResolve(val);
    });
    return promise;
}

Promise.reject = function(val) {
    let promise = new Promise((resolve, reject) => {
        reject(val);
    });
    return promise;
}

// 如果传入的参数是一个空的可迭代对象，那么此promise对象回调完成(resolve),只有此情况，是同步执行的，其它都是异步返回的。
// 如果传入的参数不包含任何 promise， 则返回一个异步完成。
// 如果参数中有一个promise失败，那么Promise.all返回的promise对象失败。
// 在任何情况下， Promise.all 返回的 promise 的完成状态的结果都是一个数组。
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let index = 0;
        let result = [];
        if (promises.length === 0) {
            resolve(result);
        } else {
            setTimeout(() => {
                function processValue(i, data) {
                    result[i] = data;
                    if (++index === promises.length) {
                        resolve(result);
                    }
                }
                for (let i = 0; i < promises.length; i++) {
                    //promises[i] 可能是普通值
                    Promise.resolve(promises[i]).then((data) => {
                        processValue(i, data);
                    }, (err) => {
                        reject(err);
                        return;
                    });
                }
            })
        }
    });
}

// 不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then。
Promise.prototype.finally = function(callback) {
    return this.then((value) => {
        return Promise.resolve(callback()).then(() => {
            return value;
        });
    }, (err) => {
        return Promise.resolve(callback()).then(() => {
            throw err;
        });
    });
}

module.exports = Promise;