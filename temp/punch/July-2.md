## 1. Es6和Es5的继承有什么区别

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

### class类

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

### 静态方法

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

### 实例属性和静态属性

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

### 继承

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

#### Object.getPrototypeOf()

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point; // true
```

因此，可以使用这个方法判断，一个类是否继承了另一个类。

#### 类的 prototype 属性和__proto__属性

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

## 2. proxy & Reflect

### Proxy

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

### Reflect

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

### 实例：使用Proxy实现观察者模式

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

## 3. SVG

基本形状标记如下：

```html
<svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <!-- 矩形 -->
  <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
  <rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
	<!-- 圆 -->
  <circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>
    <!-- 椭圆 -->
  <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5"/>
	<!-- 线条 -->
  <line x1="10" x2="50" y1="110" y2="150" stroke="orange" fill="transparent" stroke-width="5"/>
	<!-- 折线 -->
  <polyline points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
      stroke="orange" fill="transparent" stroke-width="5"/>
	<!-- 多边形 -->
  <polygon points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
      stroke="green" fill="transparent" stroke-width="5"/>
	<!-- 路径 -->
  <path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
</svg>
```

### path

| 命令     | 参数              | 描述                                                         |
| :------- | ----------------- | ------------------------------------------------------------ |
| M        | X Y               | Move to，绝对坐标，M命令仅仅是移动画笔，但不画线，<br />（M X Y）表示相对坐标 |
| L        | X Y               | Line To，绝对坐标，在当前位置和新位置之间画一条线段，<br />（l dx dy）表示相对坐标 |
| V        | Y                 | 绝对坐标，绘制垂直线（v y）同理，绝对坐标                    |
| H        | X                 | 绝对坐标，绘制水平线（h x）同理，绝对坐标                    |
| Z        | -                 | 从当前点画一条直线到路径的起点，不区分大小写                 |
| 曲线列表 |                   |                                                              |
| C        | x1 y1, x2 y2, x y | 三次贝塞尔曲线，参数依次为两个控制点和一个终点，<br />同理也包括小写相对坐标(c x1 y1, x2 y2, x y) |
| S        | x2 y2, x y        | 续前对称控制点三次贝塞尔曲线，<br />同理小写相对坐标为(s dx2 dy2, dx dy) |
| Q        | x1 y1, x y        | 二次贝塞尔曲线，参数依次为控制点和一个终点，<br />同理也包括小写相对坐标(q x1 y1, x y) |
| T        | x y               | 续前对称控制点二次贝塞尔曲线，<br />同理小写相对坐标为(t dx dy) |
|          |                   |                                                              |

## 4.Promise, async/await, setTimeout

### Promise

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

#### Promise说明
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

#### 取消promise

1. 通过`Promise.race()`，设置超时机制来取消取消promise的执行
2. 通过`throw new Error()`来终结调用链，可以给error设定标识信息代表手动的终止。

```js
Object.defineProperty(Promise, 'break', {
  get: function(){
    throw new Error('break');
  },
});

```

### async

**语法**

```js
async function name([param[, param[, ... param]]]) { statements }
```

**返回值**：`Promise`对象

当调用一个 `async` 函数时，会返回一个 `Promise`对象。当这个 `async` 函数返回一个值时，`Promise` 的 resolve 方法会负责传递这个值；当 `async` 函数抛出异常时，`Promise` 的 reject 方法也会传递这个异常值。

在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。

`async` 函数中可能会有 [`await`](#await) 表达式，这会使 `async` 函数暂停执行，等待 `Promise`  的结果出来，然后恢复`async`函数的执行并返回解析值（resolved）。

> `await` 关键字仅仅在 `async` function中有效。如果在 `async function`函数体外使用 `await` ，你只会得到一个语法错误（`SyntaxError`）。

### await

`await`  操作符用于等待一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象。它只能在异步函数 [`async function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 中使用。

**语法**

```js
[return_value] = await expression;
```

**返回值**：返回 Promise 对象的处理结果。如果等待的不是 Promise 对象，则返回该值本身。

#### 描述

`await`经历两个步骤：

1. 先等待右侧表达式的结果
2. 根据结果进行下一步处理

等到结果之后，对于await来说，分2个情况

- 不是promise对象

如果不是 promise , await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果。

- 是promise对象

如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果，如果Promise对象rejected，则将错误抛出。

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

### 正题

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

## 5. Event Loop

所有任务可以分成两种，一种是**同步任务（synchronous）**，另一种是**异步任务（asynchronous）**。同步任务指的是，在**主线程**上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"**任务队列**"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

### 宏任务macrotask

**macrotask也叫tasks。** 一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：

- setTimeout
- setInterval
- setImmediate (Node独有)
- requestAnimationFrame (浏览器独有)
- I/O
- UI rendering (浏览器独有)

### 微任务

**microtask，也叫jobs。** 另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

- process.nextTick (Node独有)
- Promise
- Object.observe
- MutationObserver

**具体步骤如下：**

1. 执行全局Script同步代码，这些同步代码有一些是同步语句，有一些是异步语句（比如setTimeout等）；

2. 全局Script代码执行完毕后，调用栈Stack会清空；

3. 从微队列microtask queue中取出位于队首的回调任务，放入调用栈Stack中执行，执行完后microtask queue长度减1；

4. 继续取出位于队首的任务，放入调用栈Stack中执行，以此类推，直到直到把microtask queue中的所有任务都执行完毕。**注意，如果在执行microtask的过程中，又产生了microtask，那么会加入到队列的末尾，也会在这个周期被调用执行**；

