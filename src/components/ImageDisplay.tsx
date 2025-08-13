import React from 'react';
import { motion } from 'framer-motion';
import { UnsplashImage, GeneratedQuote } from '../types';

interface ImageDisplayProps {
  image: UnsplashImage;
  quote: GeneratedQuote;
  isLoading?: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, quote, isLoading = false }) => {
  if (isLoading) {
    return (
      <motion.div
        className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        data-testid="image-loading"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      id="wallpaper-canvas"
      className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="image-display"
    >
      <img
        src={image.urls.regular}
        alt={image.alt_description || 'Mood wallpaper'}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Quote overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6">
        <motion.div
          className="text-center text-white max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <blockquote className="text-lg md:text-2xl font-bold mb-4 leading-relaxed">
            "{quote.text}"
          </blockquote>
          {quote.author && (
            <cite className="text-sm md:text-base opacity-80">
              — {quote.author}
            </cite>
          )}
        </motion.div>
      </div>
      
      {/* Photo credit */}
      <div className="absolute bottom-2 right-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
        Photo by {image.user.name}
      </div>
    </motion.div>
  );
};