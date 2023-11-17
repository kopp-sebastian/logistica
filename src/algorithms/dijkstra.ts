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

const dijkstra = (nodes: Node[], edges: Edge[], startNodeId: NodeId) => {
  const distances: { [nodeId: number]: number } = {};
  const previous: { [nodeId: number]: NodeId | null } = {};
  const unvisited: Set<NodeId> = new Set(nodes.map(n => n.id));

  // Initialize distances and previous
  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
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

    const currentEdges = edges.filter(edge => edge.from === current || edge.to === current);
    currentEdges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!unvisited.has(neighbor)) return;

      const newDistance = distances[current] + edge.weight;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    });
  }

  // Return distances and paths
  return {
    distances,
    paths: Object.fromEntries(
      Object.keys(previous).map(nodeId => {
        const path = [];
        let current: NodeId | null = parseInt(nodeId);
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }
        return [nodeId, path];
      })
    ),
  };
};

export default dijkstra;
