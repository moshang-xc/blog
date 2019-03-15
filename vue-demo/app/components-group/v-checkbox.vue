<template>
    <div class="form-group" :class="dataKey.css" v-show="dataKey.show">
        <label class="form-title" v-if="dataKey.title">{{dataKey.title}}</label>
        <div class="form-content">
            <template v-if="this.dataKey.sortArray.length > 1">
                <template v-for="(value, index) in dataKey.sortArray">
                    <input type="checkbox"
                        ref="v-checkbox"
                        :value="value"
                        v-show="false"
                        :checked="getChecked(value, index)">
                    <label class="form-checkbox" @click.stop="changeCheckbox(index)" :data-index="index">
                        <span class="checkbox-item"
                            :class='getChecked(value, index) ? "icon-checkbox-checked" : "icon-checkbox-unchecked"'>
                        </span>
                        <span class="checkbox-text">{{dataKey.options[value]}}</span>
                    </label>
                </template>
            </template>
            <template v-else>
                <label class="form-checkbox" @click.stop="changeCheckbox()">
                    <input type="checkbox"
                        class="none"
                        ref="v-checkbox"
                        v-show="false"
                        :checked="getChecked()">
                    <span class="checkbox-item"
                        :class='getChecked() ? "icon-checkbox-checked" : "icon-checkbox-unchecked"'>
                    </span>
                    <span class="checkbox-text">{{dataKey.label}}</span>
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
    groups: false, //是否组checkbox
    options: {},
    values: [true, false], //选中和不选中 默认用options的数据
    sortArray: [],
    label: "", //
    changeCallBack: function() {}
};

export default {
    name: "v-checkbox",
    props: ["dataKey"],
    created() {
        this.dataKey = this.setOptions(this.dataKey, defaults);

        //sortArray为空时，默认以dataKey.options 对象属性排序
        if(this.dataKey.sortArray.length === 0) {
            for(let prop in this.dataKey.options) {
                this.dataKey.sortArray.push(prop);
            }
        }
        if(this.dataKey.sortArray.length <= 1) {
            this.dataKey.groups = false;
        } else {
            this.dataKey.groups = true;
        }
    },
    data() {
        return {
            error: ""
        };
    },
    methods: {
        changeCheckbox(index) {
            var valArr = [],
                _this = this;

            if(!this.dataKey.groups) {
                this.$refs["v-checkbox"].checked = !this.$refs["v-checkbox"].checked;
                this.dataKey.key = this.$refs["v-checkbox"].checked ? this.dataKey.values[0] : this.dataKey.values[1];
            } else {
                this.$refs["v-checkbox"][index].checked = !this.$refs["v-checkbox"][index].checked;
                this.$refs["v-checkbox"].forEach(function(item) {
                    if(item.checked) {
                        valArr.push(item.value);
                    }
                });
                this.dataKey.key = valArr;
            }
        },
        getChecked(value, index) {
            if(!this.dataKey.groups) {
                if(this.dataKey.key === this.dataKey.values[0]) {
                    return true;
                }
                return false;
            }

            if(!Array.isArray(this.dataKey.key)) {
                return false;
            }

            return this.dataKey.key.indexOf(value) !== -1;

        }
    },
    watch: {
        'dataKey.key': {
            handler(newValue, oldValue) {
                this.dataKey.changeCallBack && this.dataKey.changeCallBack(newValue);
            },
            //立即执行
            immediate: true
        }
    }

};
</script>

<style lang="scss">
    .form-checkbox {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        .checkbox-item {
            vertical-align: middle;
            margin-right: 4px;
            font-size: 2.4rem;
            color: $main-active-color;
        }
        .checkbox-text {
            display: inline-block;
            vertical-align: middle;
        }

    }
</style>