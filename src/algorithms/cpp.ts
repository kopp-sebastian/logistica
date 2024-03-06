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

function solveCPP(nodes: Node[], edges: Edge[], isGraphBidirectional: boolean): { circuit: number[], totalCost: number, wastedCost: number } {
  // Preliminary check for graph connectivity and reachability
  if (!isGraphBidirectional && !checkGraphConnectivity(nodes, edges)) {
    throw new Error("Fehler: Graph nicht lösbar!");
  }

  const oddVertices = findOddDegreeVertices(nodes, edges, isGraphBidirectional);

  // If the graph has odd vertices and is unidirectional, it may not be solvable
  /*if (!isGraphBidirectional && oddVertices.length > 0) {
    throw new Error("Fehler: Graph nicht lösbar!");
  }*/

  if (!isGraphBidirectional && !checkEulerianPathOrCircuitConditions(nodes, edges)) {
    throw new Error("Fehler: Graph nicht lösbar!");
  }  

  const allPairsShortestPaths = precomputeAllPairsShortestPaths(nodes, edges, isGraphBidirectional);
  const matchingEdges = naiveMinimumWeightPerfectMatching(oddVertices, allPairsShortestPaths, edges);
  const augmentedEdges = edges.concat(matchingEdges);

  const circuit = constructEulerianCircuit(nodes, augmentedEdges, allPairsShortestPaths, isGraphBidirectional, oddVertices);

  let totalCost = 0;
  const traversedEdges = new Set<number>();

  for (let i = 0; i < circuit.length - 1; i++) {
    const fromNode = circuit[i];
    const toNode = circuit[i + 1];
    const edge = augmentedEdges.find(edge =>
      edge.from === fromNode && edge.to === toNode || (isGraphBidirectional && edge.to === fromNode && edge.from === toNode)
    );

    if (edge) {
      totalCost += edge.weight;
      traversedEdges.add(edge.id);
    }
  }

  const originalCost = edges.reduce((acc, edge) => acc + edge.weight, 0);
  const wastedCost = totalCost - originalCost;

  return { circuit, totalCost, wastedCost };
}

function findOddDegreeVertices(nodes: Node[], edges: Edge[], isGraphBidirectional: boolean): number[] {
  const degree = new Map<number, number>();
  edges.forEach(edge => {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
  });
  return Array.from(degree).filter(([_, deg]) => deg % 2 !== 0).map(([nodeId]) => nodeId);
}

function precomputeAllPairsShortestPaths(nodes: Node[], edges: Edge[], isGraphBidirectional: boolean): Map<string, number>[] {
  const allPairsShortestPaths: Map<string, number>[] = [];
  for (let sourceNode of nodes) {
    const { distances } = dijkstra(nodes, edges, sourceNode.id, isGraphBidirectional);
    const shortestPathsMap = new Map<string, number>();
    for (const [nodeId, distance] of Object.entries(distances)) {
      shortestPathsMap.set(`<span class="math-inline">\{sourceNode\}\-</span>{nodeId}`, distance);
    }
    allPairsShortestPaths.push(shortestPathsMap);
  }
  return allPairsShortestPaths;
}

function naiveMinimumWeightPerfectMatching(oddVertices: number[], allPairsShortestPaths: Map<string, number>[], edges: Edge[]): Edge[] {
  let minWeightMatching: Edge[] = [];
  let usedVertices = new Set<number>();
  let newEdgeId = edges.length > 0 ? Math.max(...edges.map(edge => edge.id)) + 1 : 1;

  oddVertices = [...oddVertices]; // Clone to prevent mutation during while loop

  while (oddVertices.length > 0) {
    let currentVertex = oddVertices.shift();
    if (currentVertex === undefined || usedVertices.has(currentVertex)) continue;

    let minDistance = Infinity;
    let pairVertex: number | null = null;
    for (let oddVertex of oddVertices) {
      if (usedVertices.has(oddVertex)) continue;
      const distance = allPairsShortestPaths[currentVertex].get(`<span class="math-inline">\{currentVertex\}\-</span>{oddVertex}`);
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
      oddVertices = oddVertices.filter(v => v !== pairVertex);
    }
  }

  return minWeightMatching;
}

