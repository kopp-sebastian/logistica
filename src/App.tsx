import Graph from "./components/Graph.tsx";
import NodesList from "./components/NodesList.tsx";
import MenuListItem from "./components/MenuListItem.tsx";

function App() {
  const handleDijkstraClick = () => {
    // handle Dijkstra click
  };

  const handleTSPClick = () => {
    // handle TSP click
  };

  const handleCPPClick = () => {
    // handle CPP click
  };

  const handleTestClick = () => {
    // handle Test click
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div className="text-red-800 hover:bg-gray-100 py-3 px-6 text-xl font-semibold border-2 border-t-1 transition-colors duration-300">
          <p className="font-mono font-bold text-2xl ml-3 mt-6 mb-6 mr-3">
            Logistica
          </p>
        </div>
        <MenuListItem label="Dijkstra" onClick={handleDijkstraClick} />
        <MenuListItem label="TSP" onClick={handleTSPClick} />
        <MenuListItem label="CPP" onClick={handleCPPClick} />
        <MenuListItem label="Test" onClick={handleTestClick} />
      </div>
      <Graph />
      <NodesList />
    </div>
  );
}

export default App;