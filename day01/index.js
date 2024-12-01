const { DEBUG, getRaw, FrequencyMap } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `3   4
4   3
2   5
1   3
3   9
3   3`;
}

function getLists(raw) {
    const tokens = raw.trim().split(/[\s]+/g).map(Number);
    return [
        tokens.filter((_, i) => i%2 === 0),
        tokens.filter((_, i) => i%2 === 1)
    ];
}

function part1(raw) {
    const [list1, list2] = getLists(raw).map(l => l.sort());
    return list1.reduce((p, c, i) => p + Math.abs(c - list2[i]), 0);
}

function part2() {
    const [list1, list2] = getLists(raw);
    const valueCount = new FrequencyMap(list2);
    return list1.reduce((p, c) => p + (c * valueCount.getOrDefault(c, 0)), 0);
}

console.log(part1(raw));
console.log(part2(raw));