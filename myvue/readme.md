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
