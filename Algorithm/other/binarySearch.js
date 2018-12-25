/**
 * 二分查找
 * @param {Array} arr 目标数组，已排序
 * @param {Number} target 目标对象
 */
function binarySearch(arr, target) {
    let len = arr.length,
        left = 0,
        right = len - 1;

    while (left <= right) {
        let mid = Math.floor((left + right) / 2),
            midItem = arr[mid];
        if (target <= midItem) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (left < len && arr[left] === target) {
        return left;
    }
    return -1;
}

module.exports = binarySearch;