import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
  IonToast,
  IonLoading,
  IonText,
  IonChip,
  IonBadge,
  IonRippleEffect
} from '@ionic/react';
import { 
  settings, 
  time, 
  create, 
  colorPalette, 
  download, 
  happy as happyIcon,
  sad as sadIcon,
  flash as motivatedIcon,
  leaf as peacefulIcon,
  fitness as energeticIcon,
  heart as romanticIcon,
  moon as mysteriousIcon,
  trail as adventureIcon,
  brush as creativeIcon
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { MoodCard } from '../components/MoodCard';
import { ImageDisplay } from '../components/ImageDisplay';
import { DownloadButton } from '../components/DownloadButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ApiKeySettings } from '../components/ApiKeySettings';
import { HistoryPanel } from '../components/HistoryPanel';
import { CustomQuoteInput } from '../components/CustomQuoteInput';
import { ThemeSelector } from '../components/ThemeSelector';
import { useImageAPI } from '../hooks/useImageAPI';
import { useOpenAI } from '../hooks/useOpenAI';
import { useApiKeys } from '../hooks/useApiKeys';
import { useWallpaperHistory } from '../hooks/useWallpaperHistory';
import { MOODS } from '../config/moods';
import { AI_PROVIDERS } from '../config/aiProviders';
import { IMAGE_PROVIDERS } from '../config/imageProviders';
import { DEFAULT_THEME } from '../config/themes';
import { logClipboardCapabilities } from '../utils/clipboardTest';
import { WallpaperData, Mood, SavedWallpaper } from '../types';

// Haptic feedback helper
const triggerHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    // Haptics not available on web
  }
};

