import { checkSubmit, checkData, setOptions, formMessage } from '@/libs/common';
import { http } from "@/http/index";
import msgboxVue from '@/components/MessageBox';


exports.install = function(Vue, options) {
    Vue.prototype.checkSubmit = checkSubmit;
    Vue.prototype.checkData = checkData;
    Vue.prototype.setOptions = setOptions;
    // 定义全局点击函数
    Vue.prototype.globalClick = function(callback) {
        document.body.onclick = function() {
            callback();
        };
    };
    //提示信息
    Vue.prototype.$message = function(msg, time) {
        //let formMessage = new FormMessage();
        formMessage.setMsg(msg, time);
    };

    //请求接口
    Vue.prototype.$getData = http.get;
    Vue.prototype.$post = http.post;

    const MessageBoxInstance = Vue.extend(msgboxVue);
    let currentMsg;
    const initInstance = () => {
        // 实例化vue实例
        currentMsg = new MessageBoxInstance();
        let msgBoxEl = currentMsg.$mount().$el;
        document.body.appendChild(msgBoxEl);
    };
    // 在Vue的原型上添加实例方法，以全局调用
    Vue.prototype.$confirm = function(msgOptions) {

        if (!currentMsg) {
            initInstance();
        }
        if (typeof msgOptions === 'string') {
            currentMsg.content = msgOptions;
        } else if (typeof msgOptions === 'object') {
            Object.assign(currentMsg, msgOptions);
        }
        return currentMsg.showMsgBox()
            .then(val => {
                currentMsg = null;
                return Promise.resolve(val);
            })
            .catch(err => {
                currentMsg = null;
                return Promise.reject(err);
            });
    };

    Vue.prototype.$alert = function(msgOptions) {
    	if (!currentMsg) {
            initInstance();
        }
        currentMsg.hasCancel = false;
    	if (typeof msgOptions === 'string') {
            currentMsg.content = msgOptions;
        } else if (typeof msgOptions === 'object') {
            Object.assign(currentMsg, msgOptions);
        }
        return currentMsg.showMsgBox()
            .then(val => {
                currentMsg = null;
                return Promise.resolve(val);
            })
            .catch(err => {
                currentMsg = null;
                return Promise.reject(err);
            });
    };
};