import { Node } from '../providers/NodesContext';
import { Edge } from '../providers/EdgesContext';

const convertToCSV = (nodes: Node[], edges: Edge[]): string => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "NodeID,X,Y\n"; // Header for nodes
    nodes.forEach(node => {
        csvContent += `${node.id},${node.x},${node.y}\n`;
    });
    csvContent += "\nEdgeID,FromNodeID,ToNodeID,Weight\n"; // Header for edges
    edges.forEach(edge => {
        csvContent += `${edge.id},${edge.from},${edge.to},${edge.weight}\n`;
    });
    return csvContent;
};

export const exportGraphToCSV = (nodes: Node[], edges: Edge[]) => {
    const csvContent = convertToCSV(nodes, edges);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "graph.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
