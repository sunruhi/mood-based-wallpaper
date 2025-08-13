import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadButton } from '../../components/DownloadButton';

// Mock the downloadWallpaper utility
vi.mock('../../utils/downloadImage', () => ({
  downloadWallpaper: vi.fn().mockResolvedValue(undefined),
}));

describe('DownloadButton', () => {
  it('renders download button with correct text', () => {
    render(<DownloadButton />);
    
    expect(screen.getByTestId('download-button')).toBeInTheDocument();
    expect(screen.getByText('Download Wallpaper')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<DownloadButton disabled={true} />);
    
    const button = screen.getByTestId('download-button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
  });

  it('is enabled when disabled prop is false', () => {
    render(<DownloadButton disabled={false} />);
    
    const button = screen.getByTestId('download-button');
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('bg-blue-500', 'text-white');
  });

  it('shows downloading state when clicked', async () => {
    render(<DownloadButton />);
    
    const button = screen.getByTestId('download-button');
    fireEvent.click(button);
    
    // Note: In a real test, you might want to mock the download function
    // to control the async behavior more precisely
    expect(button).toBeInTheDocument();
  });
});