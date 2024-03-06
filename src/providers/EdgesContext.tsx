import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Edge {
  id: number;
  from: number;
  to: number;
  weight: number;
}

interface EdgesContextType {
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  addEdge: (from: number, to: number, weight: number) => void;
  makeEdgesBidirectional: () => void; // New function declaration
  clearEdges: () => void;
  removeEdge: (id: number) => void;
  removeEdgesByNodeId: (nodeId: number) => void;
}

const EdgesContext = createContext<EdgesContextType | undefined>(undefined);

export const useEdges = () => {
  const context = useContext(EdgesContext);
  if (!context) {
    throw new Error('useEdges must be used within an EdgesProvider');
  }
  return context;
};

interface EdgesProviderProps {
  children: ReactNode;
}

export const EdgesProvider: React.FC<EdgesProviderProps> = ({ children }) => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nextEdgeId, setNextEdgeId] = useState(1);

  const addEdge = (from: number, to: number, weight: number) => {
    setEdges((prevEdges) => [
      ...prevEdges,
      { id: nextEdgeId, from, to, weight },
    ]);
    setNextEdgeId(nextEdgeId + 1);
  };

  const makeEdgesBidirectional = () => {
    console.log('Making edges bidirectional');
    setEdges((prevEdges) => {
      let modified = false;
      const edgeMap = new Map();
      const newEdges = [...prevEdges];

      // Create a map for quick lookup
      prevEdges.forEach(edge => {
        edgeMap.set(`${edge.from}-${edge.to}`, edge);
      });

      // Check for missing reverse edges and prepare to add them
      prevEdges.forEach(edge => {
        if (!edgeMap.has(`${edge.to}-${edge.from}`)) {
          modified = true;
          const newEdge = {
            id: nextEdgeId,
            from: edge.to,
            to: edge.from,
            weight: edge.weight,
          };
          newEdges.push(newEdge);
          setNextEdgeId((currentId) => currentId + newEdges.length - prevEdges.length);
        }
      });

      if (modified) {
        console.log('Adding bidirectional edges', newEdges);
        setNextEdgeId(nextEdgeId); // Update the nextEdgeId
      }

      return newEdges; // Return the updated edges array
    });
  };

  const clearEdges = () => {
    setEdges([]);
  }

  const removeEdge = (id: number) => {
    setEdges((prevEdges) => prevEdges.filter(edge => edge.id !== id));
  };

  const removeEdgesByNodeId = (nodeId: number) => {
    setEdges((currentEdges) => currentEdges.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
  };

  return (
    <EdgesContext.Provider value={{ edges, setEdges, addEdge, makeEdgesBidirectional, clearEdges, removeEdge, removeEdgesByNodeId }}>
      {children}
    </EdgesContext.Provider>
  );
};
