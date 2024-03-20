import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface AlgorithmInfoDialogProps {
  title: string;
  onClose: () => void;
}

const AlgorithmInfoDialog: React.FC<AlgorithmInfoDialogProps> = ({ title, onClose }) => {

  const [description, setDescription] = useState<string | null>(null);

  let htmlContent = '';
  useEffect(() => {
    fetch('/markdown/dijkstraDescription.md')
      .then(response => response.text())
      .then(text => setDescription(marked.parse(text)))
      .catch(err => console.error(err));
  }, []);
  // Check if description is loaded
  if (description) {
    try {
      htmlContent = marked(description);
    } catch (error) {
      console.error('Error processing Markdown:', error);
      htmlContent = 'Error loading content.'; // Fallback content
    }
  } else {
    htmlContent = 'Loading...'; // Loading state
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="h-auto max-h-[70vh]" />
        <button className="mt-4 duration-300 hover:bg-gray-100 text-black border-red-800 border-2 py-2 px-4 rounded" onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  );
};

export default AlgorithmInfoDialog;
