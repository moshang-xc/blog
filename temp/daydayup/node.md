# 进程和线程

## 进程

进程 `Process`是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础，进程是线程的容器。Node.js 里通过 `node app.js` 开启一个服务进程，多进程就是进程的复制（fork），fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。

- Node.js开启服务进程例子

```js
const http = require('http');
const server = http.createServer();
server.listen(3000,()=>{    
    process.title='程序员成长指北测试进程';    
    console.log('进程id',process.pid);
})
```

## 线程

线程是操作系统能够进行运算调度的最小单位，首先我们要清楚线程是隶属于进程的，被包含于进程之中。**一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的**。

### 单线程

**单线程就是一个进程只开一个线程**

Javascript 就是属于单线程，程序顺序执行(这里暂且不提JS异步)，可以想象一下队列，前面一个执行完之后，后面才可以执行，当你在使用单线程语言编码时切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续响应无法处理。你如果采用 Javascript 进行编码时候，请尽可能的利用Javascript异步操作的特性。

## Node.js中的进程与线程

在单核 CPU 系统之上我们采用 单进程 + 单线程 的模式来开发。在多核 CPU 系统之上，可以通过 `child_process.fork` 开启多个进程（Node.js 在 v0.8 版本之后新增了Cluster 来实现多进程架构） ，即 多进程 + 单线程 模式。注意：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。

### process模块

`process` 对象是一个全局变量，它提供有关当前 Node.js 进程的信息并对其进行控制。 作为一个全局变量，它始终可供 Node.js 应用程序使用，无需使用 `require()`。详见[参考文档](http://nodejs.cn/api/process.html)

- `process.env`：环境变量，例如通过 `process.env.NODE_ENV` 获取不同环境项目配置信息
- `process.nextTick`：这个在谈及 `EventLoop` 时经常为会提到
- `process.pid`：获取当前进程id
- `process.ppid`：当前进程对应的父进程
- `process.cwd()`：获取当前进程工作目录，
- `process.platform`：获取当前进程运行的操作系统平台
- `process.uptime()`：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
- 进程事件： `process.on(‘uncaughtException’,cb)` 捕获异常信息、 `process.on(‘exit’,cb）`进程推出监听
- 三个标准流： `process.stdout` 标准输出、 `process.stdin` 标准输入、 `process.stderr` 标准错误输出
- `process.title` 指定进程名称，有的时候需要给进程指定一个名称

### 创建进程

进程创建有多种方式，本篇文章以`child_process`模块进行讲解。

#### child_process模块

child_process 是 Node.js 的内置模块，几个常用函数：四种方式

- `child_process.spawn()`：适用于返回大量数据，例如图像处理，二进制数据处理。
- `child_process.exec()`：适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
- `child_process.execFile()`：类似 `child_process.exec()`，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
- `child_process.fork()`：衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统**CPU 核心数**设置。

> CPU 核心数这里特别说明下，fork 确实可以开启多个进程，但是并不建议衍生出来太多的进程，cpu核心数的获取方式 `constcpus=require('os').cpus();`,这里 cpus 返回一个对象数组，包含所安装的每个 CPU/内核的信息，二者总和的数组哦。假设主机装有两个cpu，每个cpu有4个核，那么总核数就是8。

##### fork开启子进程 Demo

fork开启子进程解决文章起初的计算耗时造成线程阻塞。在进行 compute 计算时创建子进程，子进程计算完成通过 `send` 方法将结果发送给主进程，主进程通过 `message` 监听到信息后处理并退出。

> fork_app.js

```js
const http = require('http');
const fork = require('child_process').fork;
const server = http.createServer((req, res) => {    
    if(req.url == '/compute'){        
        const compute = fork('./fork_compute.js');        
        compute.send('开启一个新的子进程');        
        // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件        
        compute.on('message', sum => {            
            res.end(`Sum is ${sum}`);            
            compute.kill();        
        });        
        
        // 子进程监听到一些错误消息退出     
        compute.on('close', (code, signal) => {            
            console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);       
            compute.kill();        
        })    
    }else{        
        res.end(`ok`);    
    }});

server.listen(3000, 127.0.0.1, () => {    
    console.log(`server started at http://${127.0.0.1}:${3000}`);
});
```

> fork_compute.js

针对文初需要进行计算的的例子我们创建子进程拆分出来单独进行运算。

```js
const computation = () => {    
    let sum = 0;    
    console.info('计算开始');    
    console.time('计算耗时');    
    for (let i = 0; i < 1e10; i++) {        
        sum += i    
    };    
    console.info('计算结束');    
    console.timeEnd('计算耗时');    
    return sum;
};

process.on('message', msg => {    
    console.log(msg, 'process.pid', process.pid); // 子进程id    
    const sum = computation();    // 如果Node.js进程是通过进程间通信产生的，那么，process.send()方法可以用来给父进程发送消息    
    process.send(sum);
})
```



```json
 {
  "type": "StringLiteral",
  "start": 8,
  "end": 14,
  "loc": {
    "start": {
      "line": 1,
      "column": 8
    },
    "end": {
      "line": 1,
      "column": 14
    }
  },
  "extra": {
    "rawValue": "要提取哦",
    "raw": "\"要提取哦\""
  },
  "value": "要提取哦"
}
```