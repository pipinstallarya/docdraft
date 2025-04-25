import type React from 'react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { usePresentationMode } from '../context/PresentationContext';
import { formatDate, truncate } from '../utils/helpers';
import {
  FiFolder,
  FiFile,
  FiPlus,
  FiEdit2,
  FiTrash,
  FiFolderPlus,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const {
    state,
    createDocument,
    createFolder,
    deleteDocument,
    deleteFolder,
    updateFolder,
    setCurrentDocument
  } = useAppContext();

  const { isPresentationMode } = usePresentationMode();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    default: true // Default folder is expanded by default
  });

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Start editing folder name
  const startEditingFolder = (folder: { id: string, name: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
  };

  // Save edited folder name
  const saveEditedFolder = (folderId: string) => {
    const folder = state.folders.find(f => f.id === folderId);
    if (folder && newFolderName.trim()) {
      updateFolder({ ...folder, name: newFolderName.trim() });
    }
    setEditingFolderId(null);
  };

  // Handle key press in folder name input
  const handleFolderKeyPress = (e: React.KeyboardEvent, folderId: string) => {
    if (e.key === 'Enter') {
      saveEditedFolder(folderId);
    } else if (e.key === 'Escape') {
      setEditingFolderId(null);
    }
  };

  // Delete folder
  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this folder? Documents will be moved to the default folder.')) {
      deleteFolder(folderId);
    }
  };

  // Delete document
  const handleDeleteDocument = (documentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(documentId);
    }
  };

  // Group documents by folder
  const documentsByFolder: Record<string, typeof state.documents> = {};

  // Initialize with default folder
  documentsByFolder.default = [];

  // Add all folders
  for (const folder of state.folders) {
    documentsByFolder[folder.id] = [];
  }

  // Group documents
  for (const doc of state.documents) {
    if (documentsByFolder[doc.folder]) {
      documentsByFolder[doc.folder].push(doc);
    } else {
      // If folder doesn't exist anymore, put in default
      documentsByFolder.default.push(doc);
    }
  }

  if (collapsed) {
    return (
      <div className="w-14 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-full hover:bg-gray-200 mb-4"
          title="Expand Sidebar"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => createDocument()}
          className="p-2 rounded-full hover:bg-gray-200 mb-2"
          title="New Document"
        >
          <FiFile className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => createFolder()}
          className="p-2 rounded-full hover:bg-gray-200"
          title="New Folder"
        >
          <FiFolder className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  }

  // Create a discreet name for the sidebar in presentation mode
  const sidebarTitle = isPresentationMode ? "Projects" : "Documents";

  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-medium text-gray-700">{sidebarTitle}</h2>
        <div className="flex">
          <button
            onClick={() => createDocument()}
            className="p-1 rounded hover:bg-gray-200 mr-1"
            title="New Document"
          >
            <FiFile className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={() => createFolder()}
            className="p-1 rounded hover:bg-gray-200 mr-1"
            title="New Folder"
          >
            <FiFolderPlus className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-gray-200"
            title="Collapse Sidebar"
          >
            <FiChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Default folder */}
          <div className="mb-1">
            <div
              className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
              onClick={() => toggleFolder('default')}
            >
              {expandedFolders.default ? (
                <FiChevronDown className="w-4 h-4 text-gray-500 mr-1" />
              ) : (
                <FiChevronRight className="w-4 h-4 text-gray-500 mr-1" />
              )}
              <FiFolder className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {isPresentationMode ? "Main Project" : "My Documents"}
              </span>
            </div>

            {expandedFolders.default && (
              <div className="ml-6 mt-1">
                {documentsByFolder.default.map(doc => (
                  <div
                    key={doc.id}
                    className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer text-sm ${
                      state.currentDocumentId === doc.id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => setCurrentDocument(doc.id)}
                  >
                    <FiFile className="w-3.5 h-3.5 text-gray-500 mr-2" />
                    <span className="text-gray-700 flex-1 truncate">
                      {isPresentationMode ? "Document" : truncate(doc.title, 20)}
                    </span>
                    {!isPresentationMode && (
                      <button
                        onClick={(e) => handleDeleteDocument(doc.id, e)}
                        className="p-1 rounded hover:bg-gray-300 opacity-0 group-hover:opacity-100"
                        title="Delete Document"
                      >
                        <FiTrash className="w-3 h-3 text-gray-500" />
                      </button>
                    )}
                  </div>
                ))}

                {documentsByFolder.default.length === 0 && (
                  <div className="text-xs text-gray-500 italic p-1">
                    No documents
                  </div>
                )}

                <button
                  onClick={() => createDocument('default')}
                  className="flex items-center p-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
                >
                  <FiPlus className="w-3 h-3 mr-1" />
                  <span>Add document</span>
                </button>
              </div>
            )}
          </div>

          {/* Custom folders */}
          {state.folders.map(folder => (
            <div key={folder.id} className="mb-1">
              <div
                className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer group"
                onClick={() => toggleFolder(folder.id)}
              >
                {expandedFolders[folder.id] ? (
                  <FiChevronDown className="w-4 h-4 text-gray-500 mr-1" />
                ) : (
                  <FiChevronRight className="w-4 h-4 text-gray-500 mr-1" />
                )}
                <FiFolder className="w-4 h-4 text-gray-500 mr-2" />

                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={() => saveEditedFolder(folder.id)}
                    onKeyDown={(e) => handleFolderKeyPress(e, folder.id)}
                    autoFocus
                    className="text-sm bg-white border border-gray-300 rounded px-1 py-0 flex-1 mr-1"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                    {isPresentationMode ? "Project" : folder.name}
                  </span>
                )}

                {!isPresentationMode && !editingFolderId && (
                  <>
                    <button
                      onClick={(e) => startEditingFolder(folder, e)}
                      className="p-1 rounded hover:bg-gray-300 opacity-0 group-hover:opacity-100 mr-1"
                      title="Rename Folder"
                    >
                      <FiEdit2 className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteFolder(folder.id, e)}
                      className="p-1 rounded hover:bg-gray-300 opacity-0 group-hover:opacity-100"
                      title="Delete Folder"
                    >
                      <FiTrash className="w-3 h-3 text-gray-500" />
                    </button>
                  </>
                )}
              </div>

              {expandedFolders[folder.id] && (
                <div className="ml-6 mt-1">
                  {documentsByFolder[folder.id].map(doc => (
                    <div
                      key={doc.id}
                      className={`flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer text-sm group ${
                        state.currentDocumentId === doc.id ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => setCurrentDocument(doc.id)}
                    >
                      <FiFile className="w-3.5 h-3.5 text-gray-500 mr-2" />
                      <span className="text-gray-700 flex-1 truncate">
                        {isPresentationMode ? "Document" : truncate(doc.title, 20)}
                      </span>
                      {!isPresentationMode && (
                        <button
                          onClick={(e) => handleDeleteDocument(doc.id, e)}
                          className="p-1 rounded hover:bg-gray-300 opacity-0 group-hover:opacity-100"
                          title="Delete Document"
                        >
                          <FiTrash className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  ))}

                  {documentsByFolder[folder.id].length === 0 && (
                    <div className="text-xs text-gray-500 italic p-1">
                      No documents
                    </div>
                  )}

                  <button
                    onClick={() => createDocument(folder.id)}
                    className="flex items-center p-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
                  >
                    <FiPlus className="w-3 h-3 mr-1" />
                    <span>Add document</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
