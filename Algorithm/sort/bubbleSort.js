/**
 * 冒泡排序
 * @param {Array} arr 需要排序的数组
 */
function bubbleSort(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
            if (arr[i] > arr[j]) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

module.exports = bubbleSort;