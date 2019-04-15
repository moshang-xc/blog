# 面试宝典
记录面试中的高频问题，和一些面试技巧，基础知识等
[参考链接](https://segmentfault.com/a/1190000018155877)

https://segmentfault.com/a/1190000018794544

## css

### 盒模型
border-box
content-box

### BFC

## js

### 原型，构造函数，实例
> __ptoto__: 原型对象链或者隐式原型

- 实例.__proto__ === 原型
- 原型.constructor === 构造函数
- 构造函数.prototype === 原型
- 实例.constructor = 构造函数

![25d1bc5cab25508bc521e793b6a3721b.jpeg](evernotecid://8A734D3D-9C70-4F81-A039-811699D0CEAF/appyinxiangcom/15073588/ENResource/p2)

原型链是由原型对象组成，每个对象都有`__proto__`属性，指向了创建该对象的构造函数的原型`__proto__`将对象连接起来组成了原型链。是一个用来实现继承和共享属性的有限的对象链。
```js
function S(t){
    this.s = t;
}

var t = new S(1);

t.__proto__ === S.prototype // ture
S.prototype.constructor = S // true
t.constructor = S // true
```
#### Object.create()

`Object.create()`方法接受两个参数:`Object.create(obj,propertiesObject)`
`obj`:一个对象，应该是新创建的对象的原型。
`propertiesObject`：可选。该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与Object.defineProperties()的第二个参数一样）。注意：该参数对象不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，也就是说该对象的原型链上属性是无效的。

Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法,例如：toString(), hasOwnProperty()等方法

Vue源码中的extend就是通过`Object.create`来实现的。

### new运算符的执行过程
new 构造函数，主要经历三个阶段：
1. 构造一个空的对象A
2. A的隐式原型指向构造函数的原型链prototype对象(A.__proto__ = Con.prototype)
3. 绑定`this`(Con.apple(this, arguments))
3. 返回A

代码示例如下
```
new Foo = function(Foo){
    let o = {};
    o._proto_ = Foo.prototype;
    Foo.call(o);
    return o;
}
```

### 继承
```
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

### instanceof
原理：能在实例的原型对象链(__proto__)中找到该构造函数的prototype属性所指向的原型对象，就返回true。即
```
s instanceof A
//等价于
s.__proto__ === A.prototype
```

### 闭包

### script 引入方式
- html 静态<script>引入
- js 动态插入<script>
- `<script defer>`: 异步加载，元素解析完成后执行
- `<script async>`: 异步加载，与元素渲染并行执行


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

### babel编译原理
- babylon 将 ES6/ES7 代码解析成 AST
- babel-traverse 对 AST 进行遍历转译，得到新的 AST
- 新 AST 通过 babel-generator 转换成 ES5

### 函数柯里化
在一个函数中，首先填充几个参数，然后再返回一个新的函数的技术，称为函数的柯里化。通常可用于在不侵入函数的前提下，为函数 预置通用参数，供多次重复调用。

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

### new Fun()做了哪些事情
- 新建一个空对象A，并且this引用该对象
- A.__proto__ = func.prototype A继承了函数的原型，属性和方法被加入到 this 引用的对象中
- let res = func.call(A) 并执行了该函数func
- return res/A 新创建的对象由this所引用，并且最后隐式的返回this 。// 如果func.call(target)返回的res是个对象或者function 就返回它

```js
function new(func){
    let target = {};
    target.__proto__ = func.prototype;
    let res = func.call(target);

    if(typeof(res) == "object" || typeof(res) == "function"){
        return res;
    }
    return target;
}

```

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
