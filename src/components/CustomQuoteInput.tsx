import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, X, Check } from 'lucide-react';

interface CustomQuoteInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: string, author?: string) => void;
}

export const CustomQuoteInput: React.FC<CustomQuoteInputProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!quote.trim()) {
      setError('Please enter a quote');
      return;
    }

    if (quote.length > 200) {
      setError('Quote must be 200 characters or less');
      return;
    }

    onSave(quote.trim(), author.trim() || undefined);
    setQuote('');
    setAuthor('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setQuote('');
    setAuthor('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className="bg-white rounded-lg w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Type className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Custom Quote</h2>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote *
            </label>
            <textarea
              value={quote}
              onChange={(e) => {
                setQuote(e.target.value);
                setError('');
              }}
              placeholder="Enter your custom quote here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {quote.length}/200 characters
              </span>
              {error && (
                <span className="text-xs text-red-500">{error}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author (optional)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Quote author"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Use Quote
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
