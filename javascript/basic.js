// 如果把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind, 这些值在调用时会被忽略，实际应用的是默认绑定规则。
/**
 * call 的核心：
 * 将函数设为传入参数的属性
 * 指定this到函数并传入给定参数执行函数
 * 如果不传入参数或者参数为null， 默认指向为 window / global
 * 删除参数上的函数
 */
// call实现
Function.prototype.mycall = function(target, ...args) {
    target = target || window;
    target.fn = this;

    var result = target.fn(...args);
    delete target.fn;
    return result;
}

Function.prototype.mycall1 = function(target) {
    target = target || window;
    target.fn = this;

    var args = [];
    for (var i = 1, l = arguments.length; i < l; i++) {
        args.push('arguments[' + i + ']');
    }
    args = args.join(', ');
    var result = eval('arget.fn(' + args + ')');
    delete target.fn;
    return result;
}

// apply实现
Function.prototype.myapply = function(target, args) {
    target = target || window;
    target.fn = this;

    var result = target.fn(...args);
    delete target.fn;
    return result;
}

Function.prototype.myapply1 = function(context, arr) {
    var context = context || window; //因为传进来的context有可能是null
    context.fn = this;
    var args = [];
    var params = arr || [];
    for (var i = 0; i < params.length; i++) {
        args.push("params[" + i + "]"); //不这么做的话 字符串的引号会被自动去掉 变成了变量 导致报错
    }
    args = args.join(",");

    var result = eval("context.fn(" + args + ")"); //相当于执行了context.fn(arguments[1], arguments[2]);

    delete context.fn;
    return result; //因为有可能this函数会有返回值return
}

// bind简单实现
Function.prototype.mybind = function(target) {
    target = new Object(target);
    target.fn = this;
    var argsParent = Array.prototype.slice.call(arguments, 1);

    return function() {
        target.fn([...argsParent, ...arguments]);
    }
}

// 先完成参数传递和绑定操作
Function.prototype.bind2 = function(context) {
    var _this = this;
    var argsParent = Array.prototype.slice.call(arguments, 1);
    return function() {
        var args = argsParent.concat(Array.prototype.slice.call(arguments)); //转化成数组
        _this.apply(context, args);
    };
}

// bind完全实现，当bind被当做new的构造函数时，需要保留原型链和原his指向
// 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
Function.prototype.my_bind = function(oThis) {
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function() {},
        fBound = function() {
            // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
            return fToBind.apply(this instanceof fBound ? this : oThis,
                // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系，我们直接将 fBound.prototype = this.prototype，直接修改fBound.prototype的时候，也会直接修改绑定函数的 prototype。
    if (this.prototype) {
        fNOP.prototype = this.prototype;
    }

    fBound.prototype = new fNOP();
    return fBound;
};


//instanceof实现
function instance_of(sub, sup) {
    let supPro = sup.prototype,
        subPro = sub.__proto__;

    while (true) {
        if (subPro === null) {
            return false;
        } else if (subPro === supPro) {
            return true;
        }

        subPro = subPro.__proto__;
    }
}

// ES5继承实现
function inherit(sub, sup) {
    sub.prototype = Object.create(sup.prototype);
    sub.prototype.constructor = sub;
}

var inherit = (function() {
    function F() {};

    return function(sub, sup) {
        F.prototype = sup.prototype;
        sub.prototype = new F();
        sub.protytype.constructor = sub;
    }
});

function SuperType() {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}

function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}

function F() {};
F.prototype = SuperType.prototype;
SubType.prototype = new F();
SubType.prototype.constructor = SubType;

// 深拷贝
function deepClone(obj) {
    if (obj === null) {
        return null;
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj);
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    let t = new obj.constructor();
    for (let key in obj) {
        t[key] = deepClone(obj[key]);
    }
    return t;
}

/**
 * 防抖和节流
 * 防抖的情况下只会调用一次， 而节流的情况会每隔一定时间调用一次函数
 */
function debounce(func, wait, immediate = true) {
    let timeout, context, args;
    // 延迟执行函数
    const later = () => setTimeout(() => {
        // 延迟函数执行完毕，清空定时器
        timeout = null
        // 延迟执行的情况下，函数会在延迟函数中执行
        // 使用到之前缓存的参数和上下文
        if (!immediate) {
            func.apply(context, args);
            context = args = null;
        }
    }, wait);
    let debounced = function(...params) {
        if (!timeout) {
            timeout = later();
            if (immediate) {
                //立即执行
                func.apply(this, params);
            } else {
                //闭包
                context = this;
                args = params;
            }
        } else {
            clearTimeout(timeout);
            timeout = later();
        }
    }
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
};

// 节流
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : Date.now() || new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = Date.now() || new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            // 判断是否设置了定时器和 trailing
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
};

// Object.create 
Object.create = function(o) {
    function f() {}
    f.prototype = 0;
    return new f();
}