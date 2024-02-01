import React, { useState, useRef } from 'react';
import Graph from './components/Graph';
import MenuList from './components/MenuList';
import Matrix from './components/Matrix';
import { useNodes } from './providers/NodesContext';
import { useEdges } from './providers/EdgesContext';
import dijkstra from './algorithms/dijkstra';
import ToggleSwitch from './components/ToggleSwitch';
import DijkstraCalculation from './components/DijkstraCalculation';
import AlgorithmInfoDialog from './components/AlgorithmInfoDialog';
import Button from './components/Button';
import { exportGraphToCSV } from './utils/exportGraphToCSV';
import { importGraphFromCSV } from './utils/importGraphFromCSV';


const App: React.FC = () => {
  const { nodes, clearNodes, setNodes } = useNodes();
  const { edges, clearEdges, setEdges } = useEdges();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [dijkstraResults, setDijkstraResults] = useState<any>(null);
  const [isManualWeightInput, setIsManualWeightInput] = useState(true);
  const [showDijkstraInfo, setShowDijkstraInfo] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      importGraphFromCSV(file, setNodes, setEdges);
    }
  };

  const handleLogisticaClick = () => {
    clearNodes();
    clearEdges();
  };

  const handleImportButtonClick = () => {
    clearNodes();
    clearEdges();
    fileInputRef.current.click();
  }

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
        <div className="flex justify-around items-center mb-4">
          <Button
            buttonText="Export"
            onClick={() => exportGraphToCSV(nodes, edges)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            }
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            buttonText="Import"
            onClick={() => fileInputRef.current.click()}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
              </svg>
            }
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
