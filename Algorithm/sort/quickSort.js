function quickSort(arr) {
    return sort(arr, 0, arr.length - 1);
}
//实现一
function sort(arr, left, right) {
    if (left >= right) {
        return arr;
    }

    let l = left,
        r = right,
        item = arr[l];

    while (l < r) {
        while (l < r && arr[r] > item) {
            r--;
        }
        if (l < r) {
            arr[l++] = arr[r];
        }

        while (l < r && arr[l] < item) {
            l++;
        }
        if (l < r) {
            arr[r--] = arr[l];
        }
    }

    arr[l] = item;
    sort(arr, left, l - 1);
    sort(arr, r + 1, right);
    return arr;
}

function quickSort1(arr) {
    return sort1(arr, 0, arr.length - 1);
}

// 实现二
function sort1(arr, left, right) {
    if (left >= right) {
        return arr;
    }

    let l = left,
        r = right,
        mid = arr[Math.floor((l + r) / 2)];

    while (l <= r) {
        while (l <= r && arr[l] < mid) {
            l++;
        }
        while (l <= r && arr[r] > mid) {
            r--;
        }

        if (l <= r) {
            let temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;

            l++;
            r--;
        }
    }
    sort1(arr, left, r);
    sort1(arr, l, right);
    return arr;
}

module.exports = {
    quickSort,
    quickSort1
};