# 作用域和闭包

## 词法作用域

函数的词法作用域是由这个函数被声明的位置 **唯一** 定义的。

作用域的查询匹配是从当前作用域开始，逐级向上查找的，**一旦找到第一个匹配，作用域查询就停止了**。

在一个作用域中声明的任何变量都附着在这个作用域上。

## 提升

*引擎* 会在它解释执行你的 JavaScript 代码之前编译它。编译过程的一部分就是找到所有的声明，并将它们关联在合适的作用域上。所以在你的代码的任何部分被执行之前，所有的声明，变量和函数，都会首先被处理。

当你看到 `var a = 2;` 时，你可能认为这是一个语句。但是 JavaScript 实际上认为这是两个语句：`var a;` 和 `a = 2;`。第一个语句，声明，是在编译阶段被处理的。第二个语句，赋值，为了执行阶段而留在 **原处**。

**注意：** 只有声明本身被提升了，而任何赋值或者其他的执行逻辑都被留在 *原处*。

函数声明会被提升，就像我们看到的。但是函数表达式不会。如下所示：

```js
foo(); // 不是 ReferenceError， 而是 TypeError!

var foo = function bar() {
	// ...
};
```

### 函数优先

函数声明和变量声明都会被提升。函数会首先被提升，然后才是变量。

```js
foo(); // 1

var foo;

function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};
```

这个代码段被 *引擎* 解释执行为：

```js
function foo() {
	console.log( 1 );
}

foo(); // 1

foo = function() {
	console.log( 2 );
};
```

> 多个/重复的 `var` 声明实质上是被忽略的，但是后续的函数声明确实会覆盖前一个。

```js
foo(); // 3

function foo() {
	console.log( 1 );
}

var foo = function() {
	console.log( 2 );
};

function foo() {
	console.log( 3 );
}
```

## 闭包

**闭包就是当一个函数即使是在它的词法作用域之外被调用时，也可以记住并访问它的词法作用域。**

# this

`this` 既不是函数自身的引用，也不是函数 *词法* 作用域的引用。

`this` 不是编写时绑定，而是运行时绑定。它依赖于函数调用的上下文条件。`this` 绑定与函数声明的位置没有任何关系，而与函数被调用的方式紧密相连。 `this` 是一个完全根据**直接调用点**（函数是如何被调用的）而为每次函数调用建立的绑定。

### 调用点

调用点：函数在代码中被调用的位置（**不是被声明的位置**）

### 判定this

按照优先顺序来总结一下从函数调用的调用点来判定 `this` 的规则。按照这个顺序来问问题，然后在第一个规则适用的地方停下。

1. 函数是通过 `new` 被调用的吗（**new 绑定**）？如果是，`this` 就是新构建的对象。

   `var bar = new foo()`

2. 函数是通过 `call` 或 `apply` 被调用（**明确绑定**），甚至是隐藏在 `bind` *硬绑定* 之中吗？如果是，`this` 就是那个被明确指定的对象。

   `var bar = foo.call( obj2 )`

3. 函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（**隐含绑定**）？如果是，`this` 就是那个环境对象。

   `var bar = obj1.foo()`

4. 否则，使用默认的 `this`（**默认绑定**）。如果在 `strict mode` 下，就是 `undefined`，否则是 `global` 对象。

   `var bar = foo()`

# 对象

## 类型

对象是大多数 JS 程序依赖的基本构建块儿。它们是 JS 的六种主要类型（在语言规范中称为“语言类型”）中的一种：

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `object`

### 内建对象

有几种其他的对象子类型，通常称为内建对象。对于其中的一些来说，它们的名称看起来暗示着它们和它们对应的基本类型有着直接的联系，但事实上，它们的关系更复杂，我们一会儿就开始探索。

- `String`
- `Number`
- `Boolean`
- `Object`
- `Function`
- `Array`
- `Date`
- `RegExp`
- `Error`

基本类型值 `"I am a string"` 不是一个对象，它是一个不可变的基本字面值。为了对它进行操作，比如检查它的长度，访问它的各个独立字符内容等等，都需要一个 `String` 对象。

幸运的是，在必要的时候语言会自动地将 `"string"` 基本类型强制转换为 `String` 对象类型，这意味着你几乎从不需要明确地创建对象。

考虑下面的代码：

```
var strPrimitive = "I am a string";

console.log( strPrimitive.length );			// 13

console.log( strPrimitive.charAt( 3 ) );	// "m"
```

在这两个例子中，我们在字符串的基本类型上调用属性和方法，引擎会自动地将它强制转换为 `String` 对象，所以这些属性/方法的访问可以工作。

当使用如 `42.359.toFixed(2)` 这样的方法时，同样的强制转换也发生在数字基本字面量 `42` 和包装对象 `new Number(42)` 之间。同样的还有 `Boolean` 对象和 `"boolean"` 基本类型。

