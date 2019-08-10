// 编译器 解析html  创建monitor
import Monitor from './monitor';

class Compiler {
    constructor(el, vm) {
        this.el = this._query(el);
        this.vm = vm;
        this.el.appendChild(this._compile(this.el));
    }

    _query(selector) {
        if (typeof selector === 'string') {
            return document.querySelector(selector);
        }
        if (selector instanceof document.documentElement) {
            return;
        }

        return selector;
    }

    _compile(el) {
        let child,
            self = this,
            tempEl = document.createDocumentFragment();

        while (child = el.firstChild) {
            switch (child.nodeType) {
                case 1: // element
                    if (/input|textarea/i.test(child.tagName)) {
                        // 绑定
                        let attrs = child.attributes;
                        if (attrs['v-model']) {
                            let command = attrs['v-model'].nodeValue;
                            new Monitor(child, command, self.vm);
                            child.addEventListener('input', function(e) {
                                self.vm[command] = e.target.value;
                            });
                        }
                    } else {
                        child.appendChild(this._compile(child));
                    }
                    break;
                case 3: //textNode
                    if (child.nodeValue.replace(/\s/g, '') === '') {
                        break;
                    }
                    child = this._compileText(child);
                    break;
                default:
                    console.log('default');
            }
            tempEl.appendChild(child);
        }
        return tempEl;
    }

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

                tempNode.appendChild(document.createTextNode(text.slice(0, index)));
                let commandNode = document.createTextNode(commandNoEmpty);
                tempNode.appendChild(commandNode);
                new Monitor(commandNode, commandNoEmpty, this.vm);
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