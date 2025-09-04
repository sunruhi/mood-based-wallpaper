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
  IonRippleEffect,
  IonButtons
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
  walk as adventureIcon,
  brush as creativeIcon,
  sparkles,
  image as imageIcon
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

  const handleCustomQuoteGenerate = async (moodId: string) => {
    await triggerHaptic();
    setShowCustomQuote(true);
    setSelectedMood(moodId as Mood);
  };

  const isLoading = isGenerating || imageLoading || quoteLoading;
  const error = imageError || quoteError;

  return (
    <IonPage>
      <IonHeader translucent className="ion-no-border">
        <IonToolbar color="transparent" className="header-toolbar">
          <IonTitle className="header-title">
            <div className="flex items-center justify-center gap-2">
              <IonIcon icon={sparkles} className="text-white text-xl" />
              <span className="text-white font-bold text-lg">Mood Wallpaper</span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              onClick={() => {
                triggerHaptic();
                setShowSettings(true);
              }}
              className="header-settings-btn"
              data-testid="header-settings-button"
            >
              <IonIcon icon={settings} className="text-white text-xl" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="main-content">
        {/* Header Content */}
        <div className="header-section">
          <IonText>
            <h1 className="main-title">
              Mood Wallpaper Generator
            </h1>
            <p className="main-subtitle">
              Select your mood and get a personalized wallpaper
            </p>
          </IonText>

          {/* Provider Status Chips */}
          <div className="provider-chips">
            <IonChip className="provider-chip ai-chip">
              <span className="provider-icon">{AI_PROVIDERS[selectedAIProvider]?.icon || '🤖'}</span>
              <IonText className="provider-text">
                {AI_PROVIDERS[selectedAIProvider]?.name || 'AI'}
              </IonText>
            </IonChip>

            {(selectedAIProvider === 'free' && selectedImageProvider !== 'picsum') && (
              <IonChip className="provider-chip image-chip">
                <span className="provider-icon">{IMAGE_PROVIDERS[selectedImageProvider]?.icon || '🖼️'}</span>
                <IonText className="provider-text">
                  {IMAGE_PROVIDERS[selectedImageProvider]?.name || 'Images'}
                </IonText>
              </IonChip>
            )}

            {customQuote && (
              <IonChip className="provider-chip custom-quote-chip">
                <IonIcon icon={create} />
                <IonText className="provider-text">Custom Quote</IonText>
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={() => setCustomQuote(null)}
                  className="custom-quote-remove"
                >
                  ×
                </IonButton>
              </IonChip>
            )}
          </div>

          {/* Status Messages */}
          {((selectedImageProvider !== 'picsum' && !hasCurrentImageKey) || (selectedAIProvider !== 'free' && !hasCurrentAIKey)) && (
            <IonText className="status-message">
              <p>
                {selectedAIProvider === 'free' && selectedImageProvider === 'picsum'
                  ? 'Using free providers. Add API keys for enhanced quality.'
                  : 'Add API keys in settings for enhanced functionality.'}
              </p>
            </IonText>
          )}
        </div>

        {/* Mood Selection Grid */}
        <IonGrid className="mood-grid">
          <IonRow>
            {Object.values(MOODS).map((mood) => {
              // Gradient class name, fallback to default if missing
              const gradientClass = mood.gradient
                ? `mood-gradient-${mood.id}`
                : 'mood-gradient-default';
              return (
                <IonCol key={mood.id} size="6" sizeMd="4" sizeLg="2.4">
                  <IonCard
                    className={`mood-card cursor-pointer transition-all duration-300 rounded-xl shadow-md ${selectedMood === mood.id ? 'selected-mood' : ''} ${gradientClass}`}
                    button
                    onClick={() => handleMoodSelect(mood.id)}
                    data-testid={`mood-card-${mood.id}`}
                    aria-label={`Select mood: ${mood.label}`}
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
              );
            })}
          </IonRow>
        </IonGrid>

        {/* Content Area */}
        <div className="content-area">
          {isLoading && (
            <div className="loading-section">
              <IonText>
                <p className="loading-text">Creating your personalized wallpaper...</p>
              </IonText>
              <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
              </div>
            </div>
          )}

          {(imageError || quoteError) && !isLoading && (
            <IonCard className="error-card">
              <IonCardContent>
                <div className="error-content">
                  <span className="error-icon">⚠️</span>
                  <div>
                    <p className="error-title">Using fallback content</p>
                    <p className="error-description">
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
            <div className="wallpaper-container">
              <ImageDisplay
                image={wallpaperData.image}
                quote={wallpaperData.quote}
                themeId={selectedTheme}
              />

              <div className="download-container">
                <DownloadButton
                  mood={wallpaperData.mood}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {!selectedMood && !isLoading && (
            <div className="instruction-section">
              <IonText>
                <p className="instruction-text">Choose a mood above to get started</p>
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
