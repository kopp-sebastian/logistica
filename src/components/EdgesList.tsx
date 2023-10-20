import { useEdges } from '../providers/EdgesContext';

const EdgesList = () => {
    const { edges } = useEdges();

    return (
        <div className="ml-8">
            <h3>Edges:</h3>
            <ul>
                {edges.map((edge) => (
                    <li key={edge.id}>
                        edge{edge.id}: {edge.from} -&gt; {edge.to}; weight: {edge.weight}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EdgesList;