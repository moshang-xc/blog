//历史最好成绩
<template>
	<div class="score">
		<span>BEST </span>
		<span class="num-bold">{{highScore}}</span>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';

	export default {
		computed:{
			...mapGetters([
				"highScore"
			])
		}
	}
</script>

<style scoped>
	.score{
		height: 100%;
		width: 45%;
		margin: 0 0 0 2.5%;
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