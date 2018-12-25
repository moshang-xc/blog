/**
 * 翻转字符串
 * @param {String} str 需要翻转的字符串
 * @param {Number} offset 共转换几位数组
 */
function rotateString(str, offset) {
    if (str === null || str.length === 0) {
        return str;
    }
    str = str.split('');
    // let len = offset % str.length;
    let len = str.length - 1,
        start = 0,
        end = len - offset;

    str = rotate(str, start, end);
    str = rotate(str, end + 1, len);
    str = rotate(str, start, len);
    return str.join('');
}

function rotate(str, start, end) {
    while (start < end) {
        let temp = str[start];
        str[start] = str[end];
        str[end] = temp;

        start++;
        end--;
    }
    return str;
}

module.exports = rotateString;