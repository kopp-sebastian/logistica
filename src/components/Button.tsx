import React from 'react';

interface ButtonProps {
  buttonText: string;
  onClick: () => void;
  className?: string;
  icon?: JSX.Element; // Adding an optional icon prop
}

const Button: React.FC<ButtonProps> = ({ buttonText, onClick, className, icon }) => {
  return (
    <button onClick={onClick} className={className}>
      {icon && <span className="icon-container">{icon}</span>} {/* Display the icon if provided */}
      {buttonText}
    </button>
  );
};

export default Button;
