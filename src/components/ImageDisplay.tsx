import React from 'react';
import { motion } from 'framer-motion';
import { UnsplashImage, GeneratedQuote } from '../types';
import { THEMES, ThemeConfig, DEFAULT_THEME } from '../config/themes';

interface ImageDisplayProps {
  image: UnsplashImage;
  quote: GeneratedQuote;
  isLoading?: boolean;
  themeId?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, quote, isLoading = false, themeId = DEFAULT_THEME }) => {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];

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

  const getPositionClasses = () => {
    switch (theme.textPosition) {
      case 'top':
        return 'justify-start items-center pt-8';
      case 'bottom':
        return 'justify-end items-center pb-8';
      case 'left':
        return 'justify-center items-start pl-8';
      case 'right':
        return 'justify-center items-end pr-8';
      case 'center':
      default:
        return 'justify-center items-center';
    }
  };

  const isGradient = theme.backgroundColor.includes('gradient');

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
      <div className={`absolute inset-0 flex ${getPositionClasses()} p-6`}>
        <motion.div
          className="max-w-2xl"
          style={{
            background: isGradient ? theme.backgroundColor : theme.backgroundColor,
            borderRadius: `${theme.borderRadius}px`,
            padding: `${theme.padding}px`,
            border: theme.borderConfig.enabled ? `${theme.borderConfig.width}px solid ${theme.borderConfig.color}` : 'none',
            textAlign: theme.textAlign,
            color: theme.textColor,
            ...(theme.shadowConfig.enabled && {
              textShadow: `0 0 ${theme.shadowConfig.blur}px ${theme.shadowConfig.color}`
            })
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <blockquote
            style={{
              fontSize: theme.fontSize.quote,
              fontWeight: theme.fontWeight.quote,
              marginBottom: quote.author ? '1rem' : '0',
              lineHeight: '1.4'
            }}
          >
            "{quote.text}"
          </blockquote>
          {quote.author && (
            <cite
              style={{
                fontSize: theme.fontSize.author,
                fontWeight: theme.fontWeight.author,
                opacity: 0.9,
                fontStyle: 'normal'
              }}
            >
              — {quote.author}
            </cite>
          )}
        </motion.div>
      </div>

    </motion.div>
  );
};
