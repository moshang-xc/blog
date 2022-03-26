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

**箭头函数并没有` [[Construct]]` 方法，不能被用作构造函数，如果通过 new 的方式调用，会报错。**

# Set, Map

Set 和 Map 主要的应用场景在于 **数据重组** 和 **数据储存**

Set 是一种叫做**集合**的数据结构，Map 是一种叫做**字典**的数据结构

## 1. 集合（Set）

ES6 新增的一种新的数据结构，类似于数组，但成员是唯一且无序的，没有重复的值。

**Set 本身是一种构造函数，用来生成 Set 数据结构。**

```js
new Set([iterable])
```

举个例子：

```js
const s = new Set()
[1, 2, 3, 4, 3, 2, 1].forEach(x => s.add(x))

for (let i of s) {
    console.log(i)	// 1 2 3 4
}

// 去重数组的重复对象
let arr = [1, 2, 3, 2, 1, 1]
[... new Set(arr)]	// [1, 2, 3]
```

Set 对象允许你储存任何类型的唯一值，无论是原始值或者是对象引用。

**向 Set 加入值的时候，不会发生类型转换，所以`5`和`"5"`是两个不同的值**。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于**精确相等**运算符（`===`），主要的区别是**`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。**

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}

let set1 = new Set()
set1.add(5)
set1.add('5')
console.log([...set1])	// [5, "5"]
```

- Set 实例属性

  - constructor： 构造函数

  - size：元素数量

    ```js
    let set = new Set([1, 2, 3, 2, 1])
    
    console.log(set.length)	// undefined
    console.log(set.size)	// 3
    ```

- Set 实例方法

  - 操作方法

    - add(value)：新增，相当于 array里的push

    - delete(value)：存在即删除集合中value

    - has(value)：判断集合中是否存在 value

    - clear()：清空集合

      ------

      ```js
      let set = new Set()
      set.add(1).add(2).add(1)
      
      set.has(1)	// true
      set.has(3)	// false
      set.delete(1)	
      set.has(1)	// false
      ```

      `Array.from` 方法可以将 Set 结构转为数组

      ```js
      const items = new Set([1, 2, 3, 2])
      const array = Array.from(items)
      console.log(array)	// [1, 2, 3]
      // 或
      const arr = [...items]
      console.log(arr)	// [1, 2, 3]
      ```

  - 遍历方法（遍历顺序为插入顺序）

    - keys()：返回一个包含集合中所有键的迭代器

    - values()：返回一个包含集合中所有值得迭代器

    - entries()：返回一个包含Set对象中所有元素得键值对迭代器

    - forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，回调中的this会是这个参数，**没有返回值**

      ```js
      let set = new Set([1, 2, 3])
      console.log(set.keys())	// SetIterator {1, 2, 3}
      console.log(set.values())	// SetIterator {1, 2, 3}
      console.log(set.entries())	// SetIterator {1, 2, 3}
      
      for (let item of set.keys()) {
        console.log(item);
      }	// 1	2	 3
      for (let item of set.entries()) {
        console.log(item);
      }	// [1, 1]	[2, 2]	[3, 3]
      
      set.forEach((value, key) => {
          console.log(key + ' : ' + value)
      })	// 1 : 1	2 : 2	3 : 3
      console.log([...set])	// [1, 2, 3]
      ```

      Set 可默认遍历，默认迭代器生成函数是 values() 方法

      ```js
      Set.prototype[Symbol.iterator] === Set.prototype.values	// true
      ```

      所以， Set可以使用 map、filter 方法

      ```js
      let set = new Set([1, 2, 3])
      set = new Set([...set].map(item => item * 2))
      console.log([...set])	// [2, 4, 6]
      
      set = new Set([...set].filter(item => (item >= 4)))
      console.log([...set])	//[4, 6]
      ```

      因此，Set 很容易实现交集（Intersect）、并集（Union）、差集（Difference）

      ```js
      let set1 = new Set([1, 2, 3])
      let set2 = new Set([4, 3, 2])
      
      let intersect = new Set([...set1].filter(value => set2.has(value)))
      let union = new Set([...set1, ...set2])
      let difference = new Set([...set1].filter(value => !set2.has(value)))
      
      console.log(intersect)	// Set {2, 3}
      console.log(union)		// Set {1, 2, 3, 4}
      console.log(difference)	// Set {1}
      ```

