import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock } from 'lucide-react';
import { MoodCard } from '../components/MoodCard';
import { ImageDisplay } from '../components/ImageDisplay';
import { DownloadButton } from '../components/DownloadButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ApiKeySettings } from '../components/ApiKeySettings';
import { HistoryPanel } from '../components/HistoryPanel';
import { useUnsplashAPI } from '../hooks/useUnsplashAPI';
import { useOpenAI } from '../hooks/useOpenAI';
import { useApiKeys } from '../hooks/useApiKeys';
import { useWallpaperHistory } from '../hooks/useWallpaperHistory';
import { MOODS } from '../config/moods';
import { WallpaperData, Mood, SavedWallpaper } from '../types';

export const Home: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [wallpaperData, setWallpaperData] = useState<WallpaperData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { apiKeys, saveApiKeys, hasUnsplashKey, hasCurrentAIKey, getCurrentAIKey, selectedAIProvider } = useApiKeys();
  const { fetchImageByMood, loading: imageLoading, error: imageError } = useUnsplashAPI(apiKeys.unsplashKey);
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

  const handleMoodSelect = async (moodId: string) => {
    const mood = moodId as Mood;
    setSelectedMood(mood);
    setWallpaperData(null);
    setIsGenerating(true);

    try {
      // Generate image and quote in parallel
      const [image, quote] = await Promise.all([
        fetchImageByMood(mood),
        generateQuote(mood)
      ]);

      if (image && quote) {
        const newWallpaperData = {
          image,
          quote,
          mood
        };
        setWallpaperData(newWallpaperData);

        // Auto-save to history
        saveWallpaper(newWallpaperData);
      }
    } catch (error) {
      console.error('Error generating wallpaper:', error);
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
          {(!hasUnsplashKey || (selectedAIProvider !== 'free' && !hasCurrentAIKey)) && (
            <motion.div
              className="mt-4 text-sm text-white opacity-80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p>
                Using fallback content. Click the settings icon to add API keys for enhanced functionality.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Mood Selection */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
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

          {error && (
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
            />
          )}

          {wallpaperData && !isLoading && (
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
              
              <div className="flex justify-center">
                <DownloadButton
                  mood={wallpaperData.mood}
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
    </div>
  );
};