`null` 和 `undefined` 没有对象包装的形式，仅有它们的基本类型值。相比之下，`Date` 的值 *仅可以* 由它们的构造对象形式创建，因为它们没有对应的字面形式。

## 内容

### 复制对象

`Object.assign()`属于浅拷贝。

### 属性描述符

**Object.defineProperty**，**getOwnPropertyDescriptor**

```js
var myObject = {};

Object.defineProperty( myObject, "a", {
	value: 2,
	writable: true,
	configurable: true, // 可配置的，该操作为单向操作不可撤销。
	enumerable: true
} );

myObject.a; // 2
Object.getOwnPropertyDescriptor( myObject, "a" );
// {
//    value: 2,
//    writable: true,
//    enumerable: true,
//    configurable: true
// }
```

#### 可写性（Writable）

`writable` 控制着你改变属性值的能力。

**注意：** `writable:false` 意味着值不可改变，和你定义一个空的 setter 是有些等价的。实际上，你的空 setter 在被调用时需要扔出一个 `TypeError`，来和 `writable:false` 保持一致。

#### 可配置性（Configurable）

只要属性当前是可配置的，我们就可以使用相同的 `defineProperty(..)` 工具，修改它的描述符定义。

```
var myObject = {
	a: 2
};

myObject.a = 3;
myObject.a;					// 3

Object.defineProperty( myObject, "a", {
	value: 4,
	writable: true,
	configurable: false,	// 不可配置！
	enumerable: true
} );

myObject.a;					// 4
myObject.a = 5;
myObject.a;					// 5

Object.defineProperty( myObject, "a", {
	value: 6,
	writable: true,
	configurable: true,
	enumerable: true
} ); // TypeError
```

最后的 `defineProperty(..)` 调用导致了一个 TypeError，这与 `strict mode` 无关，如果你试图改变一个不可配置属性的描述符定义，就会发生 TypeError。要小心：如你所看到的，将 `configurable` 设置为 `false` 是 **一个单向操作，不可撤销！**

**注意：** 这里有一个需要注意的微小例外：即便属性已经是 `configurable:false`，`writable` 总是可以没有错误地从 `true`改变为 `false`，但如果已经是 `false` 的话不能变回 `true`。

`configurable:false` 阻止的另外一个事情是使用 `delete` 操作符移除既存属性的能力。

#### 可枚举性（Enumerable）

它的名称可能已经使它的功能很明显了，这个性质控制着一个属性是否能在特定的对象-属性枚举操作中出现，比如 `for..in` 循环。设置为 `false` 将会阻止它出现在这样的枚举中，即使它依然完全是可以访问的。设置为 `true` 会使它出现。

#### 对象常量（Object Constant）

通过将 `writable:false` 与 `configurable:false` 组合，你可以实质上创建了一个作为对象属性的 *常量*（不能被改变，重定义或删除），比如：

```
var myObject = {};

Object.defineProperty( myObject, "FAVORITE_NUMBER", {
	value: 42,
	writable: false,
	configurable: false
} );
```

#### 防止扩展（Prevent Extensions）

如果你想防止一个对象被添加新的属性，但另一方面保留其他既存的对象属性，可以调用 `Object.preventExtensions(..)`：

```
var myObject = {
	a: 2
};

Object.preventExtensions( myObject );

myObject.b = 3;
myObject.b; // undefined
```

在非 `strict mode` 模式下，`b` 的创建会无声地失败。在 `strict mode` 下，它会抛出 `TypeError`。

#### 封印（Seal）

`Object.seal(..)` 创建一个“封印”的对象，这意味着它实质上在当前的对象上调用 `Object.preventExtensions(..)`，同时也将它所有的既存属性标记为 `configurable:false`。

所以，你既不能添加更多的属性，也不能重新配置或删除既存属性（虽然你依然 *可以* 修改它们的值）。

#### 冻结（Freeze）

`Object.freeze(..)` 创建一个冻结的对象，这意味着它实质上在当前的对象上调用 `Object.seal(..)`，同时也将它所有的“数据访问”属性设置为 `writable:false`，所以它们的值不可改变。

### Getters 与 Setters

ES5 引入了一个方法来覆盖这些默认操作的一部分，但不是在对象级别而是针对每个属性，就是通过 getters 和 setters。Getter 是实际上调用一个隐藏函数来取得值的属性。Setter 是实际上调用一个隐藏函数来设置值的属性。

当你将一个属性定义为拥有 getter 或 setter 或两者兼备，那么它的定义就成为了“访问器描述符”（与“数据描述符”相对）。对于访问器描述符，它的 `value` 和 `writable` 性质因没有意义而被忽略，取而代之的是 JS 将会考虑属性的 `set` 和 `get` 性质（还有 `configurable` 和 `enumerable`）。