## 2. WeakSet

WeakSet 对象允许你将**弱引用对象**储存在一个集合中

WeakSet 与 Set 的区别：

- WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
- WeakSet 对象中储存的对象值都是被弱引用的，即垃圾回收机制不考虑 WeakSet 对该对象的引用，如果没有其他的变量或属性引用这个对象值，则这个对象将会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以，WeakSet 对象里有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数可能不一致，遍历结束之后，有的成员可能取不到了（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没有办法拿到它包含的所有元素

属性：

- constructor：构造函数，任何一个具有 Iterable 接口的对象，都可以作参数

  ```
  const arr = [[1, 2], [3, 4]]
  const weakset = new WeakSet(arr)
  console.log(weakset)
  ```

[![2019-03-08 9 24 34](https://user-images.githubusercontent.com/19721451/54000884-27290900-4184-11e9-92f0-4d19ac6d080b.png)](https://user-images.githubusercontent.com/19721451/54000884-27290900-4184-11e9-92f0-4d19ac6d080b.png)

方法：

- add(value)：在WeakSet 对象中添加一个元素value
- has(value)：判断 WeakSet 对象中是否包含value
- delete(value)：删除元素 value
- clear()：清空所有元素，**注意该方法已废弃**

```js
var ws = new WeakSet()
var obj = {}
var foo = {}

ws.add(window)
ws.add(obj)

ws.has(window)	// true
ws.has(foo)	// false

ws.delete(window)	// true
ws.has(window)	// false
```

## 3. 字典（Map）

集合 与 字典 的区别：

- 共同点：集合、字典 可以储存不重复的值
- 不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存

```js
const m = new Map()
const o = {p: 'haha'}
m.set(o, 'content')
m.get(o)	// content

m.has(o)	// true
m.delete(o)	// true
m.has(o)	// false
```

**任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构**都可以当作`Map`构造函数的参数，例如：

```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

如果读取一个未知的键，则返回`undefined`。

```js
new Map().get('asfddfsasadf')
// undefined
```

注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

上面代码的`set`和`get`方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此`get`方法无法读取该键，返回`undefined`。

由上可知，Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如`0`和`-0`就是一个键，布尔值`true`和字符串`true`则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但 Map 将其视为同一个键。

```js
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

Map 的属性及方法

属性：

- constructor：构造函数

- size：返回字典中所包含的元素个数

  ```js
  const map = new Map([
    ['name', 'An'],
    ['des', 'JS']
  ]);
  
  map.size // 2
  ```

操作方法：

- set(key, value)：向字典中添加新元素
- get(key)：通过键查找特定的数值并返回
- has(key)：判断字典中是否存在键key
- delete(key)：通过键 key 从字典中移除对应的数据
- clear()：将这个字典中的所有元素删除

遍历方法

- Keys()：将字典中包含的所有键名以迭代器形式返回
- values()：将字典中包含的所有数值以迭代器形式返回
- entries()：返回所有成员的迭代器
- forEach()：遍历字典的所有成员

```
const map = new Map([
            ['name', 'An'],
            ['des', 'JS']
        ]);
console.log(map.entries())	// MapIterator {"name" => "An", "des" => "JS"}
console.log(map.keys()) // MapIterator {"name", "des"}
```

Map 结构的默认遍历器接口（`Symbol.iterator`属性），就是`entries`方法。

```
map[Symbol.iterator] === map.entries
// true
```

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（`...`）。

对于 forEach ，看一个例子

```
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

let map = new Map([
    ['name', 'An'],
    ['des', 'JS']
])
map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
// Key: name, Value: An
// Key: des, Value: JS
```

在这个例子中， forEach 方法的回调函数的 this，就指向 reporter

**与其他数据结构的相互转换**

1. Map 转 Array

   ```
   const map = new Map([[1, 1], [2, 2], [3, 3]])
   console.log([...map])	// [[1, 1], [2, 2], [3, 3]]
   ```

2. Array 转 Map

   ```
   const map = new Map([[1, 1], [2, 2], [3, 3]])
   console.log(map)	// Map {1 => 1, 2 => 2, 3 => 3}
   ```

3. Map 转 Object

   因为 Object 的键名都为字符串，而Map 的键名为对象，所以转换的时候会把非字符串键名转换为字符串键名。

   ```
   function mapToObj(map) {
       let obj = Object.create(null)
       for (let [key, value] of map) {
           obj[key] = value
       }
       return obj
   }
   const map = new Map().set('name', 'An').set('des', 'JS')
   mapToObj(map)  // {name: "An", des: "JS"}
   ```

4. Object 转 Map

   ```
   function objToMap(obj) {
       let map = new Map()
       for (let key of Object.keys(obj)) {
           map.set(key, obj[key])
       }
       return map
   }
   
   objToMap({'name': 'An', 'des': 'JS'}) // Map {"name" => "An", "des" => "JS"}
   ```

5. Map 转 JSON

   ```
   function mapToJson(map) {
       return JSON.stringify([...map])
   }
   
   let map = new Map().set('name', 'An').set('des', 'JS')
   mapToJson(map)	// [["name","An"],["des","JS"]]
   ```

6. JSON 转 Map

   ```
   function jsonToStrMap(jsonStr) {
     return objToMap(JSON.parse(jsonStr));
   }
   
   jsonToStrMap('{"name": "An", "des": "JS"}') // Map {"name" => "An", "des" => "JS"}
   ```

## 4. WeakMap

WeakMap 对象是一组键值对的集合，其中的**键是弱引用对象，而值可以是任意**。

**注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。**

WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。

属性：

- constructor：构造函数

方法：

- has(key)：判断是否有 key 关联对象
- get(key)：返回key关联对象（没有则则返回 undefined）
- set(key)：设置一组key关联对象
- delete(key)：移除 key 的关联对象

```
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```

## 5. 总结

- Set
  - 成员唯一、无序且不重复
  - [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
  - 可以遍历，方法有：add、delete、has
- WeakSet
  - 成员都是对象
  - 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
  - 不能遍历，方法有add、delete、has
- Map
  - 本质上是键值对的集合，类似集合
  - 可以遍历，方法很多可以跟各种数据格式转换
- WeakMap
  - 只接受对象作为键名（null除外），不接受其他类型的值作为键名
  - 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
  - 不能遍历，方法有get、set、has、delete

## 6. 扩展：Object与Set、Map

1. Object 与 Set

   ```
   // Object
   const properties1 = {
       'width': 1,
       'height': 1
   }
   console.log(properties1['width']? true: false) // true
   
   // Set
   const properties2 = new Set()
   properties2.add('width')
   properties2.add('height')
   console.log(properties2.has('width')) // true
   ```

2. Object 与 Map

JS 中的对象（Object），本质上是键值对的集合（hash 结构）

```
const data = {};
const element = document.getElementsByClassName('App');

data[element] = 'metadata';
console.log(data['[object HTMLCollection]']) // "metadata"
```

但当以一个DOM节点作为对象 data 的键，对象会被自动转化为字符串[Object HTMLCollection]，所以说，Object 结构提供了 **字符串-值** 对应，Map则提供了 **值-值** 的对应

# 迭代器Iterator与for of

ES6 规定，默认的 Iterator 接口部署在数据结构的`Symbol.iterator`属性上，或者说，一个数据结构只要具有`Symbol.iterator`属性，就可以认为是“可遍历的”（iterable）。

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

# Es6和Es5的继承有什么区别

问题是继承的差异。

```js
class Super {}
class Sub extends Super {}

const sub = new Sub();

Sub.__proto__ === Super;
```

子类可以直接通过 **\_\_proto__** 寻址到父类。

```js
function Super() {}
function Sub() {}

Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

var sub = new Sub();

Sub.__proto__ === Function.prototype;
Sub.prototype.__proto__ === Super.prototype;
```

而通过 ES5 的方式，Sub.**\_\_proto__** === Function.prototype

##class类

ES6 的类，完全可以看作构造函数的另一种写法。`prototype`对象的`constructor`属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```js
class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    toString(){
        return `(${this.x}, ${this.y})`;
    }
}

typeof Point; // function
Point.prototype.constructor === Point; // true
```

构造函数的`prototype`属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的`prototype`属性上面。在类的实例上面调用方法，其实就是调用原型上的方法。

```js
var point = new Point(1, 1);
point.constructor === Point.prototype.constructor; // true
point.__proto__ === Point.prototype; // true
```

由于类的方法都定义在`prototype`对象上面，所以类的新方法可以添加在`prototype`对象上面。`Object.assign`方法可以很方便地一次向类添加多个方法。

```javascript
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```

`constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象。

```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo; // false
```

上面代码中，`constructor`函数返回一个全新的对象，结果导致实例对象不是`Foo`类的实例。

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被`Class`继承，包括`name`属性。

```javascript
class Point {}
Point.name; // "Point"
```

`name`属性总是返回紧跟在`class`关键字后面的类名。

## 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

上面代码中，`Foo`类的`classMethod`方法前有`static`关键字，表明该方法是一个静态方法，可以直接在`Foo`类上调用（`Foo.classMethod()`），而不是在`Foo`类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

注意，如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例。

静态方法可以与非静态方法重名。

父类的静态方法，可以被子类继承。

## 实例属性和静态属性

实例属性除了定义在`constructor()`方法里面的`this`上面，也可以定义在类的最顶层。

静态属性指的是 Class 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性。

```js
class MyClass {
  static myStaticProp = 42; // 静态属性
  _count = 0; // 实例属性

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

## 继承

Class 可以通过`extends`关键字实现继承。

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

> 子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。
>
> **ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。**

在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。`spuer`中的`this`指向子类的实例。

### Object.getPrototypeOf()

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point; // true
```

因此，可以使用这个方法判断，一个类是否继承了另一个类。

### 类的 prototype 属性和__proto__属性

大多数浏览器的 ES5 实现之中，**每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性**。Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。

（1）子类的`__proto__`属性，表示构造函数的继承，总是指向父类。

（2）子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true
```

上面代码中，子类`B`的`__proto__`属性指向父类`A`，子类`B`的`prototype`属性的`__proto__`属性指向父类`A`的`prototype`属性。

这样的结果是因为，类的继承是按照下面的模式实现的。

```javascript
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();

Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```

因此，就得到了上面的结果。

```javascript
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```

### class与Es5的异同

- 类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致。

```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype); // []
Object.getOwnPropertyNames(Point.prototype); // ["constructor","toString"]

// ES5
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype); // ["toString"]
Object.getOwnPropertyNames(Point.prototype); // ["constructor","toString"]
```

- 类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。

```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo(); // TypeError: Class constructor Foo cannot be invoked without 'new'
```

- 与 ES5 一样，类的所有实例共享一个原型对象。

```javascript
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__; //true
```

- 类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式。只要你的代码写在类或模块之中，就只有严格模式可用。

- 类不存在变量提升（hoist），这一点与 ES5 完全不同。

  ```javascript
  new Foo(); // ReferenceError
  class Foo {}
  ```

  上面代码中，`Foo`类使用在前，定义在后，这样会报错，因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与下文要提到的继承有关，必须保证子类在父类之后定义。

  ```javascript
  {
    let Foo = class {};
    class Bar extends Foo {
    }
  }
  ```

  上面的代码不会报错，因为`Bar`继承`Foo`的时候，`Foo`已经有定义了。但是，如果存在`class`的提升，上面代码就会报错，因为`class`会被提升到代码头部，而`let`命令是不提升的，所以导致`Bar`继承`Foo`的时候，`Foo`还没有定义。

- `class` 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有`[[construct]]`，不能使用 `new` 来调用。

  ```js
  function Bar() {
    this.bar = 42;
  }
  Bar.prototype.print = function() {
    console.log(this.bar);
  };
  
  const bar = new Bar();
  const barPrint = new bar.print(); // it's ok
  
  class Foo {
    constructor() {
      this.foo = 42;
    }
    print() {
      console.log(this.foo);
    }
  }
  const foo = new Foo();
  const fooPrint = new foo.print(); // TypeError: foo.print is not a constructor
  ```

- ES5无法继承原生构造函数

  比如，不能自己定义一个`Array`的子类。

  ```javascript
  function MyArray() {
    Array.apply(this, arguments);
  }
  
  MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
      value: MyArray,
      writable: true,
      configurable: true,
      enumerable: true
    }
  });
  ```

  上面代码定义了一个继承 Array 的`MyArray`类。但是，这个类的行为与`Array`完全不一致。

  ```javascript
  var colors = new MyArray();
  colors[0] = "red";
  colors.length  // 0
  
  colors.length = 0;
  colors[0]  // "red"
  ```

  之所以会发生这种情况，是因为子类无法获得原生构造函数的内部属性，通过`Array.apply()`或者分配给原型对象都不行。原生构造函数会忽略`apply`方法传入的`this`，也就是说，原生构造函数的`this`无法绑定，导致拿不到内部属性。

  ES5 是先新建子类的实例对象`this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，`Array`构造函数有一个内部属性`[[DefineOwnProperty]]`，用来定义新属性时，更新`length`属性，这个内部属性无法在子类获取，导致子类的`length`属性行为不正常。

  ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象`this`，然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。下面是一个继承`Array`的例子。

  ```javascript
  class MyArray extends Array {
    constructor(...args) {
      super(...args);
    }
  }
  
  var arr = new MyArray();
  arr[0] = 12;
  arr.length // 1
  
  arr.length = 0;
  arr[0] // undefined
  ```

  上面代码定义了一个`MyArray`类，继承了`Array`构造函数，因此就可以从`MyArray`生成数组的实例。这意味着，ES6 可以自定义原生数据结构（比如`Array`、`String`等）的子类，这是 ES5 无法做到的。

# proxy & Reflect

## Proxy

**Proxy** 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
var proxy = new Proxy(target, handler);
```

`target`参数表示所要拦截的目标对象，`handler`参数也是一个对象，用来定制拦截行为。

```js
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```

> 注意，要使得`Proxy`起作用，必须针对`Proxy`实例（上例是`proxy`对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果`handler`没有设置任何拦截，那就等同于直接通向原对象。

```javascript
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // "b"
```

上面代码中，`handler`是一个空对象，没有任何拦截效果，访问`proxy`就等同于访问`target`。

Proxy 实例也可以作为其他对象的原型对象。

```javascript
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```

上面代码中，`proxy`对象是`obj`对象的原型，`obj`对象本身并没有`time`属性，所以根据原型链，会在`proxy`对象上读取该属性，导致被拦截。

同一个拦截器函数，可以设置拦截多个操作。

```javascript
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

下面是 Proxy 支持的拦截操作一览，一共 13 种。

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

## Reflect

`Reflect`对象的设计目的有这样几个。

- 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。

- 修改某些`Object`方法的返回结果，让其变得更合理。

  比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

```javascript
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

- 让`Object`操作都变成函数行为。

```javascript
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```

- `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

```javascript
Proxy(target, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
});
```

上面代码中，`Proxy`方法拦截`target`对象的属性赋值行为。它采用`Reflect.set`方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

下面是另一个例子。

```javascript
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
```

上面代码中，每一个`Proxy`对象的拦截操作（`get`、`delete`、`has`），内部都调用对应的`Reflect`方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。

有了`Reflect`对象以后，很多操作会更易读。

```javascript
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```

## 实例：使用Proxy实现观察者模式

```js
const queudObservers = new Set();

const observe = fn => queudObservers.push(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver){
    let result = Reflect.set(target, key, value, receiver);
    queudObservers.forEach(observer => observer());
    return result;
}

const person = observable({
    name: 'moshang',
    age: 18
});

function print(){
    console.log(`${person.name}, ${person.age}`);
}

observe(print);
person.name = 'xiaoming'; // xiaoming, 18
```

# Promise，async/await，setTimeout

## Promise

**语法**

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

**executor**是带有 `resolve` 和 `reject` 两个参数的函数 。**Promise构造函数执行时立即调用`executor` 函**数， `resolve` 和 `reject` 两个函数作为参数传递给`executor`（executor 函数在Promise构造函数返回所建promise实例对象前被调用）。

`resolve` 和 `reject` 函数被调用时，分别将promise的状态改为*fulfilled（*完成）或rejected（失败）。executor 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用resolve函数来将promise状态改成*fulfilled*，要么调用`reject` 函数将promise的状态改为rejected。如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。

```js
Promise.resolve((()=>{
	console.log('a')
})()).then(()=>{
	console.log(1);
}).then(()=>{
	console.log(2);
}).then(()=>{
	console.log(3);
});

Promise.resolve((()=>{
	console.log('b')
})()).then(()=>{
	console.log(4);
}).then(()=>{
	console.log(5);
}).then(()=>{
	console.log(6);
});

// 输出
a
b
1
4
2
5
3
6
```

```js
new Promise(function(resolve){
  resolve();
})
```

等价于

```js
Promise.resolve();
```

### Promise说明

- `Promise`一旦被解析会永远保持相同的解析结果（完成或拒绝）
- `thenable`（鸭子类型检查）

```js
if( p !== null && 
    (typeof p === 'function' || typeof p === 'object') && 
    typeof p.then === 'function'){
  // 认为它是一个thenable!
}
```

- 使用多个参数调用`resolve(..)`或`reject(..)`，所有第一个参数之外的后续参数都会被无声地忽略

```js
new Promise((resolve) => {
      resolve(1,2,3)
    })
    .then(function p(data){
      console.log(data); // 1
      console.log(arguments); //[1]
    });
```

- Promise被定义为只能被解析一次。

```js
new Promise((resolve, reject) => {
  resolve(1);
  reject(2); // 不会执行
});
```

- `Promise`解析或者创建过程中发生语法错误或者手动抛出错误，会强制当前的`Promise`变为拒绝
- `resolve()`接收基础数据直接返回`fullfilled`的数据，接收一个`Promise`或者`thenable`的值，那么这个值将被递归地展开，而且无论它最终解析结果/状态是什么，都将被`promise`采用。。
- `reject(..)` 不会像`resolve(..)`那样进行展开。如果你向`reject(..)`传递一个`Promise/thenable`值，这个没有被碰过的值将作为拒绝的理由。
- `Promise.all([ .. ])`、`Promise.race([ .. ])`将会在任意一个`Promise`解析为拒绝时拒绝。
- `Promise.resolve()`,传入一个纯粹的`Promise`，`Promise.resolve(..)`不会做任何事情,它仅仅会直接返回这个值，其它值得处理与`resolve`保存一致 

### 取消Promise

1. 通过`Promise.race()`，设置超时机制来取消取消promise的执行
2. 通过`throw new Error()`来终结调用链，可以给error设定标识信息代表手动的终止。

```js
Object.defineProperty(Promise, 'break', {
  get: function(){
    throw new Error('break');
  },
});

```

### Promise 构造函数是同步执行还是异步执行，那么 then 方法呢

Promise构造函数中的代码是同步执行，then方法是微任务，异步执行。

Promise.resolve()中的代码是同步执行等

## async

**语法**

```js
async function name([param[, param[, ... param]]]) { statements }
```

**返回值**：`Promise`对象

当调用一个 `async` 函数时，会返回一个 `Promise`对象。当这个 `async` 函数返回一个值时，`Promise` 的 resolve 方法会负责传递这个值；当 `async` 函数抛出异常时，`Promise` 的 reject 方法也会传递这个异常值。

在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。

`async` 函数中可能会有 [`await`](#await) 表达式，这会使 `async` 函数暂停执行，等待 `Promise`  的结果出来，然后恢复`async`函数的执行并返回解析值（resolved）。

> `await` 关键字仅仅在 `async` function中有效。如果在 `async function`函数体外使用 `await` ，你只会得到一个语法错误（`SyntaxError`）。

## await

`await`  操作符用于等待一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象。它只能在异步函数 [`async function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 中使用。

### 语法

```js
[return_value] = await expression;
```

**返回值**：返回 Promise 对象的处理结果。如果等待的不是 Promise 对象，则返回该值本身。

### 描述

`await`经历两个步骤：

1. 先等待右侧表达式的结果
2. 根据结果进行下一步处理

等到结果之后，对于await来说，分2个情况

- 不是promise对象

如果不是 promise , await 会暂停async后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果。

- 是promise对象

如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果，**如果Promise对象rejected，则将错误抛出**。

**例子**：

```js
// await Promise	
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  var x = await resolveAfter2Seconds(10);
  console.log(x);
}
f1(); // 10

// await 非Promise
async function f2() {
  var y = await 20;
  console.log(y); 
}
f2(); // 20

// await Promise.reject
async function f3() {
  try {
    var z = await Promise.reject(30);
  } catch (e) {
    console.log(e); // 30
  }
}
f3();

```

**在`await`的描述中会提及，当遇到`await`时会让出线程，阻塞`async function`后面的代码执行，但并不是说`await`等待的表达式的执行也会被阻塞**，见示例：

```js
async function async1() {
    console.log( 'async1 start' )
    await async2()
    console.log( 'async1 end' )
}
async function async2() {
    console.log( 'async2' )
}
async1()
console.log( 'script start' )

// 输出
async1 start
async2
script start
async1 end
```

> await 必须用在 async 函数中的原因：async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。

根据规范，`async`中的`await`直接采用 `Promise.resolve()` 来包装，故

```js
async function async1(){
  await async2()
  console.log('async1 end'),
}	
```

等价于

```js
async function async1() {
  Promise.resolve(async2()).then(() => {
    console.log('async1 end')
  })
}
```

## 正题

如下代码的输出结果：

```js
 async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});

console.log('script end');

```

输出结果：

```
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

**解答**：

1. 定义`async1`和`async2`
2. 执行`console.log('script start')`打印输出`script start`
3. 将`setTimeout`加入**宏任务队列**（先执行微任务，直到队列被清空再执行宏任务）
4. 在`await`中说到规范会用`Promise.resolve()` 来包装`await`，故`async1`等价于

```js
 async function async1(){
    console.log('async1 start')
     return Promise.resolve(async2()).then(()=>{
    	console.log('async1 end');
     });
 }
```

5. 执行`async1()`，如前面所述`async function`就是对Promise的一个封装，像Promise一样函数体内的内容是立即执行的，故执行第一行`console.log('async1 start')`输出`async1 start`，然后将`Promise`任务插入**微任务队列**，`async1`停止执行，让出线程，执行同步代码
6. 继续执行后续的代码，执行`Promise`中的同步代码，打印`promise1`，将`Promise`插入**微任务队列**
7. 执行最后一段同步代码，打印`script end`
8. 同步代码执行完成，开始执行微任务
9. 执行`步骤5`中插入的微任务，打印`async1 end`
10. 执行`步骤6`中插入的微任务，答应`promise2`
11. 微任务队列执行完成并清空，开始执行宏任务队列
12. 执行`步骤3`中的宏任务，打印`setTimeout`
13. 完成

变形：

```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2 start');
    return Promise.resolve(1).then(() => {
        console.log('async2 end');
    });
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});

console.log('script end');
```

输出：

```
script start
async1 start
async2 start
promise1
script end
async2 end
promise2
async1 end
setTimeout
```

**解答**：如第一个一样

**新版与旧版V8引擎解析的差别见**

```js
async function async1(){
    console.log('async1 start');
    await async2();
    console.log('async1 end');
 }

// old
async function async1() {
  return new Promise(resolve => {
    resolve(async2())
  }).then(() => {
    console.log('async1 end')
  })
}

// new 
 async function async1(){
    console.log('async1 start')
     return Promise.resolve(async2()).then(()=>{
    	console.log('async1 end');
     });
 }
```

<https://segmentfault.com/q/1010000016147496/>

<https://github.com/xianshenglu/blog/issues/60>