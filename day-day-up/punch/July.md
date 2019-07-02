## Vue 项目时为什么要在列表组件中写 key，其作用是什么？

在不带key的情况下，判断[sameVnode](https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js#L35)时因为a.key和b.key都是undefined，**对于列表渲染**来说已经可以判断为相同节点然后调用patchVnode了，实际根本不会进入到答主给的else代码，也就无从谈起“带key比不带key时diff算法更高效”了。

然后，官网推荐推荐的使用key，应该理解为“使用唯一id作为key”。因为index作为key，和不带key的效果是一样的。index作为key时，每个列表项的index在变更前后也是一样的，都是直接判断为sameVnode然后复用。

说到底，key的作用就是更新组件时**判断两个节点是否相同**。相同就复用，不相同就删除旧的创建新的。

正是因为带唯一key时每次更新都不能找到可复用的节点，不但要销毁和创建vnode，在DOM里添加移除节点对性能的影响更大。所以会才说“不带key可能性能更好”。

因为不带key时节点能够复用，省去了销毁/创建组件的开销，同时只需要修改DOM文本内容而不是移除/添加节点，这就是文档中所说的“刻意依赖默认行为以获取性能上的提升”。

既然如此，为什么还要建议带key呢？因为这种模式只适用于渲染简单的无状态组件。对于大多数场景来说，列表组件都有自己的状态。

举个例子：一个新闻列表，可点击列表项来将其标记为"已访问"，可通过tab切换“娱乐新闻”或是“社会新闻”。

不带key属性的情况下，在“娱乐新闻”下选中第二项然后切换到“社会新闻”，"社会新闻"里的第二项也会是被选中的状态，因为这里复用了组件，保留了之前的状态。要解决这个问题，可以为列表项带上新闻id作为唯一key，那么每次渲染列表时都会完全替换所有组件，使其拥有正确状态。

这只是个简单的例子，实际应用会更复杂。带上唯一key虽然会增加开销，但是对于用户来说基本感受不到差距，而且能保证组件状态正确，这应该就是为什么推荐使用唯一id作为key的原因。至于具体怎么使用，就要根据实际情况来选择了。



## ['1', '2', '3'].map(parseInt) what and why

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



##  防抖，节流

**防抖**：触发高频事件后n秒内只会执行一次，如果n秒内再次触发，则重新计算时间

```js
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   delay       表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数，在delay时间内连续调用都不执行
 * @return {function}             返回客户调用函数
 */
function debounce(fn, delay = 50，immediate = true){
	let timer, context, args;
  
  function later(){
    return setTimeout(() => {
			timer = null;
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



