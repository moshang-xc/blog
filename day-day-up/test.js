function myNew() {
    let obj = {},
        Constructor = Array.prototype.shift.call(arguments);

    obj.__proto__ = Constructor.prototype;
    let res = Constructor.apply(obj, arguments);
    return typeof res === 'object' ? res : obj;
}