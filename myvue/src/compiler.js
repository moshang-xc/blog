// 编译器 解析html 
import Monitor from './monitor';

class Compiler {
    constructor(el, vm) {
        this.el = this._query(el);
        this.vm = vm;
        this.el.appendChild(this._compile(this.el));
    }
    /**
     * 查找Dom节点
     */
    _query(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        if (selector instanceof document.documentElement) {
            return;
        }

        return selector;
    }
    /**
     * 解析el的内容
     */
    _compile(el) {
        let child,
            self = this,
            tempEl = document.createDocumentFragment();

        while (child = el.firstChild) {
            switch (child.nodeType) {
                case 1: // element
                    // input, textarea节点v-model处理
                    if (/input|textarea/i.test(child.tagName)) {
                        // 绑定
                        let attrs = child.attributes;
                        if (attrs['v-model']) {
                            let command = attrs['v-model'].nodeValue;
                            // 创建监听者
                            new Monitor(child, command, self.vm);
                            // 事件绑定
                            child.addEventListener('input', function(e) {
                                self.vm[command] = e.target.value;
                            });
                        }
                    } else {
                        // 其它节点，递归子节点
                        child.appendChild(this._compile(child));
                    }
                    break;
                case 3: //textNode
                    if (child.nodeValue.replace(/\s/g, '') === '') {
                        break;
                    }
                    // 解析文本节点提取{{xx}}指令
                    child = this._compileText(child);
                    break;
            }
            // 注意此处是append的操作，将this.el上的child的移除插入documentFragment中，这样while中的child=el.firstChild每次是取新的child元素
            tempEl.appendChild(child);
        }
        return tempEl;
    }
    /**
     * 处理textNode节点，提取{{}}指令，保留其它字符串
     * 通过将nodeValue文本进行拆分成几个不同的textNode节点，达到对{{}}指令的监听效果
     */
    _compileText(child) {
        let text = child.nodeValue,
            tempNode = document.createDocumentFragment(),
            reg = /{{([^({{)(}})]*)}}/;

        if (reg.test(text)) {
            let match = text.match(reg);

            while (match) {
                let index = match.index,
                    command = match[1],
                    commandNoEmpty = command.replace(/(^\s+)|(\s+$)/g, '');

                // 截取{{}}前的字符串，单独生成textNode
                tempNode.appendChild(document.createTextNode(text.slice(0, index)));

                // {{xxx}}生成一个textNode
                let commandNode = document.createTextNode(commandNoEmpty);
                tempNode.appendChild(commandNode);
                new Monitor(commandNode, commandNoEmpty, this.vm);
                
                // 将{{xxx}}后的字符串递归遍历，生成对应的textNode
                text = text.slice(index + command.length + 4);
                match = text.match(reg);
            }
            tempNode.appendChild(document.createTextNode(text));
            child.remove();
            return tempNode;
        }
        return child;
    }
}

export default Compiler;