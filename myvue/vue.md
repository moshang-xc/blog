# 学习方法

1.决定要学习的模块，查找官方文档、相关的总结文章，整理出大概的学习内容与目标

2.运行程序，观察表现

3.运行源码，断点调试，从头跟一边源码的执行流程，注意函数堆栈

4.画类图、流程图，先把遇到的重要类记录下来，表明各个类的关系

5.记录问题，把不理解的类或者内容以问题的方式记录下来

6.写文章、笔记，尝试逐个解决之前遗留的问题

> 2-6可能需要持续的重复进行

# 问题记录

## platforms/web/entry-runtime-with-compiler.js

该文件是入口文件

- options.staticRenderFns是干嘛用的

- 函数式组件做啥子用的

- _parentVnode在哪里定义和赋值的



# 流程

`new Vue()` -> `_init()` -> `mount()` -> `new Watch()` -> `Update`

`new Vue()`会先删除DOM节点再

# 代码记录

```js
(a[key] || (a[key] = [])).push(1);


const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}


const a = (this.a || (this.a = []))

```

# 知识点

# 发掘可学习的内容

