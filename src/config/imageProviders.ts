import { ImageProviderConfig, ImageProvider } from '../types';

export const IMAGE_PROVIDERS: Record<ImageProvider, ImageProviderConfig> = {
  picsum: {
    id: 'picsum',
    name: 'Lorem Picsum',
    description: 'Free random images (no API key required)',
    requiresApiKey: false,
    icon: '🎲',
    isFree: true
  },
  pixabay: {
    id: 'pixabay',
    name: 'Pixabay',
    description: 'High-quality free stock photos',
    requiresApiKey: true,
    getKeyUrl: 'https://pixabay.com/api/docs/',
    icon: '📸',
    isFree: true
  },
  pexels: {
    id: 'pexels',
    name: 'Pexels',
    description: 'Professional free stock photos',
    requiresApiKey: true,
    getKeyUrl: 'https://www.pexels.com/api/',
    icon: '📷',
    isFree: true
  },
  unsplash: {
    id: 'unsplash',
    name: 'Unsplash',
    description: 'Beautiful photos by professional photographers',
    requiresApiKey: true,
    getKeyUrl: 'https://unsplash.com/developers',
    icon: '🌅',
    isFree: false
  }
};

export const DEFAULT_IMAGE_PROVIDER: ImageProvider = 'picsum';

export const getImageProviderConfig = (providerId: ImageProvider): ImageProviderConfig => {
  return IMAGE_PROVIDERS[providerId];
};

export const getImageProviderList = (): ImageProviderConfig[] => {
  return Object.values(IMAGE_PROVIDERS);
};

export const getFreeImageProviders = (): ImageProviderConfig[] => {
  return Object.values(IMAGE_PROVIDERS).filter(provider => provider.isFree);
};
