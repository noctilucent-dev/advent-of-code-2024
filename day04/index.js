const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
}

function search(x, y, v, m) {
    let word = "";
    for(let i=0; i<4; i++) {
        if (y<0 || y>=m.length || x<0 || x>=m[y].length) {
            return false;
        }
        word += m[y][x];
        x += v[0];
        y += v[1];
    }
    return word === "XMAS";
}

function part1(lines) {
    const vectors = [
        [0, -1],  // N
        [1, -1],  // NE
        [1, 0],   // E
        [1, 1],   // SE
        [0, 1],   // S
        [-1, 1],  // SW
        [-1, 0],  // W
        [-1, -1], // NW
    ];
    let m = lines.map(l => l.split(""));
    let count = 0;
    for(let y=0; y<m.length; y++) {
        for(let x=0; x<m[y].length; x++) {
            if (m[y][x] === "X") {
                log(`Found X at (${x},${y})`);
                count += vectors.filter(v => search(x, y, v, m)).length;
            }
        }
    }
    return count;
}

function checkCross(x, y, m) {
    const vectors = [
        [1, -1],  // NE
        [-1, 1],  // SW
        [1, 1],   // SE
        [-1, -1], // NW
    ];
    const letters = [];
    for(let i=0; i<4; i++) {
        let lx = x+vectors[i][0];
        let ly = y+vectors[i][1];
        if (ly<0 || ly>=m.length || lx<0 || lx>=m[y].length) {
            return false;
        }
        letters.push(m[ly][lx]);
    }

    let count = 0;
    if(
        (letters[0] === "M" && letters[1] === "S") ||
        (letters[0] === "S" && letters[1] === "M")
    ) {
        count++;
    }
    if(
        (letters[2] === "M" && letters[3] === "S") ||
        (letters[2] === "S" && letters[3] === "M")
    ) {
        count++;
    }

    return count === 2;
}

function part2(lines) {
    let m = lines.map(l => l.split(""));
    let count = 0;
    for(let y=0; y<m.length; y++) {
        for(let x=0; x<m[y].length; x++) {
            if (m[y][x] === "A") {
                log(`Found A at (${x},${y})`);
                if(checkCross(x, y, m)) {
                    count++;
                }
            }
        }
    }
    return count;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));