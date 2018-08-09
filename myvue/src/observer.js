// 观察者
import Publish from "./publishSub";
class Observer {
    constructor(data, vm) {
        this.data = data;
        this.bind();
    }

    _bind() {
        Object.keys(this.data).forEach(key => {
            let val = this.data[key],
                pub = new Publish();
            Object.defineProperty(this.data, key, {
                get() {
                    pub.subscribe( /*当前监听对象 */ );
                    return val;
                },
                set(newVal) {
                    if (newVal === val) {
                        return;
                    }
                    val = newVal;
                    pub.emit();
                }
            });
        });
    }
}

export default Observer;