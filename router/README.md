  
# router
基于`webpack`按需加载的单页面路由.
通过`webpack`的`require.ensure`实现对js文件进行按需加载，对`html`进行异步请求和缓存。
兼容`IE8+`

## 功能

 1. 页面切换
 2. 异步加载html
 3. 异步加载js

## 原理
通过`hashchange`跟踪路由变化

## 流程图
![流程图](https://github.com/moshang-xc/router/blob/master/demo/src/common/img/router.png)

## 步骤
### 1. 初始化
解析路由的相关配置信息，监听window的hashchange来感知hash变化，刷新页面
```
reasyRouters.prototype.init = function(){
	//解析配置的routers，得到路由对应的js和html模板
	this.analyseRouter();
	//事件绑定
	addEvent(window, 'load', () => {
		this.routing();
	});

	addEvent(window, 'hashchange', () => {
		this.routing();
	});

	this.afterInit && this.afterInit();
}
```

router相关配置
```
{
	target: document.getElementById('content'),
	defaultPage: 'sysinfo', //起始页
	routers:{ 
		'sysinfo':{ 
			path:'/sysinfo', //若path的值与sysinfo相同可以不填,可以配置有参数的路径例如：/sysinfo/:id/:type两个参数
			template: '/pages/sysInfo.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					//按需加载js文件
					callback && (callback.call(null, require('../modules/sysStatus/sysInfo.js')));
				}, 'sysInfo');
			},
			callback:null //切换路由后的回调，与routers.on是同一作用
		}
        ......
	},
	beforeRouting: (curPath) => {
		//切换也面前回调
    },
	afterRouting: () => {
		//切换页面后业务逻辑
    },
	afterInit: () => {
		//初始化后业务逻辑
    }
```
### 2. 切换页面
切换页面会去判断请求的路由是否有相关配置，若无配置则重定向到起始页面。切换路由会先加载html文件同时进行缓存，再加载js文件。
```
reasyRouters.prototype.routing = function(){
	//解析路由参数
	this.getPathParams();

	//切换页面之前先把之前的路由给清空
	if(this.lastPath && this.lastPath.path && this.currentControler){
		this.currentControler.destroy && this.currentControler.destroy(); 
	}
	this.currentControler = null;

	let path = this.currentPath.path;
	if(path){
		let route = this.routers[path];
		//执行路由切换前操作
		this.beforeRouting && this.beforeRouting(this.currentPath);

		let init = (ctl) => {
			this.currentControler = ctl;
			ctl.init && ctl.init(this.currentPath);
			this.triger(path);
			this.afterRouting && this.afterRouting();
		}

		if(!route.hasLodeHtml && getType(route['controller']) === '[object Function]'){
			this.ajax(route.template, 'get', '', (data)=>{
				route['template'] = data;
				route.hasLodeHtml = true;
				this.target.innerHTML = data;
                //配置webpack按需加载信息
				route['controller'](init);		
			});
		}else{
			//加载html模板
			this.target.innerHTML = route.template;
			route['controller'](init);
		}
	}else{
		window.location.hash = this.defaultPage;
	}
}
```
加载html文件
```
reasyRouters.prototype.ajax = function(url, method, data, callback){
	ajaxRequest(url, method, data, (data, status) => {
		switch(status) {
			case 404:                    
				//请求不到页面，即返回默认页面
				window.location.hash = this.defaultPage;
				break;
			default:  
				callback(data);
		}
	});
}
```
### 3. 扩展
增加了三个回调(beforeRouting, afterRouting, afterInit)，和页面切换的事件委托，以满足自定义的业务需求，可对自定义的委托进行添加和移除，类似jQuery的事件绑定机制
```
reasyRouters.prototype.on = function(path, callback, namespace){
	if(!callback || getType(callback) !== '[object Function]'){
		return;
	}

	let pathHandel = this.pathHandel;
	pathHandel[path] = pathHandel[path] || { __default__: []};
	if(namespace){
		pathHandel[path][namespace] ? (pathHandel[path][namespace].push(callback)) : (pathHandel[path][namespace] = [callback]);
	}else{
		pathHandel[path]['__default__'].push(callback);
	}
}
```
## DEMO运行
```
#clone到本地
git clone https://github.com/moshang-xc/router.git

cd router/demo

#安装依赖
npm install 

#运行
npm run dev

#或者打包,通过http-mini查看
#安装http-mini
npm install http-mini -g

#打包
npm run build

# 开启服务器
cd dist 
http-mini 8088
```
