import React, { useState, useRef, useCallback } from 'react';
import Graph from './components/Graph';
import MenuList from './components/MenuList';
import Matrix from './components/Matrix';
import { useNodes } from './providers/NodesContext';
import { useEdges } from './providers/EdgesContext';
import dijkstra from './algorithms/dijkstra';
// import * as cpp from "./chinese-postman-problem";  // Import the default export
import solveCPP from './algorithms/cpp';
import AlgorithmInfoDialog from './components/AlgorithmInfoDialog';
import Button from './components/Button';
import { exportGraphToCSV } from './utils/exportGraphToCSV';
import { importGraphFromCSV } from './utils/importGraphFromCSV';
import AlgorithmWindow from './components/AlgorithmWindow';
import Result from './components/Result';
import ToggleSwitch from './components/ToggleSwitch';
import GraphEditorPopup from './components/GraphEditorPopup';

const App: React.FC = () => {
  const { nodes, clearNodes, setNodes, removeNode } = useNodes();
  const { edges, clearEdges, setEdges, removeEdgesByNodeId } = useEdges();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isGraphBidirectional, setIsGraphBidirectional] = useState(true);
  const [isManualWeightInput, setIsManualWeightInput] = useState(true);
  const [showDijkstraInfo, setShowDijkstraInfo] = useState(false);
  const [showAlgorithmWindow, setShowAlgorithmWindow] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<string>('');
  const [currentAlgorithm, setCurrentAlgorithm] = useState<'Dijkstra' | 'TSP' | 'CPP' | null>(null);
  const [algorithmResults, setAlgorithmResults] = useState<any>(null);
  const [showGraphEditor, setShowGraphEditor] = useState(false);
  const { makeEdgesBidirectional } = useEdges();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      importGraphFromCSV(file, setNodes, setEdges);
    }
  };

  const handleGraphEditorToggle = () => {
    setShowGraphEditor(!showGraphEditor);
  };

  const enhancedRemoveNode = useCallback((nodeId) => {
    removeEdgesByNodeId(nodeId); // Remove connected edges
    removeNode(nodeId); // Remove the node
  }, [removeEdgesByNodeId, removeNode]);

  const clearBoard = () => {
    clearNodes();
    clearEdges();
  };

  const handleImportClick = () => {
    clearBoard();
    fileInputRef.current.click();
  }

  const handleDijkstraClick = () => {
    if (selectedNode != null) {
      const results = dijkstra(nodes, edges, selectedNode, isGraphBidirectional);
      setCurrentAlgorithm('Dijkstra');
      setAlgorithmResults({
        distances: results.distances,
        paths: results.paths,
      });
      // Update the algorithmSteps state with the joined HTML string of steps
      setAlgorithmSteps(results.steps.map(step => step.description).join(''));
    }
  };

  const handleDijkstraInfoClick = () => setShowDijkstraInfo(true);
  const handleCloseDijkstraInfo = () => setShowDijkstraInfo(false);

  const handleTSPClick = () => {/* TSP click handler */ }

  const handleCPPClick = async () => {
    try {
      const results = solveCPP(nodes, edges, isGraphBidirectional);
      setCurrentAlgorithm('CPP');
      setAlgorithmResults(results);
    } catch (error) {
      if (error instanceof Error) {
        setAlgorithmResults(error);
      }
    }
  };


  const handleShowAlgorithmExplanation = () => {
    // Optionally, you can set the algorithmSteps state here if it's not set elsewhere
    setShowAlgorithmWindow(true);
  };

  return (
        <div className="flex flex-row h-screen bg-gray-100 select-none">
          <div className="flex flex-col w-64 bg-white shadow-lg">
            <div
              className="flex items-center justify-center w-full h-16 bg-gradient-to-r from-red-500 to-red-800 text-white font-bold cursor-pointer"
              onClick={clearBoard}
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
                labelOn="Manual Weighting"
                labelOff="Automatic Weighting"
                isChecked={isManualWeightInput}
                onChange={(checked) => setIsManualWeightInput(checked)}
              />
              <ToggleSwitch
                labelOn="Bidirectional"
                labelOff="Unidirectional"
                isChecked={isGraphBidirectional}
                onChange={(checked) => {
                  setIsGraphBidirectional(checked); // Continue to set the state
                  // if (checked) {
                  //   makeEdgesBidirectional(); // Additionally make edges bidirectional if the switch is turned on
                  // }
                }}
              />

            </div>
            <Button
              buttonText="Edit Graph"
              onClick={handleGraphEditorToggle}
              className="duration-300 hover:bg-gray-100 text-black border-red-700 border-2 font-cursive py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
              }
            />
            <div className="flex justify-around items-center mb-4">
              <Button
                buttonText="Export"
                onClick={() => exportGraphToCSV(nodes, edges)}
                className="duration-300 hover:bg-gray-100 text-black border-red-700 border-2 py-2 px-3.5 m-2 ml-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
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
                onClick={() => handleImportClick()}
                className="duration-300 hover:bg-gray-100 text-black border-red-700 border-2 py-2 px-3.5 m-2 mr-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
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
              <div className="flex flex-col h-full">
                <Graph onNodeSelect={setSelectedNode} selectedNode={selectedNode} isManualWeightInput={isManualWeightInput} isGraphBidirectional={isGraphBidirectional} />
              </div>
              <div className="flex flex-col w-[calc(95vw-1000px)] h-full">
                <div className="flex flex-col bg-white rounded-lg shadow-md h-full">
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Matrix isGraphBidirectional={isGraphBidirectional} />
                  </div>
                  <hr className="border-t border-gray-300" />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <Result algorithm={currentAlgorithm} results={algorithmResults} />

                  </div>
                  <Button
                    buttonText=""
                    onClick={handleShowAlgorithmExplanation}
                    className="duration-300 hover:bg-gray-100 text-black border-red-800 border-2 py-2 px-4 rounded flex items-center justify-center"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    }
                  />
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
          {showAlgorithmWindow && (
            <AlgorithmWindow
              title="Dijkstra Algorithm"
              content={algorithmSteps}
              onClose={() => setShowAlgorithmWindow(false)}
            />
          )}
          {showGraphEditor &&
            <GraphEditorPopup
              onClose={() => setShowGraphEditor(false)}
            />}
        </div>
  );
}

export default App;
