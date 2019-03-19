import Compiler from './compiler';
import Observer from './observer';

class Vue {
    constructor(option) {
        this.$option = option || {};
        this._data = this.$option.data;
        this.$el = option.el;
        this.vm = this;
        // 代理this.$option.data
        this._proxy();
        // 开启数据观察，通过发布订阅模式，当数据发生改变时通知订阅者，更新Dom
        new Observer(this._data);
        // 解析html模版，提取指令，事件绑定等操作
        new Compiler(this.$el, this.vm);
    }

    /**
    * data代理，通过this.vm实例可以直接访问this.$option.data数据
    * this.vm['message']
    */
    _proxy() {
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return this._data[key];
                },
                set(val) {
                    if (this._data[key] !== val) {
                        this._data[key] = val;
                    }
                }
            })
        })
    }
}

export default Vue;