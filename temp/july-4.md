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

`this` 不会以任何方式指向函数的 **词法作用域**。`this` 既不是函数自身的引用，也不是函数 *词法* 作用域的引用。`this` 不是编写时绑定，而是运行时绑定。`this` 实际上是在函数被调用时建立的一个绑定，它指向 *什么* 是完全由函数被调用的**调用点**来决定的。

**调用点**：函数在代码中被调用的位置不是被申明的位置。

如下是调用点使用的四种规则：

## 默认绑定

独立函数调用，这种 `this` 规则是在没有其他规则适用时的默认规则， `this` 指向了全局对象。

```js
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```

们考察调用点来看看 `foo()` 是如何被调用的。在我们的代码段中，`foo()` 是被一个直白的，毫无修饰的函数引用调用的。没有其他的我们将要展示的规则适用于这里，所以 *默认绑定* 在这里适用。

## 隐含绑定

调用点是否有一个环境对象（context object），也称为拥有者（owning）或容器（containing）对象

```js
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```

调用点 *使用* `obj` 环境来 **引用** 函数，所以你 *可以说* `obj` 对象在函数被调用的时间点上“拥有”或“包含”这个 **函数引用**。在 `foo()` 被调用的位置上，它被冠以一个指向 `obj` 的对象引用。当一个方法引用存在一个环境对象时，*隐含绑定* 规则会说：是这个对象应当被用于这个函数调用的 `this` 绑定。

> `strict mode` 下是 `undefined`，否则就是全局对象。

## 明确绑定

call， apply

如果你传递 `null` 或 `undefined` 作为 `call`、`apply` 或 `bind` 的 `this` 绑定参数，那么这些值会被忽略掉，取而代之的是 *默认绑定* 规则将适用于这个调用。

## new 绑定

当在函数前面被加入 `new` 调用时，也就是构造器调用时，下面这些事情会自动完成：

1. 一个全新的对象会凭空创建（就是被构建）
2. *这个新构建的对象会被接入原形链（[[Prototype]]-linked）*
3. 这个新构建的对象被设置为函数调用的 `this` 绑定
4. 除非函数返回一个它自己的其他 **对象**，否则这个被 `new` 调用的函数将 *自动* 返回这个新构建的对象。

## 判定 `this`

现在，我们可以按照优先顺序来总结一下从函数调用的调用点来判定 `this` 的规则了。按照这个顺序来问问题，然后在第一个规则适用的地方停下。

1. 函数是通过 `new` 被调用的吗（**new 绑定**）？如果是，`this` 就是新构建的对象。

   `var bar = new foo()`

2. 函数是通过 `call` 或 `apply` 被调用（**明确绑定**），甚至是隐藏在 `bind` *硬绑定* 之中吗？如果是，`this` 就是那个被明确指定的对象。

   `var bar = foo.call( obj2 )`

3. 函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（**隐含绑定**）？如果是，`this` 就是那个环境对象。

   `var bar = obj1.foo()`

4. 否则，使用默认的 `this`（**默认绑定**）。如果在 `strict mode` 下，就是 `undefined`，否则是 `global`对象。

   `var bar = foo()`

以上，就是理解对于普通的函数调用来说的 `this` 绑定规则 *所需的全部*。是的……几乎是全部。

## 词法 this

Es6箭头函数的`this`与使用四种标准的 `this` 规则不同的是，箭头函数从封闭它的（函数或全局）作用域采用 `this` 绑定。一个箭头函数的词法绑定是不能被覆盖的（就连 `new` 也不行！）。

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

声明一个函数表达式作为字面对象的一部分，那个函数都不会魔法般地 *属于* 这个对象 —— 仍然仅仅是同一个函数对象的多个引用罢了。

## 拷贝

浅拷贝和深拷贝，`Object.assign()`就是一个内置的浅拷贝。

### Object.assign

`writable`，`enumerable`，` configurable`都为false的属性不会被拷贝，且不会带上拷贝对象的属性描述，拷贝的属性的三个值都为`true`。

