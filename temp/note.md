## 原型，原型链，构造函数，实例

![原型和原型链](./img/prototype5.png)

> \_\_ptoto\__: 原型对象链或者隐式原型，每个对象都有`__proto__`属性，指向了创建该对象的构造函数的原型，`__proto__`将对象连接起来组成了原型链。

- 实例.\_\_proto__ === 原型
- 原型.constructor === 构造函数
- 构造函数.prototype === 原型
- 实例.constructor = 构造函数

```js
function Person() {
}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

**原型**
在 JavaScript 中，每当定义一个对象（函数也是对象）时候，对象中都会包含一些预定义的属性。其中每个函数对象都有一个prototype 属性，这个属性指向函数的原型对象。使用原型对象的好处是所有对象实例共享它所包含的属性和方法。原型上定义的属性和方法是共享的，构造函数内定义的是私有的。

**原型链**
每个对象拥有一个原型对象，通过 \_\_proto__ (读音: dunder proto) 指针指向其原型对象，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null(Object.proptotype.\_\_proto__ 指向的是null)。这种关系被称为原型链 (prototype chain)，通过原型链一个对象可以拥有定义在其他对象中的属性和方法。原型链解决的主要是继承问题。

**prototype 和 __proto__ 区别是什么**

- `prototype`是构造函数的属性。
- `__proto__`是每个实例都有的属性，可以访问 [[prototype]] 属性。

实例的`__proto__`与其构造函数的`prototype`指向的是同一个对象。

### 补充

#### constructor

首先是 constructor 属性，我们看个例子：

```js
function Person() {

}
var person = new Person();
console.log(person.constructor === Person); // true
```

**当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取**，正好原型中有该属性，所以：

```js
person.constructor === Person.prototype.constructor
```

#### \_\_proto__

其次是 \_\_proto__ ，绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.\_\_proto__ 时，可以理解成返回了 Object.getPrototypeOf(obj)。

### 继承

```js
function inherit(sub, sup){
    sub.prototype = Object.create(sup.prototype);
    sub.protytype.constructor = sub;
}

// 或
function inherit = (function(){
    let F= function(){};
    
    return function(sub, sup){
        F.prototype = sup.prototype;
        sub.prototype = new F();
        sub.protytype.constructor = sub;
    }
})();
```

#### 真的是继承吗？

最后是关于继承，前面我们讲到“每一个对象都会从原型‘继承’属性”，实际上，继承是一个十分具有迷惑性的说法，引用《你不知道的JavaScript》中的话，就是：

继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

# 对象字面量{}， new Object()和Object.create()有什么区别？

```js
var s = {},
    k = new Object(),
    k1 = new Object(1), // 等价于 new Number(1);
    h = Object.create({});// 传入的参数即为创建对象的`__proto__`

s.__proto__ === Object.prototype // true
k.__proto__ === Object.prototype // true
k1.__proto__ === Object.prototype // false
k1.__proto__ === Number.prototype // true
h.__proto__ === Object.prototype // false
```

**解释**:

**Object()**

`Object` 构造函数为给定值创建一个对象包装器。如果给定值是 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，将会创建并返回一个空对象，否则，将返回一个与给定值对应类型的对象。当以非构造函数形式被调用时，`Object` 等同于 `new Object()`。

**Object.create()**

`Object.create()`方法接受两个参数:`Object.create(obj,propertiesObject)`
`obj`:一个对象，应该是新创建的对象的原型。
`propertiesObject`：可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，也就是说该对象的原型链上属性是无效的。

Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法,例如：toString(), hasOwnProperty()等方法

Vue源码中的extend就是通过`Object.create`来实现的。

#### new 运算符的执行过程？

1. 一个全新的对象会凭空创建（就是被构建）
2. *这个新构建的对象会被接入原形链（[[Prototype]]-linked）*
3. 这个新构建的对象被设置为函数调用的 `this` 绑定
4. 除非函数返回一个它自己的其他 **对象**，否则这个被 `new` 调用的函数将 *自动* 返回这个新构建的对象。

```js
function new(func){
    let target = {};
    let Constructor = [].shift.call(arguments);
    target.__proto__ = Constructor.prototype;
    var res = Constructor.apply(target, arguments);
    
    return typeof res === 'object' ? res : target;
}
```

## null和undefined

JavaScript的最初版本是这样区分的：**null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。**

```js
Number(null)
// 0

5 + null
// 5

Number(undefined)
// NaN

5 + undefined
// NaN
```

按存储来分析给一个全局变量赋值为null，相当于将这个变量的指针对象以及值清空，如果是给对象的属性 赋值为null，或者局部变量赋值为null，相当于给这个属性分配了一块空的内存，然后值为null， JS会回收全局变量为null的对象。

给一个全局变量赋值为undefined，相当于将这个对象的值清空，但是这个对象依旧存在，如果是给对象的属性赋值 为undefined，说明这个值为空值

声明了一个变量，但未对其初始化时，这个变量的值就是undefined，它是 JavaScript 基本类型 之一。

```
var data;
console.log(data === undefined); //true
```

**对于尚未声明过的变量，只能执行一项操作，即使用typeof操作符检测其数据类型**，使用其他的操作都会报错。

```
//data变量未定义
console.log(typeof data); // "undefined"
console.log(data === undefined); //报错
```

值 `null` 特指对象的值未设置，它是 JavaScript 基本类型 之一。

值 `null` 是一个字面量，它不像[`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined) 是全局对象的一个属性。`null` 是表示缺少的标识，指示变量未指向任何对象。

