const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `3   4
4   3
2   5
1   3
3   9
3   3`;
}

function part1(lines) {
    lines = lines.map(l => l.split(/\s+/)).map(l => l.map(Number));
    
    const firstList = lines.map(l => l[0]);
    const secondList = lines.map(l => l[1]);
    firstList.sort();
    secondList.sort();
    
    let diffSum = 0;
    for(let i=0; i<firstList.length; i++) {
        diffSum += Math.abs(firstList[i] - secondList[i]);
    }

    return diffSum;
}

function part2(lines) {
    lines = lines.map(l => l.split(/\s+/)).map(l => l.map(Number));
    
    const firstList = lines.map(l => l[0]);
    const secondElems = Object.groupBy(lines.map(l => l[1]), i => i);
    return firstList.reduce((p, c) => p + (c * (secondElems[c]?.length || 0)), 0);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));