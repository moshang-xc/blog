const binarySearch = require('./binarySearch');

test('二分查找4在数组[1, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6, 7, 8, 9]中的第一个索引是6', () => {
    let arr = [1, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6, 7, 8, 9];
    expect(binarySearch(arr, 4)).toBe(6);
});