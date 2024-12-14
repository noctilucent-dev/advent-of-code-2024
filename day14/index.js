const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;
}

function parse(lines) {
    return lines.map(l => {
        const [x, y, dx, dy] = l.match(/-?\d+/g).map(Number);
        return [x, y, dx, dy];
    });
}

function calculateSafetyFactor(robots, width, height) {
    const quadrants = [
        [0,0,Math.floor(width/2)-1,Math.floor(height/2)-1],
        [Math.ceil(width/2), 0, width-1, Math.floor(height/2)-1],
        [0, Math.ceil(height/2), Math.floor(width/2)-1, height-1],
        [Math.ceil(width/2), Math.ceil(height/2), width-1, height-1]
    ];
    log(quadrants);
    return quadrants.map(([ax, ay, bx, by]) => {
        return robots.filter(([x, y]) => x >= ax && x <= bx && y >= ay && y <= by).length;
    }).reduce((p, c) => p * c, 1);
}

function printMap(robots, width, height) {
    // robots = robots.slice(10, 11);
    const lines = [];
    for(let y=0; y<height; y++) {
        let line = '';
        for(let x=0; x<width; x++) {
            line += robots.filter(([rx, ry]) => rx === x && ry === y).length || '.';
        }
        lines.push(line);
    }
    log(lines.join("\n"));
}

function part1(lines) {
    const robots = parse(lines);
    let width, height;
    if(DEBUG) {
        width = 11;
        height = 7;
    } else {
        width = 101;
        height = 103;
    }
    printMap(robots, width, height);
    log("");
    for(let i=0; i<100; i++) {
        robots.forEach(r => {
            r[0] = (r[0] + r[2]) % width;
            if (r[0] < 0) r[0] = r[0] += width;
            r[1] = (r[1] + r[3]) % height;
            if (r[1] < 0) r[1] = r[1] += height;
        });
        // printMap(robots, width, height);
        // log("--");
    }

    printMap(robots, width, height);

    return calculateSafetyFactor(robots, width, height);
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));