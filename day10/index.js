const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
}

function inBounds(x, y, m) {
    return y >= 0 && y < m.length && x >= 0 && x < m[y].length;
}

function part1(lines) {
    const vectors = [
        [0, -1], // N
        [1, 0],  // E
        [0, 1],  // S
        [-1, 0]  // W
    ];
    const m = lines.map(l => l.split("").map(Number));
    const g = [];
    let leaves = new Set();
    for(let y=0; y<m.length; y++) {
        g[y] = [];
        for(let x=0; x<m[y].length; x++) {
            g[y][x] = new Set();
            if (m[y][x] === 9) {
                leaves.add(JSON.stringify([x,y]));
                g[y][x].add(JSON.stringify([x,y]));
            }
        }
    }

    log(leaves);
    for(let val=9; val >= 0; val--) {
        const l = Array.from(leaves).map(JSON.parse);
        leaves = new Set();
        l.forEach(([lx, ly]) => {
            log(`Looking for adjacent to ${val} at (${lx},${ly})`);
            let adjacent =  vectors
                .map(([dx, dy]) => [lx+dx, ly+dy])
                .filter(([x,y]) => inBounds(x, y, m))
                .filter(([x, y]) => m[y][x] === val - 1);
            
            log(adjacent);

            adjacent.forEach(([x, y]) => {
                g[y][x] = g[y][x].union(g[ly][lx]);
                leaves.add(JSON.stringify([x,y]));
            });
        });
        log(leaves);
    }

    let score = 0;
    for(let y=0; y<m.length; y++) {
        for(let x=0; x<m[y].length; x++) {
            if(m[y][x] === 0) {
                score += g[y][x].size;
            }
        }
    }

    return score;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));