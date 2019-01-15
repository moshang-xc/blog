const rotateString = require('./rotateString');

test('"welcome to my website" rotate to "etisbew ym ot emoclew"', () => {
    expect(rotateString('welcome to my website')).toBe('etisbew ym ot emoclew');
});