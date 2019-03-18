import Compiler from './compiler';
import Observer from './observer';

class Vue{
    constructor(option){
        this.$option = option || {};
        this._data = option.data;
        this.$el = option.el;
        this.vm = this;

        this._proxy();
        new Compiler(this.$el, this.vm);
        new Observer(this._data);
    }

    _proxy(){
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(this, key, {
                get(){
                    return this._data[key];
                }
                set(val){
                    if(this._data[key] !== val){
                        this._data[key] = val;
                    }
                }
            })
        })
    }
}

export default Vue;