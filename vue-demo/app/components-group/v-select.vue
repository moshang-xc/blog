<template>
    <div class="form-group" :class="dataKey.css" v-show="dataKey.show">
        <label class="form-title" v-if="dataKey.title">{{dataKey.title}}</label>
        <div class="form-content">
            <div class="form-select">
                <div @click.stop="dropdownShow = !dropdownShow">
                    <input readonly="true" type="text" class="text form-input" v-model="selectLabel"
                        :disabled="dataKey.disabled">
                    <div class="select-arrow" :class="dropdownShow ? 'arrow-up' : 'arrow-down'">
                        <div class="select-arrow-icon icon-arrrow-down"></div>
                    </div>
                </div>
                <transition>
                    <ul class="select-dropdown" v-if="dropdownShow && !dataKey.disabled">
                        <template v-for="item in dataKey.options">
                            <li :value="item.value" class="select-li" :class="{'active': dataKey.key == item.value, 'disabled': item.disabled}" @click.stop="changeSelect(item.value, item.label)">{{item.label}}</li>
                        </template>
                    </ul>
                </transition>
            </div>
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
    options: [],
    description: "", //描述
    changeCallBack: function() {}
};

export default {
    name: "v-select",
    props: ["dataKey"],
    created() {
        this.dataKey = this.setOptions(this.dataKey, defaults);
    },
    data() {
        return {
            error: "",
            dropdownShow: false,
            selectLabel: ""
        };
    },
    mounted() {
        //定义body click事件
        this.globalClick(this.hide);
    },
    methods: {
        changeSelect(value, label) {
            this.dropdownShow = false;
            if(value === this.dataKey.key) {
                return;
            }
            this.dataKey.key = value;
            this.selectLabel = label;
            this.dropdownShow = false;
            this.dataKey.changeCallBack(value);
        },
        hide() {
            this.dropdownShow = false;
        }
    }
};
</script>

<style lang="scss">
    .form-select {
        width: 150px;
        cursor: pointer;
        position: relative;
        .select-arrow {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 20px;
            text-align: center;
            transition: all .3s;
            .select-arrow-icon {
                height: 100%;
                line-height: $form-line-height;
                font-size: 1.6rem;
            }
        }
        .arrow-up {
            transform: rotateZ(180deg);
            transition: all .3s;
        }
        .text {
            cursor: pointer;
            padding-right: 20px;
        }
        .select-dropdown {
            position: absolute;
            width: 100%;
            list-style: none;
            border: solid 1px #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            margin: 5px 0;
            z-index: 99;
            .select-li {
                padding: 6px;
                line-height: 1;
                &:hover {
                    background: #ddd;
                }
            }
        }
    }
</style>