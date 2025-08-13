import { renderHook, act } from '@testing-library/react';
import { useUnsplashAPI } from '../../hooks/useUnsplashAPI';

// Mock fetch
global.fetch = vi.fn();

describe('useUnsplashAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    vi.stubEnv('VITE_UNSPLASH_ACCESS_KEY', 'test-access-key');
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useUnsplashAPI());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.fetchImageByMood).toBe('function');
  });

  it('should set error when API key is not configured', async () => {
    vi.stubEnv('VITE_UNSPLASH_ACCESS_KEY', undefined);
    const { result } = renderHook(() => useUnsplashAPI());
    
    let returnedImage;
    await act(async () => {
      returnedImage = await result.current.fetchImageByMood('happy');
    });
    
    expect(result.current.error).toBe('Unsplash API key not configured');
    expect(returnedImage).toBe(null);
  });

  it('should handle successful API response', async () => {
    const mockImage = {
      id: '1',
      urls: { regular: 'test.jpg' },
      alt_description: 'Test image',
      user: { name: 'Test User', username: 'testuser' }
    };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImage,
    });
    
    const { result } = renderHook(() => useUnsplashAPI());
    
    let returnedImage;
    await act(async () => {
      returnedImage = await result.current.fetchImageByMood('happy');
    });
    
    expect(returnedImage).toEqual(mockImage);
    expect(result.current.error).toBe(null);
  });

  it('should handle API error response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    
    const { result } = renderHook(() => useUnsplashAPI());
    
    let returnedImage;
    await act(async () => {
      returnedImage = await result.current.fetchImageByMood('happy');
    });
    
    expect(returnedImage).toBe(null);
    expect(result.current.error).toBe('Failed to fetch image: 404');
  });
});