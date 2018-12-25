const rotateString = require('./other/rotateString');
const binarySearch = require('./other/binarySearch');
const sort = require('./sort');

let console = global.console;

function init() {
    //二分查找
    let a = [1, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6, 7, 8, 9];
    console.log(`binarySearch(${a}, ${4}) -> ${binarySearch(a, 4)}`);
    return;
    //冒泡排序
    let bubble = [9, 3, 6, 7, 1, 2, 1, 3];
    console.log(`冒泡排序：bubbleSort(${bubble}) -> ${sort.bubbleSort(bubble)}`);
    //选择排序
    let select = [9, 3, 6, 7, 1, 2, 1, 3];
    console.log(`选择排序：selectSort(${select}) -> ${sort.selectSort(select)}`);
    //插入排序
    let insert = [9, 3, 6, 7, 1, 2, 1, 3];
    console.log(`插入排序：insertSort(${insert}) -> ${sort.insertSort(insert)}`);
    //归并排序
    let merge = [9, 3, 6, 7, 1, 2, 1, 3];
    console.log(`归并排序：mergeSort(${merge}) -> ${sort.mergeSort(merge)}`);
    return;
    //快速排序
    let arr = [9, 3, 6, 7, 1, 2, 1, 2, 23, 4, 56, 7, 5, 8];
    let arr1 = [9, 3, 6, 7, 1, 2, 1, 2, 23, 4, 56, 7, 5, 8];
    console.log(`快速排序：quickSort(${arr}) -> ${sort.quickSort.quickSort(arr)}`);
    console.log(`快速排序1：quickSort(${arr1}) -> ${sort.quickSort.quickSort1(arr1)}`);

    //字符串反序
    let str = 'abcdefg';
    console.log(`字符串反序：rotateString('${str}', ${3}) -> ${rotateString('abcdefg', 3)}`);
}

init();