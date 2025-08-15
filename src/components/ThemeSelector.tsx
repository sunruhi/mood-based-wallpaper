import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';
import { THEMES, ThemeConfig } from '../config/themes';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  selectedTheme,
  onSelectTheme
}) => {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeSelect = (themeId: string) => {
    onSelectTheme(themeId);
    onClose();
  };

  const getTextPositionStyle = (position: ThemeConfig['textPosition']) => {
    switch (position) {
      case 'top':
        return 'justify-start items-center';
      case 'bottom':
        return 'justify-end items-center';
      case 'left':
        return 'justify-center items-start';
      case 'right':
        return 'justify-center items-end';
      case 'center':
      default:
        return 'justify-center items-center';
    }
  };

  const renderThemePreview = (theme: ThemeConfig) => {
    const isGradient = theme.backgroundColor.includes('gradient');
    
    return (
      <div className="relative w-24 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md overflow-hidden">
        <div 
          className={`absolute inset-0 flex ${getTextPositionStyle(theme.textPosition)} p-2`}
        >
          <div
            style={{
              background: isGradient ? theme.backgroundColor : theme.backgroundColor,
              borderRadius: theme.borderRadius,
              padding: '4px 8px',
              border: theme.borderConfig.enabled ? `${theme.borderConfig.width}px solid ${theme.borderConfig.color}` : 'none',
              textAlign: theme.textAlign,
              color: theme.textColor,
              fontSize: '0.5rem',
              fontWeight: theme.fontWeight.quote,
              ...(theme.shadowConfig.enabled && {
                textShadow: `0 0 ${theme.shadowConfig.blur}px ${theme.shadowConfig.color}`
              })
            }}
          >
            Quote
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg w-full max-w-2xl overflow-hidden mt-2 sm:mt-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div className="flex items-center gap-2 sm:gap-3">
              <Palette className="text-purple-500" size={20} />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Choose Theme</h2>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-80 sm:max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {Object.values(THEMES).map((theme) => (
                <motion.div
                  key={theme.id}
                  className={`
                    border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200
                    ${selectedTheme === theme.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => handleThemeSelect(theme.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-10 sm:w-24 sm:h-16">
                        {renderThemePreview(theme)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{theme.name}</h3>
                        {selectedTheme === theme.id && (
                          <Check size={14} className="text-purple-500 sm:w-4 sm:h-4" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
