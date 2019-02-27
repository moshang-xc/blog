/**
 * 动态规划
 * 最优子结构，边界，状态转移公式
 */

/**
 * 问题描述
 * 从第0节台阶上到第n节台阶，一次只能上一节或者两节，一共有多少总上法
 */
function runStep(n) {
    if (n < 0) {
        return 0;
    }

    if (n === 1) {
        return 1;
    }

    if (n === 2) {
        return 2;
    }

    let a = 1,
        b = 2,
        total;

    for (let i = 3; i <= n; i++) {
        total = a + b;
        a = b;
        b = total;
    }

    return total;
}

/**
 * 动态规划，双维度问题
 * 描述：现有五口矿，10个工人，没口矿产量和所需的工人数是不同的，怎么样分配工人，使得产量最高
 * 公式：五个矿的值 = Math.max(4个矿10人的值，当前第五个矿的值+剩余人数对应矿的最大值)
 */

/**
 * 获取最优解
 * @param {*} glodNum 矿总数
 * @param {*} peoNum 工人总数
 * @param {*} golds 矿产量
 * @param {*} perPeo 每个矿需要的工人数，与golds对应
 */
function bestSolution(glodNum, peoNum, golds, perPeo) {
    let preResult = [],
        result = [];

    //记录一个矿时的边界值
    for (let i = 0; i <= peoNum; i++) {
        if (i < perPeo[0]) {
            preResult[i] = 0;
        } else {
            preResult[i] = golds[0];
        }
    }
    result = Object.assign([], preResult);

    //逐个进行便利
    for (let i = 1; i < glodNum; i++) {
        for (let j = 0; j <= peoNum; j++) {
            // 如果当前的人数少于当前矿需要的人数，则等于上一次对应人数的值
            if (j < perPeo[i]) {
                result[j] = preResult[j];
            } else {
                result[j] = Math.max(preResult[j], preResult[j - perPeo[i]] + golds[i]);
            }
        }
        // console.log(result);
        preResult = Object.assign([], result);
    }
    return result[peoNum];
}

/**
 * 最少硬币问题
 * 例如：有硬币[1,2,5,10,20]的硬币，给定一个数N，怎么样用最少个数的硬币凑成N
 */
function minCoin(coin, n) {
    if (n <= 0) {
        return 0;
    }
    if (coin.includes(n)) {
        return 1;
    }

    return Math.min(minCoin()) + 1;
}

module.exports = {
    runStep,
    bestSolution
};