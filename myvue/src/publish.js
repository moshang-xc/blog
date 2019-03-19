// 发布订阅模式
class Publish {
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

Publish.target = null;

export default Publish;