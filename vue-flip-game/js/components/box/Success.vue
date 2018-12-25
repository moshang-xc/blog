<template>
	<div class="mess-wrap" :class="{done: success}">
        <i class="mess icon-done">
        </i>
        <button type="button" class="btn" @click="reset">TRY AGAIN</button>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import { STATUS } from '../../vuex/store/statusEnum';

    export default{
    	computed:{
    	    ...mapGetters([
    	        "status"
    	    ]),
    	    success:function(){
    	        return this.status === STATUS.SUCCESS;
    	    }
    	},
    	methods:{
    	    ...mapActions([
    	        "reset"
    	    ])
    	}
    }

</script>

<style scoped>
	.mess-wrap{
        background-color: rgba(0, 0, 0, .1);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: all .3s;
        visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    	flex-direction: column;
    }

    .mess{
        font-size: 100px;
        padding: 15px;
        border-radius: 50%;
        color: #fff;
        background-color: rgba(237, 153, 91, 0.88);
        box-shadow: 0 0 80px rgba(237, 153, 91, 0.88);
        transform: scale(0);
        transition: all .5s;
    }

    .btn{
    	padding: 8px 12px;
	    border-radius: 4px;
	    font-size: 18px;
	    margin-top: 12px;
	    border: 0;
        background-color: rgba(237, 153, 91, 0.88);
        box-shadow: 0 0 20px rgba(237, 153, 91, 0.88);
	    font-weight: bold;
	    color: #fff;
        transform: scale(0);
        transition: all .5s;
    }

    .mess-wrap.done{
        opacity: 1;
        visibility: visible;
    }

    .done .mess, .done .btn{
        transform: scale(1);
    }
</style>