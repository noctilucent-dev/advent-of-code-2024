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
        // Iterate over every pair of antenna
        for(let i=0; i<antennas[frequency].length-1; i++) {
            for(let j=i+1; j<antennas[frequency].length; j++) {
                const a = antennas[frequency][i];
                const b = antennas[frequency][j];

                log(`Checking pair ${frequency} - (${a.x},${a.y}),(${b.x},${b.y})`);

                // Get values required to determine formula for line:
                // y = a.y + (dy(x - a.x) / dx)
                const dy = a.y - b.y;
                const dx = a.x - b.x;

                // Use the GCD of dy and dx to determine the frequency of x values
                // that will provide integer solutions for y
                const div = Math.abs(dx) / gcd(Math.abs(dy), Math.abs(dx));

                // Iterate over each x value with integer y solution
                for(let x = a.x % div; x<=maxX; x += div) {
                    let y = (dy*(x - a.x)) / dx + a.y;
                    if (y < 0 || y > maxY) continue;

                    log(`Found integer co-ordinate (${x},${y})`);
                    antinodes.push({
                        f: frequency,
                        x,
                        y
                    });
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
console.log(part2(lines));