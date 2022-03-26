# Babel

## 1. 使用

### 安装依赖

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

### 安装包简介

- **@babel/core**是`babel`最核心的一个编译库，他可以将我们的代码进行**词法分析--语法分析--语义分析**过程从而生成`AST`抽象语法树，从而对于“这棵树”的操作之后再通过编译称为新的代码。

- **@babel/cli**是一个能够从终端（命令行）使用的工具。

- **@babel/preset-env**是一个智能预设，内部集成了绝大多数的转译插件，将高版本`JavaScript`代码根据内置的规则转译成为低版本的`javascript`代码。可配合`corejs@3`或`@babel/plugin-transform-runtime + corejs@3`进行按需profill。

### 配置文件

在项目的根目录下创建一个命名为 `babel.config.json` 的配置文件，内容如下：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "ie": "10"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

### 运行

```
// 将src中的js文件进行转译输出到dist中去
npx babel src --out-dir dist
```

## 2. Plugin 和 Preset的关系

所谓Preset就是一些Plugin组成的合集，你可以将`Preset`理解称为就是一些的`Plugin`整合称为的一个包。

常见的preset`babel-preset-evn`就继承了`@babel/plugin-transform-arrow-functions`等plugin。

## 3. polyfill 垫片

`polyfill`的选择关系到最后打包生成的代码体积和对不同浏览器的支持程度，是代码打包优化过程中最重要也是最难的环节。

首先我们来理清楚这三个概念:

- 最新`ES`语法，比如：箭头函数，`let/const`。
- 最新`ES Api`，比如`Promise`
- 最新`ES`实例/静态方法，比如`String.prototype.include`

@babel/preset-env只会转化最新的ES语法，对应新增的API和实例方法不会进行转化，过需要引入额外的polyfill。Babel中有两种方案引入polyfill。

> 其中@babel/polyfill已在corejs@3中弃用。

目前`polyfill`的选择有两个较为成熟的方案。

### 方案一 传统polyfill方式 @babel/preset-env + corejs@3

`@babel/preset-env`插件包中有个配置`useBuiltIns`需要强调一下，通过该参数的设置达到不同的分片效果。

#### useBuiltIns

注意，配置`useBuiltIns`的同时也需要配置`corejs`属性，提供 `false`, `entry`, `usage`三个可选值。

#### false

```js
"useBuiltIns": false
```

此时不对 `polyfill` 做操作。如果引入 `polyfill`，则无视配置的浏览器兼容，引入所有的 `polyfill`。

#### entry

```js
"useBuiltIns": "entry",
"corejs": 3,
```

根据配置的浏览器兼容，引入浏览器不兼容的 `polyfill`。**需要在入口文件手动添加** `import '@babel/polyfill'`，会自动根据 `browserslist` 替换成浏览器不兼容的所有 `polyfill`。

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

源文件：

```js
// index.js
const f = () => {};

new Promise();

class Test {}
```

编译结果：

```js
"use strict";

require("core-js/modules/es6.array.copy-within");
// ...
// ... 此处省略一大堆的 polyfillrequire("core-js/modules/web.immediate");
// ...
require("core-js/modules/web.dom.iterable");
require("regenerator-runtime/runtime");
function _classCallCheck(instance, Constructor) { 
	if (!(instance instanceof Constructor)) { 
		throw new TypeError("Cannot call a class as a function"); 
	} 
}

var f = function f() {};
new Promise();
var Test = function Test() {  
	_classCallCheck(this, Test);
};
```

#### usage

```js
"useBuiltIns": "usage",
"corejs": 3,
```

`usage` 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 `polyfill`，自动实现了按需添加。**无需在入口文件中手动引入`polyfill`。**

编译结果：

```js
"use strict";
require("core-js/modules/es6.promise");
require("core-js/modules/es6.object.to-string");
function _classCallCheck(instance, Constructor) { 
	if (!(instance instanceof Constructor)) { 
		throw new TypeError("Cannot call a class as a function"); 
	} 
}

var f = function f() {};
new Promise();
var Test = function Test() {  
	_classCallCheck(this, Test);
};

```

