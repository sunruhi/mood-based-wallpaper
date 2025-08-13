import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, EyeOff, Key, X, Save, ExternalLink, ChevronDown } from 'lucide-react';
import { ApiKeys, AIProvider, ImageProvider } from '../types';
import { AI_PROVIDERS, getProviderConfig, getProviderList } from '../config/aiProviders';
import { IMAGE_PROVIDERS, getImageProviderConfig, getImageProviderList } from '../config/imageProviders';

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
  const [showImageProviderDropdown, setShowImageProviderDropdown] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({
    openaiKey: false,
    anthropicKey: false,
    googleKey: false,
    azureKey: false,
    pixabayKey: false,
    pexelsKey: false
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const imageDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProviderDropdown(false);
      }
    };

    if (showProviderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProviderDropdown]);

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
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col backdrop-blur-sm border border-gray-100">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">API Settings</h2>
                      <p className="text-sm text-white opacity-80">Configure your API preferences</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 text-white"
                    data-testid="close-settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">ℹ</span>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700 mb-2 font-medium">
                        <span className="text-blue-600 font-semibold">Optional:</span> Add your API keys for enhanced functionality.
                        The app works with fallback content without keys.
                      </p>
                      <p className="text-gray-600">🔒 Your keys are stored locally and never sent to our servers.</p>
                    </div>
                  </div>
                </div>

                {/* Unsplash API Key */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📷</span>
                      </div>
                      <label className="text-sm font-semibold text-gray-800">
                        Unsplash Access Key
                      </label>
                    </div>
                    <a
                      href="https://unsplash.com/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1 font-medium transition-colors"
                    >
                      Get Key <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showUnsplashKey ? 'text' : 'password'}
                      value={formKeys.unsplashKey}
                      onChange={(e) => handleInputChange('unsplashKey', e.target.value)}
                      placeholder="Enter your Unsplash access key"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all"
                      data-testid="unsplash-key-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUnsplashKey(!showUnsplashKey)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showUnsplashKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 bg-white px-3 py-2 rounded-lg">
                    🌟 For high-quality, mood-specific images from professional photographers
                  </p>
                </div>

                {/* AI Provider Selection */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🤖</span>
                    </div>
                    <label className="text-sm font-semibold text-gray-800">
                      AI Quote Provider
                    </label>
                  </div>

                  {/* Provider Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                      className="w-full flex items-center justify-between px-4 py-4 bg-white border border-gray-300 rounded-xl hover:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                          {selectedProvider.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{selectedProvider.name}</div>
                          <div className="text-sm text-gray-600">{selectedProvider.description}</div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showProviderDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showProviderDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto backdrop-blur-sm"
                        >
                          {providerList.map((provider, index) => (
                            <motion.button
                              key={provider.id}
                              type="button"
                              onClick={() => handleProviderSelect(provider.id)}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all duration-200 ${
                                formKeys.selectedAIProvider === provider.id
                                  ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 border-l-4 border-purple-500'
                                  : 'text-gray-900 hover:bg-gray-50'
                              } ${index === 0 ? 'rounded-t-xl' : ''} ${index === providerList.length - 1 ? 'rounded-b-xl' : ''}`}
                            >
                              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                                {provider.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold">{provider.name}</div>
                                <div className="text-sm text-gray-500">{provider.description}</div>
                              </div>
                              {formKeys.selectedAIProvider === provider.id && (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-medium text-purple-600">Active</span>
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Dynamic API Key Field */}
                {selectedProvider.requiresApiKey && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-lg">{selectedProvider.icon}</div>
                        <label className="text-sm font-semibold text-gray-800">
                          {selectedProvider.name} API Key
                        </label>
                      </div>
                      {selectedProvider.getKeyUrl && (
                        <a
                          href={selectedProvider.getKeyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:text-purple-600 text-sm flex items-center gap-1 font-medium transition-colors bg-purple-50 px-3 py-1 rounded-lg hover:bg-purple-100"
                        >
                          Get Key <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* API Key Input */}
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showApiKeys[`${selectedProvider.id}Key`] ? 'text' : 'password'}
                        value={formKeys[`${selectedProvider.id}Key` as keyof ApiKeys] as string || ''}
                        onChange={(e) => handleInputChange(`${selectedProvider.id}Key` as keyof ApiKeys, e.target.value)}
                        placeholder={`Enter your ${selectedProvider.name} API key`}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm"
                        data-testid={`${selectedProvider.id}-key-input`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleKeyVisibility(`${selectedProvider.id}Key`)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showApiKeys[`${selectedProvider.id}Key`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Azure Endpoint Field (only for Azure) */}
                    {selectedProvider.id === 'azure' && (
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formKeys.azureEndpoint || ''}
                          onChange={(e) => handleInputChange('azureEndpoint', e.target.value)}
                          placeholder="Enter your Azure OpenAI endpoint"
                          className="w-full pl-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm"
                          data-testid="azure-endpoint-input"
                        />
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 rounded-lg border border-purple-100">
                      <p className="text-sm text-gray-700">
                        🎯 <strong>AI-generated personalized quotes</strong> tailored to your selected mood
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex gap-4 p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  data-testid="save-keys"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
