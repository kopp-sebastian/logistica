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
  const matchingEdges = naiveMinimumWeightPerfectMatching(oddVertices, shortestPaths);
  const augmentedEdges = edges.concat(matchingEdges); // Combine original edges with matching edges
  const circuit = constructEulerianCircuit(nodes, augmentedEdges);


  // Calculate total cost of the circuit
  let totalCost = 0;
  for (let i = 0; i < circuit.length - 1; i++) {
    const fromNode = circuit[i];
    const toNode = circuit[i + 1];
    const edge = augmentedEdges.find(edge => (edge.from === fromNode && edge.to === toNode) || (edge.from === toNode && edge.to === fromNode));
    if (edge) {
      totalCost += edge.weight;
    }
  }

  // Assuming originalCost is the sum of all original edges before augmentation
  const originalCost = edges.reduce((acc, edge) => acc + edge.weight, 0);
  const wastedCost = totalCost - originalCost;

  return { circuit, totalCost, wastedCost };
}

function removeEdge(edges: Edge[], edgeToRemove: Edge): Edge[] {
  return edges.filter(edge => edge !== edgeToRemove);
}

function findNextEdge(nodes: Node[], edges: Edge[], currentVertex: number): Edge | null {
  for (let edge of edges) {
    if (edge.from === currentVertex || edge.to === currentVertex) {
      return edge;
    }
  }
  return null; // No next edge found, which shouldn't happen in a proper Eulerian circuit
}

function constructEulerianCircuit(nodes: Node[], edges: Edge[]): number[] {
  let circuit: number[] = [];
  let currentEdges = [...edges]; // Clone the edges array to manipulate it
  let currentnumber = edges[0].from; // Start from the first edge's starting point
  circuit.push(currentnumber);

  while (currentEdges.length > 0) {
    const nextEdge = findNextEdge(nodes, currentEdges, currentnumber);
    if (!nextEdge) break; // Break the loop if no next edge is found

    // Add the next node to the circuit and remove the edge from the list
    currentnumber = nextEdge.from === currentnumber ? nextEdge.to : nextEdge.from;
    circuit.push(currentnumber);
    currentEdges = removeEdge(currentEdges, nextEdge);
  }

  return circuit;
}

// Naive implementation for pairing odd-degree vertices based on shortest paths
function naiveMinimumWeightPerfectMatching(oddVertices: number[], shortestPaths: Map<string, number>): Edge[] {
  let minWeightMatching: Edge[] = [];
  let usedVertices = new Set<number>();

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
        id: Math.random(), // Placeholder ID
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

function generateNewEdgeId(): number {
  return newEdgeId++;
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

function findOddDegreeVertices(nodes: Node[], edges: Edge[]): number[] {
  const degree = new Map<number, number>();
  edges.forEach(edge => {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
  });

  return Array.from(degree).filter(([_, deg]) => deg % 2 !== 0).map(([nodeId]) => nodeId);
}

export default solveCPP;