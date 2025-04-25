import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAppContext } from './AppContext';

interface PresentationContextType {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  quickEscape: () => void;
  isEscaping: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const { state, updateSettings } = useAppContext();
  const [isPresentationMode, setIsPresentationMode] = useState(state.settings.presentationModeEnabled);
  const [isEscaping, setIsEscaping] = useState(false);

  // Sync with app settings
  useEffect(() => {
    setIsPresentationMode(state.settings.presentationModeEnabled);
  }, [state.settings.presentationModeEnabled]);

  // Toggle presentation mode
  const togglePresentationMode = () => {
    const newValue = !isPresentationMode;
    setIsPresentationMode(newValue);
    updateSettings({ presentationModeEnabled: newValue });
  };

  // Setup keyboard shortcut for quick escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === state.settings.quickEscapeKey) {
        quickEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.settings.quickEscapeKey]);

  // Quick escape function
  const quickEscape = () => {
    setIsEscaping(true);

    // Show a blank document or dashboard temporarily

    // Reset after a short delay
    setTimeout(() => {
      setIsEscaping(false);
    }, 2000);
  };

  return (
    <PresentationContext.Provider
      value={{
        isPresentationMode,
        togglePresentationMode,
        quickEscape,
        isEscaping
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentationMode() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentationMode must be used within a PresentationProvider');
  }
  return context;
}