function constructEulerianCircuit(nodes: Node[], edges: Edge[], allPairsShortestPaths: Map<string, number>[], isGraphBidirectional: boolean, oddVertices: number[]): number[] {
  let circuit: number[] = [];
  const usedEdges = new Set<number>();

  // Choose any starting node with an odd degree (if one exists)
  const startingNode = oddVertices.length > 0 ? oddVertices[0] : nodes[0].id;

  let currentNode = startingNode;
  circuit.push(currentNode);

  while (usedEdges.size < edges.length) {
    let nextEdge: Edge | undefined;
    for (const edge of edges) {
      if (!usedEdges.has(edge.id) && (edge.from === currentNode || (isGraphBidirectional && edge.to === currentNode))) {
        nextEdge = edge;
        break;
      }
    }

    if (!nextEdge) {
      // If no outgoing edges are found, backtrack and choose another unused edge leading into the current node
      for (const edge of edges.filter(edge => !usedEdges.has(edge.id))) {
        if (edge.to === currentNode) {
          nextEdge = edge;
          break;
        }
      }

      if (!nextEdge) {
        // No more valid edges, circuit is incomplete
        return circuit;
      }
    }

    currentNode = nextEdge.to === currentNode && isGraphBidirectional ? nextEdge.from : nextEdge.to;
    circuit.push(currentNode);
    usedEdges.add(nextEdge.id);
  }

  return circuit;
}

function checkGraphConnectivity(nodes: Node[], edges: Edge[]): boolean {
  if (nodes.length === 0 || edges.length === 0) return true; // Empty graph or no edges means trivially "connected" for CPP

  const adjacencyList = new Map<number, number[]>();

  // Build an undirected adjacency list for connectivity check
  edges.forEach(edge => {
    if (!adjacencyList.has(edge.from)) {
      adjacencyList.set(edge.from, []);
    }
    if (!adjacencyList.has(edge.to)) {
      adjacencyList.set(edge.to, []);
    }
    adjacencyList.get(edge.from)!.push(edge.to);
    adjacencyList.get(edge.to)!.push(edge.from); // Add the reverse direction to simulate undirected connectivity
  });

  const visited = new Set<number>();

  const dfs = (node: number) => {
    visited.add(node);
    (adjacencyList.get(node) || []).forEach(neighbor => {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    });
  };

  // Start DFS from the first node
  dfs(nodes[0].id);

  // If every node is visited, the graph is weakly connected
  return visited.size === nodes.length;
}

function checkEulerianPathOrCircuitConditions(nodes: Node[], edges: Edge[]): boolean {
  const inDegree = new Map<number, number>();
  const outDegree = new Map<number, number>();

  // Initialize in-degree and out-degree for each node
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    outDegree.set(node.id, 0);
  });

  // Calculate in-degree and out-degree for each node
  edges.forEach(edge => {
    outDegree.set(edge.from, (outDegree.get(edge.from) || 0) + 1);
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  let startPoints = 0; // Nodes with out-degree - in-degree = 1
  let endPoints = 0;   // Nodes with in-degree - out-degree = 1
  let hasError = false; // To track if the condition fails

  nodes.forEach(node => {
    const diff = (outDegree.get(node.id) || 0) - (inDegree.get(node.id) || 0);
    if (diff === 1) {
      startPoints += 1;
    } else if (diff === -1) {
      endPoints += 1;
    } else if (diff !== 0) {
      hasError = true;
    }
  });

  if(hasError) {
      return false; // Correctly return false if the graph cannot have an Eulerian path or circuit
  }

  // For Eulerian Circuit, startPoints and endPoints must both be 0
  // For Eulerian Path, startPoints and endPoints must both be exactly 1
  return (startPoints === 0 && endPoints === 0) || (startPoints === 1 && endPoints === 1);
}



export default solveCPP;
