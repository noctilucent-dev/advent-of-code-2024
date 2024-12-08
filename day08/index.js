const { DEBUG, log, getRaw, toTrimmedLines } = require('../util');

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

const lines = toTrimmedLines(raw);

console.log(part1(lines));