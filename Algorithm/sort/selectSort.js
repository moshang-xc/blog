/**
 * 选择排序: 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。
 * @param {Array} arr 需要排序的数组
 */
function selectSort(arr) {
    for (let i = 0, l = arr.length; i < l; i++) {
        let t = i;
        for (let j = i + 1; j < l; j++) {
            if (arr[t] > arr[j]) {
                t = j;
            }
        }
        if (t !== i) {
            let temp = arr[i];
            arr[i] = arr[t];
            arr[t] = temp;
        }
    }
    return arr;
}

module.exports = selectSort;