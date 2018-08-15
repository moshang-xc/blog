import Vue from './src/vue';

let vue = new Vue({
    el: '#app',
    data: {
        message: 'vue双向绑定实例',
        name: ''
    }
});

window.vue = vue;