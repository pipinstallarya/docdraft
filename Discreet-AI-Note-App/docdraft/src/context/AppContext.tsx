import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type {
  AppState, AppSettings, Document, Folder
} from '../types';
import { storageService, DEFAULT_SETTINGS } from '../services/storage';
import { createNewDocument, createNewFolder } from '../utils/helpers';

// Define initial state
const initialState: AppState = {
  documents: [],
  folders: [],
  currentDocumentId: null,
  settings: DEFAULT_SETTINGS
};

// Define action types
type Action =
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: string | null }
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'RESET_STATE' };

// Reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };

    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        currentDocumentId: action.payload.id
      };

    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        )
      };

    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        currentDocumentId: state.currentDocumentId === action.payload
          ? null
          : state.currentDocumentId
      };

    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocumentId: action.payload };

    case 'SET_FOLDERS':
      return { ...state, folders: action.payload };

    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] };

    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === action.payload.id ? action.payload : folder
        )
      };

    case 'DELETE_FOLDER': {
      // Move documents in this folder to default
      const updatedDocuments = state.documents.map(doc =>
        doc.folder === action.payload
          ? { ...doc, folder: 'default' }
          : doc
      );

      return {
        ...state,
        folders: state.folders.filter(folder => folder.id !== action.payload),
        documents: updatedDocuments
      };
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Create context
interface AppContextType {
  state: AppState;
  createDocument: (folder?: string) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  setCurrentDocument: (id: string | null) => void;
  createFolder: (name?: string) => void;
  updateFolder: (folder: Folder) => void;
  deleteFolder: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from storage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load documents
        const documents = await storageService.getDocuments();
        dispatch({ type: 'SET_DOCUMENTS', payload: documents });

        // Load folders
        const folders = await storageService.getFolders();
        dispatch({ type: 'SET_FOLDERS', payload: folders });

        // Load current document
        const currentDocumentId = await storageService.getCurrentDocumentId();
        if (currentDocumentId) {
          dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: currentDocumentId });
        }

        // Load settings
        const settings = await storageService.getSettings();
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Save state changes to storage
  useEffect(() => {
    const saveState = async () => {
      try {
        await storageService.saveDocuments(state.documents);
        await storageService.saveFolders(state.folders);
        await storageService.saveCurrentDocumentId(state.currentDocumentId);
        await storageService.saveSettings(state.settings);
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [state.documents, state.folders, state.currentDocumentId, state.settings]);

  // Context actions
  const createDocument = (folder = 'default') => {
    const newDocument = createNewDocument(folder);
    dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
  };

  const updateDocument = (document: Document) => {
    const updatedDocument = {
      ...document,
      updatedAt: Date.now()
    };
    dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
  };

  const deleteDocument = (id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });
  };

  const setCurrentDocument = (id: string | null) => {
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: id });
  };

  const createFolder = (name = 'New Folder') => {
    const newFolder = createNewFolder(name);
    dispatch({ type: 'ADD_FOLDER', payload: newFolder });
  };

  const updateFolder = (folder: Folder) => {
    dispatch({ type: 'UPDATE_FOLDER', payload: folder });
  };

  const deleteFolder = (id: string) => {
    dispatch({ type: 'DELETE_FOLDER', payload: id });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const value = {
    state,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
    createFolder,
    updateFolder,
    deleteFolder,
    updateSettings,
    resetState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
