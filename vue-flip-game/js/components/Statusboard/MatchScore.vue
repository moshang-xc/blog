//当前游戏得分
<template>
	<div class="info">
		<span>SCORE</span>
		<h4 class="num-bold">{{duration}}</h4>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		computed:{
			...mapGetters([
				"duration"
			])
		}
	}
</script>

<style scoped>
	.info{
		height: 100%;
		width: 45%;
		margin: 0 0 0 5%;
		padding: 6px 10px;
		background-color: #bbada0;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		color: #e8ddce;
		font-size: 14px;
		font-weight: bold;
		flex-grow: 1;
	}

</style>