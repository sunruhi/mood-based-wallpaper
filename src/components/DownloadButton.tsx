import React, { useState } from 'react';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { download } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { downloadWallpaper } from '../utils/downloadImage';

interface DownloadButtonProps {
  disabled?: boolean;
  mood?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ disabled = false, mood = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Haptics not available on web
    }
  };

  const handleDownload = async () => {
    if (disabled || isDownloading) return;

    await triggerHaptic();
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
    <IonButton
      expand="block"
      size="large"
      color={disabled ? 'medium' : 'primary'}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className="download-button"
      data-testid="download-button"
    >
      {isDownloading ? (
        <IonSpinner name="crescent" />
      ) : (
        <IonIcon icon={download} slot="start" />
      )}
      {isDownloading ? 'Downloading...' : 'Download Wallpaper'}
    </IonButton>
  );
};
