<template>
    <div class="form-el-content">
        <template v-for="item in dataKey.sortArray">
            <label class="form-radio" @click.stop="changeRadio(item.value)">
                <span class="raido-item"
                    :class='dataKey.key === item.value ? "icon-radio-checked" : "icon-radio-unchecked"'
                    v-model="dataKey.key"
                    :value="item.value" >
                </span>
                <span class="radio-text">{{item.title}}</span>
            </label>
        </template>
    </div>
</template>

<script>

let defaults = {
    required: true,
    css: "", //样式
    show: true, //是否显示
    ignore: false, //是否忽略
    disabled: false, //是否禁用
    key: "", //组件id
    options: {},
    description: "", //描述
    changeCallBack: function() {}
};

export default {
    name: "v-radio",
    props: ["dataKey"],
    created() {
        this.dataKey = this.setOptions(this.dataKey, defaults);

        if(!Array.isArray(this.dataKey.sortArray)) {
            this.$set(this.dataKey, 'sortArray', []);
        }

        //sortArray为空时，默认以dataKey.options 对象属性排序
        if(this.dataKey.sortArray.length === 0) {
            for(let prop in this.dataKey.options) {
                this.dataKey.sortArray.push({
                    title: this.dataKey.options[prop],
                    value: prop
                });
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