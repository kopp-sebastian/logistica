import React, { useState, useEffect, useRef } from 'react';
import { Node } from '../providers/NodesContext';

interface WeightingDialogProps {
  sourceNode: Node | null;
  targetNode: Node | null;
  onClose: (weighting: number, sourceNode: Node | null) => void;
}

const WeightingDialog: React.FC<WeightingDialogProps> = ({ sourceNode, targetNode, onClose }) => {
  const [weighting, setWeighting] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  const handleWeightingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeighting(Number(event.target.value));
  };

  const handleConfirmClick = () => {
    onClose(weighting, sourceNode);
  };

  const handleCancelClick = () => {
    onClose(0, null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleConfirmClick();
    }
  };

  useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        handleConfirmClick();
      }
    };
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [weighting]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <div className="mb-4">Set Edge Weighting</div>
        <div className="mb-4">
          <div className="flex items-center">
            <label htmlFor="weighting-input" className="mr-2">Weighting:</label>
            <input
              autoFocus
              ref={inputRef}
              type="number"
              id="weighting-input"
              name="weighting-input"
              min="1"
              max="100"
              value={weighting}
              onChange={handleWeightingChange}
              onKeyDown={handleKeyDown}
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
        <div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleConfirmClick}>
            Confirm
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightingDialog;
