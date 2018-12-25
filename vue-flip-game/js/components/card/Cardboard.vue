<template>
	<div class="cards">
		<Card v-for="(card, index) in cards" :option="card" :key="index" @flopped="onFlopped"></Card>    
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import Card from './Card.vue';
	import {STATUS} from '../../vuex/store/statusEnum.js';

	// let timeout;

	export default {
		data(){
			return {
				lastCard:null
			}
		},
		computed:{
			...mapGetters([
				"cards",
				"status",
				"leftCount"
			])
		},
		methods:{
			...mapActions([
				"flopCard",
				"flopCards",
				"changeStatus",
				"changeLeftCount",
				"addDuration"
			]),
			onFlopped(card){
				if(!card){
					return;
				}
				if(this.status === STATUS.READY || this.status === STATUS.PAUSE){
					this.changeStatus(STATUS.PLAYING);
				}

				if(this.lastCard){
					if(this.lastCard !== card && this.lastCard.cardName === card.cardName){
						this.lastCard = null;
						this.changeLeftCount();
						if(this.leftCount <= 0){
							this.changeStatus(STATUS.SUCCESS);

						}
					}else{
						let lastCard = this.lastCard;
						setTimeout(() => {
							this.flopCards([lastCard, card]);
						}, 1000);
						
						this.lastCard = null;
					}
				}else{
					this.lastCard = card;
				}
			}
		},
		components:{Card}
	}
</script>

<style scoped>
	.cards{
		margin: 10px 0;
	    width: 100%;
	    background-color: #eee4da;
	    height: 530px;
	    border-radius: 4px;
	    padding: 10px 1px;
	    display: flex;
	    flex-wrap: wrap;
	    justify-content: center;
	    align-items: center;
	    align-content: space-around;
	}
</style>