## 内容

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

当你将一个属性定义为拥有 getter 或 setter 或两者兼备，那么它的定义就成为了“访问器描述符”（与“数据描述符”相对）。**对于访问器描述符，它的 `value` 和 `writable` 性质因没有意义而被忽略**，取而代之的是 JS 将会考虑属性的 `set` 和 `get` 性质（还有 `configurable` 和 `enumerable`）。

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

```js

```



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

```js
let obj = Object.create({a:1});
obj.b = 2;

Object.keys(obj); // ["b"]
for(let key in obj){
    console.log(key); // b a
}
'a' in obj // true
```

[https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/this & object prototypes/README.md#you-dont-know-js-this--object-prototypes)

# 原型和行为委托

## [[Prototype]]

JavaScript 中的对象有一个内部属性，在语言规范中称为 `[[Prototype]]`，它只是一个其他对象的引用。几乎所有的对象在被创建时，它的这个属性都被赋予了一个非 `null` 值，通常称为“原型”。

`[[Prototype]]` 引用有什么用？先看对象属性取值操作`[[Get]]`

### [[Get]]	 	

如果默认的 `[[Get]]` 操作不能直接在对象上找到被请求的属性，那么它会沿着对象的 `[[Prototype]]` **链** 继续处理。

看如下代码：

```
var anotherObject = {
	a: 2
};

// 创建一个链接到 `anotherObject` 的对象
var myObject = Object.create( anotherObject );

myObject.a; // 2
```

获取`myObject`属性`a`的值，对于默认的 `[[Get]]` 操作来说，第一步就是检查对象本身是否拥有一个 `a` 属性，如果有，就使用它。本示例中是没有的，进入第二步。第二步如果 `myObject` 上 **不** 存在 `a` 属性时，我们就将注意力转向对象的 `[[Prototype]]` 链。现在让 `myObject` `[[Prototype]]` 链到了 `anotherObject`，在 `anotherObject` 中找到了，而且确实找到了值 `2`。但是，如果在 `anotherObject` 上也没有找到 `a`，而且如果它的 `[[Prototype]]` 链不为空，就沿着它继续查找。

这个处理持续进行，直到找到名称匹配的属性，或者 `[[Prototype]]` 链终结。如果在链条的末尾都没有找到匹配的属性，那么 `[[Get]]` 操作的返回结果为 `undefined`。

对于在对象上添加新属性或改变既存属性的值，情况会更复杂一些，

### [[Put]] 与属性屏蔽

```
myObject.foo = "bar";
```

如果 `myObject` 对象已经直接拥有了普通的名为 `foo` 的数据访问器属性，那么这个赋值就和改变既存属性的值一样简单。

如果 `foo` 还没有直接存在于 `myObject`，`[[Prototype]]` 就会被遍历，就像 `[[Get]]` 操作那样。如果在链条的任何地方都没有找到 `foo`，那么就会像我们期望的那样，属性 `foo` 就以指定的值被直接添加到 `myObject` 上。

然而，如果 `foo` 已经存在于链条更高层的某处，`myObject.foo = "bar"` 赋值就可能会发生微妙的（也许令人诧异的）行为。

如果属性名 `foo` 同时存在于 `myObject` 本身和从 `myObject` 开始的 `[[Prototype]]` 链的更高层，这样的情况称为 *遮蔽*。直接存在于 `myObject` 上的 `foo` 属性会 *遮蔽* 任何出现在链条高层的 `foo` 属性，因为 `myObject.foo` 查询总是在寻找链条最底层的 `foo` 属性。

正如我们被暗示的那样，在 `myObject` 上的 `foo` 遮蔽没有看起来那么简单。我们现在来考察 `myObject.foo = "bar"` 赋值的三种场景，当 `foo` **不直接存在** 于 `myObject`，但 **存在** 于 `myObject` 的 `[[Prototype]]` 链的更高层时：

1. 如果一个普通的名为 `foo` 的数据访问属性在 `[[Prototype]]` 链的高层某处被找到，**而且没有被标记为只读（writable:false）**，那么一个名为 `foo` 的新属性就直接添加到 `myObject` 上，形成一个 **遮蔽属性**。
2. 如果一个 `foo` 在 `[[Prototype]]` 链的高层某处被找到，但是它被标记为 **只读（writable:false）** ，那么设置既存属性和在 `myObject` 上创建遮蔽属性都是 **不允许** 的。如果代码运行在 `strict mode` 下，一个错误会被抛出。否则，这个设置属性值的操作会被无声地忽略。不论怎样，**没有发生遮蔽**。
3. 如果一个 `foo` 在 `[[Prototype]]` 链的高层某处被找到，而且它是一个 setter（见第三章），那么这个 setter 总是被调用。没有 `foo` 会被添加到（也就是遮蔽在）`myObject` 上，这个 `foo` setter 也不会被重定义。

大多数开发者认为，如果一个属性已经存在于 `[[Prototype]]` 链的高层，那么对它的赋值（`[[Put]]`）将总是造成遮蔽。但如你所见，这仅在刚才描述的三中场景中的一种（第一种）中是对的。

如果你想在第二和第三种情况中遮蔽 `foo`，那你就不能使用 `=` 赋值，而必须使用 `Object.defineProperty(..)`（见第三章）将 `foo` 添加到 `myObject`。

### （原型）继承

js的继承都是依托原型之间的链接进行的，不会像传统类那样进行拷贝，只是将原型从一个地方链到另一个地方。

这里是一段典型的创建这样的链接的“原型风格”代码：

```
function Foo(name) {
	this.name = name;
}

Foo.prototype.myName = function() {
	return this.name;
};

function Bar(name,label) {
	Foo.call( this, name );
	this.label = label;
}

// 这里，我们创建一个新的 `Bar.prototype` 链接链到 `Foo.prototype`
Bar.prototype = Object.create( Foo.prototype );

// 注意！现在 `Bar.prototype.constructor` 不存在了，
// 如果你有依赖这个属性的习惯的话，它可以被手动“修复”。

Bar.prototype.myLabel = function() {
	return this.label;
};

var a = new Bar( "a", "obj a" );

a.myName(); // "a"
a.myLabel(); // "obj a"
```

**注意：** 要想知道为什么上面代码中的 `this` 指向 `a`，参见第二章。

重要的部分是 `Bar.prototype = Object.create( Foo.prototype )`。`Object.create(..)` 凭空 *创建* 了一个“新”对象，并将这个新对象内部的 `[[Prototype]]` 链接到你指定的对象上（在这里是 `Foo.prototype`）。

换句话说，这一行的意思是：“做一个 *新的* 链接到‘Foo 点儿 prototype’的‘Bar 点儿 prototype ’对象”。

## 对象链接

正如我们看到的，`[[Prototype]]` 机制是一个内部链接，它存在于一个对象上，这个对象引用一些其他的对象。

这种链接（主要）在对一个对象进行属性/方法引用，但这样的属性/方法不存在时实施。在这种情况下，`[[Prototype]]` 链接告诉引擎在那个被链接的对象上查找这个属性/方法。接下来，如果这个对象不能满足查询，它的 `[[Prototype]]` 又会被查找，如此继续。这个在对象间的一系列链接构成了所谓的“原形链”。

### 创建链接

我们已经彻底揭露了为什么 JavaScript 的 `[[Prototype]]` 机制和 *类* **不** 一样，而且我们也看到了如何在正确的对象间创建 **链接**。

`[[Prototype]]` 机制的意义是什么？为什么总是见到 JS 开发者们费那么大力气（模拟类）在他们的代码中搞乱这些链接？

记得我们在本章很靠前的地方说过 `Object.create(..)` 是英雄吗？现在，我们准备好看看为什么了。

```
var foo = {
	something: function() {
		console.log( "Tell me something good..." );
	}
};

var bar = Object.create( foo );

bar.something(); // Tell me something good...
```

`Object.create(..)` 创建了一个链接到我们指定的对象（`foo`）上的新对象（`bar`），这给了我们 `[[Prototype]]` 机制的所有力量（委托），而且没有 `new` 函数作为类和构造器调用产生的所有没必要的复杂性，搞乱 `.prototype` 和 `.constructor` 引用，或任何其他的多余的东西。

#### 部分填补 `Object.create()`

`Object.create(..)` 在 ES5 中被加入。你可能需要支持 ES5 之前的环境（比如老版本的 IE），所以让我们来看一个 `Object.create(..)` 的简单 **部分** 填补工具，它甚至能在更老的 JS 环境中给我们所需的能力：

```
if (!Object.create) {
	Object.create = function(o) {
		function F(){}
		F.prototype = o;
		return new F();
	};
}
```

## 委托设计模式

但是现在让我们试着用 *行为委托* 代替 *类* 来思考同样的问题。

你将首先定义一个称为 `Task` 的 **对象**（不是一个类，也不是一个大多数 JS 开发者想让你相信的 `function`），而且它将拥有具体的行为，这些行为包含各种任务可以使用的（读作：*委托至*！）工具方法。然后，对于每个任务（“XYZ”，“ABC”），你定义一个 **对象** 来持有这个特定任务的数据/行为。你 **链接** 你的特定任务对象到 `Task` 工具对象，允许它们在必要的时候可以委托到它。

基本上，你认为执行任务“XYZ”就是从两个兄弟/对等的对象（`XYZ` 和 `Task`）中请求行为来完成它。与其通过类的拷贝将它们组合在一起，我们可以将它们保持在分离的对象中，而且可以在需要的情况下允许 `XYZ` 对象 **委托到** `Task`。

这里是一些简单的代码，示意你如何实现它：

```js
var Task = {
	setID: function(ID) { this.id = ID; },
	outputID: function() { console.log( this.id ); }
};

// 使 `XYZ` 委托到 `Task`
var XYZ = Object.create( Task );

XYZ.prepareTask = function(ID,Label) {
	this.setID( ID );
	this.label = Label;
};

XYZ.outputTaskDetails = function() {
	this.outputID();
	console.log( this.label );
};

// ABC = Object.create( Task );
// ABC ... = ...
```

在这段代码中，`Task` 和 `XYZ`不是类（也不是函数），它们 **仅仅是对象**。`XYZ` 通过 `Object.create()` 创建，来 `[[Prototype]]` 委托到 `Task` 对象

#### class与委托比较

```js
class Widget {
	constructor(width,height) {
		this.width = width || 50;
		this.height = height || 50;
		this.$elem = null;
	}
	render($where){
		if (this.$elem) {
			this.$elem.css( {
				width: this.width + "px",
				height: this.height + "px"
			} ).appendTo( $where );
		}
	}
}

class Button extends Widget {
	constructor(width,height,label) {
		super( width, height );
		this.label = label || "Default";
		this.$elem = $( "<button>" ).text( this.label );
	}
	render($where) {
		super.render( $where );
		this.$elem.click( this.onClick.bind( this ) );
	}
	onClick(evt) {
		console.log( "Button '" + this.label + "' clicked!" );
	}
}

$( document ).ready( function(){
	var $body = $( document.body );
	var btn1 = new Button( 125, 30, "Hello" );
	var btn2 = new Button( 150, 40, "World" );

	btn1.render( $body );
	btn2.render( $body );
} );
```

```js
var Widget = {
	init: function(width,height){
		this.width = width || 50;
		this.height = height || 50;
		this.$elem = null;
	},
	insert: function($where){
		if (this.$elem) {
			this.$elem.css( {
				width: this.width + "px",
				height: this.height + "px"
			} ).appendTo( $where );
		}
	}
};

var Button = Object.create( Widget );

Button.setup = function(width,height,label){
	// delegated call
	this.init( width, height );
	this.label = label || "Default";

	this.$elem = $( "<button>" ).text( this.label );
};
Button.build = function($where) {
	// delegated call
	this.insert( $where );
	this.$elem.click( this.onClick.bind( this ) );
};
Button.onClick = function(evt) {
	console.log( "Button '" + this.label + "' clicked!" );
};

$( document ).ready( function(){
	var $body = $( document.body );

	var btn1 = Object.create( Button );
	btn1.setup( 125, 30, "Hello" );

	var btn2 = Object.create( Button );
	btn2.setup( 150, 40, "World" );

	btn1.build( $body );
	btn2.build( $body );
} );
```

# 类型和文法

## 内建类型

JavaScript 定义了七种内建类型：

- `null`
- `undefined`
- `boolean`
- `number`
- `string`
- `object`
- `symbol` -- 在 ES6 中被加入的！

**注意：** 除了 `object` 所有这些类型都被称为“基本类型（primitives）”。

# typeof

typeof 操作在用于安全的变量检查工作中是很有用的，如下例子：

```js
// 噢，这将抛出一个错误！
if (DEBUG) {
	console.log( "Debugging is starting" );
}

// 并不是所有的全局变量都是window
if (window.DEBUG) {
	console.log( "Debugging is starting" );
}

// 这是一个安全的存在性检查
if (typeof DEBUG !== "undefined") {
	console.log( "Debugging is starting" );
}
```

# Number

在 JavaScript 中字面数字一般用十进制小数表达。例如：

```
var a = 42;
var b = 42.3;
```

小数的整数部分如果是 `0`，是可选的：

```
var a = 0.42;
var b = .42;
```

相似地，一个小数在 `.` 之后的小数部分如果是 `0`，是可选的：

```
var a = 42.0;
var b = 42.;
```

**警告：** `42.` 是极不常见的，如果你正在努力避免别人阅读你的代码时感到困惑，它可能不是一个好主意。但不管怎样，它是合法的。

`number` 字面量还可以使用其他进制表达，比如二进制，八进制，和十六进制。

这些格式是可以在当前版本的 JavaScript 中使用的：

```
0xf3; // 十六进制的: 243
0o363;		// 八进制的: 243
0b11110011;	// 二进制的: 243
```

保持使用小写的谓词 `0x`、`0b`、和`0o`。

# MAX_SAFE_INTEGER

**Number.MAX_SAFE_INTEGER** 常量表示在 JavaScript 中最大的安全整数（maxinum safe integer)（`2^53 - 1）。`

