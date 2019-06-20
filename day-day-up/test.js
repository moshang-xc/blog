function guessNumber(n) {
    let i = 0,
        l = n;
    while (i < l) {
        let mid = i + Math.floor((i - i) / 2),
            res = guess(mid);
        if (res === 0) {
            return mid;
        } else if (res === 1) {
            i = mid + 1;
        } else {
            l = mid;
        }
    }
    return i;
}

console.log(getSum(3, 1));