# vue 简单实现

- html 模板解析
- 数据监控

## 目录结构

```
myvue
├── index.html html模板
├── main.js 入口文件
├── bundle.js webpack打包后的文件
├── src 核心代码
    ├── compiler.js        # 编译相关
    ├── monitor.js         # 数据变化订阅者
    ├── observer.js        # 数据监听者
    ├── publish.js         # 发布订阅模式，连接Observer，Monitor
    ├── vue.js             # vue逻辑
```

## 功能拆解
首先要实现的例子如下，仿照`Vue`的API实现`html模版`的解析，数据的绑定操作。

`html`模版如下
```html
 <div id="app">
    <div>
        <input type="text" v-model="message" placeholder="please enter something..." /> message: {{message}}
    </div>
    <div>
        <input type="text" v-model="name" placeholder="please enter something..." /> name: {{name}}
    </div>
    <pre>
        message: {{message}}
        name: {{name}}
    </pre>
</div>
```

`Vue`的使用代码如下
```js
let vue = new Vue({
    el: '#app',
    data: {
        message: 'vue双向绑定实例',
        name: 'moshang'
    }
});
```
接口与`Vue`提供的接口类似，我们使用的是自己开发的简单版vue实现。我们的实现要支持如下功能：
- 解析html模版，提取指令
- 数据的监听，修改数据触发DOM的更新

> 由于只是简易版实现，主要设计的是数据的双向绑定，对于Virtual Dom，diff算法本文是没有涉及的

### Vue.js 入口

`vue.js`为整个模块的入口，处理`new Vue(option)`传人的option，解析`html`模版，提取指令并监听数据
```js
class Vue {
    constructor(option) {
        this.$option = option || {};
        this._data = this.$option.data;
        this.$el = option.el;
        this.vm = this;
        // 代理this.$option.data
        this._proxy();
        // 开启数据观察，通过发布订阅模式，当数据发生改变时通知订阅者，更新Dom
        new Observer(this._data);
        // 解析html模版，提取指令，事件绑定等操作
        new Compiler(this.$el, this.vm);
    }

    /**
    * data代理，通过this.vm实例可以直接访问this.$option.data数据
    * this.vm['message']
    */
    _proxy() {
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return this._data[key];
                },
                set(val) {
                    if (this._data[key] !== val) {
                        this._data[key] = val;
                    }
                }
            })
        })
    }
}
```

### Compiler.js 解析器

解析器用于解析html模版， 创建监听者，对`v-model`和`{{}}`指令进行监听。
```js
class Compiler {
    constructor(el, vm) {
        this.el = this._query(el);
        this.vm = vm;
        this.el.appendChild(this._compile(this.el));
    }
    /**
     * 查找Dom节点
     */
    _query(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        if (selector instanceof document.documentElement) {
            return;
        }

        return selector;
    }
    /**
     * 解析el的内容
     */
    _compile(el) {
        ...
    }
    /**
     * 处理textNode节点，提取{{}}指令，保留其它字符串
     * 通过将nodeValue文本进行拆分成几个不同的textNode节点，达到对{{}}指令的监听效果
     */
    _compileText(child) {
        ...
    }
}
```

```js
    _compileText(child) {
        ...
        // 创建监听者进行指令监听
        new Monitor(commandNode, commandNoEmpty, this.vm);
        ...
    }

```
