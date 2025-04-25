import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { PresentationProvider } from './context/PresentationContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Settings from './components/Settings';
import Help from './components/Help';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import { useApiKey } from './hooks/useApiKey';
import { fileService } from './services/files';
import { useAppContext } from './context/AppContext';
import { usePresentationMode } from './context/PresentationContext';

function AppContent() {
  const { state, createDocument } = useAppContext();
  const { isEscaping } = usePresentationMode();
  const { isConfigured, isLoading } = useApiKey();

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);

  // Show API key prompt on first load if not configured
  const showApiKeyPrompt = !isLoading && !isConfigured && !initialSetupComplete;

  // Handle new document
  const handleNewDocument = () => {
    createDocument();
  };

  // Handle save document
  const handleSaveDocument = async () => {
    const currentDocument = state.documents.find(
      (doc) => doc.id === state.currentDocumentId
    );

    if (!currentDocument) return;

    try {
      await fileService.saveDocumentToFile(currentDocument);
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document. Please try again.');
    }
  };

  // Quick escape handling
  if (isEscaping) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-400">Loading...</h2>
          <p className="text-gray-300 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  // Show API key prompt if needed
  if (showApiKeyPrompt) {
    return (
      <ApiKeyPrompt
        onComplete={() => setInitialSetupComplete(true)}
        onSkip={() => setInitialSetupComplete(true)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        onNewDocument={handleNewDocument}
        onSaveDocument={handleSaveDocument}
        onOpenSettings={() => setShowSettings(true)}
        onShowHelp={() => setShowHelp(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <Editor onSave={handleSaveDocument} />
      </div>

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <Help isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <PresentationProvider>
          <AppContent />
        </PresentationProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
