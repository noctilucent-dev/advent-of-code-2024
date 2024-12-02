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

function part1(lines) {
    lines = lines.map(l => l.split(" ").map(Number));
    lines = lines.map(l => l.map((v, i) => i > 0 ? v - l[i-1] : 0));
    lines.forEach(l => l.shift());
    lines = lines.filter(l => l.every(v => Math.abs(v) <= 3));
    lines = lines.filter(l => l.every(v => v > 0) || l.every(v => v < 0));
    log(lines);
    return lines.length;
}

function isValid(l) {
    l = l.map((v, i) => i > 0 ? v - l[i-1] : 0);
    l.shift();
    if (!l.every(v => Math.abs(v) <=3)) {
        return false;
    }

    return l.every(v => v > 0) || l.every(v => v < 0);
}

function part2(lines) {
    lines = lines.map(l => l.split(" ").map(Number));
    lines = lines.filter(l => {
        if (isValid(l)) return true;

        for(let i=0; i<l.length; i++) {
            let l2 = [...l];
            l2.splice(i, 1);
            log(l2);
            if (isValid(l2)) return true;
        }

        return false;
    });
    log(lines);
    return lines.length;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));
