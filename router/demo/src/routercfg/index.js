import $ from 'jquery';

let $nav;

export default {
	target: document.getElementById('content'),
	defaultPage: 'sysinfo', //起始页
	routers:{ 
		'sysinfo':{ 
			path:'/sysinfo', //若path的值与sysinfo相同可以不填,可以配置有参数的路径例如：/sysinfo/:id/:type两个参数
			template: '/pages/sysInfo.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					//按需加载js文件和html文件
					callback && (callback.call(null, require('../modules/sysStatus/sysInfo.js')));
				}, 'sysInfo');
			},
			callback:null //切换路由后的回调，与reasyRouters.on是同一作用
		},
		'wanset':{
			template: '/pages/wanSet.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/netWork/wanSet.js')));
				}, 'wanSet');
			},
			callback:null 
		},
		'qosManage':{
			template: '/pages/qosManage.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/qos/qosManage.js')));
				}, 'qosManage');
			},
			callback:null 
		},
		'wirelessName':{
			template: '/pages/wirelessName.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/wireless/wirelessName.js')));
				}, 'wirelessName');
			},
			callback:null 
		},
		'wirelessAccess':{
			template: '/pages/wirelessAccess.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/wireless/wirelessAccess.js')));
				}, 'wirelessAccess');
			},
			callback:null 
		},
		'wirelessAdv':{
			template: '/pages/wirelessAdv.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/wireless/wirelessAdv.js')));
				}, 'wirelessAdv');
			},
			callback:null 
		},
		'staticIP':{
			template: '/pages/staticIP.html',
			controller: (callback) => {
				require.ensure([], (require) => {
					callback && (callback.call(null, require('../modules/staticIP/staticIP.js')));
				}, 'staticIP');
			},
			callback:null 
		}
	},
	beforeRouting: (curPath) => {
		if(curPath && curPath.path){
			$nav = $nav || $('#nav-wrapper');
			$nav.find('.active').removeClass('active');
			let $a = $nav.find('a.item-text[href=#' + curPath.path + ']');
			//导航切换
			let $li = $a.parent().addClass('active').closest('li.nav-group').addClass('active');
			let $ul = $a.closest('ul.item-wrapper');
			if(!$li.hasClass('singel') && !$ul.is('visible')){
				$ul.slideDown();
			}
		}
    }
}