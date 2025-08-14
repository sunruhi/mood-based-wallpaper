import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Download, Twitter, Facebook, Link, Check, X, AlertCircle } from 'lucide-react';
import { WallpaperData } from '../types';

interface ShareButtonProps {
  wallpaperData: WallpaperData;
  disabled?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ wallpaperData, disabled = false }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const generateShareText = () => {
    return `Check out this ${wallpaperData.mood} wallpaper I created! "${wallpaperData.quote.text}" ${wallpaperData.quote.author ? '- ' + wallpaperData.quote.author : ''}`;
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams({
      mood: wallpaperData.mood,
      quote: wallpaperData.quote.text,
      ...(wallpaperData.quote.author && { author: wallpaperData.quote.author }),
      image: wallpaperData.image.id
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  const fallbackCopyToClipboard = (text: string): boolean => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      document.body.removeChild(textArea);
      return false;
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = generateShareUrl();
    setCopyError(null);

    // Reset previous states
    setCopied(false);

    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (error) {
        console.warn('Clipboard API failed, trying fallback:', error);
      }
    }

    // Try legacy method
    if (fallbackCopyToClipboard(shareUrl)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    // If all else fails, show link in modal
    setCopyError('Unable to copy automatically. Link will be displayed for manual copying.');
    setShowLinkModal(true);
  };

  const handleShare = async (platform?: string) => {
    const shareText = generateShareText();
    const shareUrl = generateShareUrl();

    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank');
    } else if (navigator.share) {
      // Use native Web Share API if available
      try {
        await navigator.share({
          title: 'My Mood Wallpaper',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
    setShowOptions(false);
  };

  const handleDownloadAndShare = async () => {
    // Trigger download
    const downloadEvent = new CustomEvent('download-wallpaper');
    document.dispatchEvent(downloadEvent);
    
    // Then share
    handleShare();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowOptions(!showOptions)}
        disabled={disabled}
        className={`
          bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}
          flex items-center gap-2
        `}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={20} />
        Share
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border p-2 z-10 min-w-48"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowOptions(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>

            <div className="space-y-1 pt-6">
              {/* Native Share (if available) */}
              {navigator.share && (
                <button
                  onClick={() => handleShare()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              )}

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Twitter size={16} className="text-blue-500" />
                <span>Share on Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Facebook size={16} className="text-blue-600" />
                <span>Share on Facebook</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-600">Link copied!</span>
                  </>
                ) : (
                  <>
                    <Link size={16} />
                    <span>Copy link</span>
                  </>
                )}
              </button>

              {/* Download & Share */}
              <button
                onClick={handleDownloadAndShare}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors border-t pt-2 mt-2"
              >
                <Download size={16} />
                <span>Download & Share</span>
              </button>
            </div>

            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Copy Link Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLinkModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-orange-500" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Copy Link Manually</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Automatic copying isn't available. Please copy the link below manually:
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 mb-4">
                  <textarea
                    value={generateShareUrl()}
                    readOnly
                    className="w-full text-sm text-gray-800 bg-transparent border-none resize-none focus:outline-none"
                    rows={3}
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const textarea = document.querySelector('textarea');
                      if (textarea) {
                        textarea.select();
                        document.execCommand('copy');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                      setShowLinkModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Select & Copy
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
