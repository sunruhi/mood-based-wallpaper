export type Mood = 'happy' | 'sad' | 'motivated' | 'peaceful' | 'energetic' | 'romantic' | 'mysterious' | 'adventure' | 'creative';

export interface MoodConfig {
  id: Mood;
  label: string;
  description: string;
  color: string;
  gradient: string;
  searchTerms: string[];
  icon: string;
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

export interface GeneratedQuote {
  text: string;
  author?: string;
}

export interface WallpaperData {
  image: UnsplashImage;
  quote: GeneratedQuote;
  mood: Mood;
}

export type AIProvider = 'free' | 'openai' | 'anthropic' | 'google' | 'azure' | 'meta' | 'groq';
export type ImageProvider = 'picsum' | 'pixabay' | 'pexels' | 'unsplash';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  requiresApiKey: boolean;
  getKeyUrl?: string;
  icon?: string;
}

export interface ImageProviderConfig {
  id: ImageProvider;
  name: string;
  description: string;
  requiresApiKey: boolean;
  getKeyUrl?: string;
  icon?: string;
  isFree: boolean;
}

export interface ApiKeys {
  selectedImageProvider: ImageProvider;
  unsplashKey: string;
  pixabayKey: string;
  pexelsKey: string;
  selectedAIProvider: AIProvider;
  openaiKey: string;
  anthropicKey: string;
  googleKey: string;
  azureKey: string;
  azureEndpoint: string;
  metaKey: string;
  groqKey: string;
}

export interface SavedWallpaper extends WallpaperData {
  id: string;
  createdAt: string;
  title?: string;
  isFavorite?: boolean;
}
