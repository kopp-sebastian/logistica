import React from 'react';
import DOMPurify from 'dompurify';

interface AlgorithmWindowProps {
  title: string;
  content: string;
  onClose: () => void;
}

const AlgorithmWindow: React.FC<AlgorithmWindowProps> = ({ title, content, onClose }) => {
  const createMarkup = () => {
    return { __html: DOMPurify.sanitize(content) };
  };

  // Default message for when no calculation has been made yet
  const defaultContent = "<p>Keine Berechnung durchgeführt. Bitte führen Sie zuerst eine Berechnung aus, um durch die Rechenschritte geführt werden zu können.</p>";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg" style={{ width: '80vw', height: '60vh', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div dangerouslySetInnerHTML={content ? createMarkup() : { __html: DOMPurify.sanitize(defaultContent) }} />
        <button
          className="mt-4 duration-300 hover:bg-gray-100 text-black border-red-700 border-2 py-2 px-4 rounded"
          onClick={onClose}
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

export default AlgorithmWindow;
