<template>
    <div class="form-group" :class="dataKey.css" v-show="dataKey.show">
        <label class="form-title" v-if="dataKey.title">{{dataKey.title}}</label>
        <div class="form-content">
            <template v-for="value in dataKey.sortArray">
                <label class="form-radio" @click.stop="changeRadio(value)">
                    <span class="raido-item" :class='dataKey.key === value ? "icon-radio-checked" : "icon-radio-unchecked"' v-model="dataKey.key" :value="value" >
                    </span>
                    <span class="radio-text">{{dataKey.options[value]}}</span>
                </label>
            </template>
        </div>
    </div>
</template>

<script>

let defaults = {
    required: true,
    css: "", //样式
    show: true, //是否显示
    ignore: false, //是否忽略
    disabled: false, //是否禁用
    title: "", //左侧标题栏
    key: "", //组件id
    options: {},
    sortArray: [],
    description: "", //描述
    changeCallBack: function() {}
};

export default {
    name: "v-radio",
    props: ["dataKey"],
    created() {
        this.dataKey = this.setOptions(this.dataKey, defaults);

        //sortArray为空时，默认以dataKey.options 对象属性排序
        if(this.dataKey.sortArray.length === 0) {
            for(let prop in this.dataKey.options) {
                this.dataKey.sortArray.push(prop);
            }
        }
    },
    data() {
        return {
            error: ""
        };
    },
    methods: {
        changeRadio(value) {
            if(value === this.dataKey.key) {
                return;
            }
            this.dataKey.key = value;
            this.dataKey.changeCallBack(value);
        }
    }

};
</script>

<style lang="scss">
    .form-radio {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        .raido-item {
            vertical-align: middle;
            margin-right: 4px;
            font-size: 1.6rem;
            color: $main-active-color;
        }
        .radio-text {
            display: inline-block;
            vertical-align: middle;
        }
    }
</style>