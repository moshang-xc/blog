/**
 * promise-polyfill添加注释
 * https://github.com/taylorhakes/promise-polyfill
 * 预设示例
 * let promise = new Promise.resolve();
 */

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function isArray(x) {
    return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
    return function() {
        fn.apply(thisArg, arguments);
    };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
    if (!(this instanceof Promise))
        throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    /** @type {!number} */
    // pending: 0、fulfilled: 1、rejected: 2
    this._state = 0;

    this._handled = false;

    this._value = undefined;

    this._deferreds = [];

    doResolve(fn, this);
}

/**
 * 如果 x 为 Promise，则使promise接收x的状态
 * 1. 如果 x 处于pendding，promise需要保持为pendding状态直至x被解决或拒绝
 * 2. 如果 x 处于fulFilled，用相同的值执行 promise
 * 3. 如果 x 处于rejected，用相同的据因拒绝 promise
 */
function handle(self, deferred) {
    while (self._state === 3) {
        self = self._value;
    }
    if (self._state === 0) {
        // 当promise.then()多次调用(单独调用，非链式调用)时，所有的then都应该被处理，故需要用数组来存储
        self._deferreds.push(deferred);
        return;
    }
    self._handled = true;
    Promise._immediateFn(function() {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
            // 若then方法未传入对应的回调，那么Promise的值会被传递到下一次then方法中
            (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
            return;
        }
        var ret;
        try {
            ret = cb(self._value);
        } catch (e) {
            reject(deferred.promise, e);
            return;
        }
        resolve(deferred.promise, ret);
    });
}

function resolve(self, newValue) {
    try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self)
            throw new TypeError('A promise cannot be resolved with itself.');
        if (
            newValue &&
            (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
            var then = newValue.then;
            // 纯粹的promise对象
            if (newValue instanceof Promise) {
                self._state = 3;
                self._value = newValue;
                finale(self);
                return;
            } else if (typeof then === 'function') {
                // thenable对象
                doResolve(bind(then, newValue), self);
                return;
            }
        }
        // fulfilled
        self._state = 1;
        self._value = newValue;
        finale(self);
    } catch (e) {
        // 调用resolve，promise的状态也可以为rejected
        reject(self, e);
    }
}

function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
}

// 与then相关
function finale(self) {
    // 打印未处理的rejected
    if (self._state === 2 && self._deferreds.length === 0) {
        Promise._immediateFn(function() {
            if (!self._handled) {
                Promise._unhandledRejectionFn(self._value);
            }
        });
    }

    // 处理收集的then
    for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
    // done用于防止resolve和reject同时被调用，Promise标准规定了，其状态只能从pending->fulfilled或pending->rejected
    var done = false;
    try {
        fn(
            function(value) {
                if (done) return;
                done = true;
                resolve(self, value);
            },
            function(reason) {
                if (done) return;
                done = true;
                reject(self, reason);
            }
        );
    } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
    }
}

Promise.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
    // @ts-ignore
    // this.constructor为Promise构造函数，prom的状态目前已知保持为pending状态因为noop为空函数
    var prom = new this.constructor(noop);

    // 传入的onFulfilled, onRejected不为function时，重置为null
    handle(this, new Handler(onFulfilled, onRejected, prom));
    // 返回全新promise对象，不能直接返回this因为Promise的状态改变时单向的，且只能改变一次
    return prom;
};

Promise.prototype['finally'] = promiseFinally;

Promise.all = function(arr) {
    return new Promise(function(resolve, reject) {
        if (!isArray(arr)) {
            return reject(new TypeError('Promise.all accepts an array'));
        }

        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
            try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = val.then;
                    if (typeof then === 'function') {
                        then.call(
                            val,
                            function(val) {
                                res(i, val);
                            },
                            reject
                        );
                        return;
                    }
                }
                args[i] = val;
                if (--remaining === 0) {
                    resolve(args);
                }
            } catch (ex) {
                reject(ex);
            }
        }

        for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    });
};

Promise.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
    }

    return new Promise(function(resolve) {
        resolve(value);
    });
};

Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
        reject(value);
    });
};

Promise.race = function(arr) {
    return new Promise(function(resolve, reject) {
        if (!isArray(arr)) {
            return reject(new TypeError('Promise.race accepts an array'));
        }

        for (var i = 0, len = arr.length; i < len; i++) {
            Promise.resolve(arr[i]).then(resolve, reject);
        }
    });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
    // @ts-ignore
    (typeof setImmediate === 'function' &&
        function(fn) {
            // @ts-ignore
            setImmediate(fn);
        }) ||
    function(fn) {
        setTimeoutFunc(fn, 0);
    };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
};

export default Promise;