import React from 'react';

interface MenuButtonProps {
    label: string;
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick }) => {
    return (
        <button
            className="text-red-800 hover:bg-gray-100 py-3 px-6 text-xl font-semibold border-2 border-t-1 transition-colors duration-300"
            onClick={onClick}
        >
            {label}
        </button>
    );
}

export default MenuButton;
