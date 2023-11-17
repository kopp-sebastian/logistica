interface ToggleSwitchProps {
    isManualInput: boolean;
    onChange: (checked: boolean) => void;
  }
  
  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isManualInput, onChange }) => {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <span className="text-sm text-gray-700 mb-2">{isManualInput ? 'Weighting: Manual' : 'Weighting: Automatic'}</span>
        <label htmlFor="toggle" className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              id="toggle"
              type="checkbox"
              className="sr-only"
              checked={isManualInput}
              onChange={(e) => onChange(e.target.checked)}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              isManualInput ? 'transform translate-x-0' : 'transform translate-x-6'
            }`}></div>
          </div>
        </label>
      </div>
    );
  };
  
  export default ToggleSwitch;
  