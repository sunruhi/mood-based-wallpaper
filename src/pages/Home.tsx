import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, Type } from 'lucide-react';
import { MoodCard } from '../components/MoodCard';
import { ImageDisplay } from '../components/ImageDisplay';
import { DownloadButton } from '../components/DownloadButton';
import { ShareButton } from '../components/ShareButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ApiKeySettings } from '../components/ApiKeySettings';
import { HistoryPanel } from '../components/HistoryPanel';
import { CustomQuoteInput } from '../components/CustomQuoteInput';
import { useImageAPI } from '../hooks/useImageAPI';
import { useOpenAI } from '../hooks/useOpenAI';
import { useApiKeys } from '../hooks/useApiKeys';
import { useWallpaperHistory } from '../hooks/useWallpaperHistory';
import { MOODS } from '../config/moods';
import { AI_PROVIDERS } from '../config/aiProviders';
import { IMAGE_PROVIDERS } from '../config/imageProviders';
import { WallpaperData, Mood, SavedWallpaper } from '../types';

export const Home: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [wallpaperData, setWallpaperData] = useState<WallpaperData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomQuote, setShowCustomQuote] = useState(false);
  const [customQuote, setCustomQuote] = useState<{text: string; author?: string} | null>(null);

  const { apiKeys, saveApiKeys, hasCurrentImageKey, hasCurrentAIKey, getCurrentAIKey, getCurrentImageKey, selectedAIProvider, selectedImageProvider } = useApiKeys();
  const { fetchImageByMood, loading: imageLoading, error: imageError } = useImageAPI(selectedImageProvider, getCurrentImageKey());
  const { generateQuote, loading: quoteLoading, error: quoteError } = useOpenAI(
    getCurrentAIKey(),
    selectedAIProvider,
    apiKeys.azureEndpoint
  );
  const {
    history,
    saveWallpaper,
    removeWallpaper,
    clearHistory,
    toggleFavorite,
    totalCount
  } = useWallpaperHistory();

  // Handle shared wallpaper from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get('mood') as Mood;
    const quote = urlParams.get('quote');
    const author = urlParams.get('author');
    const imageId = urlParams.get('image');

    if (mood && quote && Object.keys(MOODS).includes(mood)) {
      setCustomQuote({ text: quote, author: author || undefined });
      setSelectedMood(mood);

      // Clear URL parameters after processing
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Generate wallpaper with shared parameters
      handleMoodSelect(mood);
    }
  }, []);

  const handleMoodSelect = async (moodId: string) => {
    const mood = moodId as Mood;
    setSelectedMood(mood);
    setWallpaperData(null);
    setIsGenerating(true);

    try {
      // Generate image and quote in parallel
      const [image, quote] = await Promise.all([
        fetchImageByMood(mood),
        customQuote ? Promise.resolve(customQuote) : generateQuote(mood)
      ]);

      // Always ensure we have content, even if APIs failed
      if (image && quote) {
        const newWallpaperData = {
          image,
          quote,
          mood
        };
        setWallpaperData(newWallpaperData);

        // Auto-save to history - save even if there were API errors since we have fallback content
        saveWallpaper(newWallpaperData);
      } else {
        console.error('Failed to generate both image and quote');
        // This should not happen as our hooks always return fallback content
      }
    } catch (error) {
      console.error('Error generating wallpaper:', error);
      // Even in case of unexpected errors, the hooks should have returned fallback content
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  };

  const handleRestoreWallpaper = (savedWallpaper: SavedWallpaper) => {
    setWallpaperData({
      image: savedWallpaper.image,
      quote: savedWallpaper.quote,
      mood: savedWallpaper.mood
    });
    setSelectedMood(savedWallpaper.mood);
    setShowHistory(false);
  };

  const handleCustomQuoteSave = (text: string, author?: string) => {
    setCustomQuote({ text, author });
    if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  };

  const handleCustomQuoteGenerate = (moodId: string) => {
    setShowCustomQuote(true);
    setSelectedMood(moodId as Mood);
  };

  const isLoading = isGenerating || imageLoading || quoteLoading;
  const error = imageError || quoteError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <motion.div
          className="fixed top-4 right-4 z-30 flex gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Custom Quote Button */}
          <button
            onClick={() => setShowCustomQuote(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 shadow-lg"
            data-testid="custom-quote-button"
            title="Add Custom Quote"
          >
            <Type className="w-5 h-5" />
            {customQuote && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                ✓
              </span>
            )}
          </button>

          {/* History Button */}
          <button
            onClick={() => setShowHistory(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 shadow-lg relative"
            data-testid="history-button"
          >
            <Clock className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-200 shadow-lg"
            data-testid="settings-button"
          >
            <Settings className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Mood Wallpaper Generator
          </h1>
          <p className="text-xl text-white opacity-90">
            Select your mood and get a personalized wallpaper with an inspiring quote
          </p>

          {/* AI Provider Badge */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-lg">{AI_PROVIDERS[selectedAIProvider].icon}</span>
              {selectedImageProvider !== 'picsum' && (
                <span className="text-lg">{IMAGE_PROVIDERS[selectedImageProvider].icon}</span>
              )}
              <span className="text-white text-sm font-medium">
                Powered by {AI_PROVIDERS[selectedAIProvider].name}
                {selectedImageProvider !== 'picsum' && (
                  <span> + {IMAGE_PROVIDERS[selectedImageProvider].name}</span>
                )}
              </span>
            </div>

            {customQuote && (
              <div className="bg-green-500 bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                <Type className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-medium">Custom Quote Active</span>
                <button
                  onClick={() => setCustomQuote(null)}
                  className="text-white hover:text-gray-200 text-xs ml-1"
                >
                  ×
                </button>
              </div>
            )}
          </motion.div>

          {((selectedImageProvider !== 'picsum' && !hasCurrentImageKey) || (selectedAIProvider !== 'free' && !hasCurrentAIKey)) && (
            <motion.div
              className="mt-4 text-sm text-white opacity-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                {selectedAIProvider === 'free' && selectedImageProvider === 'picsum'
                  ? 'Using Free providers. Upgrade to premium providers for enhanced quality and variety.'
                  : 'Add valid API keys in settings for enhanced functionality. Invalid keys will automatically fallback to free content.'}
              </p>
            </motion.div>
          )}

          {(imageError || quoteError) && !isLoading && (
            <motion.div
              className="mt-4 text-sm text-white opacity-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                💡 Tip: Switch to free providers in settings for reliable service without API keys.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Mood Selection */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {Object.values(MOODS).map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onSelect={handleMoodSelect}
              isSelected={selectedMood === mood.id}
            />
          ))}
        </motion.div>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <LoadingSpinner message="Creating your personalized wallpaper..." />
          )}

          {(imageError || quoteError) && (
            <motion.div
              className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded-xl mb-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium">Using fallback content</p>
                  <p className="text-sm">
                    {imageError && quoteError ?
                      "External services temporarily unavailable. Using built-in content." :
                      imageError ?
                        imageError :
                        quoteError
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {wallpaperData && !isLoading && !error && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ImageDisplay
                image={wallpaperData.image}
                quote={wallpaperData.quote}
              />
              
              <div className="flex justify-center gap-4">
                <DownloadButton
                  mood={wallpaperData.mood}
                  disabled={isLoading}
                />
                <ShareButton
                  wallpaperData={wallpaperData}
                  disabled={isLoading}
                />
              </div>
            </motion.div>
          )}

          {!selectedMood && !isLoading && (
            <motion.div
              className="text-center text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lg">Choose a mood above to get started</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* API Key Settings Modal */}
      <ApiKeySettings
        apiKeys={apiKeys}
        onSave={saveApiKeys}
        onClose={() => setShowSettings(false)}
        isOpen={showSettings}
      />

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onRestoreWallpaper={handleRestoreWallpaper}
        onRemoveWallpaper={removeWallpaper}
        onToggleFavorite={toggleFavorite}
        onClearHistory={clearHistory}
      />

      {/* Custom Quote Input */}
      <CustomQuoteInput
        isOpen={showCustomQuote}
        onClose={() => setShowCustomQuote(false)}
        onSave={handleCustomQuoteSave}
      />
    </div>
  );
};
