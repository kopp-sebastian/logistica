import { Node, Edge } from './dijkstra'; // Assuming Node and Edge types are exported

// Function to calculate the distance between two nodes
function calculateDistance(node1: Node, node2: Node): number {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
}

// Generate all permutations of an array's elements
function generatePermutations<T>(array: T[]): T[][] {
    if (array.length <= 2) return array.length === 2 ? [array, [array[1], array[0]]] : [array];
    return array.reduce((acc, item, i) =>
        acc.concat(generatePermutations([...array.slice(0, i), ...array.slice(i + 1)]).map(val => [item, ...val])), [] as T[][]);
}

// Traveling Salesman Problem solver function
export function solveTSP(nodes: Node[]): { path: number[], distance: number } {
    const permutations = generatePermutations(nodes.slice(1)); // Exclude the first node from permutations for a fixed starting point
    let shortestDistance = Infinity;
    let shortestPath: Node[] = [];

    permutations.forEach(permutation => {
        const path = [nodes[0], ...permutation];
        let totalDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            totalDistance += calculateDistance(path[i], path[i + 1]);
        }

        // Connect the last node back to the first to complete the circuit
        totalDistance += calculateDistance(path[path.length - 1], path[0]);

        if (totalDistance < shortestDistance) {
            shortestDistance = totalDistance;
            shortestPath = path;
        }
    });

    return {
        path: shortestPath.map(node => node.id),
        distance: shortestDistance
    };
}
