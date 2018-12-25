/**
 * 插入排序: 通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
 * @param {Array} arr 待排数组
 */
function insertSort(arr) {
    for (let i = 1, l = arr.length; i < l; i++) {
        let temp = arr[i],
            k = i;
        for (let j = i - 1; j >= 0; j--) {
            if (temp < arr[j]) {
                arr[k] = arr[j];
                k--;
            } else {
                break;
            }
        }
        k !== i && (arr[k] = temp);
    }
    return arr;
}

module.exports = insertSort;