5. microtask queue中的所有任务都执行完毕，此时microtask queue为空队列，调用栈Stack也为空；

6. 取出宏队列macrotask queue中位于队首的任务，放入Stack中执行；

7. 执行完毕后，调用栈Stack为空；

8. 重复第3-7个步骤；

9. 重复第3-7个步骤；

**注意：**

> 1. 宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务；
> 2. 微任务队列中所有的任务都会被依次取出来执行，直到microtask queue为空；
> 3. 在执行微队列microtask queue中任务的时候，如果又产生了microtask，那么会继续添加到队列的末尾，也会在这个周期执行，直到microtask queue为空停止。
> 4. UI rendering，它的节点是在执行完所有的microtask之后，下一个macrotask之前，紧跟着执行UI render。

只要主线程空了，就会去读取"任务队列"，这就是JavaScript的运行机制。这个过程会不断重复。

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）。

## 6. 将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组

**方法一**

```js
function flat(arr) {
    return Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b);
}
```

**方法二**

```js
Array.prototype.flat = function() {
    return [].concat(...this.map(item => {
        return Array.isArray(item) ? item.flat() : item;
    }));
}
// 或
Array.prototype.flat1 = function() {
    return this.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? item.flat1() : item);
    }, []);
}

Array.prototype.unique = function() {
    return [...new Set(this)];
}
// 或
// 基础类型数据
Array.prototype.unique1 = function() {
    let hashMap = {};
    return this.filter(item => {
      	// 区分类似1和'1' 
        let key = typeof item + item;
        return hashMap[key] === undefined ? (hashMap[key] = true) : false;
    });
}

function flat(arr){
  return arr.flat().unique().sort((a, b) => a - b);
}
```

**方法三**

```js
// 全数字
function flat(arr) {
    return arr.toString().split(',').sort((a, b) => a - b).map(Number);
}
```



## 7. 手动实现new

### new操作如下：

1. 创建一个空的简单JavaScript对象（即**`{}`**）

2. 链接该对象（即设置该对象的构造函数）到另一个对象 

3. 将步骤1新创建的对象作为**`this`**的上下文 

4. 如果该函数没有返回对象，则返回**`this`**

```js
function myNew() {
    let obj = {},
        Constructor = Array.prototype.shift.call(arguments);

    obj.__proto__ = Constructor.prototype;
    let res = Constructor.apply(obj, arguments);
    return typeof res === 'object' ? res : obj;
}
```



## 8. JS 异步解决方案的发展历程以及优缺点

#### 1. 回调函数（callback）

```js
setTimeout(() => {
    // callback 函数体
}, 1000)
```

**缺点：回调地狱，不能用 try catch 捕获错误，不能 return**

回调地狱的根本问题在于：

- 缺乏顺序性： 回调地狱导致的调试困难，和大脑的思维方式不符
- 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身，即（**控制反转**）
- 嵌套函数过多的多话，很难处理错误

```js
ajax('XXX1', () => {
    // callback 函数体
    ajax('XXX2', () => {
        // callback 函数体
        ajax('XXX3', () => {
            // callback 函数体
        })
    })
})
```

**优点：解决了同步的问题**（只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。）

#### 2. Promise

Promise就是为了解决callback的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装

**优点：解决了回调地狱的问题**

```js
ajax('XXX1')
  .then(res => {
      // 操作逻辑
      return ajax('XXX2')
  }).then(res => {
      // 操作逻辑
      return ajax('XXX3')
  }).then(res => {
      // 操作逻辑
  })
```

**缺点：无法取消 Promise ，错误需要通过回调函数来捕获**

to do by xc 取消Promise

#### 3. Generator

**特点：可以控制函数的执行**，可以配合 co 函数库使用

```js
function *fetch() {
    yield ajax('XXX1', () => {})
    yield ajax('XXX2', () => {})
    yield ajax('XXX3', () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```

#### 4. Async/await

async、await 是异步的终极解决方案

**优点是：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题**

**缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。**

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch('XXX1')
  await fetch('XXX2')
  await fetch('XXX3')
}
```

下面来看一个使用 `await` 的例子：

```js
let a = 0
let b = async () => {
  a = a + await 10; // await返回10，让出线程，a = a + 10异步执行
  console.log('2', a) // -> '2' 10
}
b()
a++
console.log('1', a) // -> '1' 1

let a = 0
let b = async () => {
  a = (a = 2) + await 10; 
  console.log('2', a) // -> '2' 12
}
b()
a++
console.log('1', a) // -> '1' 3
```

对于以上代码你可能会有疑惑，让我来解释下原因：

1. 首先函数 b 先执行，在执行到 await 10 之前变量 a 还是 0，因为 await 内部实现了 generator ，generator 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
2. 因为 await 是异步操作，后面的表达式不返回 Promise 的话，就会包装成 Promise.reslove(返回值)，然后会去执行函数外的同步代码，也就是执行了 console.log('1', a) ，输出 '1' 1
3. 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 a = 0 + 10

上述解释中提到了 await 内部实现了 generator，其实 await 就是 generator 加上 Promise的语法糖，且内部实现了自动执行 generator。

## 9. Promise 构造函数是同步执行还是异步执行，那么 then 方法呢

Promise构造函数中的代码是同步执行，then方法是微任务，异步执行。

Promise.resolve()中的代码是同步执行等

原理见如下`Promise`手动实现：(这个实现有问题，不满足pormise的语法)

```js
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
	
    // 校正非new Promise()调用形式
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
        return res;
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
```

## 10. Async/Await 如何通过同步的方式实现异步

未完待续
