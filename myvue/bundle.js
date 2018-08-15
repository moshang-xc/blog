/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Publish);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_vue__ = __webpack_require__(2);


let vue = new __WEBPACK_IMPORTED_MODULE_0__src_vue__["a" /* default */]({
    el: '#app',
    data: {
        message: 'vue双向绑定实例',
        name: ''
    }
});

window.vue = vue;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compiler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observer__ = __webpack_require__(5);



class Vue {
    constructor(option) {
        this.$option = option || {};
        this._data = this.$option.data;
        this.$el = option.el;
        this.vm = this;

        this._proxy();
        new __WEBPACK_IMPORTED_MODULE_1__observer__["a" /* default */](this._data);
        new __WEBPACK_IMPORTED_MODULE_0__compiler__["a" /* default */](this.$el, this.vm);


    }

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

/* harmony default export */ __webpack_exports__["a"] = (Vue);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__monitor__ = __webpack_require__(4);
// 编译器 解析html  创建monitor


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
                            new __WEBPACK_IMPORTED_MODULE_0__monitor__["a" /* default */](child, command, self.vm);
                            child.addEventListener('input', function(e) {
                                self.vm[command] = e.target.value;
                            });
                        }
                    } else {
                        // 处理文本内容
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
                new __WEBPACK_IMPORTED_MODULE_0__monitor__["a" /* default */](commandNode, commandNoEmpty, this.vm);
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

/* harmony default export */ __webpack_exports__["a"] = (Compiler);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__publish__ = __webpack_require__(0);
// 监听者

class Monitor {
    constructor(node, field, vm) {
        this.node = node;
        this.field = field;
        this.vm = vm;
        __WEBPACK_IMPORTED_MODULE_0__publish__["a" /* default */].target = this;
        // 首次加载也需要进行赋值操作
        this.update();
        __WEBPACK_IMPORTED_MODULE_0__publish__["a" /* default */].target = null;
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

/* harmony default export */ __webpack_exports__["a"] = (Monitor);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__publish__ = __webpack_require__(0);
// 观察者

class Observer {
    constructor(data) {
        this.data = data;
        // 观察监听data中的数据字段，当数据发生改变时，通知订阅者
        this._bind();
    }

    _bind() {
        Object.keys(this.data).forEach(key => {
            let val = this.data[key],
                pub = new __WEBPACK_IMPORTED_MODULE_0__publish__["a" /* default */]();
            Object.defineProperty(this.data, key, {
                get() {
                    if (__WEBPACK_IMPORTED_MODULE_0__publish__["a" /* default */].target) {
                        pub.subscribe(__WEBPACK_IMPORTED_MODULE_0__publish__["a" /* default */].target);
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

/* harmony default export */ __webpack_exports__["a"] = (Observer);

/***/ })
/******/ ]);