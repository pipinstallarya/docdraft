import type React from 'react';
import { useAppContext } from '../context/AppContext';
import { usePresentationMode } from '../context/PresentationContext';
import {
  FiFile,
  FiSave,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiHelpCircle
} from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onNewDocument: () => void;
  onSaveDocument: () => void;
  onOpenSettings: () => void;
  onShowHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNewDocument,
  onSaveDocument,
  onOpenSettings,
  onShowHelp
}) => {
  const { state } = useAppContext();
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();

  // Get the current document
  const currentDocument = state.documents.find(
    doc => doc.id === state.currentDocumentId
  );

  return (
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      {/* Logo and title */}
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700 dark:text-gray-300"
          >
            <rect x="5" y="3" width="22" height="26" rx="2" fill="currentColor"/>
            <rect x="9" y="8" width="14" height="2" rx="1" fill="#FFF"/>
            <rect x="9" y="13" width="14" height="2" rx="1" fill="#FFF"/>
            <rect x="9" y="18" width="10" height="2" rx="1" fill="#FFF"/>
            <rect x="9" y="23" width="7" height="2" rx="1" fill="#FFF"/>
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">DocDraft</h1>

        {/* Current document title - simplified in presentation mode */}
        {currentDocument && (
          <div className="ml-4 text-sm text-gray-500 dark:text-gray-400 border-l pl-4 border-gray-300 dark:border-gray-600">
            {isPresentationMode
              ? 'Document'
              : currentDocument.title || 'Untitled Document'}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onNewDocument}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="New Document"
        >
          <FiFile className="w-4 h-4" />
        </button>

        <button
          onClick={onSaveDocument}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Save Document"
        >
          <FiSave className="w-4 h-4" />
        </button>

        <button
          onClick={togglePresentationMode}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isPresentationMode ? "Exit Presentation Mode" : "Enter Presentation Mode"}
        >
          {isPresentationMode ? (
            <FiEyeOff className="w-4 h-4" />
          ) : (
            <FiEye className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onShowHelp}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Help"
        >
          <FiHelpCircle className="w-4 h-4" />
        </button>

        <ThemeToggle className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700" />

        <button
          onClick={onOpenSettings}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Settings"
        >
          <FiSettings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
