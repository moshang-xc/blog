import Vue from 'vue';
import {
    escapeText
} from '@/libs/utils';
let directiveConfig = {
    // 注册一个局部的自定义指令 v-focus
    focus: {
        // 指令的定义
        inserted: function (el) {
            // 聚焦元素
            el.focus();
        }
    }
};

for (let Vname in directiveConfig) {
    Vue.directive(Vname, directiveConfig[Vname]);
}


//过滤器
Vue.filter('upperCase', function (value) {
    if (!value) return '';
    value = value.toUpperCase();
    return value;
});

Vue.filter('escapeHtml', function (value) {
    if (!value) return '';
    return value;
});