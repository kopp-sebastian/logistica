import React, { useState } from 'react';
import Graph from './components/Graph';
import MenuList from './components/MenuList';
import Matrix from './components/Matrix';
import { useNodes } from './providers/NodesContext';
import { useEdges } from './providers/EdgesContext';
import dijkstra from './algorithms/dijkstra';
import ToggleSwitch from './components/ToggleSwitch';
import DijkstraCalculation from './components/DijkstraCalculation';
import AlgorithmInfoDialog from './components/AlgorithmInfoDialog';

const App: React.FC = () => {
  const { nodes, clearNodes } = useNodes();
  const { edges, clearEdges } = useEdges();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [dijkstraResults, setDijkstraResults] = useState<any>(null);
  const [isManualWeightInput, setIsManualWeightInput] = useState(true);
  const [showDijkstraInfo, setShowDijkstraInfo] = useState(false);

  const handleLogisticaClick = () => {
    clearNodes();
    clearEdges();
  };

  const handleDijkstraClick = () => {
    if (selectedNode != null) {
      const results = dijkstra(nodes, edges, selectedNode);
      setDijkstraResults(results);
    }
  };

  const handleDijkstraInfoClick = () => setShowDijkstraInfo(true);
  const handleCloseDijkstraInfo = () => setShowDijkstraInfo(false);

  const handleTSPClick = () => {/* TSP click handler */ };
  const handleCPPClick = () => {/* CPP click handler */ };

  return (
    <div className="flex flex-row h-screen bg-gray-100 select-none">
      <div className="flex flex-col w-64 bg-white shadow-lg">
        <div
          className="flex items-center justify-center w-full h-16 bg-gradient-to-r from-red-500 to-red-800 text-white font-bold cursor-pointer"
          onClick={handleLogisticaClick}
        >
          Logistica
        </div>
        <MenuList
          handleDijkstraClick={handleDijkstraClick}
          handleDijkstraInfoClick={handleDijkstraInfoClick}
          handleTSPClick={handleTSPClick}
          handleTSPInfoClick={handleDijkstraInfoClick}
          handleCPPClick={handleCPPClick}
          handleCPPInfoClick={handleDijkstraInfoClick}
        />
        <div className="mt-auto mb-8">
          <ToggleSwitch
            isManualInput={isManualWeightInput}
            onChange={(checked) => setIsManualWeightInput(checked)}
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6 space-y-4">
        <div className="flex flex-row h-full">
          <Graph onNodeSelect={setSelectedNode} selectedNode={selectedNode} isManualWeightInput={isManualWeightInput} />
          <div className="flex flex-col w-[calc(95vw-1000px)] h-full">
            <div className="flex flex-col bg-white rounded-lg shadow-md h-full">
              <div className="flex flex-col flex-1 overflow-hidden">
                <Matrix />
              </div>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-col flex-1 overflow-hidden">
                <DijkstraCalculation results={dijkstraResults} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDijkstraInfo && (
        <AlgorithmInfoDialog 
          title="Dijkstra Algorithm" 
          onClose={handleCloseDijkstraInfo} 
        />
      )}
    </div>
  );
}

export default App;