```
var myObject = {
	// 为 `a` 定义 getter
	get a() {
		return this._a_;
	},

	// 为 `a` 定义 setter
	set a(val) {
		this._a_ = val * 2;
	}
};

myObject.a = 2;

myObject.a; // 4
```

### 存在性（Existence）

我们可以查询一个对象是否拥有特定的属性，而 *不必* 取得那个属性的值：

```
var myObject = {
	a: 2
};

("a" in myObject);				// true
("b" in myObject);				// false

myObject.hasOwnProperty( "a" );	// true
myObject.hasOwnProperty( "b" );	// false
```

`in` 操作符会检查属性是否存在于对象 *中*，或者是否存在于 `[[Prototype]]` 链对象遍历的更高层中（详见第五章）。相比之下，`hasOwnProperty(..)` *仅仅* 检查 `myObject` 是否拥有属性，但 *不会* 查询 `[[Prototype]]` 链。

#### 枚举（Enumeration）

```js
var myObject = { };

Object.defineProperty(
	myObject,
	"a",
	// 使 `a` 可枚举，如一般情况
	{ enumerable: true, value: 2 }
);

Object.defineProperty(
	myObject,
	"b",
	// 使 `b` 不可枚举
	{ enumerable: false, value: 3 }
);

myObject.b; // 3
("b" in myObject); // true
myObject.hasOwnProperty( "b" ); // true

// .......

for (var k in myObject) {
	console.log( k, myObject[k] );
}
// "a" 2

myObject.propertyIsEnumerable( "a" ); // true
myObject.propertyIsEnumerable( "b" ); // false

Object.keys( myObject ); // ["a"]
Object.getOwnPropertyNames( myObject ); // ["a", "b"]
```

> `for in`和`Object.key()`只能枚举`enumerable`为`true`的属性

[https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this & object prototypes/README.md#you-dont-know-js-this--object-prototypes)



# 位运算

## &（按位与）

两个都为真才为真

```js
1&1=1 , 1&0=0 , 0&1=0 , 0&0=0

3&5 = 1 <=> 011&101 = 001 
```

## &&（逻辑与）

左右两边的表达式为真则为真，且`&&`左边的表达式为真的情况下才计算右边的表达式

逻辑与的值当表达式的结果为真时，值为后一项表达式的值，当表达式的值为假时，若第一个表达式为真，则值为第二个表达式的值，否则为第一个表达式的值，如下所示：

```js
1&&3 // 3
0&&3 // 0
1&&false // false
```

## |（按位或）

一个为真就为真

```js
1|0 = 1 , 1|1 = 1 , 0|0 = 0 , 0|1 = 1

6||2 = 6 <=> 0110||0010 = 0110
```

## ||（逻辑或）

两边的表达式有一个为真则为真，且`||`左边的表达式为真的情况下不去计算右边的表达式

## ^（异或运算符）

同为假，异为真

```JS
1^0 = 1 , 1^1 = 0 , 0^1 = 1 , 0^0 = 0

5^9 = 12 <=> 0101^1001 = 1100
```

## >>（右移运算符） 

`5>>2`的意思为5的二进制位往右挪两位，正数左边补0，负数补1

```js
0101 >> 2 -> 0001 = 1 

-5>>2 
// -5的二进制表示 1111 1011
源码: 0000 0101
取反: 1111 1010
补码: 1111 1011 (补码=取反+1)
 
-5>>2: 1111 1110
取反:   0000 0001  
源码:   0000 0010 (源码=取反+1)
-5>>2 = -2

-2 = 1111 1111
-2>>2: 1111 1111

-1 : 1111 1110
取反: 0000 0001  
-5>>2 = -1
```

## <<（左移运算符）

`5<<2`的意思为5的二进制位往左挪两位，右边补0

```js
0101 << 2 -> 010100 = 20 
```

## ~（取反运算符）

取反就是1为0,0为1

```js
~5 = -6 <=> 0000 0101 -> 1111 1010
```

## 位运算使用实例：

- 检测整数n是否是2的次幂

```js
n&(n-1) === 0 
```

- a^b^b = a
- 数 a 向右移一位，相当于将 a 除以 2；数 a 向左移一位，相当于将 a 乘以 2

```js
var a = 2;
a >> 1; // 1
a << 1; // 4
```

- 交换两个数

```js
a ^= b;
b ^= a;
a ^= b;
```

- 判断奇数、偶数

```js
a&1 === 0 // 偶数
```

- 交换符号

```js
function reversal(a) {
  return ~a + 1; // 整数取反加1，正好变成其对应的负数(补码表示)；负数取反加一，则变为其原码，即正数
}
```

- x & (x - 1) 用于消去x最后一位的1

```js
let x = 12; //1100
x - 1 = 11; //1011
X&(x-1) = 8; //1000

// 统计给定数二进制中1的个数
function count(n){
    let len = 0;
    while(n){
        n = n&(n-1);
        len++;
    }
    return len;
}
```

