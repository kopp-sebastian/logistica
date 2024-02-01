import { Node, useNodes } from '../providers/NodesContext';
import { Edge, useEdges } from '../providers/EdgesContext';

const parseCSV = (csvString: string): { nodes: Node[], edges: Edge[] } => {
    const lines = csvString.split('\n');
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    let mode = 'nodes'; // Start with nodes
    for (let line of lines) {
        if (line.trim() === '') {
            mode = 'edges'; // Switch to edges
            continue;
        }

        const parts = line.split(',');
        if (mode === 'nodes' && parts.length === 3) {
            const id = parseInt(parts[0]);
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            if (!isNaN(id) && !isNaN(x) && !isNaN(y)) {
                nodes.push({ id, x, y });
            }
        } else if (mode === 'edges' && parts.length === 4) {
            const id = parseInt(parts[0]);
            const from = parseInt(parts[1]);
            const to = parseInt(parts[2]);
            const weight = parseFloat(parts[3]);
            if (!isNaN(id) && !isNaN(from) && !isNaN(to) && !isNaN(weight)) {
                edges.push({ id, from, to, weight });
            }
        }
    }

    return { nodes, edges };
};

export const importGraphFromCSV = (file: File, setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) => {
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
            const { nodes, edges } = parseCSV(text);
            setNodes(nodes);
            setEdges(edges);
        }
    };
    reader.readAsText(file);
};
