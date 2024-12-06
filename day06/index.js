const { DEBUG, log, getRaw, toTrimmedLines, deepClone } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
}

function part1(lines) {
    const m = lines.map(l => l.split(""));
    const inBounds = ([x, y]) => y >= 0 && y < m.length && x >= 0 && x < m[y].length;
    const visited = new Set();

    const vectors = [
        [0, -1], // N
        [1, 0],  // E
        [0, 1],  // S
        [-1, 0], // W
    ];

    let pos = undefined;
    let di = 0;

    // Find initial position
    for(let y=0; y<lines.length && !pos; y++) {
        for(let x=0; x<lines[y].length && !pos; x++) {
            if(m[y][x] === "^") {
                pos = [x, y];
            }
        }
    }

    while(true) {
        visited.add(JSON.stringify(pos));

        let nx = pos[0] + vectors[di][0];
        let ny = pos[1] + vectors[di][1];
        if (!inBounds([nx, ny])) {
            break;
        }

        if (m[ny][nx] === "#") {
            di = (di + 1) % 4;
        } else {
            pos = [nx, ny];
        }
    }

    return visited.size;
}

function printMap(m, positions) {
    m = deepClone(m);
    let lines = [];
    for(let y=0; y<m.length; y++) {
        let line = "";
        for(let x=0; x<m[y].length; x++) {
            if(positions && positions.some(([px, py]) => y === py && x === px)) {
                const matches = positions.filter(([px, py]) => y === py && x === px);
                if (matches.length > 1) {
                    line += "+";
                } else if (matches[0][2] === 0 || matches[0][2] === 2) {
                    line += "|";
                } else {
                    line += "-";
                }
            } else {
                line += m[y][x];
            }
        }
        lines.push(line);
    }
    log(lines.join("\n"));
}

const vectors = [
    [0, -1], // N
    [1, 0],  // E
    [0, 1],  // S
    [-1, 0], // W
];

function inBounds([x, y], m) {
    return y >= 0 && y < m.length && x >= 0 && x < m[y].length
}

function isLoop(pos, di, m) {
    const visited = new Set();
    const positions = [];
    while(true) {
        visited.add(JSON.stringify(pos));
        positions.push([pos[0], pos[1], di]);

        let nx = pos[0] + vectors[di][0];
        let ny = pos[1] + vectors[di][1];
        if (!inBounds([nx, ny], m)) {
            log(`No loop`);
            // printMap(m, positions);
            return false;
        }

        if (m[ny][nx] === "#" || m[ny][nx] === "O") {
            di = (di + 1) % 4;
        } else {
            pos = [nx, ny];
            // if (visited.has(JSON.stringify(pos))) {
            if(positions.some(([px, py, pdi]) => px === pos[0] && py === pos[1] && pdi === di)) {
                log("Loop");
                printMap(m, positions);
                return true;
            }
        }
    }
}

function part2(lines) {
    const m = lines.map(l => l.split(""));
    const inBounds = ([x, y]) => y >= 0 && y < m.length && x >= 0 && x < m[y].length;
    const visited = new Set();
    const positions = [];

    let pos = undefined;
    let di = 0;

    // Find initial position
    for(let y=0; y<lines.length && !pos; y++) {
        for(let x=0; x<lines[y].length && !pos; x++) {
            if(m[y][x] === "^") {
                pos = [x, y];
            }
        }
    }

    let startPos = [...pos];

    while(true) {
        visited.add(JSON.stringify(pos));
        positions.push([pos[0], pos[1], di]);

        let nx = pos[0] + vectors[di][0];
        let ny = pos[1] + vectors[di][1];
        if (!inBounds([nx, ny])) {
            break;
        }

        if (m[ny][nx] === "#") {
            di = (di + 1) % 4;
        } else {
            pos = [nx, ny];
        }
    }

    let loopCount = Array.from(visited).map(JSON.parse).filter(([x, y]) => {
        if (x === startPos[0] && y === startPos[1]) {
            return false;
        }
        log(`Placing obstacle at (${x}, ${y})`);
        let m2 = deepClone(m);
        m2[y][x] = "O";
        let l = isLoop([...startPos], 0, m2);
        if(l) {
            return true;
        } else {
            return false;
        }
    }).length;

    return loopCount;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines));