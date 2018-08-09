// 监听者
class Monitor {
    constructor(node, field, vm) {
        this.node = node;
        this.field = field;
        this.vm = vm;
        // 首次加载也需要进行赋值操作
        this.update();
    }

    update() {
        this.node.nodeValue = this.vm[this.field];
    }
}

export default Monitor;