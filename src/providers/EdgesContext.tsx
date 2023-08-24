import React, { createContext, useContext, useState } from 'react';
import { Node } from './NodesContext';

interface Edge {
    source: Node;
    target: Node;
}

const EdgesContext = createContext<{
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>> | undefined;
}>({
    edges: [],
    setEdges: undefined,
});

export const useEdges = () => {
    const context = useContext(EdgesContext);
    if (!context) {
        throw new Error('useEdges must be used within an EdgesProvider');
    }
    return context;
};

interface EdgesProviderProps {
    children: React.ReactNode;
}

export const EdgesProvider = ({ children }: EdgesProviderProps) => {
    const [edges, setEdges] = useState<Edge[]>([]);

    return (
        <EdgesContext.Provider value={{ edges, setEdges }}>
            {children}
        </EdgesContext.Provider>
    );
};