看上面的编译结果，会发现还有个问题，`_classCallCheck` 辅助函数是直接内嵌的，如果多个地方使用 `Class`，那每个地方都会添加这个辅助函数，大量重复。这时候就需要 `@babel/plugin-transform-runtime` 来复用辅助行数，配置如下。

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": {
          "ie": 10
        }
      }
    ]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime"]
  ]
}

```

编译结果如下：

```js
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

var f = function f() {};

new Promise();

var Test = function Test() {
  (0, _classCallCheck2.default)(this, Test);
};

```

一般不使用false的情况，根据使用产品判断使用`entry`还是`usage`。

`useBuiltIns`设置为`entry`需要在webpack的入口文件中引入`polyfill`，会将browserslist环境不支持的所有垫片都导入，能够覆盖到`Array.prototype.includes()`这种句法，足够安全且代码体积不是特别大。`useBuiltIns`设置为`usage`，项目里不用主动import，会自动将代码里已使用到的、且browserslist环境不支持的垫片导入；相对安全且打包的js体积不大，但是，通常我们转译都会排除`node_modules/`目录，如果使用到的第三方包有个别未做好ES6转译，有遇到bug的可能性。

#### 完整使用示例

依赖安装：

```
npm i @babel/core @babel/preset-env @babel/plugin-transform-runtim -D
npm i core-js regenerator-runtime @babel/runtime -S

```

环境配置：

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
        "useBuiltIns": "usage", 
        "corejs": {
          "version": 3, // 使用core-js@3
          "proposals": true,
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
        {
          "corejs": false // 解决 helper 函数重复引入
        }
    ]
  ]
}

```

### 方案二 tranform-runtime

#### 安装依赖

```
npm i babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
npm i @babel/runtime-corejs3

```

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        },
        "useESModules": true
      }
    ]
  ]
}

```



### 两种方案区别

他们的区别在于方案一实际使用的是core-js，采用修改全局对象原型 链的方式去polyfill，会污染全局变量。方案二使用的是core-js-pure，采用不污染全局对象模式去polyfill。



### 总结polyfill

在`babel`中实现`polyfill`主要有两种方式：

- 一种是通过`@babel/polyfill`配合`preset-env`去使用，这种方式可能会存在污染全局作用域。
- 一种是通过`@babel/runtime`配合`@babel/plugin-transform-runtime`去使用，这种方式并不会污染作用域。
- 全局引入会污染全局作用域，但是相对于局部引入来说。它会增加很多额外的引入语句，增加包体积。

通常选择是会在开发类库时遵守不污染全局为首先使用方案二，而在业务开发中使用方案一。

## 4. 其它知识

### 插件顺序

- Plugins在 Presets 前运行。
- Plugins顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。

```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```

先执行 `transform-decorators-legacy` ，在执行 `transform-class-properties`。

```json
{  
	"presets": ["es2015", "react", "stage-2"]
}
```

将按如下顺序执行：`stage-2`、`react` 然后是 `es2015`。

### plugins/presets参数

插件和 preset 都可以接受参数，参数由插件名和参数对象组成一个数组，可以在配置文件中设置。

如果不指定参数，下面这几种形式都是一样的：

```json
{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}
```

要指定参数，请传递一个以参数名作为键（key）的对象。

```json
{
  "plugins": [
    [
      "transform-async-to-module-method",
      {
        "module": "bluebird",
        "method": "coroutine"
      }
    ]
  ]
}
```

### @babel/plugin-transform-runtime

`@babel/plugin-transform-runtime` 是一个可以重复使用 `Babel` 注入的帮助程序，以节省代码大小的插件。

# webpack

做为前端社区最流行的工程构建库，在前端工程构建领域必不可少，对它的使用也不陌生，对平时使用中不会注意到的几个知识点进行简单总结。

##  1. 各配置项说明


```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const pkgInfo = require('./package.json')

