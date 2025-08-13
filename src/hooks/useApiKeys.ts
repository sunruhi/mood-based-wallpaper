import { useState, useEffect } from 'react';
import { ApiKeys } from '../types';
import { DEFAULT_AI_PROVIDER } from '../config/aiProviders';
import { DEFAULT_IMAGE_PROVIDER } from '../config/imageProviders';

const STORAGE_KEY = 'mood-wallpaper-api-keys';

const getDefaultApiKeys = (): ApiKeys => ({
  unsplashKey: '',
  selectedAIProvider: DEFAULT_AI_PROVIDER,
  openaiKey: '',
  anthropicKey: '',
  googleKey: '',
  azureKey: '',
  azureEndpoint: ''
});

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(getDefaultApiKeys());

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedKeys = JSON.parse(stored);
        // Merge with defaults to handle missing fields in old stored data
        setApiKeys({ ...getDefaultApiKeys(), ...parsedKeys });
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
        setApiKeys(getDefaultApiKeys());
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
    const defaultKeys = getDefaultApiKeys();
    setApiKeys(defaultKeys);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get the current AI provider's API key
  const getCurrentAIKey = (): string => {
    switch (apiKeys.selectedAIProvider) {
      case 'openai':
        return apiKeys.openaiKey;
      case 'anthropic':
        return apiKeys.anthropicKey;
      case 'google':
        return apiKeys.googleKey;
      case 'azure':
        return apiKeys.azureKey;
      case 'free':
      default:
        return '';
    }
  };

  return {
    apiKeys,
    saveApiKeys,
    clearApiKeys,
    getCurrentAIKey,
    hasUnsplashKey: Boolean(apiKeys.unsplashKey.trim()),
    hasOpenaiKey: Boolean(apiKeys.openaiKey.trim()),
    hasCurrentAIKey: Boolean(getCurrentAIKey().trim()),
    selectedAIProvider: apiKeys.selectedAIProvider
  };
};
