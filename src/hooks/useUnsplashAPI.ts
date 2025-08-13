import { useState } from 'react';
import { UnsplashImage, Mood } from '../types';
import { MOODS } from '../config/moods';

export const useUnsplashAPI = (apiKey?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImageByMood = async (mood: Mood): Promise<UnsplashImage | null> => {
    const accessKey = apiKey || import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    
    if (!accessKey) {
      // Return fallback image data when no API key is available
      return getFallbackImage(mood);
    }

    setLoading(true);
    setError(null);

    try {
      const moodConfig = MOODS[mood];
      const searchTerm = moodConfig.searchTerms[Math.floor(Math.random() * moodConfig.searchTerms.length)];
      
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${searchTerm}&orientation=landscape&w=1920&h=1080`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const data: UnsplashImage = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
      setError(errorMessage);
      return getFallbackImage(mood);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackImage = (mood: Mood): UnsplashImage => {
    const fallbackImages = {
      happy: {
        id: 'fallback-happy',
        urls: {
          raw: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
        },
        alt_description: 'Beautiful mountain landscape with sunny sky',
        user: { name: 'Unsplash', username: 'unsplash' }
      },
      sad: {
        id: 'fallback-sad',
        urls: {
          raw: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&h=1080&fit=crop',
          full: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&h=1080&fit=crop',
          regular: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&h=1080&fit=crop',
          small: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=300&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&h=200&fit=crop'
        },
        alt_description: 'Peaceful rainy day scene',
        user: { name: 'Unsplash', username: 'unsplash' }
      },
      motivated: {
        id: 'fallback-motivated',
        urls: {
          raw: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
          small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop'
        },
        alt_description: 'Inspiring mountain peak at sunrise',
        user: { name: 'Unsplash', username: 'unsplash' }
      }
    };

    return fallbackImages[mood];
  };

  return {
    fetchImageByMood,
    loading,
    error,
  };
};