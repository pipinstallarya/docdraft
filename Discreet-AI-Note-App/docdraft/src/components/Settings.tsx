import type React from 'react';
import { useState, useEffect } from 'react';
import { FiX, FiSave, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import { useApiKey } from '../hooks/useApiKey';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings, resetState } = useAppContext();
  const {
    apiKey,
    isConfigured,
    isLoading,
    error,
    saveApiKey,
    clearApiKey
  } = useApiKey();

  const [newApiKey, setNewApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState(state.settings.theme);
  const [fontSize, setFontSize] = useState(state.settings.fontSize);
  const [autoSave, setAutoSave] = useState(state.settings.autoSave);
  const [quickEscapeKey, setQuickEscapeKey] = useState(state.settings.quickEscapeKey);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewApiKey('');
      setShowApiKey(false);
      setTheme(state.settings.theme);
      setFontSize(state.settings.fontSize);
      setAutoSave(state.settings.autoSave);
      setQuickEscapeKey(state.settings.quickEscapeKey);
      setSavedMessage('');
    }
  }, [isOpen, state.settings]);

  // Handle API key save
  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) return;

    setIsSaving(true);
    setSavedMessage('');

    try {
      const success = await saveApiKey(newApiKey);
      if (success) {
        setSavedMessage('API key saved successfully');
        setNewApiKey('');
      }
    } catch (err) {
      console.error('Error saving API key:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle API key clear
  const handleClearApiKey = async () => {
    if (window.confirm('Are you sure you want to remove your API key?')) {
      await clearApiKey();
      setSavedMessage('API key removed');
    }
  };

  // Handle app settings save
  const handleSaveSettings = () => {
    updateSettings({
      theme,
      fontSize,
      autoSave,
      quickEscapeKey
    });
    setSavedMessage('Settings saved successfully');
  };

  // Handle clear all data
  const handleClearAllData = () => {
    if (window.confirm(
      'Are you sure you want to delete all documents and settings? This cannot be undone.'
    )) {
      resetState();
      clearApiKey();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* API Key Section */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2 text-gray-700">Content Generation</h3>

            {isConfigured ? (
              <div className="mb-4">
                <div className="flex items-center text-sm mb-2">
                  <FiCheck className="text-green-500 mr-2" />
                  <span>API key configured</span>
                </div>
                <button
                  onClick={handleClearApiKey}
                  className="text-sm text-red-600 hover:text-red-800"
                  disabled={isLoading}
                >
                  Remove API key
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <div className="mb-2">
                  <label htmlFor="apiKey" className="block text-sm text-gray-700 mb-1">
                    API Key
                  </label>
                  <div className="flex">
                    <input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="flex-1 border rounded-l p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="bg-gray-100 px-2 rounded-r border-y border-r"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm mb-2 flex items-center">
                    <FiAlertTriangle className="mr-1" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSaveApiKey}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center disabled:opacity-50"
                  disabled={!newApiKey.trim() || isLoading || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save API Key'}
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  Your API key is stored locally and never sent to any server other than OpenAI.
                </p>
              </div>
            )}
          </div>

          {/* Other Settings */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 text-gray-700">Application Settings</h3>

            <div className="mb-3">
              <label htmlFor="theme" className="block text-sm text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="fontSize" className="block text-sm text-gray-700 mb-1">
                Font Size
              </label>
              <input
                id="fontSize"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={12}
                max={24}
                className="w-full border rounded p-2 text-sm"
              />
            </div>

            <div className="mb-3 flex items-center">
              <input
                id="autoSave"
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-700">
                Auto-save documents
              </label>
            </div>

            <div className="mb-3">
              <label htmlFor="quickEscapeKey" className="block text-sm text-gray-700 mb-1">
                Quick Escape Key
              </label>
              <select
                id="quickEscapeKey"
                value={quickEscapeKey}
                onChange={(e) => setQuickEscapeKey(e.target.value)}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="Escape">Escape</option>
                <option value="F1">F1</option>
                <option value="F2">F2</option>
                <option value="F3">F3</option>
                <option value="F4">F4</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pressing this key will quickly hide the application content
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              className="mt-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center"
            >
              <FiSave className="mr-1" />
              Save Settings
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-medium mb-2 text-red-600">Danger Zone</h3>
            <button
              onClick={handleClearAllData}
              className="bg-red-100 text-red-700 border border-red-300 px-3 py-1.5 rounded text-sm hover:bg-red-200"
            >
              Clear All Data
            </button>
            <p className="text-xs text-gray-500 mt-1">
              This will delete all your documents, folders, and settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        {savedMessage && (
          <div className="border-t p-3 bg-gray-50 text-center text-sm text-green-600">
            {savedMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
