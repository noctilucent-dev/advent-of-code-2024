const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
}

function part1(raw) {
    const r = /mul\((\d+),(\d+)\)/g;
    let instructions = raw.match(r);
    log(instructions);
    instructions = instructions.map(i => {
        const parts = i.match(/\d+/g);
        return parts[0] * parts[1];
    });
    return instructions.reduce((p, c) => p + c, 0);
    log(instructions);
}

function part2(raw) {
    const r = /(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g;
    let instructions = raw.match(r);
    let sum = 0;
    let enabled = true;
    log(instructions);

    instructions.forEach(instr => {
        if (instr === "do()") {
            enabled = true;
            return;
        }
        if (instr === "don't()") {
            enabled = false;
            return;
        }
        if (!enabled) {
            return;
        }

        const parts = instr.match(/\d+/g);
        sum += parts[0] * parts[1];
    });

    return sum;
}

console.log(part1(raw));
console.log(part2(raw));