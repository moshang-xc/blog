<template>
	<div class="header">
		<div class="header-left">
			<Logo></Logo>
		</div>
		<div class="header-right">
			<div class="right-top">
				<MatchScore></MatchScore>
				<BestScore></BestScore>
			</div>
			<div class="right-bottom">
				<MatchInfo></MatchInfo>
				<MatchAction></MatchAction>
			</div>
		</div>
		
	</div>
</template>

<script>
	import Logo from './Logo.vue';
	import MatchInfo from './MatchInfo.vue';
	import BestScore from './BestScore.vue';
	import MatchAction from './MathAction.vue';
	import MatchScore from './MatchScore.vue';

	export default{
		components:{Logo, MatchInfo, BestScore,MatchScore,MatchAction}
	}
</script>

<style scoped>
	.header{
	    height: 110px;
	    width: 100%;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}


	.header-left, .header-right{
		height: 100%;
	}

	.header-right{
	    flex-grow: 1;
	    display: flex;
	    flex-wrap: wrap;
	}

	.right-top{
		width: 100%;
		height: 70%;
		display: flex;
		align-items: center;
		padding-bottom: 6px;
	}
	
	.right-bottom{
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
	}
</style>