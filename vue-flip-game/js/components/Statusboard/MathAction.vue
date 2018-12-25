//游戏操作，点击进行游戏状态的切换
<template>
	<div class="info" @click.prevent.stop="doAction">{{statusText}}</div>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex';
	import {STATUS} from '../../vuex/store/statusEnum.js';

	export default{
		computed:{
			statusText:function(){
				switch(this.status){
					case STATUS.READY:{
						return "READY";
					}break;
					case STATUS.PLAYING:{
						return "PLAYING";
					}break;
					case STATUS.SUCCESS:{
						return "SUCCESS";
					}break;
					case STATUS.PAUSE:{
						return "PAUSE";
					}break;
				}
			},
			...mapGetters([
				'status'
			])
		},
		methods:{
			...mapActions([
				'changeStatus',
				'reset'
			]),
			doAction(){
				switch(this.status){
					case STATUS.READY:{
						this.changeStatus(STATUS.PLAYING);
					}break;
					case STATUS.PLAYING:{
						this.changeStatus(STATUS.PAUSE);
					}break;
					case STATUS.PAUSE:{
						this.changeStatus(STATUS.PLAYING);
					}break;
					case STATUS.SUCCESS:{
						this.reset();
						this.changeStatus(STATUS.READY);
					}break;
				}
			}
		}
	}
</script>

<style scoped>
	.info{
		height: 100%;
		width: 45%;
		margin: 0 0 0 2.5%;
		background-color: #ed995b;
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 14px;
		flex-grow: 1;
	}

</style>