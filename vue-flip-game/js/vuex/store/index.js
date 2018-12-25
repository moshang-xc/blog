import Vue from 'vue';
import Vuex from 'vuex';

import getters from '../getters';
import actions from '../actions';
import mutations from '../mutations';

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		duration: 0, //持续时间
		leftCount:0, //未完成卡片数
		highScore:0,//最高分
		status:"", //当前游戏状态
		cards:[]
	},
    actions,
    mutations,
    getters
})