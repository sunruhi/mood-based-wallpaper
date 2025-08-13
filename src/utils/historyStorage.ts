import { SavedWallpaper, WallpaperData } from '../types';

const STORAGE_KEY = 'mood-wallpaper-history';
const MAX_HISTORY_ITEMS = 20;

export const saveWallpaperToHistory = (wallpaperData: WallpaperData): SavedWallpaper => {
  const savedWallpaper: SavedWallpaper = {
    ...wallpaperData,
    id: `wallpaper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    title: `${wallpaperData.mood} - ${wallpaperData.quote.text.slice(0, 30)}...`
  };

  const history = getWallpaperHistory();
  const updatedHistory = [savedWallpaper, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return savedWallpaper;
};

export const getWallpaperHistory = (): SavedWallpaper[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load wallpaper history:', error);
    return [];
  }
};

export const removeWallpaperFromHistory = (id: string): void => {
  const history = getWallpaperHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const clearWallpaperHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const toggleWallpaperFavorite = (id: string): void => {
  const history = getWallpaperHistory();
  const updatedHistory = history.map(item => 
    item.id === id 
      ? { ...item, isFavorite: !item.isFavorite }
      : item
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};
