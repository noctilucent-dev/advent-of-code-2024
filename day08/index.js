const { DEBUG, log, getRaw, toTrimmedLines, gcd } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
}

function parse(lines) {
    const m = lines.map(l => l.split(""));
    const antennas = [];
    for(let y=0; y<m.length; y++) {
        for(let x=0; x<m[y].length; x++) {
            if (m[y][x] === ".") {
                continue;
            }
            antennas.push({
                f: m[y][x],
                x,
                y
            });
        }
    }
    return {
        m, antennas
    };
}

function part1(lines) {
    let {m, antennas} = parse(lines);
    let frequencies = new Set(antennas.map(a => a.f));
    antennas = Object.groupBy(antennas, a => a.f);
    let antinodes = [];
    frequencies.forEach(frequency => {
        for(let i=0; i<antennas[frequency].length-1; i++) {
            for(let j=i+1; j<antennas[frequency].length; j++) {
                const a = antennas[frequency][i];
                const b = antennas[frequency][j];

                const v1 = [a.x - b.x, a.y-b.y];
                const v2 = [b.x-a.x, b.y-a.y];

                antinodes.push({
                    f: a.f,
                    x: a.x + v1[0],
                    y: a.y + v1[1]
                });
                antinodes.push({
                    f: b.f,
                    x: b.x + v2[0],
                    y: b.y + v2[1]
                });
            }
        } 
    });
    antinodes = antinodes.filter(({x, y}) => y >= 0 && y < m.length && x >= 0 && x < m[y].length);
    let unique = new Set(antinodes.map(({x,y}) => [x,y]).map(JSON.stringify));
    log(unique);
    return unique.size;
}

function part2(lines) {
    let {m, antennas} = parse(lines);
    const maxY = m.length-1;
    const maxX = m[0].length-1;
    let frequencies = new Set(antennas.map(a => a.f));
    antennas = Object.groupBy(antennas, a => a.f);
    let antinodes = [];
    frequencies.forEach(frequency => {
        for(let i=0; i<antennas[frequency].length-1; i++) {
            for(let j=i+1; j<antennas[frequency].length; j++) {
                const a = antennas[frequency][i];
                const b = antennas[frequency][j];

                log(`Checking pair ${frequency} - (${a.x},${a.y}),(${b.x},${b.y})`);
                //const v = [a.x - b.x, a.y-b.y];
                const dy = a.y - b.y;
                const dx = a.x - b.x;
                const div = Math.abs(dx) / gcd(Math.abs(dy), Math.abs(dx));
                log(`dx: ${dx}, dy: ${dy}, gcd: ${div}`);
                log(`y = ${dy}(x - ${a.x}) / ${dx} + ${a.y}`);

                // m = dy / dx
                // y - y1  = m(x - x1)
                // y - a.y = m(x - a.x)
                // y = mx - m(a.x) + a.y
                let calcY = (x) => ((dy*(x - a.x)) / dx) + a.y;
                for(let x=0; x<=maxX; x += 1) {
                    let z = dy*(x - a.x);
                    if ((Math.abs(z) % Math.abs(dx)) !== 0) {
                        log(`Skipping x=${x}`);
                        continue;
                    } else {
                        log(`x=${x}, z=${z}`);
                    }
                    let y = calcY(x);
                    if (y < 0 || y > maxY) continue;
                    // if (Math.abs(y - Math.floor(y)) < 0.1) {
                        log(`Found integer co-ordinate (${x},${y})`);
                        antinodes.push({
                            f: frequency,
                            x,
                            y
                        });
                    // }
                }
            }
        } 
    });
    let unique = new Set(antinodes.map(({x,y}) => [x,y]).map(JSON.stringify));
    log(unique);
    return unique.size;
}

const lines = toTrimmedLines(raw);

console.log(part1(lines));
console.log(part2(lines)); // 996 too low, 1012 too low, 1234 not correct