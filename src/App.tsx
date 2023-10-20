import Graph from "./components/Graph.tsx";
import NodesList from "./components/NodesList.tsx";
import EdgesList from "./components/EdgesList.tsx";
import MenuListItem from "./components/MenuListItem.tsx";
import { useNodes } from "./providers/NodesContext.tsx";
import { useEdges } from "./providers/EdgesContext.tsx";

function App() {
  const { clearNodes } = useNodes();
  const { clearEdges } = useEdges();

  const handleLogisticaClick = () => {
    clearNodes();
    clearEdges();
  }

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
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div
            className="w-full py-3 px-6 text-xl font-semibold transition-colors duration-300 hover:bg-gray-100 cursor-pointer"
            onClick={handleDijkstraClick}
          >
            Dijkstra
          </div>
          <div
            className="w-full py-3 px-6 text-xl font-semibold transition-colors duration-300 hover:bg-gray-100 cursor-pointer"
            onClick={handleTSPClick}
          >
            TSP
          </div>
          <div
            className="w-full py-3 px-6 text-xl font-semibold transition-colors duration-300 hover:bg-gray-100 cursor-pointer"
            onClick={handleCPPClick}
          >
            CPP
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row flex-grow">
          <div className="flex flex-col flex-grow">
            <div className="flex flex-row flex-grow">
              <Graph />
            </div>
          </div>
          <div className="flex flex-row flex-grow">
            <NodesList />
            <EdgesList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;