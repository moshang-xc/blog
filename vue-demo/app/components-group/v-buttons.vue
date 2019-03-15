<template>
    <div class="btn-group" :class="dataKey.css" :style="{'text-align': dataKey.textAlign}" v-show="dataKey.show">
        <template v-for="item in dataKey.buttons">
            <div class="button-item">
                <button class="btn" :class="item.css" @click.stop="clickCallBack(item)">{{item.text}}</button>
            </div>
        </template>
    </div>
</template>

<script>

let defaults = {
    required: false,
    textAlign: 'center',
    css: "", //样式
    show: true, //是否显示
    ignore: true,
    buttons: [/*{
        css: "",
        text: "",
        clickCallBack: function(){}
    }*/]
};

export default {
    name: "v-buttons",
    props: ["dataKey"],
    created() {
        this.dataKey = this.setOptions(this.dataKey, defaults);
    },
    data() {
        return {
            error: ""
        };
    },
    methods: {
        clickCallBack(btnOption) {
            if(typeof btnOption.clickCallBack == "function") {
               btnOption.clickCallBack();
            }
        }
    }

};
</script>

<style lang="scss">
    .btn-group {
        margin-bottom: 15px;
        .button-item {
            display: inline-block;
            & + .button-item {
                margin-left: 20px;
            }
        }
    }
</style>