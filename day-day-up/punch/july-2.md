## 1. Es6和Es5的继承有什么区别

问题是继承的差异。

```js
class Super {}
class Sub extends Super {}

const sub = new Sub();

Sub.__proto__ === Super;
```

子类可以直接通过 **proto** 寻址到父类。

```js
function Super() {}
function Sub() {}

Sub.prototype = new Super();
Sub.prototype.constructor = Sub;

var sub = new Sub();

Sub.__proto__ === Function.prototype;
```

而通过 ES5 的方式，Sub.**proto** === Function.prototype

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
> ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

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

## 2. proxy



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

## 4. setTimeout、Promise、Async/Await 的区别

首先看个题目，下面的代码输出什么？

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2 start');
  return Promise.resolve().then(()=>console.log('async2 end'));
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

输出：

```js
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
```

解释：

1. 正常输出`script start`
2. 执行`async1`函数，此函数中又调用了`async2`函数，输出`async2 end`。回到`async1`函数，**遇到了await，让出线程**，将`await async2`后的代码扔到**微任务队列**中。
3. 遇到`setTimeout`，扔到**下一轮宏任务队列**
4. 遇到`Promise`对象，立即执行其函数，输出`Promise`。其后的`resolve`，被扔到了**微任务队列**
5. 正常输出`script end`
6. 执行第2步被扔到微任务队列的任务，输出`async1 end`
7. 执行第4步被扔到微任务队列的任务，输出`promise1`和`promise2`
8. 第一轮EventLoop完成，执行第二轮EventLoop。执行`setTimeout`中的回调函数，输出`setTimeout`。

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2 start');
  return Promise.resolve().then(()=>console.log('async2 end'));
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

输出：

```js
script start
async2 start
Promise
script end
async2 end
promise1
promise2
async1 end
setTimeout
```



### async, await, promise解析

`async` 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。假如await后面的表达式不是一个promise，那么会直接执行不需要让出线程，如果返回的是promise则需要等promise解析完成后再继续执行。

`await`返回 Promise 对象的**处理结果**。如果等待的不是 Promise 对象，则返回该值本身。