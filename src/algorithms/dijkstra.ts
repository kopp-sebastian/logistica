import DOMPurify from 'dompurify';

type NodeId = number;

interface Edge {
  id: number;
  from: NodeId;
  to: NodeId;
  weight: number;
}

interface Node {
  id: NodeId;
  x: number;
  y: number;
}

interface DijkstraStep {
  description: string;
}

const dijkstra = (nodes: Node[], edges: Edge[], startNodeId: NodeId) => {
  const distances: { [nodeId: number]: number } = {};
  const previous: { [nodeId: number]: NodeId | null } = {};
  const steps: DijkstraStep[] = [];
  const unvisited: Set<NodeId> = new Set(nodes.map(n => n.id));

  // Initialize distances and previous
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    steps.push({
      description: DOMPurify.sanitize(`<div class="mb-2 p-2 rounded border-l-4 border-blue-500 bg-blue-100">Set initial distances from node ${node.id} to all others to infinity, except to itself (0).</div>`)
    });
  });

  const findNodeWithSmallestDistance = (distances: { [nodeId: number]: number }, unvisited: Set<NodeId>): NodeId | null => {
    let lowestDistanceNodeId: NodeId | null = null;
    let lowestDistance = Infinity;

    unvisited.forEach(nodeId => {
      if (distances[nodeId] < lowestDistance) {
        lowestDistance = distances[nodeId];
        lowestDistanceNodeId = nodeId;
      }
    });

    return lowestDistanceNodeId;
  };

  while (unvisited.size > 0) {
    const current = findNodeWithSmallestDistance(distances, unvisited);
    if (current === null) break;

    unvisited.delete(current);
    steps.push({
      description: DOMPurify.sanitize(`<div class="mb-2 p-2 rounded border-l-4 border-green-500 bg-green-100">Select node ${current} with the shortest distance from the unvisited set and remove it.</div>`)
    });

    const currentEdges = edges.filter(edge => edge.from === current || edge.to === current);
    currentEdges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbor)) return;

      const newDistance = distances[current] + edge.weight;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
        steps.push({
          description: DOMPurify.sanitize(`<div class="mb-2 p-2 rounded border-l-4 border-yellow-500 bg-yellow-100">Update distance from node ${current} to its neighbor ${neighbor}: New Distance = ${newDistance}.</div>`)
        });
      }
    });
  }

  // Construct the final paths from the start node to all others
  const paths = Object.fromEntries(
    Object.keys(previous).map(nodeId => {
      const path = [];
      let current: NodeId | null = parseInt(nodeId);
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
      return [nodeId, path];
    })
  );

  steps.push({
    description: DOMPurify.sanitize(`<div class="mb-2 p-2 rounded border-l-4 border-red-500 bg-red-100">All nodes have been visited. Dijkstra's algorithm has completed.</div>`)
  });

  return {
    distances,
    paths,
    steps
  };
};

export default dijkstra;
