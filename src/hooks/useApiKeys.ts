import { useState, useEffect } from 'react';
import { ApiKeys } from '../types';
import { DEFAULT_AI_PROVIDER } from '../config/aiProviders';

const STORAGE_KEY = 'mood-wallpaper-api-keys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    unsplashKey: '',
    openaiKey: ''
  });

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedKeys = JSON.parse(stored);
        setApiKeys(parsedKeys);
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
      }
    }
  }, []);

  // Save API keys to localStorage
  const saveApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  };

  // Clear API keys
  const clearApiKeys = () => {
    setApiKeys({ unsplashKey: '', openaiKey: '' });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    apiKeys,
    saveApiKeys,
    clearApiKeys,
    hasUnsplashKey: Boolean(apiKeys.unsplashKey.trim()),
    hasOpenaiKey: Boolean(apiKeys.openaiKey.trim())
  };
};
