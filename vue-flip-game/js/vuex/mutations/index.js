export default{
	//游戏时间递增
	addDuration(state){
		state.duration ++;
	},
	//改变游戏状态
	changeStatus(state, status){
		state.status = status;
	},
	//重置所有参数
	reset(state, newState){
		state.duration = newState.duration;
		state.leftCount = newState.leftCount;
		state.highScore = newState.highScore;
		state.status = newState.status;
		state.cards = newState.cards;
	},
	
	flopCard(state, card){
		var curCard = state.cards.find(c => c === card);
		curCard.flopped = !curCard.flopped;
	},
	flopCards(state, cards){
		state.cards
		    .filter(cc => cards.indexOf(cc) >= 0)
		    .forEach(cc => {
		        cc.flopped = !cc.flopped;
		    });
	},
	changeStatus(state, status){
		state.status = status;
	},
	changeLeftCount(state){
		state.leftCount--;
	},
	updateHighScore(state){
		let score = localStorage.getItem("highScore"),
		highScore = state.duration;

		if(score){
			if(score > highScore){
				localStorage.setItem("highScore", highScore);
				state.highScore = highScore;
			}
		}else{
			localStorage.setItem("highScore", highScore);
		}
	}
}