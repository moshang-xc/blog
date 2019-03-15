
import { valid } from "@/libs/validate.js";
function checkSubmit(dataObj) {
    var errorMsg = "";
    for (var prop in dataObj) {
        if (typeof dataObj[prop] != "object") {
            continue;
        }
        errorMsg = checkData(dataObj[prop]);
        if (!errorMsg) {
            break;
        }
    }

    if (!errorMsg) {
        return false;
    }
    return true;
}

function checkData(dataKey, value) {
    var val = value || dataKey.key || "",
        errMsg = "",
        handleValid;

    if (dataKey.show === false
        || dataKey.ignore === true
        || dataKey.disabled === true) { //忽略验证时
        return true;
    }

    if (dataKey.required) {
        if (val === "") {
            errMsg = _("This field is required");
        }
    } else { //非必填时 为空则不验证
        if (val === "") {
            dataKey.error = '';
            return true;
        }
    }

    if (!Array.isArray(dataKey.valid)) {
        if (dataKey.valid) {
            dataKey.valid = [dataKey.valid];
        } else {
            dataKey.valid = [];
        }
    }

    !errMsg && dataKey.valid && dataKey.valid.forEach(function(item){
        handleValid = valid[item.type];
        if(typeof handleValid == "function") {
            errMsg = handleValid(val, ...item.args);
        } else if(typeof handleValid.all === "function") {
            errMsg = handleValid.all(val, ...item.args);
        }

        if(errMsg) {
            return false;
        }

    });

    //数据验证
    if (errMsg) {
        dataKey.error = errMsg;
        return false;
    }

    dataKey.error = '';
    return true;
}

let setOptions = function(data, defaluts) {

    //浅复制
    for (var prop in defaluts) {
        if (typeof data[prop] == "undefined") {
            data[prop] = defaluts[prop];
        }
    }

    return data;
};

class FormMessage {
    constructor(msg, showTime) {
        this.msg = "";
        this.time = 2000;
        this.elemPool = [];
    }
    createElem() {
        let elem = document.createElement("div");
        elem.className = "form-message";
        return elem;
    }

    getMsgContent() {
        if(this.elemPool.length > 0) {
            return this.elemPool[0].cloneNode(true);
        }

        return this.createElem();
    }

    getContainer() {
        let elem = document.getElementsByClassName("message-container")[0];

        if(!elem) {
            elem = document.createElement("div");
            elem.className = "message-container";
            document.body.appendChild(elem);
        }

        return elem;
    }

    setMsg(msg, showTime) {
        let elem = this.getMsgContent(),
            containerElem = this.getContainer(),
            _this = this;
        this.msg = msg;
        this.time = showTime || (2000 + msg.length * 30);

        elem.innerHTML = this.msg;
        containerElem.appendChild(elem);

        setTimeout(function() {
            _this.elemPool.push(elem);
            containerElem.removeChild(elem);
        }, this.time);
    }
}

let formMessage = new FormMessage();

export {
    checkSubmit,
    checkData,
    setOptions,
    formMessage
};