import type React from 'react';
import { useState } from 'react';
import { FiKey, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useApiKey } from '../hooks/useApiKey';

interface ApiKeyPromptProps {
  onComplete: () => void;
  onSkip: () => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onComplete, onSkip }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const { saveApiKey, error } = useApiKey();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) return;

    setSaving(true);
    try {
      const success = await saveApiKey(apiKey);
      if (success) {
        onComplete();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full w-16 h-16 mb-4">
            <FiKey className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to DocDraft</h2>
          <p className="text-gray-600">
            To enable content generation features, please enter your OpenAI API key.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && (
              <div className="flex items-center text-red-600 text-sm mt-1">
                <FiAlertTriangle className="mr-1" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Your API key is stored securely in your browser and is never sent to any server other than OpenAI.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-gray-600">Local storage</span>
            </div>
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-gray-600">Encrypted</span>
            </div>
            <div className="flex items-center">
              <FiCheck className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-gray-600">Private</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={onSkip}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={!apiKey.trim() || saving}
            >
              {saving ? 'Setting up...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
