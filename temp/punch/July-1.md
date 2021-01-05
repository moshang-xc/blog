## 1. Vue 项目时为什么要在列表组件中写 key，其作用是什么？

在不带key的情况下，判断[sameVnode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L35)时因为a.key和b.key都是undefined，**对于列表渲染**来说已经可以判断为相同节点然后调用patchVnode了，实际根本不会进入到答主给的else代码，也就无从谈起“带key比不带key时diff算法更高效”了。

然后，官网推荐推荐的使用key，应该理解为“使用唯一id作为key”。因为index作为key，和不带key的效果是一样的。index作为key时，每个列表项的index在变更前后也是一样的，都是直接判断为sameVnode然后复用。

说到底，key的作用就是更新组件时**判断两个节点是否相同**。相同就复用，不相同就删除旧的创建新的。

正是因为带唯一key时每次更新都不能找到可复用的节点，不但要销毁和创建vnode，在DOM里添加移除节点对性能的影响更大。所以会才说“不带key可能性能更好”。

因为不带key时节点能够复用，省去了销毁/创建组件的开销，同时只需要修改DOM文本内容而不是移除/添加节点，这就是文档中所说的“刻意依赖默认行为以获取性能上的提升”。

既然如此，为什么还要建议带key呢？因为这种模式只适用于渲染简单的无状态组件。对于大多数场景来说，列表组件都有自己的状态。

举个例子：一个新闻列表，可点击列表项来将其标记为"已访问"，可通过tab切换“娱乐新闻”或是“社会新闻”。

不带key属性的情况下，在“娱乐新闻”下选中第二项然后切换到“社会新闻”，"社会新闻"里的第二项也会是被选中的状态，因为这里复用了组件，保留了之前的状态。要解决这个问题，可以为列表项带上新闻id作为唯一key，那么每次渲染列表时都会完全替换所有组件，使其拥有正确状态。

这只是个简单的例子，实际应用会更复杂。带上唯一key虽然会增加开销，但是对于用户来说基本感受不到差距，而且能保证组件状态正确，这应该就是为什么推荐使用唯一id作为key的原因。至于具体怎么使用，就要根据实际情况来选择了。



## 2. ['1', '2', '3'].map(parseInt) what and why

先上结果：

```js
[1, NaN, NaN]
```

首先需要了解两个函数`parseInt`和`map`

### [parseInt(string, radix)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

**parseInt(string, radix)**  string为字符串，radix为介于2-36之间的数。使用者告诉这个函数string（比如11）是radix（比如2）进制的，函数将固定返回string以十进制时显示的数（3）;

#### 参数

- `string`

  要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用  `ToString `抽象操作)。字符串开头的空白符将会被忽略。

- `radix`

  一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的**基数**。比如参数"10"表示使用我们通常使用的十进制数值系统。**始终指定此参数**可以消除阅读该代码时的困惑并且保证转换结果可预测。当未指定基数时，不同的实现会产生不同的结果，通常将值默认为**10**。

#### 返回值

返回解析后的整数值。 如果被解析参数的第一个字符无法被转化成数值类型，则返回 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)。

注意：`radix`参数为n 将会把第一个参数看作是一个数的n进制表示，而返回的值则是十进制的。例如：

```html
parseInt('123', 5) // 将'123'看作5进制数，返回十进制数38 => 1*5^2 + 2*5^1 + 3*5^0 = 38
```

如果 `parseInt` 遇到了不属于`radix`参数所指定的基数中的字符那么该字符和其后的字符都将被忽略。接着返回已经解析的整数部分。`parseInt` 将截取整数部分。开头和结尾的空白符允许存在，会被忽略。

**注意：**

在基数为 `undefined`，或者基数为 0 或者没有指定的情况下，JavaScript 作如下处理：

- 如果字符串 `string` 以"0x"或者"0X"开头, 则基数是16 (16进制).
- 如果字符串 `string` 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用10，但是并不是所有的浏览器都遵循这个规定。因此，**永远都要明确给出radix参数的值**。
- 如果字符串 `string` 以其它任何值开头，则基数是10 (十进制)。