MAX_SAFE_INTEGER 是一个值为 9007199254740991的常量。因为Javascript的数字存储使用了`[IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point)中规定的[双精度浮点数](https://zh.wikipedia.org/zh-cn/雙精度浮點數)数据类型，而这一数据类型能够安全存储 `-(253 - 1)` 到 `253 - 1 之间的数值（包含边界值）。

这里安全存储的意思是指能够准确区分两个不相同的值，例如 `Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2 将得到 true的结果，而这在数学上是错误的`

## 值与引用

在其他许多语言中，根据你使用的语法，值可以通过值拷贝，也可以通过引用拷贝来赋予/传递。在 JavaScript 中，没有指针，并且引用的工作方式有一点儿不同。你不能拥有一个从一个 JS 变量到另一个 JS 变量的引用。这是完全不可能的。

JS 中的引用指向一个（共享的） **值**，所以如果你有十个不同的引用，它们都总是同一个共享值的不同引用；**它们没有一个是另一个的引用/指针。**

另外，在 JavaScript 中，没有语法上的提示可以控制值和引用的赋值/传递。取而代之的是，值的 *类型* 用来 *唯一* 控制值是通过值拷贝，还是引用拷贝来赋予。

简单值（也叫基本标量） *总是* 通过值拷贝来赋予/传递：`null`、`undefined`、`string`、`number`、 `boolean`、以及 ES6 的 `symbol`。

