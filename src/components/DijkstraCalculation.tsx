import React from 'react';

interface DijkstraCalculationProps {
  results: {
    distances: { [nodeId: number]: number };
    paths: { [nodeId: string]: number[] };
  } | null;
}

const DijkstraCalculation: React.FC<DijkstraCalculationProps> = ({ results }) => {
  if (!results) return <div>No calculations yet.</div>;

  return (
    <div className="overflow-auto max-h-[calc(100%-2rem)]">
      <h2 className="text-xl font-bold mb-4">Dijkstra Results</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Ziel</th>
            <th className="px-4 py-2 text-left">Entfernung</th>
            <th className="px-4 py-2 text-left">Vorgänger</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results.paths).map(([node, path]) => (
            <tr key={node} className="border-b">
              <td className="px-4 py-2">{node}</td>
              <td className="px-4 py-2">{results.distances[node]}</td>
              <td className="px-4 py-2">{path.length > 1 ? path[path.length - 2] : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DijkstraCalculation;
