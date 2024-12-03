const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
}

function part1(raw) {
    return raw.match(/mul\(\d+,\d+\)/g)
        .map(i => i.match(/\d+/g).reduce((p,c) => p*c))
        .reduce((p, c) => p + c);
}

function part2(raw) {
    return raw
        .match(/(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g)
        .reduce(([sum, enabled], i) => {
            if (i === "do()") {
                return [sum, true];
            }
            if (i === "don't()") {
                return [sum, false];
            }
            if(!enabled) {
                return [sum, false];
            }

            return [sum + i.match(/\d+/g).reduce((p,c) => p*c), true];
        }, [0, true])[0];
}

console.log(part1(raw));
console.log(part2(raw));