复合值 —— `object`（包括 `array`，和所有的对象包装器 —— 见第三章）和 `function` —— *总是* 在赋值或传递时创建一个引用的拷贝。

## 封箱包装器

这些对象包装器服务于一个非常重要的目的。基本类型值没有属性或方法，所以为了访问 `.length` 或 `.toString()` 你需要这个值的对象包装器。值得庆幸的是，JS 将会自动地 *封箱*（也就是包装）基本类型值来满足这样的访问。

```
var a = "abc";

a.length; // 3
a.toUpperCase(); // "ABC"
```

那么，如果你想以通常的方式访问这些字符串值上的属性/方法，比如一个 `for` 循环的 `i < a.length` 条件，这么做看起来很有道理：一开始就得到一个这个值的对象形式，于是 JS 引擎就不需要隐含地为你创建一个。

## JSON 字符串化

对于最简单的值，JSON 字符串化行为基本上和 `toString()` 转换是相同的，除了序列化的结果 *总是一个 string*：

```
JSON.stringify( 42 );	// "42"
JSON.stringify( "42" );	// ""42"" （一个包含双引号的字符串）
JSON.stringify( null );	// "null"
JSON.stringify( true );	// "true"
```

`JSON.stringify(..)` 工具在遇到 `undefined`、`function`、和 `symbol` 时将会自动地忽略它们。如果在一个 `array` 中遇到这样的值，它会被替换为 `null`（这样数组的位置信息就不会改变）。如果在一个 `object` 的属性中遇到这样的值，这个属性会被简单地剔除掉。

