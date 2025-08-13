import html2canvas from 'html2canvas';

export const downloadWallpaper = async (elementId: string, filename: string = 'mood-wallpaper.png'): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Convert canvas to blob and create download link
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download wallpaper');
  }
};
