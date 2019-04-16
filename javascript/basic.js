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

Function.prototype.bind2 = function(context) {
    var _this = this;
    var argsParent = Array.prototype.slice.call(arguments, 1);
    return function() {
        var args = argsParent.concat(Array.prototype.slice.call(arguments)); //转化成数组
        _this.apply(context, args);
    };
}

// bind完全实现，当bind被当做new的构造函数时，需要保留原型链和this指向
Function.prototype.my_bind = function(oThis) {
    if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function() {},
        fBound = function() {
            // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
            return fToBind.apply(this instanceof fBound ? this : oThis,
                // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
        fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
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