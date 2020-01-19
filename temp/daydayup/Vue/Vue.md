# You Do Not Know About



熟悉http协议，具备web性能优化经验和web安全知识XSS攻击等防范技术；



Vue全家桶分析

Vue大部分关键知识点分析

性能优化

Vue各功能原理知识点梳理：

1. 双向绑定
2. transition
3. slot
4. 改变路由的时候，当前组件何时挂载的
5. 在 Vue.js 应用中, 所有组件都是 Vue 实例的扩展, 也就意味着所有的组件都可以访问到这个实例原型上定义的属性. 所以, VueRouter 将 `$route` 和 `$router` 属性定义在了 Vue 实例的原型上.



# Vue原理

- parent
- children
- createElement

## keep-alive

## vuex



## transition



## 组件

- 组件何时自动销毁

### 异步组件

### 函数式组件

**函数式组件是一个不渲染任何html文本的组件。**

相反，它只管理状态和行为，给父组件或者消费组件暴露一个作用域插槽，以便它们能自己控制该渲染的内容。

函数式组件能够准确的渲染你给它传入的内容，无需任何其它元素。

函数式组件仅仅暴露一个scoped slot，消费者可以在其中提供整个他们想要渲染的模块。

```js
// 无任何html的组件，类似functional: true
export default{
    name: 'emptySlot',
    render(){
        return this.$slots.default;
    }
}

// 参考链接：https://juejin.im/post/5c2d7030f265da613a54236f

// functional: true
export default {
    name: 'v-collapse-transition',
    functional: true,
    render (createElement, context) {
        const data = {
            props: {
                name: 'collapse'
            },
            on: transitionOn
        };

        return createElement('transition', data, context.children);
    }
};
```

### 高阶组件

高阶组件定义：**接收一个纯对象，并返回一个新的纯对象**

```js
export default function hocComponent(wrappedComponent){
    return {
        template: '<wrap v-on="$listeners" v-bind="$attrs"></wrap>',
        components: {
            wrap: wrappedComponent
        }
    }
}
```



# vue-router

## 原理

如果原生支持`History.pushState`:

history和hash模式下都用的是**`history.pushState()`**和**`history.replaceState()`**进行路由的替换。

如果原生不支持`History.pushState`:

H5模式下用**`location.assign`**代替pushState，用**`location.replace`**代替replaceState。

Hash模式下用**`location.hash`**代替pushState，用**`location.replace`**代替replaceState。通过hashchange监听路由变化

> 默认不支持histroy自动降级为hash模式，除非fallback设置为false，则不降级

## history API

### popState

每当同一个文档的浏览历史（即`history`对象）出现变化时，就会触发`popstate`事件。

注意，**仅仅调用`pushState()`方法或`replaceState()`方法 ，并不会触发该事件**，只有用户点击浏览器倒退按钮和前进按钮，或者使用 JavaScript 调用`History.back()`、`History.forward()`、`History.go()`方法时才会触发。另外，该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发。

### pushState

`History.pushState()`方法用于在历史中添加一条记录。

假定当前网址是`example.com/1.html`，使用`pushState()`方法在浏览记录（History 对象）中添加一个新记录。

```js
var stateObj = { foo: 'bar' };
history.pushState(stateObj, 'page 2', '2.html');
```

添加新记录后，浏览器地址栏立刻显示`example.com/2.html`，但并不会跳转到`2.html`，甚至也不会检查`2.html`是否存在，它只是成为浏览历史中的最新记录。这时，在地址栏输入一个新的地址(比如访问`google.com`)，然后点击了倒退按钮，页面的 URL 将显示`2.html`；你再点击一次倒退按钮，URL 将显示`1.html`。

**总之，`pushState()`方法不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有反应。**

### replaceState

`History.replaceState()`方法用来修改 History 对象的当前记录，其他都与`pushState()`方法一模一样。

假定当前网页是`example.com/example.html`。

```js
history.pushState({page: 1}, 'title 1', '?page=1')
// URL 显示为 http://example.com/example.html?page=1

history.pushState({page: 2}, 'title 2', '?page=2');
// URL 显示为 http://example.com/example.html?page=2

history.replaceState({page: 3}, 'title 3', '?page=3');
// URL 显示为 http://example.com/example.html?page=3

history.back()
// URL 显示为 http://example.com/example.html?page=1

history.back()
// URL 显示为 http://example.com/example.html

history.go(2)
// URL 显示为 http://example.com/example.html?page=3
```



## vue源码段

**Vue.extend**

```js

  /**
   * 构造Vue的子类VueComponent
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    // Object.create方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    // 如下一步将Vue.options深拷贝到Sub.options中去了，
    // 这样createComponent中  const baseCtor = context.$options._base指向Vue
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}
```



# 知识点

- 所有的配置都可用通过`this.$options.propertyName`取得



# 非模板组件

```js
export default {
  name: 'ElRow',

  componentName: 'ElRow',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  },

  computed: {
    style() {
      const ret = {};

      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    }
  },

  render(h) {
    return h(this.tag, {
      class: [
        'el-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'el-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default);
  }
};

```

# 组件列表

- layout： col, row
- Button, Button Group
- select：参数区分添加到全局还是局部
- popper.js



# 重点分析组件

1. select
2. timepicker
3. OTHERS




