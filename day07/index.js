const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
}

function parse(lines) {
    return lines.map(l => l.split(/:?\s+/).map(Number));
}

function rCheck(target, total, remaining) {
    if (remaining.length === 0) {
        return total === target;
    }
    if (rCheck(target, total + remaining[0], remaining.slice(1))) {
        return true;
    }
    if (rCheck(target, total * remaining[0], remaining.slice(1))) {
        return true;
    }
    return false;
}

function part1(lines) {
    lines = parse(lines);
    log(lines);

    lines = lines.filter(l => {
        const target = l[0];
        const nums = l.slice(1);
        return rCheck(target, 0, nums);
    });
    return lines.map(l => l[0]).reduce((p,c) => p+c);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));