import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, EyeOff, Key, X, Save, ExternalLink, ChevronDown } from 'lucide-react';
import { ApiKeys, AIProvider } from '../types';
import { AI_PROVIDERS, getProviderConfig, getProviderList } from '../config/aiProviders';

interface ApiKeySettingsProps {
  apiKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({
  apiKeys,
  onSave,
  onClose,
  isOpen
}) => {
  const [formKeys, setFormKeys] = useState<ApiKeys>(apiKeys);
  const [showUnsplashKey, setShowUnsplashKey] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({
    openaiKey: false,
    anthropicKey: false,
    googleKey: false,
    azureKey: false
  });

  const handleSave = () => {
    onSave(formKeys);
    onClose();
  };

  const handleInputChange = (field: keyof ApiKeys, value: string) => {
    setFormKeys(prev => ({ ...prev, [field]: value }));
  };

  const handleProviderSelect = (providerId: AIProvider) => {
    setFormKeys(prev => ({ ...prev, selectedAIProvider: providerId }));
    setShowProviderDropdown(false);
  };

  const toggleKeyVisibility = (keyName: string) => {
    setShowApiKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const selectedProvider = getProviderConfig(formKeys.selectedAIProvider);
  const providerList = getProviderList();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-testid="settings-backdrop"
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-800">API Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="close-settings"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>Optional:</strong> Add your API keys for enhanced functionality.
                    The app works with fallback content without keys.
                  </p>
                  <p>Your keys are stored locally and never sent to our servers.</p>
                </div>

                {/* Unsplash API Key */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Unsplash Access Key
                    </label>
                    <a
                      href="https://unsplash.com/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                    >
                      Get Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showUnsplashKey ? 'text' : 'password'}
                      value={formKeys.unsplashKey}
                      onChange={(e) => handleInputChange('unsplashKey', e.target.value)}
                      placeholder="Enter your Unsplash access key"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      data-testid="unsplash-key-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUnsplashKey(!showUnsplashKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUnsplashKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    For high-quality, mood-specific images
                  </p>
                </div>

                {/* OpenAI API Key */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      OpenAI API Key
                    </label>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                    >
                      Get Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={formKeys.openaiKey}
                      onChange={(e) => handleInputChange('openaiKey', e.target.value)}
                      placeholder="Enter your OpenAI API key"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      data-testid="openai-key-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    For AI-generated personalized quotes
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  data-testid="save-keys"
                >
                  <Save className="w-4 h-4" />
                  Save Keys
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
