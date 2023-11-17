import React from 'react';
import MenuListItem from './MenuListItem';

interface MenuListProps {
  handleDijkstraClick: () => void;
  handleDijkstraInfoClick: () => void;
  handleTSPClick: () => void;
  handleTSPInfoClick: () => void;
  handleCPPClick: () => void;
  handleCPPInfoClick: () => void;
}

const MenuList: React.FC<MenuListProps> = (
  { handleDijkstraClick,
    handleDijkstraInfoClick,
    handleTSPClick,
    handleTSPInfoClick,
    handleCPPClick,
    handleCPPInfoClick
  }) => {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <MenuListItem label="Dijkstra" onClick={handleDijkstraClick} onInfoClick={handleDijkstraInfoClick} />
      <MenuListItem label="TSP" onClick={handleTSPClick} onInfoClick={handleTSPInfoClick} />
      <MenuListItem label="CPP" onClick={handleCPPClick} onInfoClick={handleCPPInfoClick} />
    </div>
  );
};

export default MenuList;