考虑下面的代码：

```
JSON.stringify( undefined );					// undefined
JSON.stringify( function(){} );					// undefined

JSON.stringify( [1,undefined,function(){},4] );	// "[1,null,null,4]"
JSON.stringify( { a:2, b:function(){} } );		// "{"a":2}"
```

但如果你试着 `JSON.stringify(..)` 一个带有循环引用的 `object`，就会抛出一个错误。

JSON 字符串化有一个特殊行为，如果一个 `object` 值定义了一个 `toJSON()` 方法，这个方法将会被首先调用，以取得用于序列化的值。

如果你打算 JSON 字符串化一个可能含有非法 JSON 值的对象，或者如果这个对象中正好有不适于序列化的值，那么你就应当为它定义一个 `toJSON()` 方法，返回这个 `object` 的一个 *JSON 安全* 版本。

例如：

```
var o = { };

var a = {
	b: 42,
	c: o,
	d: function(){}
};

// 在 `a` 内部制造一个循环引用
o.e = a;

// 这会因循环引用而抛出一个错误
// JSON.stringify( a );

// 自定义一个 JSON 值序列化
a.toJSON = function() {
	// 序列化仅包含属性 `b`
	return { b: this.b };
};

JSON.stringify( a ); // "{"b":42}"
```

`toJSON()` 应当被翻译为：“变为一个适用于字符串化的 JSON 安全的值”，而不是像许多开发者错误认为的那样，“变为一个 JSON 字符串”。

