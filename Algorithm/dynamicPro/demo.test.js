const { runStep, bestSolution } = require('./demo');

test('1级别台阶行走的方法有1种', () => {
    expect(runStep(1)).toBe(1);
});

test('2级别台阶行走的方法有2种', () => {
    expect(runStep(2)).toBe(2);
});

test('3级别台阶行走的方法有3种', () => {
    expect(runStep(3)).toBe(3);
});

test('4级别台阶行走的方法有5种', () => {
    expect(runStep(4)).toBe(5);
});

test('5级别台阶行走的方法有8种', () => {
    expect(runStep(5)).toBe(8);
});

test('6级别台阶行走的方法有13种', () => {
    expect(runStep(6)).toBe(13);
});

let glods = [350, 100, 200, 500, 400],
    perPelple = [4, 1, 2, 4, 4];

test('一口矿五个人最大挖出黄金350g', () => {
    expect(bestSolution(1, 5, glods, perPelple)).toBe(350);
});

test('二口矿五个人最大挖出黄金450g', () => {
    expect(bestSolution(2, 5, glods, perPelple)).toBe(450);
});

test('三口矿五个人最大挖出黄金450g', () => {
    expect(bestSolution(3, 5, glods, perPelple)).toBe(450);
});

test('四口矿五个人最大挖出黄金600g', () => {
    expect(bestSolution(4, 5, glods, perPelple)).toBe(600);
});

test('五口矿五个人最大挖出黄金600g', () => {
    expect(bestSolution(5, 5, glods, perPelple)).toBe(600);
});

test('五口矿七个人最大挖出黄金800g', () => {
    expect(bestSolution(5, 7, glods, perPelple)).toBe(800);
});

test('五口矿十个人最大挖出黄金1100g', () => {
    expect(bestSolution(5, 10, glods, perPelple)).toBe(1100);
});