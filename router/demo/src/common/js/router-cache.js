
/**
 * 基于webpack按需加载的SPA路由
 * moshang @v1.0.0
 */

 /* 问题： 确定是否需要进行控制器的缓存，若需要缓存则进行缓存数量的限制，以免消耗太多内存 */

/*
opt示例如下，配置路由对应的controler，html模板等信息
let opt = {
	target: htmlnode,
	defaultPage: 'index', //起始页
	routers:{
		'sysinfo':{
			path:'/sysinfo', //若path的值与sysinfo相同可以不填,可以配置有参数的路径例如：/sysinfo/:id/:type两个参数
			template:"xx.html", //由于后台是Linux系统，区分大小写，故注意template文件名大小写的正确性
			controller: (callback) => {
				require.ensure([], (require) => {
					//按需加载js文件
					callback && (callback.call(null, require("../xx/xx.js")));
					//每个文件即为一个控制器，至少需要export出init和destroy两个方法，用于初始化操作和变量销毁内存回收
				}, 'sysinfo');
			},
			callback:null //切换路由后的回调，与reasyRouters.on是同一作用
		}
	},
	beforeRouting: null, //切换路由前的回调
	afterRouting: null //切换路由前的回调
}
*/
let DEFAULT = {
	//html元素，加载的页面信息将被插入的标签节点
	target: document.body,
	//首页，默认页
	defaultPage: 'index',
	routers: []
}

function reasyRouters(opt){
	opt = Object.assign({}, DEFAULT, opt);
	this.target = opt.target;
	this.routers = opt.routers;
	this.rootPath = opt.rootPath;
	this.beforeRouting = opt.beforeRouting;
	this.afterRouting = opt.afterRouting;
	this.defaultPage = opt.defaultPage.toLowerCase();
	//记录页面事件委托
	this.pathHandel = {};
	//记录当前页信息
	this.currentPath = {};
	//记录上一页的信息
	this.lastPath = {};

	this.init();
}

//解析配置的路由参数
reasyRouters.prototype.analyseRouter = function(){
	let routers = this.routers;
	for(let key in routers){
		if(routers.hasOwnProperty(key)){
			let route = routers[key],
				keyLower = key.toLowerCase();

			//将所有路由转换成小写，不区分大小写
			if(keyLower !== key){
				routers[keyLower] = route;
				delete routers[key];
			}
			//解析路由参数
			route["params"] = [];
			if(route["path"]){
				let pars = route["path"].split('/:');
				route["params"] = pars.length > 1 ? pars.slice(1) : []
			}
		}
	}
}

//初始化操作
reasyRouters.prototype.init = function(){
	//解析配置的routers
	this.analyseRouter();
	//事件绑定
	addEvent(window, "load", () => {
		this.routing();
	});

	addEvent(window, "hashchange", () => {
		this.routing();
	});
}

//解析浏览器地址栏的参数
reasyRouters.prototype.getPathParams = function(){
	let _this = this,
		val,
		hash = location.hash;
	this.lastPath = this.currentPath;

	if(hash){
		hash = hash.replace(/^#+/g, "");
		hash = hash.split("/:");
		let path = hash[0];
		path && (path = path.toLowerCase());
		if(!this.routers[path]){
			path = this.defaultPage;
		}
		this.currentPath = {
			path: path,
			params: {}
		}

		hash = hash.length > 1 ? hash.slice(1) : [];
		let l= hash.length;
		this.routers[path].params.forEach((param, i) => {
			l > i && (this.currentPath.params[param] = hash[i]);
		})
	}else{
		this.currentPath = {
			path: this.defaultPage,
			params: {}
		}
	}
}

/**
 * 路由切换
 */
reasyRouters.prototype.routing = function(){
	//解析路由参数
	this.getPathParams();

	//切换页面之前先把之前的路由给清空
	if(this.lastPath && this.lastPath.path){
		let route = this.routers[this.lastPath.path];
		if(route && route.controller){
			route.controller.destroy && route.controller.destroy(); 
		}
	}

	let path = this.currentPath.path;
	if(path){
		let route = this.routers[path];
		//执行路由切换前操作
		this.beforeRouting && this.beforeRouting(this.currentPath);
		//如果切换的页面为当前页只做数据更新操作，但是不会刷新页面
		// if(path !== this.lastPath.path){
			if(getType(route["controller"]) === "[object Function]"){
				this.ajax(route.template, 'get', "", (data)=>{
					route['template'] = data;
					this.target.innerHTML = data;

					let init = (ctl) => {
						route['controller'] = ctl;
						ctl.init && ctl.init(this.currentPath);
						this.triger(path);
						this.afterRouting && this.afterRouting(ctl, this.currentPath);
					}
					route["controller"](init);
				});
			}else{
				//加载html模板
				this.target.innerHTML = route.template;
				route.controller.init && route.controller.init(this.currentPath);
				this.triger(path);
				this.afterRouting && this.afterRouting(route.controller, this.currentPath);
			}
		// }else{
		// 	this.triger(path);
		// 	this.afterRouting(route.controller, this.currentPath);
		// }
	}else{
		window.location.hash = this.defaultPage;
	}
}

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

//触发自定义事件委托
reasyRouters.prototype.triger = function(path, namespace){
	let handel = this.pathHandel[path];
	if(handel){
		if(namespace){
			handel = handel[namespace];
			if(handel && handel.length > 0){
				handel.forEach((cb) => {
					cb && cb();
				});
			}
		}else{
			for(let key in handel){
				let events = handel[key];
				if(events && events.length > 0){
					events.forEach((cb) => {
						cb && cb();
					});
				}
			}
			//一次once绑定的委托
			if(handel["__oncetime__"]){
				this.off(path, "__oncetime__");
			}
		}
	}
}

/**
 * 当路由匹配成功后的回调,在beforeRouting后，afterRouting前执行
 * @param path：匹配的路径
 * @param callback: 匹配后执行的回调
 */
reasyRouters.prototype.on = function(path, callback, namespace){
	if(!callback || getType(callback) !== "[object Function]"){
		return;
	}

	let pathHandel = this.pathHandel;
	pathHandel[path] = pathHandel[path] || { __default__: []};
	if(namespace){
		pathHandel[path][namespace] ? (pathHandel[path][namespace].push(callback)) : (pathHandel[path][namespace] = [callback]);
	}else{
		pathHandel[path]["__default__"].push(callback);
	}
}

//删除委托
reasyRouters.prototype.off = function(path, namespace){
	if(this.pathHandel[path]){
		if(namespace){
			delete this.pathHandel[path][namespace];
		}else{
			delete this.pathHandel[path];
		}
	}
}

/**
 * 路由匹配成功后只执行一次的回调,在beforeRouting后，afterRouting前执行
 * @param path：匹配的路径
 * @param callback: 匹配后执行的回调
 */
reasyRouters.prototype.once = function(path, callback){
	this.on(path, callback, "__oncetime__");
}

//获取对象类型
let getType =  obj => Object.prototype.toString.call(obj);

//时间绑定
let addEvent = (elem, type, callback) => {
	if(elem.addEventListener){
		elem.addEventListener(type, callback, false);
	}else if(elem.attachEvent){
		elem.attachEvent('on' + type, callback)
	} 
} 

//ajax
let ajaxRequest = (url, method, data, callback) => {  
	let xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
	}else{
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
    }  
	if(method === 'POST'){
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	}

	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			callback(xmlhttp.responseText, xmlhttp.status);
		}
	}
	
	xmlhttp.open(method, url, true);
	xmlhttp.send(data);
} 

export default reasyRouters;