import { useState, useEffect } from 'react';
import { SavedWallpaper, WallpaperData } from '../types';
import {
  saveWallpaperToHistory,
  getWallpaperHistory,
  removeWallpaperFromHistory,
  clearWallpaperHistory,
  toggleWallpaperFavorite
} from '../utils/historyStorage';

export const useWallpaperHistory = () => {
  const [history, setHistory] = useState<SavedWallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = getWallpaperHistory();
        setHistory(savedHistory);
      } catch (error) {
        console.error('Failed to load wallpaper history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const saveWallpaper = (wallpaperData: WallpaperData): SavedWallpaper => {
    const savedWallpaper = saveWallpaperToHistory(wallpaperData);
    setHistory(prev => [savedWallpaper, ...prev.slice(0, 19)]); // Keep only latest 20
    return savedWallpaper;
  };

  const removeWallpaper = (id: string): void => {
    removeWallpaperFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = (): void => {
    clearWallpaperHistory();
    setHistory([]);
  };

  const toggleFavorite = (id: string): void => {
    toggleWallpaperFavorite(id);
    setHistory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
  };

  const getFavorites = (): SavedWallpaper[] => {
    return history.filter(item => item.isFavorite);
  };

  const getByMood = (mood: string): SavedWallpaper[] => {
    return history.filter(item => item.mood === mood);
  };

  return {
    history,
    isLoading,
    saveWallpaper,
    removeWallpaper,
    clearHistory,
    toggleFavorite,
    getFavorites,
    getByMood,
    totalCount: history.length,
    favoritesCount: history.filter(item => item.isFavorite).length
  };
};
