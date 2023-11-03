import React from 'react';
import Graph from './components/Graph';
import MenuList from './components/MenuList';
import { useNodes } from './providers/NodesContext';
import { useEdges } from './providers/EdgesContext';
import Matrix from './components/Matrix';

const App: React.FC = () => {
  const { clearNodes } = useNodes();
  const { clearEdges } = useEdges();

  const handleLogisticaClick = () => {
    clearNodes();
    clearEdges();
  };

  const handleDijkstraClick = () => {
    // handle Dijkstra click
  };

  const handleTSPClick = () => {
    // handle TSP click
  };

  const handleCPPClick = () => {
    // handle CPP click
  };

  return (
    <div className="flex flex-row h-screen bg-gray-200">
      <div className="flex flex-col w-64 bg-white shadow-lg">
        <div
          className="flex items-center justify-center w-full h-16 bg-gradient-to-r from-red-500 to-red-800 hover:from-red-600 hover:to-red-900 text-white font-bold"
          onClick={handleLogisticaClick}
        >
          Logistica
        </div>
        <MenuList
          handleDijkstraClick={handleDijkstraClick}
          handleTSPClick={handleTSPClick}
          handleCPPClick={handleCPPClick}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row flex-grow">
          <div className="flex flex-col flex-grow">
            <div className="flex flex-row flex-grow">
              <Graph />
            </div>
          </div>
          <Matrix />
        </div>
      </div>
    </div>
  );
};

export default App;
