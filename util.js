/**
 * 全局API添加 
 */
if (typeof Object.create !== "function") {
    Object.create = function(proto) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        function F() {}
        F.prototype = proto;
        return new F();
    }
}

/**
 * 全局对象获取
 */
var globalNS = (function getNS() {
    if (typeof self !== 'undefined') {
        return self;
    }

    if (typeof window !== 'undefined') {
        return window;
    }

    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('unable to locate global object');
})();

/**
 * 获取类型
 */
function getType(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
}

/**
 * 深度克隆
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (getType(obj) === 'Date') {
        return new Date(obj);
    }

    if (getType(obj) === 'RegExp') {
        return new RegExp(obj);
    }

    let newObj = new obj.constructor();
    for (let key in obj) {
        newObj[key] = deepClone(obj[key]);
    }
    return newObj;
}

function isUndef(v) {
    return v === undefined || v === null;
}

function isDef(v) {
    return v !== undefined && v !== null;
}

function isObject(v) {
    return v !== null && typeof v === 'object';
}

function isPlainObject(v) {
    return getType(v) === 'Object';
}

function isRegExp(v) {
    return getType(v) === 'RegExp';
}

function toString(v) {
    return v === null ? '' :
        Array.isArray(v) || (isPlainObject(v) && v.toString === Object.prototype.toString) ? JSON.stringify(v) : String(v);
}

function toNumber(v) {
    let n = parseFloat(v);
    return isNaN(n) ? v : n;
}

/**
 * 通过字符串创建一个map
 * 同时返回一个函数用于判断给定的key是否在map内
 */
function makeMap(str, expectLowerCase) {
    let map = Object.create(null);
    let list = str.split(',');
    for (let i = 0, l = list.length; i < l; i++) {
        map[list[i]] = true;
    }

    return expectLowerCase ?
        val => map[val.toLowerCase()] :
        val => map[val];
}

/**
 * 移除数组中指定的项
 */
function remove(arr, item) {
    let index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

/**
 * 根据fn对处理后的内容进行缓存 
 */
function cached(fn) {
    let cached = Object.create(null);
    return function cachedFn(str) {
        let val = cached[str];
        return val || (cached[str] = fn(str));
    }
}

const hyphenateRE = /\B[A-Z]/g;
/**
 * 驼峰转-连接
 */
function hyphenate(str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
}

function no() {
    return false;
}

function noop() {}

function once(fn) {
    let called = false;
    return function() {
        if (called) {
            return;
        }
        called = true;
        fn.apply(this, arguments);
    }
}

/**
 * 平台相关
 */
const UA = window.navigator.userAgent.toLowerCase();
const isIE = /msie|trident/.test(UA);
const idIE9 = UA.indexOf('msie 9.0') > 0;
const isEdge = UA.indexOf('edge/') > 0;
const isAndroid = UA.indexOf('android') > 0;
const isIos = /iphone|ipad|ipod|ios/.test(UA);
const isChrome = /chrome\/\d+/.test(UA) && !isEdge;
const isFF = UA.match(/firefox\/(\d+)/);