//游戏进行状态
<template>
	<div class="info">
		LEFT: <span>{{leftCount}}</span>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		computed:{
			...mapGetters([
				"leftCount"
			])
		}
	}
</script>

<style scoped>
	.info{
		height: 100%;
		width: 45%;
		margin: 0 0 0 5%;
		background-color: #ed995b;
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		flex-grow: 1;
		color: #fff;
	}

	.info span {
		padding-left: .5em;
		font-weight: bold;
	}

</style>