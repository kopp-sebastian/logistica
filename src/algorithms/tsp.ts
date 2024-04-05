interface Node {
    id: number;
    x: number;
    y: number;
  }
  
  interface Edge {
    id: number;
    from: number;
    to: number;
    weight: number;
  }
  
// Helper function to find the nearest neighbor
function findNearestNeighbor(currentNodeId: number, nodes: Node[], edges: Edge[], visited: Set<number>): number | null {
    let nearestNodeId: number | null = null;
    let shortestDistance = Infinity;

    edges.forEach(edge => {
        if (edge.from === currentNodeId && !visited.has(edge.to) && edge.weight < shortestDistance) {
            shortestDistance = edge.weight;
            nearestNodeId = edge.to;
        } else if (edge.to === currentNodeId && !visited.has(edge.from) && edge.weight < shortestDistance) {
            shortestDistance = edge.weight;
            nearestNodeId = edge.from;
        }
    });

    return nearestNodeId;
}

// Modify the TSP using a revised Nearest Neighbor algorithm that backtracks if necessary
export function solveTSP(nodes: Node[], edges: Edge[]): { path: number[], distance: number } {
    if (nodes.length === 0) return { path: [], distance: 0 };

    let totalDistance = 0;
    let path: number[] = [nodes[0].id]; // Start from the first node
    let visited = new Set<number>([nodes[0].id]);

    while (visited.size < nodes.length) {
        let lastNodeId = path[path.length - 1];
        let nearestNodeId = findNearestNeighbor(lastNodeId, nodes, edges, visited);

        if (nearestNodeId !== null) {
            const edge = edges.find(edge => (edge.from === lastNodeId && edge.to === nearestNodeId) || (edge.to === lastNodeId && edge.from === nearestNodeId));
            if (edge) {
                totalDistance += edge.weight;
                path.push(nearestNodeId);
                visited.add(nearestNodeId);
            }
        } else {
            // Find the nearest unvisited node from any of the visited nodes
            let found = false;
            for (const visitedNodeId of visited) {
                nearestNodeId = findNearestNeighbor(visitedNodeId, nodes, edges, visited);
                if (nearestNodeId !== null) {
                    const edge = edges.find(edge => (edge.from === visitedNodeId && edge.to === nearestNodeId) || (edge.to === visitedNodeId && edge.from === nearestNodeId));
                    if (edge) {
                        totalDistance += edge.weight;
                        path.push(visitedNodeId, nearestNodeId); // backtrack if necessary
                        visited.add(nearestNodeId);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                console.error('Failed to find a path that visits all nodes');
                break; // No path found that visits all nodes, exit the loop
            }
        }
    }

    return {
        path,
        distance: totalDistance
    };
}
