import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { contentService } from '../services/ai';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if API key is configured on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const key = await storageService.getApiKey();
        setApiKey(key);
        setIsConfigured(!!key);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking API key:', err);
        setError('Failed to check API key configuration');
        setIsLoading(false);
      }
    };

    checkApiKey();
  }, []);

  // Save API key
  const saveApiKey = async (key: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate the API key
      const isValid = await contentService.validateApiKey(key);

      if (!isValid) {
        setError('Invalid API key. Please check and try again.');
        setIsLoading(false);
        return false;
      }

      // Save valid key
      await storageService.saveApiKey(key);
      setApiKey(key);
      setIsConfigured(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Error saving API key:', err);
      setError('Failed to save API key');
      setIsLoading(false);
      return false;
    }
  };

  // Clear API key
  const clearApiKey = async () => {
    try {
      setIsLoading(true);
      await storageService.clearApiKey();
      setApiKey('');
      setIsConfigured(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error clearing API key:', err);
      setError('Failed to clear API key');
      setIsLoading(false);
    }
  };

  return {
    apiKey,
    isLoading,
    isConfigured,
    error,
    saveApiKey,
    clearApiKey
  };
}
