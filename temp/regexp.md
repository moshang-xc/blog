# 你不知道的正则

## 前言

在平时的工作中balabala...

网络上类似的文章有很多，也有很多写的很好的文章，虽然看过很多次，用完又忘记了，如此反复。为了彻底弄明白，加深自己的印象，也把我的理解分享给大家，希望能够帮助到大家，如果错误欢迎指正，立即修改。

主要是用来分析使用场景，对于语法的知识不作讲解，只讲几个大家容易忽视的知识点。

## 正则表达式

正则表达式提供了功能强大、灵活而又高效的方法来处理文本。 使用正则表达式的全面模式匹配表示法，可以快速分析大量文本，以找到特定的字符模式；验证文本以确保它匹配预定义模式（如电子邮件地址）；提取、编辑、替换或删除文本子字符串；将提取的字符串添加到集合以生成报告。 对于处理字符串或分析大文本块的许多应用程序而言，正则表达式是不可缺少的工具。

正则表达式是用于匹配字符串中字符组合的模式。在 JavaScript中，正则表达式也是对象。这些模式被用于 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp) 的 [`exec`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) 和 [`test`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) 方法, 以及 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String) 的 [`match`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)、[`matchAll`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)、[`replace`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)、[`search`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search) 和 [`split`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split) 方法。本章介绍 JavaScript 正则表达式。

在日常的工作中，合理的使用正则，往往会极大的提高工作效率，合理的掌握和使用正则是非常必要的，接下来就一起去探索正则的奥秘吧。



## 基础知识

### 创建正则

使用一个正则表达式字面量，其由包含在斜杠之间的模式组成，如下所示：

```js
var re = /ab+c/;
```

调用`RegExp`对象的构造函数，如下所示：

```js
var re = new RegExp("ab+c");
```

如果你想通过字符串去构造正则表达式，那么上面的方式就很适用了。



### 容易忽视的知识点

#### 1. 非贪婪匹配

?`符号可以禁止贪婪属性，放在`.*`之后，表示一次匹配遇到重点就可以停止。否则将会一直向后匹配。

```js
[google](https://www.google.com)[baidu](ddd)

\[.*?\] -> \[.*\]
```

#### 2. 分组捕获

使用`()`进行数据分组，编号0代表整个匹配项，选择的分组从1号开始

使用括号`()`将导致相应的子项被记住。例如，`/a(b)c /`可以匹配字符串`abc`，并且记得`b`。返回的数组中保存所有被发现的子匹配，其中第一项为整个匹配，分组匹配从索引1开始。

取得所匹配到的子项有好几种方式：

- `$n`占位符，其中n为对应的索引，从`1`开始，`$1`表示匹配到的第一个子项，`$&`表示完整匹配
- `\n`占位符，同`$n`，`n`从`1`开始，用于正则表达式本身
- 通过`RegExp.exec()`的返回值，从索引`1`开始
- 其它与`exec()`相似

分组的具体的应用稍后会介绍。

#### 3. `[]`注意事项

- 如果`-`在第一位表示`-`本身，否则为连字符表示一个范围，例如`[a-z]`表示`a`到`z`范围内的字母；
- 如果`^`在第一位表示非，在其它地方表示`^`字符本身，例如`[^ab]`表示匹配除`a`，`b`外的字符；
- `[]`中的特殊字符无需转义，表示该字符本身，例如：

```js  
/[?.*]/  // 表示匹配?或.或*不需要转义

/^\d+(\.\d{2,4})?$/  // 单独匹配.则需要进行转义(匹配2-4位小数)
```

## 正则使用

正则表达式可以被用于 `RegExp` 的 [`exec`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp/exec) 和 [`test`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/RegExp/test) 方法以及 [`String`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String) 的 [`match`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/match)、[`replace`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/replace)、[`search`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/search) 和 [`split`](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/String/split) 方法。

### replace

```js
// $n占位符使用	
let re = /(\w+)\s(\w+)/;
let str = "John Smith";
let newstr = str.replace(re, "$2, $1");
console.log(newstr); // Smith John
```

### split

```js
var s =  "Hello,My name is Vincent. Nice to Meet you!What's your name? Haha."

s.split(/([.,!?]+)/) //["Hello", ",", "My name is Vincent", ".", " Nice to Meet you", "!", "What's your name", "?", " Haha", ".", ""]
```

### replace



### search

### exec

### test



## 最后

正则的分析工具：https://regexper.com/

```js
<!--(.*?)-->
```

生成对应的图表

正则快速学习：https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/regular-expression-language-quick-reference



## 参考资料

1. [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)