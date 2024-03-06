// GraphEditorPopup.tsx
import React from 'react';
import { useNodes } from '../providers/NodesContext';
import { useEdges } from '../providers/EdgesContext';

const GraphEditorPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { nodes, removeNode } = useNodes();
  const { edges, removeEdge } = useEdges();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg" style={{ width: '80vw', height: '60vh', maxWidth: '1000px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h2 className="text-xl font-bold mb-4">Edit Graph</h2>
        <div className="flex-1 overflow-hidden">
          <div className="h-1/2 overflow-auto mb-2">
            <h3 className="text-lg font-bold p-2">Nodes</h3>
            {nodes.map((node) => (
              <div key={node.id} className="flex justify-between items-center p-2">
                <span>Node {node.id}: ({node.x}, {node.y})</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                  onClick={() => removeNode(node.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <hr className="self-center h-0.5 bg-gray-400" style={{ width: '100%' }} />
          <div className="h-1/2 overflow-auto mt-3">
            <h3 className="text-lg font-bold p-2">Edges</h3>
            {edges.map((edge) => (
              <div key={edge.id} className="flex justify-between items-center p-2">
                <span>Edge {edge.id}: {edge.from} to {edge.to}, weight: {edge.weight}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                  onClick={() => removeEdge(edge.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-4 duration-300 hover:bg-gray-100 text-black border-red-700 border-2 py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GraphEditorPopup;
