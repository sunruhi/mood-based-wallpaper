import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, RotateCcw, Clock } from 'lucide-react';
import { SavedWallpaper } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedWallpaper[];
  onRestoreWallpaper: (wallpaper: SavedWallpaper) => void;
  onRemoveWallpaper: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onRestoreWallpaper,
  onRemoveWallpaper,
  onToggleFavorite,
  onClearHistory
}) => {
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredHistory = filter === 'favorites' 
    ? history.filter(item => item.isFavorite)
    : history;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mt-2 sm:mt-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Clock className="text-blue-500" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Wallpaper History</h2>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {history.length} saved
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {/* Filter buttons */}
                <div className="flex bg-gray-100 rounded-lg p-1 flex-1 sm:flex-initial">
                  <button
                    className={`flex-1 sm:flex-initial px-3 py-2 rounded text-sm transition-all font-medium ${
                      filter === 'all'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`flex-1 sm:flex-initial px-3 py-2 rounded text-sm transition-all font-medium ${
                      filter === 'favorites'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setFilter('favorites')}
                  >
                    Favorites
                  </button>
                </div>
                
                {history.length > 0 && (
                  <button
                    className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] border border-red-200 hover:border-red-300"
                    onClick={onClearHistory}
                  >
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                )}
                
                <button
                  className="text-gray-500 hover:text-gray-700 p-1"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-120px)]">
              {filteredHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8 sm:py-12">
                  <Clock size={40} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                  <p className="text-base sm:text-lg mb-2 font-medium">
                    {filter === 'favorites' ? 'No favorite wallpapers yet' : 'No wallpapers saved yet'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {filter === 'favorites'
                      ? 'Mark wallpapers as favorites to see them here'
                      : 'Generate some wallpapers and they\'ll appear here'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredHistory.map((wallpaper, index) => (
                    <motion.div
                      key={wallpaper.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      {/* Preview image */}
                      <div className="relative h-32 sm:h-36 bg-gray-200">
                        <img
                          src={wallpaper.image.urls.small}
                          alt={wallpaper.image.alt_description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                          <p className="text-white text-sm text-center px-3 line-clamp-2 font-medium drop-shadow-lg">
                            "{wallpaper.quote.text.slice(0, 45)}..."
                          </p>
                        </div>
                        
                        {/* Mood badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-lg backdrop-blur-sm">
                            {wallpaper.mood}
                          </span>
                        </div>
                      </div>

                      {/* Info and actions */}
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-3 font-medium">
                          {formatDate(wallpaper.createdAt)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <button
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[36px] border border-blue-200 hover:border-blue-300"
                            onClick={() => onRestoreWallpaper(wallpaper)}
                          >
                            <RotateCcw size={14} />
                            Restore
                          </button>
                          
                          <div className="flex gap-2">
                            <button
                              className={`p-2 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-all ${
                                wallpaper.isFavorite
                                  ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
                                  : 'text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200'
                              }`}
                              onClick={() => onToggleFavorite(wallpaper.id)}
                            >
                              <Heart size={16} fill={wallpaper.isFavorite ? 'currentColor' : 'none'} />
                            </button>

                            <button
                              className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center transition-all border border-gray-200 hover:border-red-200"
                              onClick={() => onRemoveWallpaper(wallpaper.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
