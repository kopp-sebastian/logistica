import React, { useState } from 'react';

interface ToggleSwitchProps {
  labelOn: string;
  labelOff: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  labelOn,
  labelOff,
  isChecked,
  onChange,
}) => {
  // Generate a unique ID for each toggle switch instance
  const [toggleId] = useState(`toggle-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <span className="text-sm text-gray-700 mb-2">
        {isChecked ? labelOn : labelOff}
      </span>
      <label htmlFor={toggleId} className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            id={toggleId}
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
            isChecked ? 'transform translate-x-6' : 'transform translate-x-0'
          }`}></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
