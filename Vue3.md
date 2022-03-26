# VUE 细节点

## 方法和计算属性

直接从模板中调用方法，通常换做计算属性会更好。

```vue
<span :title="toTitleDate()">
  {{ formatDate(date) }}
</span>
```

## 计算属性（getter/setter）

```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

## class绑定

当你在带有单个根元素的自定义组件上使用 `class` attribute 时，这些 class 将被添加到该元素中。此元素上的现有 class 将不会被覆盖。

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `<p class="foo bar">Hi!</p>`
})
```

```vue
<div id="app">
  <my-component class="baz boo"></my-component>
</div>	
```

渲染结果：

```html
<p class="foo bar baz boo">Hi</p>
```

如果你的组件有多个根元素，你需要定义哪些部分将接收这个类。可以使用 `$attrs` 组件属性执行此操作：

```html
<div id="app">
  <my-component class="baz"></my-component>
</div>
```

```js
const app = Vue.createApp({})

app.component('my-component', {
  template: `
    <p :class="$attrs.class">Hi!</p>
    <span>This is a child component</span>
  `
})
```

## v-show

> `v-show` 不支持 `<template>` 元素，也不支持 `v-else`。

## v-for

使用`v-form`时可以将`:key`使用在`template`标签上

## v-on

参数处理

```vue
<div id="event-with-method">
  <!-- `greet` 是在下面定义的方法名 -->
  <button @click="greet">Greet</button>
  <button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
  </button>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      name: 'Vue.js'
    }
  },
  methods: {
    greet(event) {
      // `methods` 内部的 `this` 指向当前活动实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }，
  	warn(message, event) {
      // 现在可以访问到原生事件
      if (event) {
        event.preventDefault()
      }
      alert(message)
    }
  }
}).mount('#event-with-method')
```

## v-model

修饰符：`.lazy`、`.number`、`.trim`

	## props

1. 但prop类型设为Boolean时，直接写该属性，最后解析的值为true

```html
<!-- 包含该 prop 没有值的情况在内，都意味着 `true`。          -->
<!-- 如果没有在 props 中把 is-published 的类型设置为 Boolean，则这里的值为空字符串，而不是“true” 。 -->
<blog-post is-published></blog-post>
```

2. 传入一个对象的所有属性：

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

```html
<blog-post v-bind="post"></blog-post>
```

等价于：

```html
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

3. 自定义类型检查

type可以设为一个function，Vue内部通过instanceof 来判断属性值是不是对应function的实例

4. 非Prop的Attribute

当组件返回单个根节点时，非 prop attribute 将自动添加到根节点的 attribute 中。

```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime-local" />
    </div>`
})
```

```html
<!-- 具有非prop attribute的Date-picker组件-->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker" data-status="activated">
  <input type="datetime-local" />
</div>
```

> 如果你**不**希望组件的根元素继承 attribute，你可以在组件的选项中设置 `inheritAttrs: false`，你可以访问组件的 `$attrs` property，该 property 包括组件 `props` 和 `emits` property 中未包含的所有属性 (例如，`class`、`style`、`v-on` 监听器等)

## 作用域插槽

就是指在父组件作用域内访问子组件作用域的内容。

```html
<!-- 子组件 todo-list -->
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>

<!-- 父组件 -->
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

## provide/inject

默认不是响应式的。

## keep-alive

当组件在 `<keep-alive>` 内被切换时，它的 `mounted` 和 `unmounted` 生命周期钩子不会被调用，取而代之的是 `activated` 和 `deactivated`。



# VUE3

## 动态参数

```vue
<a v-bind:[attributeName]="url"> ... </a>

<a v-on:[eventName]="doSomething"> ... </a>
```

## v-on

多事件处理

```vue
<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
<button @click="one($event), two($event)">
  Submit
</button>
```

## emit

```js
app.component('custom-form', {
  emits: ['inFocus', 'submit']
})

// emits验证
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
})
```

## v-model

默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件。

自定义组件可以使用多个v-model

```html
<my-component v-model:title="bookTitle"></my-component>
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})

app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

v-model自定义修饰符

```html
<my-component v-model.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

```

## 动态插槽

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## provide/inject 

使用`Vue.computed()`可使`provide`的值变成响应式的。

## transition

mode: `out-in`，`in-out`

## setUp

