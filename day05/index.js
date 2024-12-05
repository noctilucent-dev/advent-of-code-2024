const { DEBUG, log, getRaw, toTrimmedLines, deepClone } = require('../util');

let raw = getRaw();
if (DEBUG) {
    raw = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;
}

function parse(raw) {
    let [rules, updates] = raw.trim().split("\n\n");
    rules = rules.split("\n").map(l => l.trim().split("|"));
    updates = updates.split("\n").map(l => l.trim().split(","));
    return {
        rules,
        updates
    };
}

function part1(rules, updates) {
    log(rules);
    log(updates);

    const g = {};
    rules.forEach(([a, b]) => {
        if (!g[a]) g[a] = new Set();
        if (!g[b]) g[b] = new Set();
        g[a].add(b);
    });
    log(g);

    // const ranks = {};
    // for(let i=0; true; i++) {
    //     const nodes = Object.getOwnPropertyNames(g);
    //     const leaves = nodes.filter(k => g[k].size === 0);
    //     log(leaves);
    //     if (leaves.length === 0) {
    //         break;
    //     }

    //     leaves.forEach(l => {
    //         log(`Removing leaf ${l} with rank ${i}`);
    //         ranks[l] = i;
    //         nodes.forEach(n => g[n].delete(l));
    //         delete g[l];
    //     });

    //     log(g);
    // }

    // log(ranks);
    // console.log(ranks);

    const valid = updates.filter(u => {
        for(let i=0; i<u.length-1; i++) {
            for(let j=i+1; j<u.length; j++) {
                if (g[u[j]].has(u[i])) {
                    return false;
                }
            }
        }
        return true;
    });
    return valid.map(u => u[Math.floor(u.length/2)] * 1).reduce((p, c) => p+c);
}

function part2(rules, updates) {
    const g = {};
    const allNodes = Array.from(new Set(rules.flatMap(c => c)));
    log(allNodes);
    rules.forEach(([a, b]) => {
        if (!g[a]) g[a] = new Set();
        if (!g[b]) g[b] = new Set();
        g[a].add(b);
    });
    log(g);

    const invalid = updates.filter(u => {
        for(let i=0; i<u.length-1; i++) {
            for(let j=i+1; j<u.length; j++) {
                if (g[u[j]].has(u[i])) {
                    return true;
                }
            }
        }
        return false;
    });

    log(invalid);

    let changed = invalid.map(u => {
        let g2 = {...g};
        Object.getOwnPropertyNames(g2).forEach(n => g2[n] = new Set(g2[n]));
        const toDelete = allNodes.filter(n => !u.some(v => v === n));
        log(toDelete);
        toDelete.forEach(n => {
            delete g2[n];
        });
        u.forEach(n => {
            log(`Deleting ${toDelete} from ${Array.from(g2[n])}`);
            toDelete.forEach(d => g2[n].delete(d));
        })
        log(g2);
        const newUpdate = [];
        while(true) {
            const nodes = Object.getOwnPropertyNames(g2);
            const leaves = nodes.filter(n => g2[n].size === 0);
            if (leaves.length === 0) {
                break;
            }
            const leaf = leaves[0];
            newUpdate.push(leaf);
            nodes.forEach(n => g2[n].delete(leaf));
            delete g2[leaf];
        }
        return newUpdate.reverse();
    });

    log(changed);

    return changed.map(u => u[Math.floor(u.length/2)] * 1).reduce((p, c) => p+c);
}

const {rules, updates} = parse(raw);

console.log(part1(rules, updates));
console.log(part2(rules, updates));