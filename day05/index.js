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

/**
 * Represents an abstract graph.
 * Stores nodes (array) and edges (map of node => Set of children).
 */
class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    /**
     * Finds a leaf node in the graph 
     * @returns a leaf node
     */
    leaf() {
        return this.nodes.find(n => this.edges[n].size === 0);
    }

    clone() {
        let e2 = {...this.edges};
        this.nodes.forEach(n => e2[n] = new Set(e2[n]))

        let n2 = [...this.nodes];

        return new Graph(n2, e2);
    }

    /**
     * Completely removes the specified node from the graph
     * @param {*} n 
     */
    delete(n) {
        this.nodes.forEach(n2 => this.edges[n2].delete(n));
        this.nodes.splice(this.nodes.indexOf(n), 1);
        delete this.edges[n];
    }
}

/**
 * Converts a list of rules into a graph.
 * Each page number is a node.
 * Each rule is an edge.
 * 
 * @param {[string[]]} rules List of rules (array of pairs of page numbers)
 * @returns the graph
 */
function createGraphFromRules(rules) {
    let edges = {};
    rules.forEach(([a, b]) => {
        if (!edges[a]) edges[a] = new Set();
        if (!edges[b]) edges[b] = new Set();
        edges[a].add(b);
    });
    let nodes = Array.from(new Set(rules.flatMap(c => c)));

    return new Graph(nodes, edges);
}

/**
 * Determines whether a list of pages is valid given the rules.
 * @param {string[]} pages 
 * @param {{string: string[]}} rules
 * @returns 
 */
function isValid(pages, rules) {
    for(let i=0; i<pages.length-1; i++) {
        for(let j=i+1; j<pages.length; j++) {
            if (rules[pages[j]].has(pages[i])) {
                return false;
            }
        }
    }
    return true;
}

function getSumOfMiddleValues(updates) {
    return updates.map(u => u[Math.floor(u.length/2)] * 1).reduce((p, c) => p+c)
}

function part1(rules, updates) {
    const g = createGraphFromRules(rules);
    const valid = updates.filter(u => isValid(u, g.edges));

    return getSumOfMiddleValues(valid);
}

function part2(rules, updates) {
    const g = createGraphFromRules(rules);

    const modified = updates
        .filter(u => !isValid(u, g.edges))
        .map(u => {
            let g2 = g.clone();

            // Remove all nodes not in the page list
            g2.nodes
                .filter(n => !u.some(v => v === n))
                .forEach(n => g2.delete(n));

            // Extract each leaf from the graph until none left
            const newUpdate = [];
            for (let leaf = g2.leaf(); leaf; leaf = g2.leaf()) {
                newUpdate.push(leaf);
                g2.delete(leaf);
            }

            return newUpdate.reverse();
        });

    return getSumOfMiddleValues(modified);
}

const {rules, updates} = parse(raw);

console.log(part1(rules, updates));
console.log(part2(rules, updates));