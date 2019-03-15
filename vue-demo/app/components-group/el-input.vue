<template>
    <div class="form-input">
        <input :type="dataKey.type == 'password' ? 'password' : 'text'"
            :maxlength="dataKey.maxlength"
            :placeholder="dataKey.placeholder"
            :disabled="dataKey.disabled"
            class="text form-input" :class="{'text-password':dataKey.hasEye}"
            v-on:input="changeValue()"
            v-model="dataKey.key" ref="input">

        <div class="placeholder-text" v-if="!supportPlaceholder && !dataKey.key">{{dataKey.placeholder}}</div>
        <div v-if="dataKey.hasEye"
            :class="dataKey.type == 'password'? 'icon-eye-close': 'icon-eye-open'"
            @click="changePlaceHolder()">
        </div>
        <div class="error-bottom text-error" v-if="dataKey.error">{{dataKey.error}}</div>
    </div>

</template>

<script>

let defaluts = {
    required: false,
    css: "", //样式
    show: true, //是否显示
    ignore: false, //是否忽略
    disabled: false, //是否禁用
    key: "", //组件id
    error: ""   //错误标志
};
export default {
    name: "el-input",
    props: ["dataKey"],
    created(){
        //TODO: 数据转换
    	this.dataKey = this.setOptions(this.dataKey, defaluts);

    },

    mounted() {

    },
    data() {
        return {
            supportPlaceholder: this.hasPlaceholder()
        };

    },

    methods: {
        changePlaceHolder() {
            if(this.dataKey.type == "password") {
                this.dataKey.type = "text";
            } else {
                this.dataKey.type = "password";
            }
        },

        changeValue() {
            var newVal = this.dataKey.key,
                checkSuccess = this.checkData(this.dataKey);
            if (checkSuccess) {
                this.dataKey.changeCallback && this.dataKey.changeCallback(newVal);
            }
        },
        hasPlaceholder() {
            var i = document.createElement('input');
            return 'placeholder' in i;
        }
    },
    destroyed() {
        console.log(this.dataKey.key);
    }
}
</script>

<style lang="scss">
    .form-input {
        position: relative;
        display: inline-block;
    }
    .text {
        line-height: $form-line-height - 2px;
        height: $form-line-height - 2px;
        border: 1px solid #ddd;
        width: 100%;
        padding: $input-padding;
    }
    .placeholder-text {
        position: absolute;
        top: 0;
        color: #999;
        padding: $input-padding;
    }
    .icon-eye-close {
        display: inline-block;
        position: absolute;
        right: 0;
        top: 8px;
        font-size: 12px;
        transform: scale(.8);
    }

    .icon-eye-open {
        display: inline-block;
        position: absolute;
        right: 0;
        top: 8px;
        font-size: 14px;
        transform: scale(.8);
    }
    .error-group {
        position: relative;
        .error-bottom {
            position: absolute;

        }
    }

</style>