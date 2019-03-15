<template>
	<transition name="fade">
		<div v-if="alert.show">
			<v-dialog :dialog="alert" >
				<slot></slot>
			</v-dialog>
		</div>
    </transition>
</template>

<script>
	let defaluts = {
	    required: false,
	    css: "", //样式
	    title: "提示",
	    show: false, //是否显示
	    ignore: true //是否忽略
	};

	export default {
		name: "v-alert",
		props:["alert"],
    	data(){
            return{

            };
        },
        created() {
        	let _this = this;
        	this.alert = this.setOptions(this.alert, defaluts);
			this.alert.buttons = [{
				text: "确定",
				css: "btn-primary",
				callback: this.alert.callback
			}];

        },
        methods: {
        	handlerCancel() {
        		this.alert.show = false;
        	}
        }
    };
</script>