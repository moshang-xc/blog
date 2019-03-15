import Vue from 'vue';
//环境变量控制请求接口
var baseUrl = PROXY_HTTP_HOST || "";

let Http = function() {
	this.get = function(url, callback) {
		if(url.indexOf("/") != 0) {
			url = "/" + url;
		}
		Vue.http({
			url: baseUrl + url,
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			timeout: 60000,
			//params: {a:1, b:2}
		}).then(function(res){
			callback(res.data);

		},function(res){
			//alert(res.status)
		});
	};
	this.post = function(url, data, callback) {
		if(url.indexOf("/") != 0) {
			url = "/" + url;
		}
		Vue.http({
			url: baseUrl + url,
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
			timeout: 60000,
			body: data,
			//emulateJSON: true  是否为application/x-www-form-urlencoded
		}).then(function(res){
			callback(res.data);

		},function(res){
			//alert(res.status)
		});
	};
};

let http = new Http();
export {
	http
};
