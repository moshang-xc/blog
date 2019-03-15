<template>
	<transition name="fade">
	    <v-elem class="dialog" v-if="dialog.show">
	    	<div class="overlay" @click="dialog.show = false;"></div>
	    	<div class="dialog-container" :class="dialog.css">
	    		<div class="dialog-content">
	    			<div class="dialog-title">
	    				<span>{{dialog.title}}</span>
						<span class="dialog-close" @click="handlerCancel()">&times;</span>
	    			</div>
					<div class="content">
						<slot></slot>
					</div>
					<v-buttons :dataKey="dialog.dataKey"></v-buttons>
				</div>
			</div>
	    </v-elem>
    </transition>
</template>

<script>
	let defaluts = {
	    required: false,
	    css: "", //样式
	    title: "",
	    show: true, //是否显示
	    ignore: true, //是否忽略
	    buttons:[{
			text: "确定",
			css: "btn-primary"
		},{
			text: "取消",

		}]
	};

	export default {
		name: "v-dialog",
		props:["dialog"],
    	data(){
            return{

            };
        },
        created() {
        	let _this = this;

        	//TODO: 数据转换
    		this.dialog = this.setOptions(this.dialog, defaluts);
    		this.dialog.dataKey = {
    			buttons: this.dialog.buttons,
    			textAlign: this.dialog.textAlign
    		};

    		//定义点击事件
    		this.dialog.dataKey.buttons.forEach(function(btn) {
    			btn.callback = btn.callback || function() {};
    			btn.clickCallBack = function() {
    				let errMsg = btn.callback();
    				if(errMsg !== false) {
    					_this.handlerCancel();
    				}
    			};
    		});
        },
        mounted(){

        },
        methods: {
        	handlerCancel() {
        		this.dialog.show = false;
        	}
        }
    };
</script>

<style lang="scss">


</style>