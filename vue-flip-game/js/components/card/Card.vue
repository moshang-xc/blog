<template>
	<div class="card-wrap" @click="flop">
		<div class="card" :class="{flopped:option.flopped}">
			<!-- <img class="front" v-if="option.cardName === '8-ball'" src="../../../img/8-ball.png"/>
            <img class="front" v-if="option.cardName === 'baked-potato'" src="../../../img/baked-potato.png"/>
            <img class="front" v-if="option.cardName === 'dinosaur'" src="../../../img/dinosaur.png"/>
            <img class="front" v-if="option.cardName === 'kronos'" src="../../../img/kronos.png"/>
            <img class="front" v-if="option.cardName === 'rocket'" src="../../../img/rocket.png"/>
            <img class="front" v-if="option.cardName === 'skinny-unicorn'" src="../../../img/skinny-unicorn.png"/>
            <img class="front" v-if="option.cardName === 'that-guy'" src="../../../img/that-guy.png"/>
            <img class="front" v-if="option.cardName === 'zeppelin'" src="../../../img/zeppelin.png"/>

            <img class="back" src="../../../img/back.png"/> -->
            <i class="front" :class="option.cardName"></i>
            <i class="back"></i>
		</div>

	</div>
</template>

<script>
	import {mapActions} from 'vuex';

	export default {
		props:{
			option:{
	            type: Object,
	            default () {
	                return {
	                    flopped: false,
	                    cardName: ''
	                };
	            }
			}
		},
		methods:{
			...mapActions([
				'flopCard'
			]),
			flop(){
				if(this.option.flopped){
					return;
				}
				this.flopCard(this.option);
				this.$emit("flopped", this.option);
			}
		}
	}
</script>

<style scoped>
	.card-wrap{
        width: 21%;
        height: 84px;
        margin: 1%;
        cursor: pointer;
        flex-grow: 1;
        position: relative;
        perspective: 800px;
	}

	.card {
	    width: 100%;
	    height: 100%;
	    font-size: 46px;
	    color: #776e65;
	    background-color: #fff;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    transition: transform 1s;
	    transform-style: preserve-3d;
	}

	.card.flopped {
	    transform: rotateY( 180deg );
	}

	.card img {
	    display: block;
	    height: 100%;
	    width: 100%;
	    position: absolute;
	    backface-visibility: hidden;
	}

	.card .back {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(135deg, #ccc0b4, #ccc0b4 4px, #eee4da 0, #eee4da 10px);
	    transform: rotateY( 0deg );
	}

	.card .front {    
		background: #fff;
		width: 100%;
		height: 100%;
		color: #fc7c5f;
		transform: rotateY( 180deg );
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>