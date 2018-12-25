/**
 * 归并排序: 即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为2-路归并。
 * @param {Array} arr 待排数组
 */
function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }

    let len = arr.length,
        mid = Math.floor(len / 2),
        arr1 = arr.slice(0, mid),
        arr2 = arr.slice(mid);
    return merge(mergeSort(arr1), mergeSort(arr2));
}

function merge(arr1, arr2) {
    let arr = [];
    while (arr1.length > 0 && arr2.length > 0) {
        if (arr1[0] < arr2[0]) {
            arr.push(arr1.shift());
        } else {
            arr.push(arr2.shift());
        }
    }

    if (arr1.length > 0) {
        arr = arr.concat(arr1);
    }

    if (arr2.length > 0) {
        arr = arr.concat(arr2);
    }
    return arr;
}

module.exports = mergeSort;