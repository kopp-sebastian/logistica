import React from 'react';
import { useNodes } from '../providers/NodesContext';
import { useEdges } from '../providers/EdgesContext';

const Matrix: React.FC = () => {
  const { nodes } = useNodes();
  const { edges } = useEdges();

  // Create a matrix based on the nodes and edges
  const createMatrix = () => {
    const matrix: (string | number)[][] = [];

    nodes.forEach((_, i) => {
      const row: (string | number)[] = [];
      nodes.forEach((_, j) => {
        if (i === j) {
          row.push(0);
          return;
        }
        const edge = edges.find((e) => (e.from === i + 1 && e.to === j + 1));
        row.push(edge ? edge.weight : '-');
      });
      matrix.push(row);
    });

    return matrix;
  };

  const matrix = createMatrix();

  return (
    <div className="overflow-auto max-h-[calc(100%-1rem)]">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b border-gray-300 font-bold">#</th>
            {nodes.map((node, index) => (
              <th key={index} className="py-1 px-2 border-b border-gray-300 font-bold">
                {node.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="py-1 px-2 border-b border-gray-300 text-center font-bold">{nodes[i].id}</td>
              {row.map((cell, j) => (
                <td key={j} className="py-1 px-2 border-b border-gray-300 text-center">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Matrix;
