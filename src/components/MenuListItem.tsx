import React from 'react';

interface MenuListItemProps {
    label: string;
    onClick: () => void;
}

const MenuListItem: React.FC<MenuListItemProps> = ({ label, onClick }) => {
    return (
        <div
            className="w-full py-3 px-6 text-xl font-semibold transition-colors duration-300 hover:bg-gray-100 cursor-pointer"
            onClick={onClick}
        >
            {label}
        </div>
    );
}

export default MenuListItem;
