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

                {/* AI Provider Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    AI Quote Provider
                  </label>

                  {/* Provider Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{selectedProvider.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{selectedProvider.name}</div>
                          <div className="text-sm text-gray-500">{selectedProvider.description}</div>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProviderDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showProviderDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          {providerList.map((provider) => (
                            <button
                              key={provider.id}
                              type="button"
                              onClick={() => handleProviderSelect(provider.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                                formKeys.selectedAIProvider === provider.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                              }`}
                            >
                              <span className="text-lg">{provider.icon}</span>
                              <div>
                                <div className="font-medium">{provider.name}</div>
                                <div className="text-sm text-gray-500">{provider.description}</div>
                              </div>
                              {formKeys.selectedAIProvider === provider.id && (
                                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Dynamic API Key Field */}
                {selectedProvider.requiresApiKey && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        {selectedProvider.name} API Key
                      </label>
                      {selectedProvider.getKeyUrl && (
                        <a
                          href={selectedProvider.getKeyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                        >
                          Get Key <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* API Key Input */}
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showApiKeys[`${selectedProvider.id}Key`] ? 'text' : 'password'}
                        value={formKeys[`${selectedProvider.id}Key` as keyof ApiKeys] as string || ''}
                        onChange={(e) => handleInputChange(`${selectedProvider.id}Key` as keyof ApiKeys, e.target.value)}
                        placeholder={`Enter your ${selectedProvider.name} API key`}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid={`${selectedProvider.id}-key-input`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility(`${selectedProvider.id}Key`)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKeys[`${selectedProvider.id}Key`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Azure Endpoint Field (only for Azure) */}
                    {selectedProvider.id === 'azure' && (
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formKeys.azureEndpoint || ''}
                          onChange={(e) => handleInputChange('azureEndpoint', e.target.value)}
                          placeholder="Enter your Azure OpenAI endpoint"
                          className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          data-testid="azure-endpoint-input"
                        />
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      For AI-generated personalized quotes
                    </p>
                  </div>
                )}
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
