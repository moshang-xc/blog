/**
 * 几种排序算法
 */

/**
 * 冒泡排序
 * 原理：两两比较顺序, 如果顺序错误则交换位置
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

/**
 * 快速排序
 * 原理：左右交替进行， 拆东墙补西墙
 */
function quickSort(arr, left, right) {
    if (left === undefined) {
        left = 0;
    }

    if (right === undefined) {
        right = arr.length - 1;
    }

    if (left >= right) {
        return arr;
    }

    let l = left,
        r = right,
        // 基准元素
        midItem = arr[Math.floor((l + r) / 2)];

    while (l <= r) {
        while (l <= r && arr[r] > midItem) {
            r--;
        }

        while (l <= r && arr[l] < midItem) {
            l++;
        }

        if (l <= r) {
            let temp = arr[l];
            arr[l++] = arr[r];
            arr[r--] = temp;
        }
    }

    quickSort(arr, left, r);
    quickSort(arr, l, right);
    return arr;
}

/**
 * 选择排序: 
 * 原理： 在未排序的序列中找到最大（ 小） 的元素与第1个元素交换
 * 在剩余元素中继续找最大（ 小） 的元素与第2个元素交换
 * 以此类推， 直到排序完毕
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

/**
 * 直接插入排序
 * 原理：通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
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

/**
 * 归并排序
 * 原理: 将每个数组分成两段，两段再拆分，直到不可再分，拆分的子序列分别排序，再将有序的子序列合并
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

module.exports = {
    bubbleSort,
    quickSort,
    selectSort,
    mergeSort,
    insertSort
};