如果第一个字符不能被转换成数字，`parseInt`返回`NaN`。

算术上， `NaN` 不是任何一个进制下的数。 你可以调用[`isNaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 来判断 `parseInt` 是否返回 `NaN`。`NaN` 参与的数学运算其结果总是 `NaN`。

### [map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

`map()` 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

```
var new_array = arr.map(function callback(currentValue[,index[, array]]) {
 // Return element for new_array
 }[, thisArg])
```

可以看到`callback`回调函数需要三个参数, 我们通常只使用第一个参数 (其他两个参数是可选的)。
`currentValue` 是callback 数组中正在处理的当前元素。
`index`可选, 是callback 数组中正在处理的当前元素的索引。
`array`可选, 是callback map 方法被调用的数组。
另外还有`thisArg`可选, 执行 callback 函数时使用的this 值。

```
const arr = [1, 2, 3];
arr.map((num) => num + 1); // [2, 3, 4]
```

### 再看题目

```js
['1', '2', '3'].map(parseInt)
```

实际执行代码为：

```js
['1', '2', '3'].map((item, i) => {
  	return parseInt(item, i);
})
```

返回值为：

```js
parseInt('1', 0) //1
parseInt('2', 1) //NAN
parseInt('3', 2) //NAN, 2进制表示的数中，最大值小于3，所以无法解析
```

### 扩展 -> Number()转换规则

如果是boolean值，true和false将分别转换为十进制数值
如果是数字值，只是简单的传入与返回
如果是null， 返回0
如果是undefined ，返回NaN
如果是字符串，遵循下列原则：
 `1.只包含数字，八进制的数值将会被忽略前面的0，直接显示为十进制 如：“011” 应为 ‘9’但只能转换为‘11’；`
 `2.浮点数可以转换为对应的浮点数值`
 `3.如果是十六进制会转换为十进制值`
 `4.如果字符串为空转换为0`
 `5.其他转为NaN`

```js
Number(new Date()) // 1562075861887
Number('100n') // NAN
parseInt('100n') // 100
Number("123")       //123     字符串
Number("")          //0       字符串
Number(true)        //1       布尔
Number(null)        //0       对象
Number(1.1)         //1.1     浮点数
Number('011')       //11      八进制
Number('0x11')      //17      16进制
```



##  3. 防抖，节流

**防抖**：触发高频事件后n秒内只会执行一次，如果n秒内再次触发，则重新计算时间

```js
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   delay       表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数，在delay时间内连续调用都不执行，且只执行一次
 * @return {function}             返回客户调用函数
 */
function debounce(fn, delay = 50，immediate = true){
	let timer, context, args;
  
  function later(){
    return setTimeout(() => {
			timer = null;
      // immediate: true, 表示目标函数知执行一次，之后再也不执行
      if(!immediate){
				fn.call(context, args);
        context = args = null;
      }
    }, delay);
  }
  
  return function(){
    if(!timer){
      timer = later();
      if(immediate){
				fn.call(this, arguments);
      }else{
        context = this;
        args = arguments;
      }
    }else{
      clearTimeout(timer);
      timer = later();
    }
  }
}
```

**节流**：每n秒内只执行一次高频事件。

```js
// 补充
```

## 4. background

background属性的简写用法, 常见背景属性的理解。

### background属性

background简写属性在一个声明中可设置所有的背景属性。

可设置属性如下:

- `background-image`: 设置背景图像, 可以是真实的图片路径, 也可以是创建的渐变背景;
- `background-position`: 设置背景图像的位置;
- `background-size`: 设置背景图像的大小;
- `background-repeat`: 指定背景图像的铺排方式;
- `background-attachment`: 指定背景图像是滚动还是固定;
- `background-origin`: 设置背景图像显示的原点[background-position相对定位的原点];
- `background-clip`: 设置背景图像向外剪裁的区域;
- `background-color`: 指定背景颜色。

简写的顺序如下:

```
 bg-color || bg-image || bg-position [ / bg-size]? || bg-repeat || bg-attachment || bg-origin || bg-clip
```

**顺序并非固定, 但是要注意:**

1. background-position 和 background-size 属性, 之间需使用/分隔, 且position值在前, size值在后。
2. 如果同时使用 background-origin 和 background-clip 属性, origin属性值需在clip属性值之前, 如果origin与clip属性值相同, 则可只设置一个值。

代码示例:

```
background: url("image.png") 10px 20px/100px no-repeat content-box;
```

background是一个复合属性, 可设置多组属性, 每组属性间使用逗号分隔, 其中**背景颜色不能设置多个且只能放在最后一组**。

如设置的多组属性背景图像之间存在重叠, 则前面的背景图像会覆盖在后面的背景图像上。

代码示例:

```
padding: 10px;
background: url("image.png") 0% 0%/60px 60px no-repeat padding-box,
            url("image.png") 40px 10px/110px 110px no-repeat content-box,
            url("image.png") 140px 40px/200px 100px no-repeat content-box #58a;
```



### 常见背景属性

**background-position**

background-position属性用来设置背景图像的位置, 默认值: 0% 0%, 效果等同于 left top。

取值说明:

1. 如果设置一个值, 则该值作用在横坐标上, 纵坐标默认为50%(即center) ;
2. 如果设置两个值, 则第一个值作用于横坐标, 第二个值作用于纵坐标, 取值可以是方位关键字[left\top\center\right\bottom], 如 `background-position: left center ;` 也可以是百分比或长度, 百分比和长度可为设置为负值, 如: `background-position: 10% 30px ;`
3. 另外css3支持3个值或者4个值, 注意如果设置3个或4个值, `偏移量前必须有关键字`, 如: `background-position: right 20px bottom 30px;`



也可以使用 `background-position-x` 或 `background-position-y` 来分别设置横坐标或纵坐标的偏移量。

注意: 当使用 background-position-x 以及 background-position-y 时, 需考虑Firefox兼容性的问题。

**background-size**

background-size 属性用来指定背景图像的大小。默认值: auto

取值说明: 

1. 可使用 长度值 或 百分比 指定背景图像的大小, 值不能为负值。

   如果设置一个值, 则该值用于定义图像的宽度, 图像的高度为默认值`auto`, 根据宽度进行等比例缩放; 如果设置两个值, 则分别作用于图像的宽和高。 

2. `auto`默认值, 即图像真实大小。 

3. `cover`将背景图像等比缩放到完全覆盖容器, 背景图像有可能超出容器。(即当较短的边等于容器的边时, 停止缩放) 

4. `contain`将背景图像等比缩放到宽度或高度与容器的宽度或高度相等, 背景图像始终被包含在容器内。(即当较长的边等于容器的边时, 停止缩放)

**background-repeat**

background-repeat 属性用来设置背景图像铺排填充方式, 默认值: repeat 。

取值说明: 

1. repeat-x 表示横向上平铺, 相当于设置两个值 repeat no-reapeat; 
2. repeat-y 表示纵向上平铺, 相当于设置两个值 no-repeat repeat; 
3. repeat 表示横向纵向上均平铺; 
4. no-repeat 表示不平铺; 
5. round 表示背景图像自动缩放直到适应且填充满整个容器。 注意: 当设置为 round 时, background-size 的 cover 和 contain 属性失效。
6. space 表示背景图像以相同的间距平铺且填充满整个容器或某个方向. 注意: 当 background-size 设置为 cover 和 contain 时, background-rapeat 的 space 属性失效。

注意, background-repeat 的 round/space 属性, 部分Firefox版本不支持。

**background-origin**

用于设置 `background-position` 定位时参考的原点, 默认值 `padding-box` , 另外还有两个值: `border-box` 和 `content-box`。

代码示例:

```
border: 10px solid #58A;
padding: 20px;
background-position: 10px 20px;
```

**background-attachment**

- background-attachment: scroll

scroll 此关键字表示背景相对于元素本身固定， 而不是随着它的内容滚动。

- background-attachment: local

local 此关键字表示背景相对于元素的内容固定。如果一个元素拥有滚动机制，背景将会随着元素的内容滚动， 并且背景的绘制区域和定位区域是相对于可滚动的区域而不是包含他们的边框。

- background-attachment: fixed

fixed 此关键字表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。背景图从一开始就已经被固定死在初始所在的位置。可用于实现滚动视差，见例子：

<https://www.cnblogs.com/coco1s/p/9453938.html>

<https://kilianvalkhof.com/2010/design/the-problem-with-svg-and-canvas/>

> 注意一下 scroll 与 fixed，一个是相对元素本身固定，一个是相对视口固定，有点类似 `position` 定位的 `absolute` 和 `fixed`。

## 5. 0.1 + 0.2  !== 0.3 why?

因为 JS 采用 IEEE 754 双精度版本（64位），并且只要采用 IEEE 754 的语言都有该问题。

我们都知道计算机表示十进制是采用二进制表示的，所以 `0.1` 在二进制表示为

```js
// (0011) 表示循环
0.1 = 0.0001(1001)...
```

**小数转2进制过程**：将该数字乘以2，取出整数部分作为二进制表示的第1位；然后再将小数部分乘以2，将得到的整数部分作为二进制表示的第2位；以此类推，直到小数部分为0。 
**特殊情况：** 小数部分出现循环，无法停止，则用有限的二进制位无法准确表示一个小数，这也是在编程语言中表示小数会出现误差的原因

```js
// 0.1二进制演算过程如下
0.1 * 2 = 0.2 // 记录0
0.2 * 2 = 0.4 // 记录0
0.4 * 2 = 0.8 // 记录0
0.8 * 2 = 1.6 // 记录1
0.6 * 2 = 1.2 // 记录1
0.2 * 2 = 0.4 // 记录0
0.2 * 2 = 0.4 // 记录0
0.4 * 2 = 0.8 // 记录0
0.8 * 2 = 1.6 // 记录1
0.6 * 2 = 1.2 // 记录1
... // 如此循环下去
0.1 = 0.0001100110011001...
```

 IEEE 754 双精度。六十四位中符号位占一位，整数位占一位，其余五十二位都为小数位。因为 **`0.1` 和 `0.2` 都是无限循环的二进制**了，所以**在小数位末尾处需要判断是否进位**（就和十进制的四舍五入一样）。	故`0.1`进位后表示为`0.0001(1001*11次)1010`，同理`0.2`表示为`0.(0011*12次)0100`。那么把这两个二进制加起来会得出 `0.0100(1100*11次)1110` , 这个值算成十进制就是 `0.30000000000000004`

下面说一下原生解决办法，如下代码所示

```js
parseFloat((0.1 + 0.2).toFixed(10))
```

## 6. NaN

`NaN` 是一个全局对象的属性。

NaN 属性的初始值就是 NaN，和 `Number.NaN` 的值一样。在现代浏览器中（ES5中）， `NaN` 属性是一个不可配置（non-configurable），不可写（non-writable）的属性。

### 判断一个值是否是NaN

等号运算符（`==` 和 `===）` 不能被用来判断一个值是否是 `NaN`。必须使用 [`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)或 [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 函数。在执行自比较之中：NaN，**也只有NaN，比较之中不等于它自己**。

```js
NaN == NaN;         // false
NaN === NaN;        // false
Number.NaN === NaN; // false
isNaN(NaN);         // true
isNaN(Number.NaN);  // true

function valueIsNaN(v) { return v !== v; }
valueIsNaN(1);          // false
valueIsNaN(NaN);        // true
valueIsNaN(Number.NaN); // true
```

### isNaN
**isNaN()**函数用来确定一个值是否为[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 。

如果给定值为 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)则返回值为`true`；否则为`false`。

 JavaScript 中其他的值不同，[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)不能通过相等操作符（== 和 ===）来判断 ，因为 `NaN == NaN` 和 `NaN === NaN` 都会返回 `false`。 因此，`isNaN` 就很有必要了。

#### 怪异行为
如果`isNaN`函数的参数不是`Number`类型， `isNaN`函数会首先尝试将这个参数转换为数值，然后才会对转换后的结果是否是[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)进行判断。

通过[`Number.isNaN(x)`](#Number.isNaN)来检测变量`x`是否是一个`NaN`将会是一种可靠的做法。然而，在缺少`Number.isNaN`函数的情况下, 通过表达式`(x != x)` 来检测`变量x`是否是`NaN`会更加可靠。

**示例**：

```js
isNaN(NaN);       // true
isNaN(undefined); // true
isNaN({});        // true

isNaN(true);      // false
isNaN(null);      // false
isNaN(37);        // false

// strings
isNaN("37");      // false: 可以被转换成数值37
isNaN("37.37");   // false: 可以被转换成数值37.37
isNaN("37,5");    // true
isNaN('123ABC');  // true:  parseInt("123ABC")的结果是 123, 但是Number("123ABC")结果是 NaN
isNaN("");        // false: 空字符串被转换成0
isNaN(" ");       // false: 包含空格的字符串被转换成0 Number('     ')结果是0

// dates
isNaN(new Date());                // false
isNaN(new Date().toString());     // true
isNaN("blabla")   // true: "blabla"不能转换成数值转换成数值失败， 返回NaN
```

### Number.isNaN

**Number.isNaN()** 方法确定传递的值是否为 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)和其类型是 [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)。它是原始的全局[`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)的更强大的版本。

和全局函数 [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN) 相比，该方法不会强制将参数转换成数字，只有在参数是真正的数字类型，且值为 `NaN` 的时候才会返回 `true`。

**示例**：
```js
Number.isNaN(NaN);        // true
Number.isNaN(Number.NaN); // true
```

## 7. Set, Map

Set 和 Map 主要的应用场景在于 **数据重组** 和 **数据储存**

Set 是一种叫做**集合**的数据结构，Map 是一种叫做**字典**的数据结构

### 1. 集合（Set）

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

### 2. WeakSet

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

### 3. 字典（Map）

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

### 4. WeakMap

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

### 5. 总结

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

### 6. 扩展：Object与Set、Map

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

## 8. 深度优先遍历和广度优先遍历

首先初始化一个需要遍历的html结构，如下：

[![image](https://user-images.githubusercontent.com/27856388/52606290-118a3180-2ead-11e9-86b7-d0feae6f8030.png)](https://user-images.githubusercontent.com/27856388/52606290-118a3180-2ead-11e9-86b7-d0feae6f8030.png)

我将用深度优先遍历和广度优先遍历对这个dom树进行查找

### 深度优先遍历

#### 深度优先遍历（DFS）

深度优先遍历（Depth-First-Search），是搜索算法的一种，它沿着树的深度遍历树的节点，尽可能深地搜索树的分支。当节点v的所有边都已被探寻过，将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已探寻源节点到其他所有节点为止，如果还有未被发现的节点，则选择其中一个未被发现的节点为源节点并重复以上操作，直到所有节点都被探寻完成。

简单的说，DFS就是从图中的一个节点开始追溯，直到最后一个节点，然后回溯，继续追溯下一条路径，直到到达所有的节点，如此往复，直到没有路径为止。

DFS 可以产生相应图的拓扑排序表，利用拓扑排序表可以解决很多问题，例如最大路径问题。一般用堆数据结构来辅助实现DFS算法。

**注意：深度DFS属于盲目搜索，无法保证搜索到的路径为最短路径，也不是在搜索特定的路径，而是通过搜索来查看图中有哪些路径可以选择。**

**步骤：**

- 访问顶点v
- 依次从v的未被访问的邻接点出发，对图进行深度优先遍历；直至图中和v有路径相通的顶点都被访问
- 若此时途中尚有顶点未被访问，则从一个未被访问的顶点出发，重新进行深度优先遍历，直到所有顶点均被访问过为止

**实现：**

```js
// 实现一
function deepTraversal(node, nodeList = []){
  if(!node){
    return nodeList;
  }
  nodeList.push(node);
  let children = node.children;
  children.forEach(item => {
		deepTraversal(item, nodeList);
  });
  return nodeList;
}

// 实现二
function deepTraversal(node){
  let nodeList = [];
  if (node !== null) {
    nodeList.push(node)
    let children = node.children
  	children.forEach(item => {
      nodeList = nodeList.concat(deepTraversal1(item));
    });
  }
  return nodeList;
}

// 实现三，非递归
function deepTraversal(node){
  let nodeList = [],
      task = [];
  
  if (node) {
    // 推入当前处理的node
    task.push(node)
    while (task.length) {
      let item = task.pop()
      let children = item.children
      nodeList.push(item)
      // node = [] stack = [parent]
      // node = [parent] stack = [child3,child2,child1]
      // node = [parent, child1] stack = [child3,child2,child1-2,child1-1]
      // node = [parent, child1-1] stack = [child3,child2,child1-2]
      for (let i = children.length - 1; i >= 0; i--) {
        task.push(children[i])
      }
    }
  }
  return nodeList;
}
```

### 广度优先遍历

#### 广度优先遍历（BFS）

广度优先遍历（Breadth-First-Search）是从根节点开始，沿着图的宽度遍历节点，如果所有节点均被访问过，则算法终止，BFS 同样属于盲目搜索，一般用队列数据结构来辅助实现BFS

**BFS从一个节点开始，尝试访问尽可能靠近它的目标节点。本质上这种遍历在图上是逐层移动的，首先检查最靠近第一个节点的层，再逐渐向下移动到离起始节点最远的层**

**步骤：**

- 创建一个队列，并将开始节点放入队列中
- 若队列非空，则从队列中取出第一个节点，并检测它是否为目标节点
  - 若是目标节点，则结束搜寻，并返回结果
  - 若不是，则将它所有没有被检测过的字节点都加入队列中
- 若队列为空，表示图中并没有目标节点，则结束遍历

**实现：**

```js
function widthTraversal2(node){
  let nodeList = []
  let task = []
  if (node) {
    task.push(node)
    while (task.length) {
      let item = task.shift()
      let children = item.children
      nodeList.push(item)
        // 队列，先进先出
        // nodes = [] stack = [parent]
        // nodes = [parent] stack = [child1,child2,child3]
        // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
        // nodes = [parent,child1,child2]
      for (let i = 0; i < children.length; i++) {
        task.push(children[i])
      }
    }
  }
  return nodeList;
}
```

## 9. 请分别用深度优先思想和广度优先思想实现一个拷贝函数？

```js

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function getConstructor(obj) {
    let type = getType(obj),
        isSame = true;

    if (type === 'Object' || type === 'Array') {
        obj = obj.constructor();
        isSame = false;
    } else if (type === 'Date') {
        obj = new Date(obj);
    } else if (type === 'RegExp') {
        obj = new RegExp(obj);
    }

    return {
        isSame,
        obj
    };
}

// 广度优先遍历
function deepCloneBFS(obj) {
    let cons = getConstructor(obj),
        stack = [],
        map = new Map(), // 用于处理循环引用
        _obj = cons.obj;

    if (cons.isSame) {
        return _obj;
    }

    stack.push([obj, _obj]);
    map.set(obj, _obj);

    while (stack.length > 0) {
        let [ori, tar] = stack.shift();
        for (let key in ori) {
            // 用于处理循环引用
            if (map.get(ori[key])) {
                tar[key] = map.get(ori[key]);
                continue;
            }

            let data = getConstructor(ori[key]);
            tar[key] = data.obj;
            if (data.isSame) {
                continue;
            }
            stack.push([ori[key], tar[key]]);
            map.set(ori[key], tar[key]);
        }
    }
}

// 深度优先遍历
// 处理循环引用
function deepCloneDFS(obj) {
    let data = getConstructor(obj);
    let _obj = data.obj;
    if (data.isSame) {
        return _obj;
    }

    for (let key in obj) {
        _obj[key] = deepCloneDFS(obj[key]);
    }
    return _obj;
}

```

# 
