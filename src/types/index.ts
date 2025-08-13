export type Mood = 'happy' | 'sad' | 'motivated';

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

export interface ApiKeys {
  unsplashKey: string;
  openaiKey: string;
}