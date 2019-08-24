// 监听者
import Publish from './publish';
class Monitor {
    constructor(node, field, vm) {
        this.node = node;
        this.field = field;
        this.vm = vm;
        Publish.target = this;
        // 首次加载也需要进行赋值操作
        console.log('monitor');
        this.update();
        Publish.target = null;
    }

    update() {
        let val = this.vm[this.field];
        switch (this.node.nodeType) {
            case 1:
                if (/input|textarea/i.test(this.node.tagName)) {
                    this.node.value = val;
                } else {
                    this.node.innerText = val;
                }
                break;
            case 3:
                this.node.nodeValue = val;
                break;
        }
    }
}

export default Monitor;