# 面试宝典
记录面试中的高频问题，和一些面试技巧，基础知识等
[参考链接](https://segmentfault.com/a/1190000018155877)

https://segmentfault.com/a/1190000018794544
https://mp.weixin.qq.com/s/lvGmT7KbdNzfEvQB9-tgrw

## css

### 盒模型
border-box
content-box

### BFC

### 移动端适配

#### 概念介绍
1. 英寸
一般用英寸描述屏幕的物理大小，如电脑显示器的17、22，手机显示器的4.8、5.7等使用的单位都是英寸。需要注意，上面的尺寸都是屏幕对角线的长度。
英寸和厘米的换算：1英寸 = 2.54 厘米

2. 分辨率
- 像素：一个小方块，它具有特定的位置和颜色。
- 屏幕分辨率：屏幕分辨率指一个屏幕具体由多少个像素点组成，iPhone SE的分辨率为1136 x 640
- 图像分辨率：图片含有的像素数，比如一张图片的分辨率为800 x 400。这表示图片分别在垂直和水平上所具有的像素点数为800和400。
- PPI(Pixel Per Inch)每英寸包括的像素数。((水平像素平方+垂直像素平方)平方根/英寸)
- DPI(Dot Per Inch)：即每英寸包括的点数。

3. 设备物理像素
4. 设备独立像素(Device Independent Pixels) CSS像素 =设备独立像素 = 逻辑像素
5. 设备像素比(device pixel ratio)简称dpr，即物理像素和设备独立像素的比值

## js

### 原型，构造函数，实例

### new运算符的执行过程
### 原型 && 原型链
### 继承
### instanceof typeof
**insranceof实现**

### 闭包
闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包最常用的方式就是在一个函数内部创建另一个函数。

闭包的作用有:
- 封装私有变量
- 模仿块级作用域(ES5中没有块级作用域)
- 实现JS的模块

### this指向问题
- 自执行函数的`this`指向`window`
- 把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind, 这些值在调用时会被忽略，实际应用的是默认绑定规则(在严格模式下，则绑定到 undefined，否则绑定到全局对象)。

### 词法作用域和this的区别。
- 词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的
- `this`是在调用时被绑定的，`this`指向什么，完全取决于函数的调用位置(关于this的指向问题，本文已经有说明)

### script 引入方式
- html 静态<script>引入
- js 动态插入<script>
- `<script defer>`: 异步加载，元素解析完成后执行
- `<script async>`: 异步加载，与元素渲染并行执行

### 原始数据类型和复制数据类型的存储区别
- 原始数据类型：undefined，null，bool，string，number，symbol
- 虽然 typeof null 返回的值是 object,但是null不是对象，而是基本数据类型的一种
- 原始数据类型存储在栈内存，存储的是值。
- 复杂数据类型存储在堆内存，存储的是地址。当我们把对象赋值给另外一个变量的时候，复制的是地址，指向同一块内存空间，当其中一个对象改变时，另一个对象也会变化。

> 栈：由操作系统自动分配释放 ，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
> 堆：一般由程序员分配释放， 若程序员不释放，程序结束时可能由OS回收，分配方式倒是类似于链表。

### 谈谈你对JS执行上下文栈和作用域链的理解。
执行上下文就是当前 JavaScript 代码被解析和执行时所在环境, JS执行上下文栈可以认为是一个存储函数调用的栈结构，遵循先进后出的原则。
- JavaScript执行在单线程上，所有的代码都是排队执行。
- 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈的顶部。
- 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部。当前函数执行-完成后，当前函数的执行上下文出栈，并等待垃圾回收。
- 浏览器的JS执行引擎总是访问栈顶的执行上下文。
- 全局上下文只有唯一的一个，它在浏览器关闭时出栈。

作用域链: 无论是 LHS 还是 RHS 查询，都会在当前的作用域开始查找，如果没有找到，就会向上级作用域继续查找目标标识符，每次上升一个作用域，一直到全局作用域为止。

### 类型转换
大家都知道 JS 中在使用运算符号或者对比符时，会自带隐式转换，规则如下:

* 算数运算符 ：一律转换成数值后计算
* +：
    - 数字 + 字符串 = 字符串， 运算顺序是从左到右
    - 数字 + 对象， 优先调用对象的valueOf -> toString
    - 数字 + boolean/null = 数字
    - 数字 + undefined == NaN(+undefined -> NaN)
* [1].toString() === '1'
* {}.toString() === '[object object]'
* NaN !== NaN

###  == 和 === 有什么区别？

=== 不需要进行类型转换，只有类型相同并且值相等时，才返回 true.

== 如果两者类型不同，首先需要进行类型转换。具体流程如下:

- 首先判断两者类型是否相同，如果相等，判断值是否相等.
- 如果类型不同，进行类型转换
- 判断比较的是否是 null 或者是 undefined, 如果是, 返回 true .
- 判断两者类型是否为 string 和 number, 如果是, 将字符串转换成 number
- 判断其中一方是否为 boolean, 如果是, 将 boolean 转为 number 再进行判断
- 判断其中一方是否为 object 且另一方为 string、number 或者 symbol , 如果是, 将 object 转为原始类型再进行判断

```js
let person1 = {
    age: 25
}
let person2 = person1;
person2.gae = 20;
console.log(person1 === person2); //true,注意复杂数据类型，比较的是引用地址
```

**思考: [] == ![]**

我们来分析一下: [] == ![] 是true还是false？

1. 首先，我们需要知道 ! 优先级是高于 == (更多运算符优先级可查看: 运算符优先级)
2. ![] 引用类型转换成布尔值都是true,因此![]的是false
3. 根据上面的比较步骤中的第五条，其中一方是 boolean，将 boolean 转为 number 再进行判断，false转换成 number，对应的值是 0.
4. 根据上面比较步骤中的第六条，有一方是 number，那么将object也转换成Number,空数组转换成数字，对应的值是0.(空数组转换成数字，对应的值是0，如果数组中只有一个数字，那么转成number就是这个数字，其它情况，均为NaN)
5. 0 == 0; 为true

### 类型判断

- 基本类型(null): 使用 String(null)
- 基本类型(string / number / boolean / undefined) + function: 直接使用 typeof即可
- 其余引用类型(Array / Date / RegExp Error): 调用toString后根据[object XXX]进行判断

> typeof null -> "object"

### 模块化
- 分类
    - es6: import / exports
    - commonjs: require / module.exports / exports
    - amd: require / defined
    
- require与import的区别
    - require支持 动态导入，import不支持，正在提案 (babel 下可支持)
    - require是 同步 导入，import属于 异步 导入
    - require是 值拷贝，导出值变化不会影响导入值；import指向 内存地址，导入值会随导出值而变化

### ES6/ES7
set, map, class, extend, promise
- 新增了块级作用域(let,const)
- 提供了定义类的语法糖(class)
- 新增了一种基本数据类型(Symbol)
- 新增了变量的解构赋值
- 函数参数允许设置默认值，引入了rest参数，新增了箭头函数
- 数组新增了一些API，如 isArray / from / of 方法;数组实例新增了 entries()，keys() 和 values() 等方法
- 对象和数组新增了扩展运算符
- ES6 新增了模块化(import/export)
- ES6 新增了 Set 和 Map 数据结构
- ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例
- ES6 新增了生成器(Generator)和遍历器(Iterator)

###  ES6中的class和ES5的类有什么区别？
- `ES6 class`内部所有定义的方法都是不可枚举的; 所有的方法都在实例的`__proto__`中
- `ES6 class`必须使用`new`调用;
- `ES6 class`不存在变量提升;
- `ES6 class`默认即是严格模式;
- `ES6 class`子类必须在父类的构造函数中调用super()，这样才有this对象;ES5中类继承的关系是相反的，先有子类的this，然后用父类的方法应用在this上。

### promise
promise有三种状态: `fulfilled`, `rejected`, `resolved`.
**Promise 的优点：**
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果
- 可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数

**Promise 的缺点：**
- 无法取消 Promise
- 当处于pending状态时，无法得知目前进展到哪一个阶段

Promise 是微任务，setTimeout 是宏任务，同一个事件循环中，promise.then总是先于 setTimeout 执行。同一个事件循环中，promise.then 先于 setTimeout 执行。

### 在JS中什么是变量提升？什么是暂时性死区？

变量提升就是变量在声明之前就可以使用，值为`undefined`。

在代码块内，使用 let/const 命令声明变量之前，该变量都是不可用的(会抛出错误)。这在语法上，称为“暂时性死区”。暂时性死区也意味着 typeof 不再是一个百分百安全的操作。
```js
typeof x; // ReferenceError(暂时性死区，抛错)
let x;

typeof y; // 值是undefined,不会报错
```
暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

### setTimeout倒计时为什么会出现误差？
setTimeout() 只是将事件插入了“任务队列”，必须等当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码消耗时间很长，也有可能要等很久，所以并没办法保证回调函数一定会在 setTimeout() 指定的时间执行。所以， setTimeout() 的第二个参数表示的是最少时间，并非是确切时间。

HTML5标准规定了 setTimeout() 的第二个参数的最小值不得小于4毫秒，如果低于这个值，则默认是4毫秒。在此之前。老版本的浏览器都将最短时间设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常是间隔16毫秒执行。这时使用 requestAnimationFrame() 的效果要好于 setTimeout();

### babel编译原理
- babylon 将 ES6/ES7 代码解析成 AST
- babel-traverse 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 babel-generator 转换成 ES5

### 函数柯里化
在一个函数中，首先填充几个参数，然后再返回一个新的函数的技术，称为函数的柯里化。通常可用于在不侵入函数的前提下，为函数 预置通用参数，供多次重复调用。
```js
function curry(fn, args = []) {
    return function(){
        let rest = [...args, ...arguments];
        if (rest.length < fn.length) {
            return curry.call(this,fn,rest);
        }else{
            return fn.apply(this,rest);
        }
    }
}
//test
function sum(a,b,c) {
    return a+b+c;
}
let sumFn = curry(sum);
console.log(sumFn(1)(2)(3)); //6
console.log(sumFn(1)(2, 3)); //6
```

### 数组
* map: 遍历数组，返回回调返回值组成的新数组
* forEach: 无法break，可以用try/catch中throw new Error来停止
* filter: 过滤
* some: 有一项返回true，则整体为true
* every: 有一项返回false，则整体为false
* join: 通过指定连接符生成字符串
* push / pop: 末尾推入和弹出，改变原数组， 返回推入/弹出项
* unshift / shift: 头部推入和弹出，改变原数组，返回操作项
* sort(fn) / reverse: 排序与反转，改变原数组
* concat: 连接数组，不影响原数组， 浅拷贝
* slice(start, end): 返回截断后的新数组，不改变原数组
* splice(start, number, value...): 返回删除元素组成的数组，value 为插入项，改变原数组
* indexOf / lastIndexOf(value, fromIndex): 查找数组项，返回对应的下标
* reduce / reduceRight(fn(prev, cur)， defaultPrev): 两两执行，prev 为上次化简函数的return值，cur 为当前值(从第二项开始)

### 判断一个变量是不是数组
- 使用 Array.isArray 判断，如果返回 true, 说明是数组
- 使用 instanceof Array 判断，如果返回true, 说明是数组
- 使用 Object.prototype.toString.call 判断，如果值是 [object Array], 说明是数组

### 类数组转化为数组
```js
//第一种方法
Array.prototype.slice.call(arrayLike, start);
//第二种方法
[...arrayLike];
//第三种方法:
Array.from(arrayLike);
```

### 数组的哪些API会改变原数组？

修改原数组的API有:`splice/reverse/fill/copyWithin/sort/push/pop/unshift/shift`

不修改原数组的API有:`slice/map/forEach/every/filter/reduce/entry/entries/find`

### 数组取最大值
```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77, 30]);

// ES6 的写法
Math.max(...[14, 3, 77, 30]);

// reduce写法
```

### for of , for in 和 forEach,map 的区别。

- for...of循环：具有 iterator 接口，就可以用for...of循环遍历它的成员(属性值)。for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象、Generator 对象，以及字符串。for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。对于普通的对象，for...of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。可以中断循环。
- for...in循环：遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值。可以中断循环。
- forEach: 只能遍历数组，不能中断，没有返回值(或认为返回值是undefined)，不修改原数组。
- map: 只能遍历数组，不能中断，返回值是修改后的数组，不修改原数组。

> PS: Object.keys()：返回给定对象所有可枚举属性的字符串数组。

如还不了解 iterator 接口或 for...of, 请先阅读ES6文档: Iterator 和 for...of 循环

## 浏览器
### 跨标签页通信

### Event Loop事件循环
* 微任务
    microtask(jobs): promise / ajax / Object.observe
* 宏任务
    macrotask(task): setTimout / script / IO / UI Rendering

### 存储
短暂性的时候，我们只需要将数据存在内存中，只在运行时可用
持久性存储，可以分为 浏览器端 与 服务器端

* 浏览器:
cookie: 通常用于存储用户身份，登录状态等http 中自动携带， 体积上限为 4K， 可自行设置过期时间
localStorage / sessionStorage: 长久储存/窗口关闭删除， 体积限制为 4~5M
indexDB
* 服务器:
  分布式缓存 redis
  数据库

### 内存泄露

* 意外的全局变量: 无法被回收
* 定时器: 未被正确关闭，导致所引用的外部变量无法被释放
* 事件监听: 没有正确销毁 (低版本浏览器可能出现)
* 闭包: 会导致父级中的变量无法被释放
* dom 引用: dom 元素被删除时，内存中的引用未被正确清空

可用 chrome 中的 timeline 进行内存标记，可视化查看内存的变化情况，找出异常点。

### v8中的垃圾回收机制

## server

### http&cache

https://github.com/moshang-xc/Blog/issues/7

### HTTPS的工作原理 

### 跨域
### 安全
XSS，CSPF

## 算法
### 五大算法

* 贪心算法: 局部最优解法
* 分治算法: 分成多个小模块，与原问题性质相同
* 动态规划: 每个状态都是过去历史的一个总结
* 回溯法: 发现原先选择不优时，退回重新选择
* 分支限界法

### 基础排序算法

* 冒泡排序
* 选择排序
* 插入排序

### 高级排序算法

* 快速排序
* 希尔排序
* 归并排序

## 排序算法

chrome默认的sort算法是怎样的，为什么不能进行正确的排序

### 算法 - Algorithms
1. 排序算法：快速排序、归并排序、计数排序
2. 搜索算法：回溯、递归、剪枝技巧
3. 图论：最短路、最小生成树、网络流建模
4. 动态规划：背包问题、最长子序列、计数问题
5. 基础技巧：分治、倍增、二分、贪心

### 数据结构 - Data Structures
1. 数组与链表：单 / 双向链表、跳舞链
2. 栈与队列
3. 树与图：最近公共祖先、并查集
4. 哈希表
5. 堆：大 / 小根堆、可并堆
6. 字符串：字典树、后缀树

### 斐波那契数列运用
### 数据结构
二叉树


## 运算符

### &（按位与）
两个都为真才为真
```js
1&1=1 , 1&0=0 , 0&1=0 , 0&0=0

3&5 = 1 <=> 011&101 = 001 
```

### &&（逻辑与）
左右两边的表达式为真则为真，且`&&`左边的表达式为真的情况下才计算右边的表达式

逻辑与的值当表达式的结果为真时，值为后一项表达式的值，当表达式的值为假时，若第一个表达式为真，则值为第二个表达式的值，否则为第一个表达式的值，如下所示：

```js
1&&3 // 3
0&&3 // 0
1&&false // false
```

### |（按位或）
一个为真就为真
```js
1|0 = 1 , 1|1 = 1 , 0|0 = 0 , 0|1 = 1

6||2 = 6 <=> 0110||0010 = 0110
```
### ||（逻辑或）
两边的表达式有一个为真则为真，且`||`左边的表达式为真的情况下不去计算右边的表达式

### ^（异或运算符）
同为假，异为真
```JS
1^0 = 1 , 1^1 = 0 , 0^1 = 1 , 0^0 = 0

5^9 = 12 <=> 0101^1001 = 1100
```

### >>（右移运算符） 
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

### <<（左移运算符）
`5<<2`的意思为5的二进制位往左挪两位，右边补0
```js
0101 << 2 -> 010100 = 20 
```
### ~（取反运算符）
取反就是1为0,0为1
```js
~5 = -6 <=> 0000 0101 -> 1111 1010
```



