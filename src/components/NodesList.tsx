import { useNodes } from "../providers/NodesContext.tsx";

const NodesList = () => {
    const { nodes } = useNodes();

    return (
        <div className="ml-8">
            <h3>Nodes:</h3>
            <ul>
                {nodes.map((node, index) => (
                    <li key={index}>
                        node{index + 1}: {node.x.toFixed(2)}, {node.y.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NodesList;
