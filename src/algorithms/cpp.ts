import dijkstra from './dijkstra';

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

function solveCPP(nodes: Node[], edges: Edge[]): { circuit: number[], totalCost: number, wastedCost: number } {
  const oddVertices = findOddDegreeVertices(nodes, edges);
  const shortestPaths = findAllPairsShortestPaths(nodes, edges, oddVertices);
  const matchingEdges = naiveMinimumWeightPerfectMatching(oddVertices, shortestPaths, edges);
  const augmentedEdges = edges.concat(matchingEdges);
  const circuit = constructEulerianCircuit(nodes, augmentedEdges);

  let totalCost = 0;
  for (let i = 0; i < circuit.length - 1; i++) {
    const fromNode = circuit[i];
    const toNode = circuit[i + 1];
    const edge = augmentedEdges.find(edge => (edge.from === fromNode && edge.to === toNode) || (edge.from === toNode && edge.to === fromNode));
    if (edge) {
      totalCost += edge.weight;
    }
  }

  const originalCost = edges.reduce((acc, edge) => acc + edge.weight, 0);
  const wastedCost = totalCost - originalCost;

  return { circuit, totalCost, wastedCost };
}

function findOddDegreeVertices(nodes: Node[], edges: Edge[]): number[] {
  const degree = new Map<number, number>();
  edges.forEach(edge => {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
  });

  return Array.from(degree).filter(([_, deg]) => deg % 2 !== 0).map(([nodeId]) => nodeId);
}

function findAllPairsShortestPaths(nodes: Node[], edges: Edge[], oddVertices: number[]): Map<string, number> {
  const shortestPaths = new Map<string, number>();

  oddVertices.forEach(source => {
    const { distances } = dijkstra(nodes, edges, source);
    oddVertices.forEach(target => {
      if (source !== target) {
        shortestPaths.set(`${source}-${target}`, distances[target]);
      }
    });
  });

  return shortestPaths;
}

function naiveMinimumWeightPerfectMatching(oddVertices: number[], shortestPaths: Map<string, number>, edges: Edge[]): Edge[] {
  let minWeightMatching: Edge[] = [];
  let usedVertices = new Set<number>();
  let newEdgeId = edges.length > 0 ? Math.max(...edges.map(edge => edge.id)) + 1 : 1;

  while (oddVertices.length > 0) {
    let currentVertex = oddVertices.shift();
    if (currentVertex === undefined || usedVertices.has(currentVertex)) continue;

    let minDistance = Infinity;
    let pairVertex: number | null = null;
    for (let oddVertex of oddVertices) {
      if (usedVertices.has(oddVertex)) continue;
      const distance = shortestPaths.get(`${currentVertex}-${oddVertex}`);
      if (distance !== undefined && distance < minDistance) {
        minDistance = distance;
        pairVertex = oddVertex;
      }
    }

    if (pairVertex !== null) {
      minWeightMatching.push({
        id: newEdgeId++,
        from: currentVertex,
        to: pairVertex,
        weight: minDistance,
      });
      usedVertices.add(currentVertex);
      usedVertices.add(pairVertex);
    }
  }

  return minWeightMatching;
}

function constructEulerianCircuit(nodes: Node[], edges: Edge[]): number[] {
  let circuit: number[] = [];
  let currentEdges = [...edges];
  let currentNode = edges[0].from;
  circuit.push(currentNode);

  while (currentEdges.length > 0) {
    const nextEdge = findNextEdgeDirected(currentEdges, currentNode);
    if (!nextEdge) break;

    currentNode = nextEdge.to;
    circuit.push(currentNode);
    currentEdges = removeEdge(currentEdges, nextEdge);
  }

  return circuit;
}

function findNextEdgeDirected(edges: Edge[], currentNode: number): Edge | null {
  return edges.find(edge => edge.from === currentNode) || null;
}

function removeEdge(edges: Edge[], edgeToRemove: Edge): Edge[] {
  return edges.filter(edge => edge.id !== edgeToRemove.id);
}

export default solveCPP;
