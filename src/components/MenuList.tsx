import React from 'react';
import MenuListItem from './MenuListItem';

interface MenuListProps {
  handleDijkstraClick: () => void;
  handleTSPClick: () => void;
  handleCPPClick: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ handleDijkstraClick, handleTSPClick, handleCPPClick }) => {
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <MenuListItem label="Dijkstra" onClick={handleDijkstraClick} />
      <MenuListItem label="TSP" onClick={handleTSPClick} />
      <MenuListItem label="CPP" onClick={handleCPPClick} />
    </div>
  );
};

export default MenuList;
