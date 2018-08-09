// 发布订阅模式
class Publish {
    static target = null;
    constructor() {
        this.list = [];
    }
    subscribe(target) {
        this.list.push(target);
    }
    emit() {
        this.list.forEach(monitor => {
            monitor.update && monitor.update();
        });
    }
}

export default Publish;