// 驼峰转-连接：dataValueType -> data-value-type
function camelToString(str) {
    if (str === undefined || str === '') {
        return '';
    }
    str += '';
    return str.replace(/[A-Z]/g, '-$&').toLowerCase();
}

// 反转
function toCamel(str) {
    if (str === undefined || str === '') {
        return '';
    }
    str += '';
    return str.replace(/-[a-z]/g, function(match) {
        return match.replace(/-/, '').toUpperCase();
    });
}

//数据类型转换
function transformat(data) {
    if (data === 'true') {
        return true;
    }

    if (data === 'false') {
        return false;
    }

    if (data === 'null') {
        return null;
    }

    if (data === +data + '') {
        return +data;
    }

    if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) {
        return JSON.parse(data);
    }

    return data;
}