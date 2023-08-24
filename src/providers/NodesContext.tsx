import React, {createContext, ReactNode, useContext, useState} from "react";

export interface Node {
    x: number;
    y: number;
}

interface NodesContextType {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
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

export const NodesProvider: React.FC<NodesProviderProps> = ({children}) => {
    const [nodes, setNodes] = useState<Node[]>([]);

    return (
        <NodesContext.Provider value={{nodes, setNodes}}>
            {children}
        </NodesContext.Provider>
    );
};
