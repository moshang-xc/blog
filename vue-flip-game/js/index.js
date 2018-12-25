import '../css/main.css';
import '../css/icon-font/style.css';
import Vue from 'vue';
import Flip from './components/Flip';
import store from './vuex/store';

//the main entrance
/* eslint-disable no-new */

new Vue({
	el:'#app',
	render(render){
		return render(Flip);
	},
	store //Vuex 通过store选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）
});
