import { downloadWallpaper } from '../../utils/downloadImage';
import html2canvas from 'html2canvas';

// Mock html2canvas
vi.mock('html2canvas');

// Mock DOM methods
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

describe('downloadWallpaper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock document.getElementById
    document.getElementById = vi.fn(() => ({
      id: 'test-element'
    } as HTMLElement));
    
    // Mock document.body methods
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    // Mock canvas.toBlob
    const mockCanvas = {
      toBlob: vi.fn((callback) => {
        const mockBlob = new Blob(['test'], { type: 'image/png' });
        callback(mockBlob);
      })
    };
    
    (html2canvas as any).mockResolvedValue(mockCanvas);
  });

  it('should successfully download wallpaper', async () => {
    await downloadWallpaper('test-element', 'test.png');
    
    expect(document.getElementById).toHaveBeenCalledWith('test-element');
    expect(html2canvas).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });

  it('should throw error when element is not found', async () => {
    document.getElementById = vi.fn(() => null);
    
    await expect(downloadWallpaper('non-existent')).rejects.toThrow('Element not found');
  });

  it('should throw error when canvas.toBlob fails', async () => {
    const mockCanvas = {
      toBlob: vi.fn((callback) => callback(null))
    };
    
    (html2canvas as any).mockResolvedValue(mockCanvas);
    
    await expect(downloadWallpaper('test-element')).rejects.toThrow('Failed to download wallpaper');
  });
});