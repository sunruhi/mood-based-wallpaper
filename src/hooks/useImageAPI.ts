import { useState } from 'react';
import { UnsplashImage, Mood, ImageProvider } from '../types';
import { MOODS } from '../config/moods';

export const useImageAPI = (provider: ImageProvider = 'picsum', apiKey?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImageByMood = async (mood: Mood): Promise<UnsplashImage | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if API key is required but not provided, fallback to picsum
      if ((provider === 'pixabay' || provider === 'pexels' || provider === 'unsplash') && (!apiKey || !apiKey.trim())) {
        console.warn(`${provider} requires API key, falling back to picsum`);
        return await fetchPicsumImage(mood);
      }

      // Try the selected provider
      let result: UnsplashImage | null = null;

      switch (provider) {
        case 'picsum':
          result = await fetchPicsumImage(mood);
          break;
        case 'pixabay':
          result = await fetchPixabayImage(mood, apiKey);
          break;
        case 'pexels':
          result = await fetchPexelsImage(mood, apiKey);
          break;
        case 'unsplash':
          result = await fetchUnsplashImage(mood, apiKey);
          break;
        default:
          result = getFallbackImage(mood);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
      console.error(`Error fetching image from ${provider}:`, err);

      // If external provider fails, automatically try picsum as fallback
      if (provider !== 'picsum') {
        console.log(`${provider} failed, attempting fallback to picsum...`);
        setError(`${provider} temporarily unavailable. Using free images.`);
        try {
          return await fetchPicsumImage(mood);
        } catch (picsumErr) {
          console.error('Picsum fallback also failed:', picsumErr);
          setError('Image services temporarily unavailable. Using built-in fallback.');
          return getFallbackImage(mood);
        }
      } else {
        // If even picsum fails, use built-in fallback
        setError('All image services temporarily unavailable. Using built-in fallback.');
        return getFallbackImage(mood);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPicsumImage = async (mood: Mood): Promise<UnsplashImage> => {
    // Lorem Picsum provides random images - we'll select different seed values based on mood
    const moodSeeds = {
      happy: [100, 200, 300, 400, 500],
      sad: [600, 700, 800, 900, 1000],
      motivated: [1100, 1200, 1300, 1400, 1500]
    };
    
    const seeds = moodSeeds[mood];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const baseUrl = `https://picsum.photos/1920/1080?random=${randomSeed}`;
    
    // Get image info from Lorem Picsum API
    const infoResponse = await fetch(`https://picsum.photos/id/${randomSeed % 1000}/info`);
    const info = infoResponse.ok ? await infoResponse.json() : {};
    
    return {
      id: `picsum-${randomSeed}`,
      urls: {
        raw: baseUrl,
        full: baseUrl,
        regular: baseUrl,
        small: `https://picsum.photos/400/300?random=${randomSeed}`,
        thumb: `https://picsum.photos/200/200?random=${randomSeed}`
      },
      alt_description: `${mood.charAt(0).toUpperCase() + mood.slice(1)} mood wallpaper`,
      user: {
        name: info.author || 'Lorem Picsum',
        username: 'picsum'
      }
    };
  };

  const fetchPixabayImage = async (mood: Mood, key?: string): Promise<UnsplashImage> => {
    if (!key || !key.trim()) {
      throw new Error('Pixabay API key is required');
    }

    const moodConfig = MOODS[mood];
    const searchTerm = moodConfig.searchTerms[Math.floor(Math.random() * moodConfig.searchTerms.length)];

    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${key}&q=${searchTerm}&image_type=photo&orientation=horizontal&category=nature&min_width=1920&min_height=1080&per_page=20`
      );

      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.hits || data.hits.length === 0) {
        throw new Error('No images found on Pixabay for this mood');
      }
    } catch (fetchError) {
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Pixabay');
      }
      throw fetchError;
    }

    const randomImage = data.hits[Math.floor(Math.random() * data.hits.length)];
    
    return {
      id: `pixabay-${randomImage.id}`,
      urls: {
        raw: randomImage.largeImageURL,
        full: randomImage.largeImageURL,
        regular: randomImage.webformatURL,
        small: randomImage.webformatURL,
        thumb: randomImage.previewURL
      },
      alt_description: randomImage.tags || `${mood} mood wallpaper`,
      user: {
        name: randomImage.user,
        username: randomImage.user
      }
    };
  };

  const fetchPexelsImage = async (mood: Mood, key?: string): Promise<UnsplashImage> => {
    if (!key || !key.trim()) {
      throw new Error('Pexels API key is required');
    }

    const moodConfig = MOODS[mood];
    const searchTerm = moodConfig.searchTerms[Math.floor(Math.random() * moodConfig.searchTerms.length)];

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&orientation=landscape&size=large&per_page=20`,
        {
          headers: {
            Authorization: key
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Pexels API key');
        }
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.photos || data.photos.length === 0) {
        throw new Error('No images found on Pexels for this mood');
      }
    } catch (fetchError) {
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Pexels');
      }
      throw fetchError;
    }

    const randomImage = data.photos[Math.floor(Math.random() * data.photos.length)];
    
    return {
      id: `pexels-${randomImage.id}`,
      urls: {
        raw: randomImage.src.original,
        full: randomImage.src.large2x,
        regular: randomImage.src.large,
        small: randomImage.src.medium,
        thumb: randomImage.src.small
      },
      alt_description: randomImage.alt || `${mood} mood wallpaper`,
      user: {
        name: randomImage.photographer,
        username: randomImage.photographer
      }
    };
  };

  const fetchUnsplashImage = async (mood: Mood, key?: string): Promise<UnsplashImage> => {
    if (!key || !key.trim()) {
      throw new Error('Unsplash API key is required');
    }

    const moodConfig = MOODS[mood];
    const searchTerm = moodConfig.searchTerms[Math.floor(Math.random() * moodConfig.searchTerms.length)];

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerm)}&orientation=landscape&w=1920&h=1080`,
        {
          headers: {
            Authorization: `Client-ID ${key}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Unsplash API key');
        }
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (fetchError) {
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to Unsplash');
      }
      throw fetchError;
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
        user: { name: 'Free Images', username: 'free' }
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
        user: { name: 'Free Images', username: 'free' }
      },
      motivated: {
        id: 'fallback-motivated',
        urls: {
          raw: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=1920&h=1080&fit=crop',
          full: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=1920&h=1080&fit=crop',
          regular: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=1920&h=1080&fit=crop',
          small: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=400&h=300&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1dff?w=200&h=200&fit=crop'
        },
        alt_description: 'Inspiring mountain peak at sunrise',
        user: { name: 'Free Images', username: 'free' }
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
