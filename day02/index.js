const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
}

function isSafe(l) {
    // map to deltas
    l = l.map((v, i) => i > 0 ? v - l[i-1] : 0);
    // ignore first element
    l.shift();

    // Check maximum delta
    if (!l.every(v => Math.abs(v) <=3)) {
        return false;
    }

    // Check consistent increase/decrease
    return l.every(v => v > 0) || l.every(v => v < 0);
}

function part1(lines) {
    return lines.filter(isSafe).length;
}

function part2(lines) {
    return lines.filter(l => isSafe(l) ||
        l.some((_, i) => {
            // Create a copy with element removed
            let l2 = [...l];
            l2.splice(i, 1);
            
            return isSafe(l2);
        })).length;
}

const lines = toTrimmedLines(raw).map(l => l.split(" ").map(Number));

console.log(part1(lines));
console.log(part2(lines));