// 使用 WEBPACK_SERVE 环境变量检测当前是否是在 webpack-server 启动的开发环境中
const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {
  /*
  webpack 执行模式
  development：开发环境，它会在配置文件中插入调试相关的选项，比如 moduleId 使用文件路径方便调试
  production：生产环境，webpack 会将代码做压缩等优化
  */
  mode: dev ? 'development' : 'production',

  /*
  配置 source map
  开发模式下使用 cheap-module-eval-source-map, 生成的 source map 能和源码每行对应，方便打断点调试
  生产模式下使用 hidden-source-map, 生成独立的 source map 文件，并且不在 js 文件中插入 source map 路径，用于在 error report 工具中查看 （比如 Sentry)
  */
  devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',
  
  // 开发环境关闭文件大小warning
  performance: {
    hints: dev ? false : 'warning'
  },

  // 配置页面入口 js 文件
  entry: './src/index.js',

  // 配置打包输出相关
  output: {
    // 打包输出目录
    path: resolve(__dirname, 'dist'),

    // 入口 js 的打包输出文件名
    filename: 'index.js',
    
    // 该配置能帮助你为项目中的所有资源指定一个基础路径，它被称为公共路径。基础路径是指项目中引用css，js，img等资源时候的一个基础路径，这个基础路径要配合具体资源中指定的路径使用
    publicPath: '/assets/',
      /*
      按需加载文件配置
    代码中引用的文件（js、css、图片等）会根据配置合并为一个或多个包，我们称一个包为 chunk。
    每个 chunk 包含多个 modules。无论是否是 js，webpack 都将引入的文件视为一个 module。
    chunkFilename 用来配置这个 chunk 输出的文件名。

    [chunkhash]：这个 chunk 的 hash 值，文件发生变化时该值也会变。使用 [chunkhash] 作为文件名可以防止浏览器读取旧的缓存文件。

    还有一个占位符 [id]，编译时每个 chunk 会有一个id。
    我们在这里不使用它，因为这个 id 是个递增的数字，增加或减少一个chunk，都可能导致其他 chunk 的 id 发生改变，导致缓存失效。
    */
    chunkFilename: '[chunkhash].js',
  },
    
  // 取别名
  resolve: {
    extensions: ['.vue', '.js'], // 引用对应的文件可以省略后缀名
    alias: {
        'vue': 'vue/dist/vue.min.js',
        '@': path.resolve('src')
    }
  },

  module: {
    /*
    配置各种类型文件的加载器，称之为 loader
    webpack 当遇到 import ... 时，会调用这里配置的 loader 对引用的文件进行编译
    */
    rules: [
      {
        /*
        使用 babel 编译 ES6 / ES7 / ES8 为 ES5 代码
        使用正则表达式匹配后缀名为 .js 的文件
        */
        test: /\.js$/,

        // 排除 node_modules 目录下的文件，npm 安装的包不需要编译
        exclude: /node_modules/,

        /*
        use 指定该文件的 loader, 值可以是字符串或者数组。
        这里先使用 eslint-loader 处理，返回的结果交给 babel-loader 处理。loader 的处理顺序是从最后一个到第一个。
        eslint-loader 用来检查代码，如果有错误，编译的时候会报错。
        babel-loader 用来编译 js 文件。
        */
        use: ['babel-loader', 'eslint-loader']
      },

      {
        // 匹配 html 文件
        test: /\.html$/,
        /*
        使用 html-loader, 将 html 内容存为 js 字符串，比如当遇到
        import htmlString from './template.html';
        template.html 的文件内容会被转成一个 js 字符串，合并到 js 文件里。
        */
        use: 'html-loader'
      },

      {
        // 匹配 css 文件
        test: /\.css$/,

        /*
        先使用 css-loader 处理，返回的结果交给 style-loader 处理。
        css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
        字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
        */
        use: ['style-loader', 'css-loader']
      },

      {
        /*
        匹配各种格式的图片和字体文件
        上面 html-loader 会把 html 中 <img> 标签的图片解析出来，文件名匹配到这里的 test 的正则表达式，
        css-loader 引用的图片和字体同样会匹配到这里的 test 条件
        */
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,

        /*
        使用 url-loader, 它接受一个 limit 参数，单位为字节(byte)

        当文件体积小于 limit 时，url-loader 把文件转为 Data URI 的格式内联到引用的地方
        当文件大于 limit 时，url-loader 会调用 file-loader, 把文件储存到输出目录，并把引用的文件路径改写成输出后的路径

        比如 views/foo/index.html 中
        <img src="smallpic.png">
        会被编译成
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAA...">

        而
        <img src="largepic.png">
        会被编译成
        <img src="/f78661bef717cf2cc2c2e5158f196384.png">
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  /*
  配置 webpack 插件
  plugin 和 loader 的区别是，loader 是在 import 时根据不同的文件名，匹配不同的 loader 对这个文件做处理，
  而 plugin, 关注的不是文件的格式，而是在编译的各个阶段，会触发不同的事件，让你可以干预每个编译阶段。
  */
  plugins: [
    /*
    html-webpack-plugin 用来打包入口 html 文件
    entry 配置的入口是 js 文件，webpack 以 js 文件为入口，遇到 import, 用配置的 loader 加载引入文件
    但作为浏览器打开的入口 html, 是引用入口 js 的文件，它在整个编译过程的外面，
    所以，我们需要 html-webpack-plugin 来打包作为入口的 html 文件
    */
    new HtmlWebpackPlugin({
      /*
      template 参数指定入口 html 文件路径，插件会把这个文件交给 webpack 去编译，
      webpack 按照正常流程，找到 loaders 中 test 条件匹配的 loader 来编译，那么这里 html-loader 就是匹配的 loader
      html-loader 编译后产生的字符串，会由 html-webpack-plugin 储存为 html 文件到输出目录，默认文件名为 index.html
      可以通过 filename 参数指定输出的文件名
      html-webpack-plugin 也可以不指定 template 参数，它会使用默认的 html 模板。
      */
      template: './src/index.html',

      /*
      因为和 webpack 4 的兼容性问题，chunksSortMode 参数需要设置为 none
      https://github.com/jantimon/html-webpack-plugin/issues/870
      */
      chunksSortMode: 'none'
    }),
    /*
    使用文件路径的 hash 作为 moduleId。
    虽然我们使用 [chunkhash] 作为 chunk 的输出名，但仍然不够。
    因为 chunk 内部的每个 module 都有一个 id，webpack 默认使用递增的数字作为 moduleId。
    如果引入了一个新文件或删掉一个文件，可能会导致其他文件的 moduleId 也发生改变，
    那么受影响的 module 所在的 chunk 的 [chunkhash] 就会发生改变，导致缓存失效。
    因此使用文件路径的 hash 作为 moduleId 来避免这个问题。
    */
    new webpack.HashedModuleIdsPlugin(),
    // 替换代码中的环境变量
    new webpack.DefinePlugin({
      DEBUG: dev,
      VERSION: JSON.stringify(pkgInfo.version),
      CONFIG: JSON.stringify(config.runtimeConfig)
    })
  ],
    optimization: {
    /*
    上面提到 chunkFilename 指定了 chunk 打包输出的名字，那么文件名存在哪里了呢？
    它就存在引用它的文件中。这意味着一个 chunk 文件名发生改变，会导致引用这个 chunk 文件也发生改变。

    runtimeChunk 设置为 true, webpack 就会把 chunk 文件名全部存到一个单独的 chunk 中，
    这样更新一个文件只会影响到它所在的 chunk 和 runtimeChunk，避免了引用这个 chunk 的文件也发生改变。
    */
    runtimeChunk: true,

    splitChunks: {
      /*
      默认 entry 的 chunk 不会被拆分
      因为我们使用了 html-webpack-plugin 来动态插入 <script> 标签，entry 被拆成多个 chunk 也能自动被插入到 html 中，
      所以我们可以配置成 all, 把 entry chunk 也拆分了
      */
      chunks: 'all'
    },
    
    //  new webpack.HashedModuleIdsPlugin() 等价
    moduleIds: 'hash'
  }
}

/*
配置开发时用的服务器，让你可以用 http://127.0.0.1:8080/ 这样的 url 打开页面来调试
并且带有热更新的功能，打代码时保存一下文件，浏览器会自动刷新。比 nginx 方便很多
如果是修改 css, 甚至不需要刷新页面，直接生效。这让像弹框这种需要点击交互后才会出来的东西调试起来方便很多。

因为 webpack-cli 无法正确识别 serve 选项，使用 webpack-cli 执行打包时会报错。
因此我们在这里判断一下，仅当使用 webpack-serve 时插入 serve 选项。
issue：https://github.com/webpack-contrib/webpack-serve/issues/19
*/
if (dev) {
  module.exports.serve = {
    // 配置监听端口，默认值 8080
    port: 8080,

    // add: 用来给服务器的 koa 实例注入 middleware 增加功能
    add: app => {
      /*
      配置 SPA 入口

      SPA 的入口是一个统一的 html 文件，比如
      http://localhost:8080/foo
      我们要返回给它
      http://localhost:8080/index.html
      这个文件
      */
      app.use(convert(history()))
    }
  }
}
```

## 2. 工作流程

- 校验配置文件 ：读取命令行传入或者`webpack.config.js`文件，初始化本次构建的配置参数

- 生成`Compiler`对象：执行配置文件中的插件实例化语句`new MyWebpackPlugin()`，为`webpack`事件流挂上自定义`hooks`

- 进入`entryOption`阶段：`webpack`开始读取配置的`Entries`，递归遍历所有的入口文件

- `run/watch`：如果运行在`watch`模式则执行`watch`方法，否则执行`run`方法

- `compilation`：创建`Compilation`对象回调`compilation`相关钩子，依次进入每一个入口文件(`entry`)，使用loader对文件进行编译。通过`compilation`我可以可以读取到`module`的`resource`（资源路径）、`loaders`（使用的loader）等信息。再将编译好的文件内容使用`acorn`解析生成AST静态语法树。然后递归、重复的执行这个过程， 所有模块和和依赖分析完成后，执行 `compilation` 的 `seal` 方法对每个 chunk 进行整理、优化、封装`__webpack_require__`来模拟模块化操作.

- `emit`：所有文件的编译及转化都已经完成，包含了最终输出的资源，我们可以在传入事件回调的`compilation.assets`上拿到所需数据，其中包括即将输出的资源、代码块Chunk等等信息。
- `afterEmit`：文件已经写入磁盘完成
- `done`：完成编译

## 3. 打包速度提升

- speed-measure-webpack-plugin量化打包时间，逐个优化
- HardSourceWebpackPlugin为模块提供中间缓存
- **缩小打包作用域**
  - exclude/include (确定 loader 规则范围)
  - resolve.modules 指明第三方模块的绝对路径
  - resolve.extensions 尽可能减少后缀尝试的可能性
  - resolve.alias 合理使用别名
  - noParse 对完全不需要解析的库进行忽略
- 缓存：babel-loader开启缓存`cacheDirectory`或使用**cache-loader**
- 多进程：happypack/thread-loader
- DLL：dllPlugin进行分包

## 4. Loader和Plugin的区别

- **Loader**

对内容进行处理转换，返回转换后的结果。类似前置的工作，将内容翻译成机器可以读得懂的语言。比如：将A.less转换为A.css，单纯的文件转换过程。可配置`enforce` 强制执行 `loader` 的作用顺序，`pre` 代表在所有正常 loader 之前执行，`post` 是所有 loader 之后执行

- **plugin**

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务。

## 5. 几种 hash 的区别

不同的hash对应不同的用户使用场景，掌握hash可以根据使用环境的差异更好的确定打包方案，使得在不同场景下，用户使用体验和开发、发布体验做到最好。

- **hash**

`hash` 和每次 `build`有关，没有任何改变的情况下，每次编译出来的 `hash`都是一样的，但当你改变了任何一点东西，它的`hash`就会发生改变。

简单理解，你改了任何东西，`hash` 就会和上次不一样了。是项目构建的哈希值。

- **chunkhash**

`chunkhash`是根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。同一chunk下的文件的哈希值是一样的。

- **contenthash**

它的出现主要是为了解决，让`css`文件不受`js`文件的影响。比如`foo.css`被`foo.js`引用了，所以它们共用相同的`chunkhash`值。但这样子是有问题的，如果`foo.js`修改了代码，`css`文件就算内容没有任何改变，由于是该模块的 `hash` 发生了改变，其`css`文件的`hash`也会随之改变。

这个时候我们就可以使用`contenthash`了，保证即使`css`文件所处的模块里有任何内容的改变，只要 css 文件内容不变，那么它的`hash`就不会发生变化。

`contenthash` 你可以简单理解为是 `moduleId` + `content` 所生成的 `hash`。