```
// foo不存在，它从来没有被定义过或者是初始化过：
foo;
"ReferenceError: foo is not defined"

// foo现在已经是知存在的，但是它没有类型或者是值：
var foo = null; 
console.log(foo);	// null
```

## 数组去重

```js
// 排序去重
function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
    for (var i = 0, len = sortedArray.length; i < len; i++) {
        // 如果是第一个元素或者相邻的元素不相同
        if (!i || seen !== sortedArray[i]) {
            res.push(sortedArray[i])
        }
        seen = sortedArray[i];
    }
    return res;
}

// Object去重  有问题无法区分1和'1'等
function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        return obj.hasOwnProperty(item) ? false : (obj[item] = true)
    })
}

// Es6
function unique(array) {
   return Array.from(new Set(array));
}

var unique = (a) => [...new Set(a)]

// map
function unique (arr) {
    const seen = new Map()
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}
```

## 类型判断

### typeof

typeof 是一元操作符，放在其单个操作数的前面，操作数可以是任意类型。返回值为表示操作数类型的一个字符串。

```js
typeof 'moshang' // string
```

typeof操作对应的值

| typeof | Undefined | Null   | Boolean | Number | String | Object | Function |
| ------ | --------- | ------ | ------- | ------ | ------ | ------ | -------- |
| 值     | undefined | object | boolean | number | string | object | function |

### instanceof

`instanceof `运算符用来检测 `constructor.prototype `是否存在于参数 `object` 的原型链上。

instanceof 是通过原型链判断的，A instanceof B, 在A的原型链中层层查找，是否有原型等于B.prototype，如果一直找到A的原型链的顶端(null;即Object.prototype.__proto__),仍然不等于B.prototype，那么返回false，否则返回true.

> 对于内置的基础数据类型，`instanceof`的返回值永远都是`false`

```js
'a' instanceof String // false
true instanceof Boolean // false
new Boolean(true) instanceof Boolean // true

```

**insranceof实现**

```js
function instanceof(sub, sup){
    let subPro = sub.__proto__,
        supPro = sup.prototype;

    while(true){
        if(subPro === null){
            return false;
        }else if(subPro === supPro){
            return true;
        }
        subPro = subPro.__proto__;
    }
}
```

### Object.prototype.toString

```js
// 以下是11种：
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]

console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]

function a() {
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
a();
```

### type API

```js
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    // 一箭双雕
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}
```

### plainObject

除了 {} 和 new Object 创建的之外，jQuery 认为一个没有原型的对象也是一个纯粹的对象。

```js
// 相当于 Object.prototype.toString
var toString = ({}).toString;
// 相当于 Object.prototype.hasOwnProperty
var hasOwn = ({}).hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;

    // 排除掉明显不是obj的以及一些宿主对象如Window
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }

    /**
     * getPrototypeOf es5 方法，获取 obj 的原型
     * 以 new Object 创建的对象为例的话
     * obj.__proto__ === Object.prototype
     */
    proto = Object.getPrototypeOf(obj);

    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
        return true;
    }

    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    // hasOwn.toString返回当前函数源代码的字符串，参考Function.prototype.toString
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object); 
}
```



### EmptyObject

jQuery提供了 `isEmptyObject` 方法来判断是否是空对象，代码简单，我们直接看源码：

```js
function isEmptyObject( obj ) {

        var name;

        for ( name in obj ) {
            return false;
        }

        return true;
}
```

### window

```js
function isWindow( obj ) {
    return obj != null && obj === obj.window;
}
```

### isArrayLike

```js
function isArrayLike(obj) {

    // obj 必须有 length属性
    var length = !!obj && "length" in obj && obj.length;
    var typeRes = type(obj);

    // 排除掉函数和 Window 对象
    if (typeRes === "function" || isWindow(obj)) {
        return false;
    }

    return typeRes === "array" || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}
```

#### 思考题

```
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

a.x 	// --> undefined
b.x 	// --> {n: 2}
```

答案已经写上面了，这道题的关键在于

- 1、优先级。`.`的优先级高于`=`，所以先执行`a.x`，堆内存中的`{n: 1}`就会变成`{n: 1, x: undefined}`，改变之后相应的`b.x`也变化了，因为指向的是同一个对象。
- 2、赋值操作是`从右到左`，所以先执行`a = {n: 2}`，`a`的引用就被改变了，然后这个返回值又赋值给了`a.x`，**需要注意**的是这时候`a.x`是第一步中的`{n: 1, x: undefined}`那个对象，其实就是`b.x`，相当于`b.x = {n: 2}`