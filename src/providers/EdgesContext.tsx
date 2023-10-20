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
  clearEdges: () => void;
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

  const clearEdges = () => {
    setEdges([]);
  }

  return (
    <EdgesContext.Provider value={{ edges, setEdges, addEdge, clearEdges }}>
      {children}
    </EdgesContext.Provider>
  );
};
