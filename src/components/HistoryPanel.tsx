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
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Clock className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Wallpaper History</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {history.length} saved
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Filter buttons */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      filter === 'all' 
                        ? 'bg-white text-gray-800 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm transition-all ${
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
                    className="text-red-500 hover:text-red-600 px-3 py-1 rounded text-sm"
                    onClick={onClearHistory}
                  >
                    Clear All
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {filteredHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Clock size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">
                    {filter === 'favorites' ? 'No favorite wallpapers yet' : 'No wallpapers saved yet'}
                  </p>
                  <p className="text-sm">
                    {filter === 'favorites' 
                      ? 'Mark wallpapers as favorites to see them here'
                      : 'Generate some wallpapers and they\'ll appear here'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHistory.map((wallpaper, index) => (
                    <motion.div
                      key={wallpaper.id}
                      className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Preview image */}
                      <div className="relative h-32 bg-gray-200">
                        <img
                          src={wallpaper.image.urls.small}
                          alt={wallpaper.image.alt_description}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <p className="text-white text-sm text-center px-2 line-clamp-2">
                            "{wallpaper.quote.text.slice(0, 60)}..."
                          </p>
                        </div>
                        
                        {/* Mood badge */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs capitalize">
                            {wallpaper.mood}
                          </span>
                        </div>
                      </div>

                      {/* Info and actions */}
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          {formatDate(wallpaper.createdAt)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <button
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                            onClick={() => onRestoreWallpaper(wallpaper)}
                          >
                            <RotateCcw size={14} />
                            Restore
                          </button>
                          
                          <div className="flex gap-2">
                            <button
                              className={`p-1 rounded ${
                                wallpaper.isFavorite 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                              onClick={() => onToggleFavorite(wallpaper.id)}
                            >
                              <Heart size={16} fill={wallpaper.isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            
                            <button
                              className="text-gray-400 hover:text-red-500 p-1 rounded"
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
