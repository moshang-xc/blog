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

// bind实现
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

//new操作符做了什么事情

function