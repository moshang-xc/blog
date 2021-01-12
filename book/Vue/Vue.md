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



## Vue知识点

## 1. computed 和 watch 的区别和运用的场景？

**computed：** 是计算属性，依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed  的值；计算属性的值是用到的时候才去计算。

computed对于的watcher.dirty记录是否需要重新计算

**watch：** 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；

**运用场景：**

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
- 使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

## 2. Vue监听数据变化原理

重写数组实例的原型对象`__proto__`，添加`dep.notify()`。

对如下方法进行重写： 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'

**Vue实现对数组的监听的处理：**见源码

```js
var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});
```

## 3. 生命周期

- beforeCreate()：data没有挂载，methods、computed、watch等均不能访问。

*initState：initProps()，initMethods()，initData()，initComputed()，initWatch()*

- created()： vnode，Dom都没有生成
- beforeMount()：vm._render已经生成
- mounted()：vm._render()，dom挂载完毕
- beforeUpdate()：vnode patch之前
- updated()：patch完成，dom更新
- beforeDestroy()：发生在实例销毁之前，在当前阶段实例完全可以被使用
- destroyed()：发生在实例销毁之后，这个时候只剩下了dom空壳。

![img](https://user-gold-cdn.xitu.io/2019/7/2/16bb2946c711b0b6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> **callhock**源码中的**invokeWithErrorHandling** 方法在执行回调时会改变回调this的指向所以不能使用箭头函数，箭头函数的this在定义的时候就确定了无法被更改。

## 4.Vue 的父组件和子组件生命周期钩子函数执行顺序？

- 加载渲染过程

  父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

- 子组件更新过程

  父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

- 销毁过程

  父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

## 5. Keep-alive

可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

常用的两个属性`include/exclude`，允许组件有条件的进行缓存。

两个生命周期`activated/deactivated`，用来得知当前组件是否处于活跃状态。

通常与vue-router一起使用

第一次激活时 先mounted再activated，mounted就第一次唤醒的时候执行一次，唤醒后会再次执行activated

## 6. v-model

v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

- text 和 textarea 元素使用 value 属性和 input 事件；
- checkbox 和 radio 使用 checked 属性和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

以 input  表单元素为例：

```
<input v-model='something'>
    
相当于

<input v-bind:value="something" v-on:input="something = $event.target.value">
```

在组件中：

```js
// 父组件
<ModelChild v-model="message"></ModelChild>

// 子组件
<div>
  <input type="text" :value="value" @:change="$emit('input', $event.target.value)">
</div>
export default {
  props:['value']
}
```

## 7. 组件间通信

- **`props / $emit` 适用 父子组件通信**
- **`ref` 与 `$parent / $children` 适用 父子组件通信**
- **`$attrs`/`$listeners` 适用于 隔代组件通信**

	`$attrs`：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 `v-bind="$attrs"` 传入内部组件。通常配合 inheritAttrs 选项一起使用。

	`$listeners`：包含了父作用域中的 (不含 .native 修饰器的)  v-on 事件监听器。它可以通过 `v-on="$listeners"` 传入内部组件

- **`provide / inject` 适用于 隔代组件通信**

  祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。 provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。

- **Vuex  适用于 父子、隔代、兄弟组件通信**

  Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

  - Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
  - 改变 store 中的状态的唯一途径就是显式地提交  (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

## 父组件调用子组件的生命周期函数

可以通过`$on`和`$emit`的方式调用，也可以直接`@hook:mounted=""`的方式进行调用，子组件内部的mounted先执行再执行父组件中手动绑定的mounted。

```vue
<mychild @hook:mounted="log"></mychild>
```



## 8. SSR

**（1）服务端渲染的优点：**

- 更好的 SEO： 因为 SPA 页面的内容是通过 Ajax 获取，而搜索引擎爬取工具并不会等待 Ajax 异步完成后再抓取页面内容，所以在 SPA 中是抓取不到页面通过 Ajax 获取到的内容；而 SSR 是直接由服务端返回已经渲染好的页面（数据已经包含在页面中），所以搜索引擎爬取工具可以抓取渲染好的页面；
- 更快的内容到达时间（首屏加载更快）： SPA 会等待所有 Vue 编译后的 js 文件都下载完成后，才开始进行页面的渲染，文件下载等需要一定的时间等，所以首屏渲染需要一定的时间；SSR 直接由服务端渲染好页面直接返回显示，无需等待下载 js 文件及再去渲染等，所以 SSR 有更快的内容到达时间；

**（2) 服务端渲染的缺点：**

- 更多的开发条件限制： 例如服务端渲染只支持 beforCreate 和 created 两个钩子函数，这会导致一些外部扩展库需要特殊处理，才能在服务端渲染应用程序中运行；并且与可以部署在任何静态文件服务器上的完全静态单页面应用程序 SPA 不同，服务端渲染应用程序，需要处于 Node.js server 运行环境；
- 更多的服务器负载：在 Node.js  中渲染完整的应用程序，显然会比仅仅提供静态文件的  server 更加大量占用CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 ( high traffic ) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

https://juejin.im/post/5cb6c36e6fb9a068af37aa35

## 9. MVVM

MVVM 源自于经典的 Model–View–Controller（MVC）模式  ，MVVM 的出现促进了前端开发与后端业务逻辑的分离，极大地提高了前端开发效率，MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。如下图所示：

![1.png](/Users/xiechang/Documents/project/Blog/temp/daydayup/Vue/mvvm.png)

（1）View 层

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建 。

（2）Model 层

Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。

（3）ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。需要注意的是 ViewModel 所封装出来的数据模型包括视图的状态和行为两部分，而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。

MVVM 框架实现了双向绑定，这样 ViewModel 的内容会实时展现在 View 层，前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新。这样 View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一环。

我们以下通过一个 Vue 实例来说明 MVVM 的具体实现，有 Vue 开发经验的同学应该一目了然：

（1）View 层

```html
<div id="app">
    <p>{{message}}</p>
    <button v-on:click="showMessage()">Click me</button>
</div>
```

（2）ViewModel 层

```vue
var app = new Vue({
    el: '#app',
    data: {  // 用于描述视图状态   
        message: 'Hello Vue!', 
    },
    methods: {  // 用于描述视图行为  
        showMessage(){
            let vm = this;
            alert(vm.message);
        }
    },
    created(){
        let vm = this;
        // Ajax 获取 Model 层的数据
        ajax({
            url: '/your/server/data/api',
            success(res){
                vm.message = res;
            }
        });
    }
})
```

（3） Model 层

```js
{
    "url": "/your/server/data/api",
    "res": {
        "success": true,
        "name": "IoveC",
        "domain": "www.cnblogs.com"
    }
}
```

## 10. 双向绑定/响应式原理

- Observer遍历所有数据对象，通过`Object.defineproperty`添加数据劫持，getter（依赖收集）和setter（触发依赖）且会对对象进行深度遍历。每个属性对应一个依赖收集器（dep实例），在getter时通过dep进行依赖收集`dep.addSub(Dep.target)`
- compile解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并初始化订阅者（new Watcher()），将每个指令对应的节点绑定更新函数，初始化订阅者的过程中会get value ，触发getter进行依赖收集`Dep.target`，添加监听数据的订阅者。
- Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
- Dep：依赖收集器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理
- 但数据发生改变时，setter触发dep.notify() -> watcher.update()触发compile中绑定的回调

## 11.  diff 和 pach算法

在有key且新旧dom的子节点都为多个的时候核心算法才发挥作用。

核心算法：新旧dom树分别有首尾两个指针进行节点对比复用。

对于是sameVnode的节点才进行patchVnode的diff算法

```js
function sameVnode(a, b) {
    return (
        a.key === b.key && (
            (
                a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)
            ) || (
                isTrue(a.isAsyncPlaceholder) &&
                a.asyncFactory === b.asyncFactory &&
                isUndef(b.asyncFactory.error)
            )
        )
    )
}

```

## 12. Key的作用

说简单点就是为了复用，且不出问题。可以说很多简单场景下不用key，效率会更高。

官网推荐推荐的使用key，应该理解为“使用唯一id作为key”。因为index作为key，和不带key的效果是一样的。index作为key时，每个列表项的index在变更前后也是一样的，都是直接判断为sameVnode然后复用。

1. key的作用是尽可能的复用元素，在新旧的节点之间保存映射关系，以便能对旧的dom进行复用。
2. 保证组件的状态正确，比如对于没有通过data中属性控制的文本标签，会不出现状态错误的情况。

```vue
<div id="app">
  <ul>
    <li v-for="(item, index) in list" @click="check(item)">
      <label>{{item.title}}</label>
      <input type="text" />
    </li>
  </ul>
  <a @click.prevent.stop="delete1">delete</a>
</div>

<script>
// input中输入任意的内容，然后删除a3，发现第五个input被删除了，之前输入的a3的input内容还在
let vm = new Vue({
        el: "#app",
        data: {
          type: "a",
          list: [
            { title: "a1"},
            { title: "a2"},
            { title: "a3"},
            { title: "a4"},
            { title: "a5"}
          ]
        },
        methods: {
          delete1() {
            this.a.splice(2, 1);
          }
        }
      });
</script>
```

## 13. nextTrick

Vue内部维护一个callbacks异步队列，多次调用nextTick会将方法存入队列中，通过异步方法清空当前队列。异步方法选择的顺序为`promise`，`MutationObserver`，`setImmediate`，`setImmediate`

## 14. $on原理

```js
Vue.prototype.$on = function(event: string | Array < string > , fn: Function): Component {
        const vm: Component = this
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn)
            }
        } else {
            (vm._events[event] || (vm._events[event] = [])).push(fn)
            // optimize hook:event cost by using a boolean flag marked at registration
            // instead of a hash lookup
            if (hookRE.test(event)) {
                vm._hasHookEvent = true
            }
        }
        return vm
    }
```

## 15. Compile原理

- parse通过正则匹配生成ast
- optimize遍历ast，标记节点是否是静态节点，跳过对静态节点的比对
- generate生成render函数和staticRenderFns

## 16. 异步组件

## 17. Vue项目优化

### 代码层面

- 图片资源懒加载
- 路由懒加载
- 按需加载
- 特定场景使用特定的API
- SSR或预渲染

其它层面

- 打包优化，提取公共代码，模版预编译，hash值使用利用浏览器缓存
- chrome调试工具，查看性能瓶颈
- CDN使用

## 18. vue3.0 新特性

ue 3.0 正走在发布的路上，Vue 3.0 的目标是让 Vue 核心变得更小、更快、更强大，因此 Vue 3.0 增加以下这些新特性：

**（1）监测机制的改变**

3.0 将带来基于代理 Proxy 的 observer 实现，提供全语言覆盖的反应性跟踪。这消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：

- 只能监测属性，不能监测对象
- 检测属性的添加和删除；
- 检测数组索引和长度的变更；
- 支持 Map、Set、WeakMap 和 WeakSet。

新的 observer 还提供了以下特性：

- 用于创建 observable 的公开 API。这为中小规模场景提供了简单轻量级的跨组件状态管理解决方案。
- 默认采用惰性观察。在 2.x 中，不管反应式数据有多大，都会在启动时被观察到。如果你的数据集很大，这可能会在应用启动时带来明显的开销。在 3.x 中，只观察用于渲染应用程序最初可见部分的数据。
- 更精确的变更通知。在 2.x 中，通过 Vue.set 强制添加新属性将导致依赖于该对象的 watcher 收到变更通知。在 3.x 中，只有依赖于特定属性的 watcher 才会收到通知。
- 不可变的 observable：我们可以创建值的“不可变”版本（即使是嵌套属性），除非系统在内部暂时将其“解禁”。这个机制可用于冻结 prop 传递或 Vuex 状态树以外的变化。
- 更好的调试功能：我们可以使用新的 renderTracked 和 renderTriggered 钩子精确地跟踪组件在什么时候以及为什么重新渲染。

**（2）模板**

模板方面没有大的变更，只改了作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。

同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。

**（3）对象式的组件声明方式**

vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易。

此外，vue 的源码也改用了 TypeScript 来写。其实当代码的功能复杂之后，必须有一个静态类型系统来做一些辅助管理。现在 vue3.0 也全面改用 TypeScript 来重写了，更是使得对外暴露的 api 更容易结合 TypeScript。静态类型系统对于复杂代码的维护确实很有必要。

**（4）其它方面的更改**

vue3.0 的改变是全面的，上面只涉及到主要的 3 个方面，还有一些其他的更改：

- 支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
- 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
- 基于 treeshaking 优化，提供了更多的内置功能。

# vue-router

## hash & history

**1）hash 模式**

早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：

hash  路由模式的实现主要是基于下面几个特性：

- URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
- hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
- 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用  JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
- 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

**（2）history 模式**

HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

history 路由模式的实现主要基于存在下面几个特性：

- pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
- 我们可以使用 popstate  事件来监听 url 的变化，从而对页面进行跳转（渲染）；
- history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。



## Vue-router原理

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

# 



