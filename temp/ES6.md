# let, const

let 和 const 声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，会导致报错：

```
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

```
var value = "global";

(function() {
    console.log(value);
    let value = 'local';
}());
```

结果并不会打印 "global"，而是报错 `Uncaught ReferenceError: value is not defined`，就是因为 TDZ 的缘故。

对应循环中的`let`会在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域

# 箭头函数

- 没有`this`，不能用`call`、`apply`、`bind`这些方法改变this的指向。
- 没有`arguments`
- 不能通过`new`关键字调用，没有`new.target`
- 没有原型`prototype`，没有`super`

## tip:

JavaScript 函数有两个内部方法：`[[Call]]` 和 `[[Construct]]`。

当通过` new `调用函数时，执行` [[Construct]] `方法，创建一个实例对象，然后再执行函数体，将 this 绑定到实例上。

当直接调用的时候，执行` [[Call]] `方法，直接执行函数体。

箭头函数并没有` [[Construct]]` 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。

# Set

```js
let set = new Set(arg); // srg可为空或arg是具有itarable接口的数据结构
set.size; // 尺寸
set.add(xxx); // 添加某个值，返回Set结构本身。
set.delete(xxx); // 删除某个元素，返回一个布尔值，表示删除是否成功。
set.has(xxx); // 返回布尔值，表示该值是否为Set的成员。
set.clear(); // 清除所有成员，无返回值。
```

# WeakSet

使用同`Set`，但是它与`Set`有一下区别

- WeakSet的成员只能是对象，不能是其它类型的值。
- WeakSet的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其它对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于WeakSet之中。故没有clear方法
- WeakSet没有size属性，不能遍历

> 应用场景：可以用来存储DOM ELEMENT防止内存泄露

# Map

```js
let map = new Map(arg); // arg可以为空活数组
map.size; 
map.set(key, value);
map.get(key);
map.has(key);
map.delete(key);
map.clear();
```

> 严格相等的key会被视为同一个key，NaN除外

# WeakMap

同WeakSet类似：

- key只能是对象
- key是弱引用
- 没有遍历，没有size，没有clear

> 应用场景：DOM作为key，部署私有属性等

# 迭代器Iterator与for of

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。

```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

每一次调用`next`方法，都会返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

> obj[Symbol.iterator] is a function.

for of 遍历的其实是对象的Symbol.iterator属性，以下数据结构默认部署了Symbol.iterator属性：

- 数组
- Set
- Map
- 类数组，如arguments, DOM NodeList
- Generator对象
- 字符串

ES6 为数组、Map、Set 集合内建了以下三种迭代器：

1. entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值。
2. keys() 返回一个遍历器对象，用来遍历所有的键名。
3. values() 返回一个遍历器对象，用来遍历所有的键值。

> 每个集合类型都有一个默认的迭代器，在 for-of 循环中，如果没有显式指定则使用默认的迭代器。数组和 Set 集合的默认迭代器是 values() 方法，Map 集合的默认迭代器是 entries() 方法。

```js
// for of 实现
function forof(obj, cb){
	if(typeof obj[Sysbol.iterator] !== 'function'){
        throw new TypeError(obj + " is not iterable");
    }
    
    if(typeof cb !== 'function'){
        throw new TypeError('cb must be callable');
    }
    
    let iterable = Obj[Symbol.iterator]();
    let result = iterable.next();
    while(!result.done){
        cb(result.value);
        result = result.next();
    }
}
```

**注意，一旦`next`方法的返回对象的`done`属性为`true`，`for...of`循环就会中止，且不包含该返回对象**

```js
// 示例1：
function createIterator1(arr){
    let i = 0;
    return {
        next(){
            return {
                value: arr[i++],
                done: i === arr.length
            }
        }
    }
}
let obj1 = {
    [Symbol.iterator]: ()=> createIterator1([1,2,3])
}
for(let val of obj1){
    console.log(val); // 1 2
}
// 示例2：
function createIterator2(arr){
    let i = 0;
    return {
        next(){
            return {
                value: arr[i],
                done: i++ === arr.length
            }
        }
    }
}
let obj2 = {
    [Symbol.iterator]: ()=> createIterator2([1,2,3])
}
for(let val of obj2){
    console.log(val); // 1 2 3
}
```



# Promise

过

# Generator

调用Generator函数后，该函数并不执行（可以理解为暂缓执行函数），返回的也不是该函数的运行结果。Generator函数返回遍历器对象，只有当调用`next()`方法才会遍历下一个内部状态。


## yield(产出)

只能存在于Generato函数中，不然会报错。yield表达式后面的表达式，只有当调用next()方法时才会执行。

## 例子

```js
function* gen(){
    console.log('first');
    yield 1; // stop
    console.log('second');
    yield 2; // stop
    console.log('third');
    yield 3; // stop
    console.log('fourth');
}

let gg = gen(); 
gen.next(); // first {value: 1, done: false}
gen.next(); // second {value: 2, done: false}
gen.next(); // third {value: 3, done: false}
gen.next(); // fourth {value: undefined, done: true}
gen.next(); // {value: undefined, done: true}
```

Generator函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。

```js
function* f(){
    console.log('执行了！');
}

let ff = f(); 
ff.next(); // 执行了！
```

> forEach的参数是一个普通函数，使用yield会报错。

## next()参数

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

```js
function* dataConsumer(){
    console.log('start');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
	return 'result';
}

let dd = dataConsumer();
dd.next(); // start {value: undefined, done: false}
dd.next('a'); // 1. a {value: undefined, done: false} 
dd.next('b'); // 2. b {value: 'result', done: true}
dd.next('c'); // {value: undefined, done: true}
```

## for ... of 遍历Iterator

```js
function* foo(){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for(let val of foo()){
    console.log(val); // 1 2 3 4 5
}
```

# async, await

`asybc`函数返回一个Promise对象。

`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。

```js
async function f(){
    return 'hello world'
}

f().then(console.log) // hello world
```

> `async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

## await

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象resolve的结果。如果不是 Promise 对象，就直接返回对应的值。

```js
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v)) // 123

async function f1() {
  	let s = await Promise.resolve(123);
    console.log(s); // 123
    return s;
}

f1().then(v => console.log(v)) // 123
```

`await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。

如果`await`后面的异步操作出错，那么等同于`async`函数返回的 Promise 对象被`reject`。

任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行。

```js
async function f(){
    await Promise.reject('出错了');
    return await Promise.resolve('对了'); // 不会执行
}

f().then(console.log).catch(console.log) // 出错了
```

> `await`命令只能用在`async`函数之中，如果用在普通函数，就会报错。

# class

子类没有自己的`this`对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。

```js
class A {
    
}

class B extends A {
    
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

```js
function F(){
    
}

let f = new F();

f.__proto__ === F.prototype
f.constructor === F === F.prototype.constructor
F.prototype.__proto__ === Object.prototype
```

# defineProperty，proxy
