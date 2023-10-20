import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Node {
  id: number;
  x: number;
  y: number;
}

interface NodesContextType {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  addNode: (node: Node) => void;
  clearNodes: () => void;
}

const NodesContext = createContext<NodesContextType | undefined>(undefined);

export const useNodes = () => {
  const context = useContext(NodesContext);
  if (!context) {
    throw new Error("useNodes must be used within a NodesProvider");
  }
  return context;
};

interface NodesProviderProps {
  children: ReactNode;
}

export const NodesProvider: React.FC<NodesProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  const addNode = (node: Node) => {
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  const clearNodes = () => {
    setNodes([]);
  };

  return (
    <NodesContext.Provider value={{ nodes, setNodes, addNode, clearNodes }}>
      {children}
    </NodesContext.Provider>
  );
};
