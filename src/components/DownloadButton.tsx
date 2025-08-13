import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { downloadWallpaper } from '../utils/downloadImage';

interface DownloadButtonProps {
  disabled?: boolean;
  mood?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ disabled = false, mood = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (disabled || isDownloading) return;

    setIsDownloading(true);
    try {
      const filename = `${mood}-wallpaper-${Date.now()}.png`;
      await downloadWallpaper('wallpaper-canvas', filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download wallpaper. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      className={`
        inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
        ${disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
        }
        ${isDownloading ? 'animate-pulse' : ''}
      `}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      data-testid="download-button"
    >
      <Download size={20} className={isDownloading ? 'animate-spin' : ''} />
      {isDownloading ? 'Downloading...' : 'Download Wallpaper'}
    </motion.button>
  );
};