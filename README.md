# 前端系列博客

## JavaScript系列文章
- [基础数据类型与转换](https://github.com/moshang-xc/Blog/blob/master/article/js/基础数据类型与转换.md)
- [JS浮点数与IEEE标准规范](https://github.com/moshang-xc/Blog/blob/master/article/js/JS浮点数与IEEE标准规范.md)
- [时间复杂度](https://github.com/moshang-xc/Blog/blob/master/article/js/时间复杂度.md)

## 其它文章
- [Git操作命令](https://github.com/moshang-xc/Blog/blob/master/article/normal/Git操作命令.md)
- [npm操作命令](https://github.com/moshang-xc/Blog/blob/master/article/normal/npm.md)
- [Linux操作命令](https://github.com/moshang-xc/Blog/blob/master/article/normal/linux.md)
- [unicode](https://github.com/moshang-xc/Blog/blob/master/article/normal/unicode.md)
- [跨域问题](https://github.com/moshang-xc/Blog/issues/4)
- [icomoon字体图标导入与使用](https://github.com/moshang-xc/Blog/issues/11)
- [Http状态码/缓存/Cookie](https://github.com/moshang-xc/Blog/issues/7)
- [浏览器渲染原理及性能优化](https://github.com/moshang-xc/Blog/issues/3)
- [正则表达式](https://github.com/moshang-xc/Blog/blob/master/article/normal/正则表达式.md)
- [移动端适配](https://github.com/moshang-xc/Blog/blob/master/article/normal/移动端适配.md)

## 代码片段

**生成长度为10的随机字符串**
```js
Math.random().toString(36).substring(2);
```

**取整**
```js
let a = ~~2.33   ----> 2
let b = 2.33 | 0   ----> 2
let c = 2.33 >> 0   ----> 2
```

**金钱格式化**
```js
// 正则
let test1 = '1234567890'
let format = test1.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// reduce
function formatCash(str) {
   return str.split('').reverse().reduce((prev, next, index) => {
      return ((index % 3) ? next : (next + ',')) + prev
   })
}
```
