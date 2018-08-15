// 观察者
import Publish from "./publish";
class Observer {
    constructor(data) {
        this.data = data;
        // 观察监听data中的数据字段，当数据发生改变时，通知订阅者
        this._bind();
    }

    _bind() {
        Object.keys(this.data).forEach(key => {
            let val = this.data[key],
                pub = new Publish();
            Object.defineProperty(this.data, key, {
                get() {
                    if (Publish.target) {
                        pub.subscribe(Publish.target);
                    }
                    return val;
                },
                set(newVal) {
                    if (newVal === val) {
                        return;
                    }
                    val = newVal;
                    // 通知订阅者
                    pub.emit();
                }
            });
        });
    }
}

export default Observer;