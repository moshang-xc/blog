# 前端模块化

## commonjs规范

#### (1)概述

Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。**在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。**

#### (2)特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

#### (3)基本语法

- 暴露模块：`module.exports = value`或`exports.xxx = value`
- 引入模块：`require(xxx)`,如果是第三方模块，xxx为模块名；如果是自定义模块，xxx为模块文件路径

#### (4)模块的加载机制

**CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值**。

# commonjs实现

同步加载模块

```js
//node原生的模块，用来读写文件(fileSystem)
let fs = require('fs')
//node原生的模块，用来解析文件路径
let path = require('path')
//提供了一系列 API 用于在 V8 虚拟机环境中编译和运行代码。
let vm = require('vm')
//Module类，就相当于我们的模块(因为node环境不支持es6的class，这里用function)
function Module(p){
  //当前模块的标识
  this.id = p
  //没个模块都有一个exports属性
  this.exports = {}
  //这个模块默认没有加载完
  this.loaded = false
  //模块加载方法
  this.load = function(filepath){
    //判断文件是json还是 node还是js
    let ext = path.extname(filepath)
    return Module._extensions[ext](this)
  }
}

//js文件加载的包装类
Module._wrapper = ['(function(exports,require,module,__dirname,__filename){','\n})']
//所有的加载策略
Module._extensions = {
  '.js': function(module){
    let fn = Module._wrapper[0] + fs.readFileSync(module.id,'utf8') + Module._wrapper[1]
    //执行包装后的方法 把js文件中的导出引入module的exports中
    //模块中的this === module.exports === {}  exports也只是module.exports的别名
    vm.runInThisContext(fn).call(module.exports,module.exports,req,module)
    return module.exports
  },
  '.json': function(module){
    return JSON.parse(fs.readFileSync(module.id,'utf8'))
  },
  '.node': 'xxx',
}
//以绝对路径为key存储一个module
Module._catcheModule = {}

// 解析绝对路径的方法，返回一个绝对路径
Module._resolveFileName = function(moduleId){
  let p = path.resolve(moduleId)
  try{
    fs.accessSync(p)      
    return p;
  }catch(e){
    console.log(e)
  }
  //对象中所有的key做成一个数组[]
  let arr = Object.keys(Module._extensions)
  for(let i=0;i<arr.length;i++){
    let file = p+arr[i]
    //因为整个模块读取是个同步过程，所以得用sync，这里判断有没有这个文件存在
    try{
      fs.accessSync(file)      
      return file
    }catch(e){
      console.log(e)
    }
  }
}
//require方法
function req(moduleId){
  let p = Module._resolveFileName(moduleId)
  if(Module._catcheModule[p]){
    //模块已存在
    return Module._catcheModule[p].exports
  }
  //没有缓存就生成一个
  let module = new Module(p)
  Module._catcheModule[p] = module
  //加载模块
  module.exports = module.load(p)
  return module.exports
}
```



## AMD requireJS

[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。采用异步的方式加载模块，模块的加载不影响它后面语句的运行。

CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。但是，**如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范**。此外AMD规范比CommonJS规范在浏览器端实现要来着早。

```js
// main.js
define(
    ["types/Employee"],  //依赖
    function(Employee){  //这个回调会在所有依赖都被加载后才执行
        function Programmer(){
            //do something
        };

        Programmer.prototype = new Employee();
        return Programmer;  //return Constructor
    }
)

define(["require"], function(require){
    // 在这里， a.js 已经下载并且执行好了
    var a = require("./a")
})

var a = require("./a");  // 执行到此时，a.js 同步下载并执行
a.doSomething();

require(['math'], function (math){
　　alert(math.add(1,1));
});

```

## 手动实现

思略：

- 遍历data-main属性的`script`标签

- 执行`require`，收集依赖`Deps`，加载依赖

- 执行`define`，收集依赖，加载依赖，依赖加载完成，`isLoading`设为false，执行回调，缓存当前模块

> 循环遍历所有依赖，如果当前模块的依赖已记载完成，缓存当前模块，同时进行下一次依赖遍历

```js
// 记录每个模块的加载信息
let handles = [
    // {
    //  	name: '模块名称',
    //  	deps: [], // 依赖
    //  	fn: null, // define和require的回调
    // 	    isLoading: true // 正在加载模块
	// }
]

// 缓存每个模块
let cacheModule = {};

// 具体实现
let require = (deps, cb) => {
  // 参数检查，省略
  // ......
    
  handlers.push({
    name: "main",
    deps: deps,
    fn: cb
  });

  loadRequireModule(deps);
};

let define = (name, deps, cb) => {
  // 参数检查，省略
  // ......

  handlers.push({
    name: name,
    deps: deps,
    fn: cb,
    isLoading: true 
  });

  loadRequireModule(deps);
};

function loadRequireModule(deps) {
  for (let i = 0; i < deps.length; i++) {
    const url = deps[i];

    let script = document.createElement("script");
    script.src = "scripts/" + url + ".js";
    script.setAttribute("data-name", url);
    document.body.appendChild(script);

    script.onload = data => {
      const moduleName = data.target.getAttribute("data-name");
      // 遍历依赖，加载完成，执行回调
      runHandles(); 
    };
  }
}

function runHandles() {
  handlers.forEach((handle, index) => {
    const isDependLoaded = checkIsAllLoaded(handle);
    if (isDependLoaded) {
      // 从缓存读取依赖模块的值
      const arg = getArgsFromCache(handle);
      var result = handle.fn(...arg);

      cacheModule[handle.name] = result;
      handlers.splice(index, 1);

      runHandles();
    }
  });
}
```

## CMD 

CMD 即Common Module Definition通用模块定义。CMD推崇依赖就近、延迟执行。CMD规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD规范整合了CommonJS和AMD规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD模块定义规范。

```js
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});

// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});
```

### ## ES6模块化

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

# ES6 模块与 CommonJS 模块的差异

### 1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

- CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
- ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的`import`有点像 Unix 系统的“符号连接”，原始值变了，`import`加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

### 2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

- 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
- 编译时加载: ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import`时采用静态命令的形式。即在`import`时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

## 总结

- CommonJS规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了AMD CMD解决方案。
- AMD规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。
- CMD规范与AMD规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在Node.js中运行。不过，依赖SPM 打包，模块的加载逻辑偏重
- **ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案**。