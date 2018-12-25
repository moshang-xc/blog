import {STATUS} from '../store/statusEnum.js';
import {mixArray} from '../../lib/mixArray.js';

// const cardNames = ['8-ball', 'kronos', 'baked-potato', 'dinosaur', 'rocket', 'skinny-unicorn',
//     'that-guy', 'zeppelin'];

const cardNames = ['icon-twitter', 'icon-baidu', 'icon-github', 'icon-sina', 'icon-zhifubao', 'icon-apple', 'icon-taobao', 'icon-wechat']

let timeout;

function clearTimeout(){
	timeout && clearInterval(timeout);
	timeout = null;
}

export default {
	addDuration({commit}){
		commit("addDuration");
	},
	changeStatus({commit}, status){
		commit("changeStatus", status);

		switch(status){
			case STATUS.PLAYING:{
				timeout = setInterval(() => {
					commit("addDuration");
				}, 1000);
			}break;
			case STATUS.SUCCESS:{
				clearTimeout();
				commit("updateHighScore");
			}break;
			case STATUS.PAUSE:{
				clearTimeout();
			}break;
		}
	},
	reset({commit}){
		let newState = {
			leftCount: cardNames.length,
	        highScore: localStorage.getItem("highScore") || 999,
	        status: STATUS.READY,
	        cards: mixArray(cardNames.concat(cardNames)).map(name => ({cardName:name, flopped:false})),
	        duration: 0
		}

		commit("reset", newState);
		clearTimeout();
	},
	flopCard({commit}, card){
		commit("flopCard", card);
	},
	flopCards({commit}, cards){
		commit("flopCards", cards);
	},
	changeLeftCount({commit}){
		commit("changeLeftCount");
	},
	updateHighScore({commit}, highScore){
		commit("updateHighScore", highScore);
	}
}