**`JSON.stringify(..)` 的第二个参数值是可选的**，它称为 *替换器（replacer）*。这个参数值既可以是一个 `array` 也可以是一个 `function`。与 `toJSON()` 为序列化准备一个值的方式类似，它提供一种过滤机制，指出一个 `object` 的哪一个属性应该或不应该被包含在序列化形式中，来自定义这个 `object` 的递归序列化行为。

如果 *替换器* 是一个 `array`，那么它应当是一个 `string` 的 `array`，它的每一个元素指定了允许被包含在这个 `object` 的序列化形式中的属性名称。如果一个属性不存在于这个列表中，那么它就会被跳过。

如果 *替换器* 是一个 `function`，那么它会为 `object` 本身而被调用一次，并且为这个 `object` 中的每个属性都被调用一次，而且每次都被传入两个参数值，*key* 和 *value*。要在序列化中跳过一个 *key*，可以返回 `undefined`。否则，就返回被提供的 *value*。

**`JSON.stringify(..)` 还可以接收第三个可选参数值**，称为 *填充符（space）*，在对人类友好的输出中它被用做缩进。*填充符*可以是一个正整数，用来指示每一级缩进中应当使用多少个空格字符。或者，*填充符* 可以是一个 `string`，这时每一级缩进将会使用它的前十个字符。