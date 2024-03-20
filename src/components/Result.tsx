import { log } from 'console';
import React from 'react';

interface DijkstraResult {
    distances: { [nodeId: number]: number };
    paths: { [nodeId: string]: number[] };
}

interface CPPResult {
  circuit: number[];
  totalCost: number;
  wastedCost: number;
}

interface TSPResult {
  path: number[]; // The sequence of node IDs for the shortest path
  distance: number; // The total distance of that path
}


interface ResultProps {
  algorithm: 'Dijkstra' | 'CPP' | 'TSP' | null;
  results: DijkstraResult | CPPResult | TSPResult | null;
}

const Result: React.FC<ResultProps> = ({ algorithm, results }) => {
  if (!results) return <div className="text-center text-xl my-8">Keine Berechnung durchgeführt.</div>;
  if (results instanceof Error) {
    return <div className="text-red-500 font-bold">{results.message}</div>;
  }
  console.log(results);
  switch (algorithm) {
    case 'Dijkstra':
      const dijkstraResults = results as DijkstraResult;
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
              {Object.entries(dijkstraResults.paths).map(([node, path]) => (
                <tr key={node} className="border-b">
                  <td className="px-4 py-2">{node}</td>
                  <td className="px-4 py-2">{dijkstraResults.distances[node]}</td>
                  <td className="px-4 py-2">{path.length > 1 ? path[path.length - 2] : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'CPP':
      const cppResults = results as CPPResult;
      return (
        <div className="overflow-auto max-h-[calc(100%-2rem)]">
          <h2 className="text-xl font-bold mb-4">CPP Results</h2>
          <div>
            <p className="mb-2">Circuit: {cppResults.circuit.join(' -> ')}</p>
            <p className="mb-2">Total Cost: {cppResults.totalCost}</p>
            <p>Wasted Cost: {cppResults.wastedCost}</p>
          </div>
        </div>
      );

      case 'TSP':
        const tspResults = results as TSPResult;
        return (
          <div className="overflow-auto max-h-[calc(100%-2rem)]">
            <h2 className="text-xl font-bold mb-4">TSP Results</h2>
            <div>
              <p className="mb-2">Path: {tspResults.path.join(' -> ')}</p>
              <p>Total Distance: {tspResults.distance}</p>
            </div>
          </div>
        );
    default:
      return <div>Unsupported algorithm.</div>;
  }
};

export default Result;