export const Home: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [wallpaperData, setWallpaperData] = useState<WallpaperData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomQuote, setShowCustomQuote] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [customQuote, setCustomQuote] = useState<{text: string; author?: string} | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  // Mood icon mapping for Ionic icons
  const moodIcons = {
    happy: happyIcon,
    sad: sadIcon,
    motivated: motivatedIcon,
    peaceful: peacefulIcon,
    energetic: energeticIcon,
    romantic: romanticIcon,
    mysterious: mysteriousIcon,
    adventure: adventureIcon,
    creative: creativeIcon
  };

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

    // Log clipboard capabilities in development
    if (import.meta.env.DEV) {
      logClipboardCapabilities();
    }
  }, []);

  const handleMoodSelect = async (moodId: string) => {
    await triggerHaptic();
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
        
        // Show success toast
        setToastMessage('Wallpaper generated successfully!');
        setShowToast(true);
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
    triggerHaptic();
    if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  };

  const handleRestoreWallpaper = (savedWallpaper: SavedWallpaper) => {
    triggerHaptic();
    setWallpaperData({
      image: savedWallpaper.image,
      quote: savedWallpaper.quote,
      mood: savedWallpaper.mood
    });
    setSelectedMood(savedWallpaper.mood);
    setShowHistory(false);
  };

  const handleCustomQuoteSave = (text: string, author?: string) => {
    triggerHaptic();
    setCustomQuote({ text, author });
    if (selectedMood) {
      handleMoodSelect(selectedMood);
    }
  };

  const handleCustomQuoteGenerate = (moodId: string) => {
    await triggerHaptic();
    setShowCustomQuote(true);
    setSelectedMood(moodId as Mood);
  };

  const isLoading = isGenerating || imageLoading || quoteLoading;
  const error = imageError || quoteError;

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar className="gradient-background">
          <IonTitle className="text-white font-bold">
            Mood Wallpaper
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="gradient-background">
        {/* Header Content */}
        <div className="text-center pt-6 pb-4 px-4">
          <IonText>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Mood Wallpaper Generator
            </h1>
            <p className="text-base sm:text-lg text-white opacity-90">
              Select your mood and get a personalized wallpaper
            </p>
          </IonText>

          {/* Provider Status Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <IonChip className="bg-white bg-opacity-20 backdrop-blur-sm">
              <span className="text-lg mr-1">{AI_PROVIDERS[selectedAIProvider]?.icon || '🤖'}</span>
              <IonText className="text-white text-sm font-medium">
                {AI_PROVIDERS[selectedAIProvider]?.name || 'AI'}
              </IonText>
            </IonChip>

            {(selectedAIProvider === 'free' && selectedImageProvider !== 'picsum') && (
              <IonChip className="bg-white bg-opacity-20 backdrop-blur-sm">
                <span className="text-lg mr-1">{IMAGE_PROVIDERS[selectedImageProvider]?.icon || '🖼️'}</span>
                <IonText className="text-white text-sm font-medium">
                  {IMAGE_PROVIDERS[selectedImageProvider]?.name || 'Images'}
                </IonText>
              </IonChip>
            )}

            {customQuote && (
              <IonChip color="success">
                <IonIcon icon={create} />
                <IonText>Custom Quote</IonText>
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={() => setCustomQuote(null)}
                >
                  ×
                </IonButton>
              </IonChip>
            )}
          </div>

          {/* Status Messages */}
          {((selectedImageProvider !== 'picsum' && !hasCurrentImageKey) || (selectedAIProvider !== 'free' && !hasCurrentAIKey)) && (
            <IonText className="block mt-3 text-sm text-white opacity-80">
              <p>
                {selectedAIProvider === 'free' && selectedImageProvider === 'picsum'
                  ? 'Using free providers. Add API keys for enhanced quality.'
                  : 'Add API keys in settings for enhanced functionality.'}
              </p>
            </IonText>
          )}
        </div>

        {/* Mood Selection Grid */}
        <IonGrid className="px-2">
          <IonRow>
            {Object.values(MOODS).map((mood) => (
              <IonCol key={mood.id} size="6" sizeMd="4" sizeLg="2.4">
                <IonCard
                  className={`mood-card cursor-pointer transition-all duration-300 ${
                    selectedMood === mood.id ? 'selected-mood' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${mood.gradient.replace('from-', '').replace('to-', '').split(' ').map(c => {
                      const colorMap: Record<string, string> = {
                        'yellow-300': '#FDE047',
                        'orange-400': '#FB923C',
                        'blue-300': '#93C5FD',
                        'indigo-400': '#818CF8',
                        'red-300': '#FCA5A5',
                        'pink-400': '#F472B6',
                        'green-300': '#86EFAC',
                        'teal-400': '#2DD4BF',
                        'orange-300': '#FDBA74',
                        'emerald-300': '#6EE7B7',
                        'cyan-400': '#22D3EE',
                        'violet-300': '#C4B5FD',
                        'purple-300': '#D8B4FE',
                        'purple-400': '#C084FC'
                      };
                      return colorMap[c] || c;
                    }).join(', ')})`,
                    minHeight: '100px'
                  }}
                  button
                  onClick={() => handleMoodSelect(mood.id)}
                  data-testid={`mood-card-${mood.id}`}
                >
                  <IonRippleEffect />
                  <IonCardContent className="text-center text-white p-3">
                    <div className="text-2xl mb-2">{mood.icon}</div>
                    <IonText>
                      <h3 className="font-bold text-base mb-1">{mood.label}</h3>
                      <p className="text-xs opacity-90 leading-tight">{mood.description}</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Content Area */}
        <div className="px-4 pb-20">
          {isLoading && (
            <div className="text-center py-8">
              <IonText className="text-white">
                <p className="mb-4">Creating your personalized wallpaper...</p>
              </IonText>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            </div>
          )}

          {(imageError || quoteError) && !isLoading && (
            <IonCard className="bg-orange-100 border border-orange-400 mx-auto max-w-2xl">
              <IonCardContent>
                <div className="flex items-center gap-2 text-orange-700">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-medium">Using fallback content</p>
                    <p className="text-sm">
                      {imageError && quoteError ?
                        "External services temporarily unavailable." :
                        imageError ? imageError : quoteError
                      }
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {wallpaperData && !isLoading && (
            <div className="max-w-4xl mx-auto space-y-4">
              <ImageDisplay
                image={wallpaperData.image}
                quote={wallpaperData.quote}
                themeId={selectedTheme}
              />

              <div className="flex justify-center">
                <DownloadButton
                  mood={wallpaperData.mood}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {!selectedMood && !isLoading && (
            <div className="text-center text-white py-8">
              <IonText>
                <p className="text-lg">Choose a mood above to get started</p>
              </IonText>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="light">
            <IonIcon icon={settings} />
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton
              color="tertiary"
              onClick={() => {
                triggerHaptic();
                setShowThemeSelector(true);
              }}
              data-testid="theme-button"
            >
              <IonIcon icon={colorPalette} />
            </IonFabButton>
            <IonFabButton
              color="secondary"
              onClick={() => {
                triggerHaptic();
                setShowCustomQuote(true);
              }}
              data-testid="custom-quote-button"
            >
              <IonIcon icon={create} />
              {customQuote && (
                <IonBadge color="success" className="absolute -top-1 -right-1">
                  ✓
                </IonBadge>
              )}
            </IonFabButton>
            <IonFabButton
              color="primary"
              onClick={() => {
                triggerHaptic();
                setShowHistory(true);
              }}
              data-testid="history-button"
            >
              <IonIcon icon={time} />
              {totalCount > 0 && (
                <IonBadge color="danger" className="absolute -top-1 -right-1">
                  {totalCount > 9 ? '9+' : totalCount}
                </IonBadge>
              )}
            </IonFabButton>
            <IonFabButton
              color="medium"
              onClick={() => {
                triggerHaptic();
                setShowSettings(true);
              }}
              data-testid="settings-button"
            >
              <IonIcon icon={settings} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>

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

      {/* Theme Selector */}
      <ThemeSelector
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
      />

      {/* Loading overlay */}
      <IonLoading
        isOpen={isLoading}
        message="Creating your wallpaper..."
        spinner="crescent"
      />

      {/* Toast notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="success"
      />
    </IonPage>
  );
};
