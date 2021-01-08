# babel

示例：

初始插件安装

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save @babel/polyfill
```

配置文件`babel.config.json`

```json
{
  "presets": [
    [
      "@babel/env", // 等价于@babel/preset-env
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
        },
        "useBuiltIns": "usage", // 设置只加载所需的polyfill，
      }
    ]
  ]
}
```

开箱即用的babel，什么也不做。如果要让它对代码进行转换，就得配置plugins才能有效。

babel默认只转换新的 JavaScript 语法，比如箭头函数、扩展运算（spread）。

不转换新的 API，例如`Iterator`、`Generator`、`Set`、`Maps`、`Proxy`、`Reflect`、`Symbol`、`Promise` 等全局对象，以及一些定义在全局对象上的方法（比如 `Object.assign`）都不会转译。如果想使用这些新的对象和方法，则需要为当前环境提供一个垫片（polyfill）。

## @babel/core

Babel的核心库

## @babel/cli

Babel终端操作指令模块

## babel.config.json/.babelrc.json等

Babel的配置文件，用于配置`presets`和`plugins`

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
Copy
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
Copy
```

> preset 的设置参数的工作原理完全相同。

以下是常用的`preset`和`plugin`

## @babel/preset-env

对我们所使用的并且目标浏览器中缺失的功能进行代码转换，语法转换只是将高版本的语法转换成低版本的，但是新的内置函数、实例方法无法转换。

转换插件，支持现代JavaScript（ES2015，ES2016等）语法的所有插件集合

`@babel/preset-env` 提供了一个 `useBuiltIns` 参数，设置值为 `usage` 时，就只会包含代码需要的 `polyfill` 。有一点需要注意：配置此参数的值为 `usage` ，必须要同时设置 `corejs` 

```js
//.babelrc
const presets = [    
	[
        "@babel/env",
 		{ 
        	"useBuiltIns": "usage",
  			"corejs": 3        
 		}    
	]
]
```

## @babel/polyfill

内置函数的实现例如Promise，WeakMap，Object.assign等

> useBuiltIns为usage，表示Babel现在将检查您所有代码中目标环境中缺少的功能，只加载需要的polyfill，否则将在入口文件处一次性加载所有的polyfill

## @babel/plugin-transform-runtime

`@babel/plugin-transform-runtime` 是一个可以重复使用 `Babel` 注入的帮助程序，以节省代码大小的插件。